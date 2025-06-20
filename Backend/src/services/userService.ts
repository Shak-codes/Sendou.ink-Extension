import { pool } from "../db";
import { TwitchData, User } from "../types";
import { SINK_ROUTE, SINK_TOKEN } from "./constants";

export const getUser = async (twitchID: string): Promise<User | null> => {
  try {
    const result = await pool.query<User>(
      `
      UPDATE users 
      SET last_fetched = NOW() 
      WHERE twitch_id = $1 
      RETURNING *
    `,
      [twitchID]
    );

    return result.rows[0] || null;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

// DO NOT PUSH TILL CONFIGURING ENV FOR AUTH TOKEN
const fetchUserData = async (id: string): Promise<any> => {
  const url = `${SINK_ROUTE}/user/${id}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${SINK_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user data: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export const addUser = async (data: TwitchData): Promise<any> => {
  const { discord_id, twitch_name, twitch_id } = data;

  try {
    const {
      name,
      url,
      avatarUrl,
      peakXp,
      id: sendou_id,
    } = await fetchUserData(discord_id);

    const result = await pool.query<User>(
      `
      INSERT INTO users 
        (sendou_name, sendou_id, url, avatar_url, twitch_name, twitch_id) 
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (twitch_id) DO UPDATE SET
        sendou_name = EXCLUDED.sendou_name,
        url = EXCLUDED.url,
        avatar_url = EXCLUDED.avatar_url,
        rank = EXCLUDED.rank
      RETURNING *
    `,
      [name, sendou_id, url, avatarUrl, twitch_name, twitch_id]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

export const deleteInactiveUsers = async () => {
  const result = await pool.query(
    "DELETE FROM users WHERE last_requested < NOW() - INTERVAL '30 days'"
  );
  console.log(`Deleted ${result.rowCount} inactive users`);
  return result.rowCount;
};

export const getIDs = async (): Promise<
  { twitchID: string; sendouID: string }[]
> => {
  try {
    const result = await pool.query("SELECT twitchID, sendouID FROM users");
    return result.rows;
  } catch (error) {
    console.error("Error fetching user IDs:", error);
    throw error;
  }
};
