import { SendouData } from "../types";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

export const fetchUserData = async (
  discord_id: string
): Promise<SendouData> => {
  const SINK_ROUTE = process.env.SINK_ROUTE;
  const SINK_TOKEN = process.env.SINK_TOKEN;

  if (!SINK_ROUTE || !SINK_TOKEN) {
    throw new Error("Missing Twitch credentials");
  }

  const url = `${SINK_ROUTE}/user/${discord_id}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${SINK_TOKEN}`,
    },
  });

  if (!response.ok) {
    const error = new Error(
      `Failed to fetch user data: ${response.statusText}`
    );
    // @ts-ignore - attach status code for easier handling
    error.status = response.status;
    throw error;
  }

  const data = (await response.json()) as SendouData;
  return data;
};
