export interface User {
  id: number;
  sendou_name: string;
  sendou_id: string;
  url: string;
  avatar_url: string;
  twitch_name: string;
  twitch_id: string;
  last_fetched: Date;
  team?: string | null;
  team_url?: string | null;
  team_role?: string | null;
  rank?: string | null;
}

export interface TwitchData {
  discord_id: string;
  twitch_name: string;
  twitch_id: string;
}
