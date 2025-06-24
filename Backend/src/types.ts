export interface User {
  id: number;
  discord_id: string;
  sendou_id: string;
  twitch_id: string;
  sendou_name: string;
  twitch_name: string;
  sendou_url: string;
  avatar_url: string;
  last_fetched: Date;
  team?: string | null;
  team_url?: string | null;
  team_role?: string | null;
  peak_rank?: string | null;
  sendouq_rank?: string | null;
}

export interface TwitchData {
  discord_id: string;
  twitch_name: string;
  twitch_id: string;
}
