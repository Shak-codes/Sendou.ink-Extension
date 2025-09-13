import Redis from "ioredis";
import { supabase } from "../db";
import { TokenResponse } from "./types";
import config from "../config";

export const getUsers = async (): Promise<
  { twitchName: string; sendouId: string }[]
> => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("twitchName, sendouId");

    if (error) throw error;

    return data as { twitchName: string; sendouId: string }[];
  } catch (error) {
    console.error("Error fetching registered users:", error);
    throw error;
  }
};

export const getLiveUsers = async (): Promise<
  { twitchName: string; sendouId: string }[]
> => {
  const { NODE_ENV, TWITCH_CLIENT_ID } = config;
  try {
    const { data, error } = await supabase
      .from("users")
      .select("twitchName, sendouId");

    if (error) throw error;
    if (!data) return [];

    const token = await getExtensionToken();

    const names = data.map((u) => u.twitchName);
    if (NODE_ENV !== "production") {
      console.log("Names: ", names);
    }
    if (names.length === 0) return [];

    const userLogins = names.map((u) => `user_login=${u}`).join("&");
    const url = `https://api.twitch.tv/helix/streams?${userLogins}`;

    const res = await fetch(url, {
      headers: {
        "Client-ID": TWITCH_CLIENT_ID!,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        `Twitch API error: ${res.status} ${res.statusText} - ${JSON.stringify(
          err
        )}`
      );
    }

    const body: any = await res.json();
    const liveSet = new Set(body.data.map((stream: any) => stream.user_login));

    return data.filter((user) => liveSet.has(user.twitchName)) as {
      twitchName: string;
      sendouId: string;
    }[];
  } catch (error) {
    console.error("Error fetching registered users:", error);
    throw error;
  }
};

export const getExtensionToken = async (): Promise<string> => {
  const REFRESH_BUFFER_SECONDS = 3600;
  const { REDIS, OAUTH_TOKEN_KEY } = config;

  const client = new Redis(REDIS);
  const token = await client.get(OAUTH_TOKEN_KEY);

  console.log("Access Token", token);
  if (token) return token;

  const { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, TWITCH_OAUTH_ROUTE } = config;

  if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET || !TWITCH_OAUTH_ROUTE) {
    throw new Error("Missing Twitch credentials");
  }

  try {
    const response = await fetch(TWITCH_OAUTH_ROUTE, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: TWITCH_CLIENT_ID,
        client_secret: TWITCH_CLIENT_SECRET,
        grant_type: "client_credentials",
      }),
    });

    if (!response.ok) {
      const errorData: any = await response.json();
      throw new Error(
        `Twitch API error: ${errorData.message || response.statusText}`
      );
    }

    const client = new Redis(REDIS);
    const data: TokenResponse = (await response.json()) as TokenResponse;
    const ttl = data.expires_in - REFRESH_BUFFER_SECONDS;
    await client.set(OAUTH_TOKEN_KEY, data.access_token, "EX", ttl);
    console.log("Access Token", data.access_token);
    return data.access_token;
  } catch (error) {
    console.error("Failed to get extension token:", error);
    throw new Error("Failed to authenticate with Twitch");
  }
};
