import { supabase } from "../db";
import { User } from "../types";

export const getUser = async (twitchId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({ lastFetched: new Date().toISOString() })
      .eq("twitchId", twitchId)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

export const addUser = async (data: User): Promise<User> => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .upsert(data, { onConflict: "twitchId" }) // replaces INSERT ... ON CONFLICT
      .select()
      .single();

    if (error) throw error;
    return user as User;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

export const deleteInactiveUsers = async () => {
  try {
    const { count, error } = await supabase
      .from("users")
      .delete({ count: "exact" })
      .lt(
        "lastFetched",
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      );

    if (error) throw error;
    console.log(`Deleted ${count} inactive users`);
    return count ?? 0;
  } catch (error) {
    console.error("Error deleting inactive users:", error);
    throw error;
  }
};

export const getIdentifiers = async (): Promise<
  {
    discordId: string;
    twitchId: string;
    sendouId: string;
    twitchName: string;
    sendouName: string;
  }[]
> => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("discordId, twitchId, sendouId, twitchName, sendouName");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching identifiers:", error);
    throw error;
  }
};
