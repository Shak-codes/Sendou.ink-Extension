import { TokenResponse, TokenData } from "./types";
import dotenv from "dotenv";
import Redis from "ioredis";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const getExtensionToken = async (): Promise<string> => {
  const REFRESH_BUFFER_SECONDS = 3600;
  const REDIS_URL = process.env.REDIS_URL;
  const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY;

  const client = new Redis(REDIS_URL!);
  const token = await client.get(ACCESS_TOKEN_KEY!);

  console.log("Access Token", token);
  if (token) return token;

  const CLIENT_ID = process.env.TWITCH_EXTENSION_CLIENT_ID;
  const CLIENT_SECRET = process.env.TWITCH_EXTENSION_CLIENT_SECRET;
  const TWITCH_OAUTH_ROUTE = process.env.TWITCH_OAUTH_ROUTE;

  if (!CLIENT_ID || !CLIENT_SECRET || !TWITCH_OAUTH_ROUTE) {
    throw new Error("Missing Twitch credentials");
  }

  try {
    const response = await fetch(TWITCH_OAUTH_ROUTE, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "client_credentials",
      }),
    });

    if (!response.ok) {
      const errorData: any = await response.json();
      throw new Error(
        `Twitch API error: ${errorData.message || response.statusText}`
      );
    }

    const client = new Redis(REDIS_URL!);
    const data: TokenResponse = (await response.json()) as TokenResponse;
    const ttl = data.expires_in - REFRESH_BUFFER_SECONDS;
    await client.set(ACCESS_TOKEN_KEY!, data.access_token, "EX", ttl);
    console.log("Access Token", data.access_token);
    return data.access_token;
  } catch (error) {
    console.error("Failed to get extension token:", error);
    throw new Error("Failed to authenticate with Twitch");
  }
};

export const getDisplayName = async (channel_id: string): Promise<string> => {
  const accessToken = await getExtensionToken();

  const TWITCH_HELIX_ROUTE = process.env.TWITCH_HELIX_ROUTE;
  if (!TWITCH_HELIX_ROUTE) {
    throw new Error("Missing Twitch Helix Route");
  }

  console.log(`Route: ${TWITCH_HELIX_ROUTE}?id=${channel_id}`);

  const response = await fetch(`${TWITCH_HELIX_ROUTE}?id=${channel_id}`, {
    method: "GET",
    headers: {
      "Client-ID": process.env.TWITCH_EXTENSION_CLIENT_ID ?? "",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user info: ${response.statusText}`);
  }

  const data: any = await response.json();
  return data.data?.[0]?.display_name ?? "";
};
