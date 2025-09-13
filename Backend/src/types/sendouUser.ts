export interface SendouUser {
  id: number;
  name: string;
  discordId: string;
  avatarUrl: string;
  url: string;
  country: string;
  plusServerTier: string | null;
  socials: {
    twitch: string | null;
    battlefy: string | null;
    bsky: string | null;
    twitter: string | null;
  };
  currentRank: {
    season: number;
    tier: {
      name: string;
      isPlus: boolean;
    };
  } | null;
  peakXp: number | null;
  weaponPool: string[];
  badges: string[];
  teams: string[];
}
