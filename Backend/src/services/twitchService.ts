import { getExtensionToken } from "./utils";
import config from "../config";

export const getDisplayName = async (channel_id: string): Promise<string> => {
  const token = await getExtensionToken();

  const { TWITCH_HELIX_ROUTE, TWITCH_CLIENT_ID } = config;
  if (!TWITCH_HELIX_ROUTE) {
    throw new Error("Missing Twitch Helix Route");
  }

  console.log(`Route: ${TWITCH_HELIX_ROUTE}?id=${channel_id}`);

  const response = await fetch(`${TWITCH_HELIX_ROUTE}?id=${channel_id}`, {
    method: "GET",
    headers: {
      "Client-ID": TWITCH_CLIENT_ID ?? "",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user info: ${response.statusText}`);
  }

  const data: any = await response.json();
  return data.data?.[0]?.display_name ?? "";
};
