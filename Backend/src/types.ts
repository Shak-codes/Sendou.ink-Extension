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

interface Socials {
  twitch: string | null;
  battlefy: string | null;
  bsky: string | null;
  twitter: string | null;
}

interface Weapon {
  id: string;
  name: string;
  isFiveStar: boolean;
}

interface Badge {
  name: string;
  count: number;
  gifUrl: string;
  imageUrl: string;
}

export interface SendouData {
  id: string;
  name: string;
  discordId: string;
  avatarUrl: string;
  country: string;
  plusServerTier: string | null;
  socials: Socials;
  peakXp: string | null;
  weaponPool: Weapon[];
  badges: Badge[];
}
