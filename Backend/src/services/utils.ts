import Redis from "ioredis";
import { TokenResponse } from "./types";
import config from "../config";

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

export const sendouFetch = async <T>(endpoint: string): Promise<T> => {
  const { SINK_ROUTE, SINK_TOKEN } = config;

  const response = await fetch(`${SINK_ROUTE}${endpoint}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${SINK_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `${endpoint} request failed: ${response.status} - ${response.statusText}`
    );
  }

  return (await response.json()) as T;
};
