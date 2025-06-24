import { TokenResponse, TokenData } from "./types";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

let tokenCache: TokenData = {
  access_token: "",
  expires_at: 0,
  token_type: "",
};

const tokenExpired = (): boolean => {
  if (!tokenCache.expires_at) return true;
  else return Date.now() >= tokenCache.expires_at;
};

const getExtensionToken = async (): Promise<string> => {
  if (!tokenExpired) return tokenCache.access_token;

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
        scope: "",
      }),
    });

    if (!response.ok) {
      const errorData: any = await response.json();
      throw new Error(
        `Twitch API error: ${errorData.message || response.statusText}`
      );
    }

    const data: TokenResponse = (await response.json()) as TokenResponse;
    tokenCache = {
      access_token: data.access_token,
      token_type: data.token_type,
      expires_at: Date.now() + data.expires_in * 1000,
    };
    return tokenCache.access_token;
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

  const response = await fetch(`${TWITCH_HELIX_ROUTE}?id=${channel_id}`, {
    method: "GET",
    headers: {
      "Client-ID": process.env.TWITCH_CLIENT_ID ?? "",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user info: ${response.statusText}`);
  }

  const data: any = await response.json();
  return data.data?.[0]?.display_name ?? "";
};
