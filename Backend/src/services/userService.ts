import { pool } from "../db";
import { User } from "../types";

export const getUser = async (twitch_id: string): Promise<User | null> => {
  try {
    const result = await pool.query<User>(
      `
      UPDATE users 
      SET last_fetched = NOW() 
      WHERE twitch_id = $1 
      RETURNING *
    `,
      [twitch_id]
    );

    return result.rows[0] || null;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

export const addUser = async (data: User): Promise<User> => {
  const {
    discord_id,
    twitch_id,
    sendou_id,
    twitch_name,
    sendou_name,
    sendou_url,
    avatar_url,
  } = data;

  try {
    const result = await pool.query<User>(
      `
      INSERT INTO users 
        (discord_id, twitch_id, sendou_id, twitch_name, sendou_name, sendou_url, avatar_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (twitch_id) DO UPDATE SET
        discord_id = EXCLUDED.discord_id,
        sendou_id = EXCLUDED.sendou_id,
        twitch_name = EXCLUDED.twitch_name,
        sendou_name = EXCLUDED.sendou_name,
        sendou_url = EXCLUDED.sendou_url,
        avatar_url = EXCLUDED.avatar_url
      RETURNING *;
      `,
      [
        discord_id,
        twitch_id,
        sendou_id,
        twitch_name,
        sendou_name,
        sendou_url,
        avatar_url,
      ]
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

export const get_identifiers = async (): Promise<
  { twitch_name: string; sendou_id: number }[]
> => {
  try {
    const result = await pool.query(
      "SELECT discord_id, twitch_id, sendou_id, twitch_name, sendou_name FROM users"
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching identifiers:", error);
    throw error;
  }
};
