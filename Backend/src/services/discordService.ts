import dotenv from "dotenv";
import { DiscordUser } from "./types";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

export const getAvatarHash = async (userId: string): Promise<string | null> => {
  const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
  if (!DISCORD_TOKEN) {
    throw new Error("DISCORD_TOKEN is not set in .env");
  }

  const res = await fetch(`https://discord.com/api/v10/users/${userId}`, {
    headers: {
      Authorization: `Bot ${DISCORD_TOKEN}`,
    },
  });

  if (!res.ok) {
    console.error(
      `Failed to fetch user ${userId}: ${res.status} ${res.statusText}`
    );
    return null;
  }

  const user = (await res.json()) as DiscordUser;

  return user.avatar || null;
};
