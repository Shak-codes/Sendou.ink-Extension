export interface User {
  id: number;
  discordId: string;
  sendouId: string;
  twitchId: string;
  sendouName: string;
  twitchName: string;
  sendouUrl: string;
  avatarUrl: string;
  sqRank: SendouqRank["tier"] | null;
  peakXp: string | null;
  team: TeamData | null;
  lastFetched: Date;
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

interface SendouqRank {
  season: number;
  tier: {
    name: string;
    isPlus: boolean;
  };
}

interface Team {
  id: number;
  role: string;
}

export interface TeamData {
  id: number;
  name: string;
  teamPageUrl: string;
  logoUrl: string;
}

export interface ProfileData {
  id: string;
  name: string;
  discordId: string;
  avatarUrl: string;
  url: string;
  country: string;
  plusServerTier: string | null;
  socials: Socials;
  currentRank: SendouqRank | null;
  peakXp: string | null;
  weaponPool: Weapon[];
  badges: Badge[];
  teams: Team[];
}

export interface UserData {
  discordId: string;
  sendouId: string;
  sendouName: string;
  sendouUrl: string;
  sendouAvatarUrl: string;
  sqRank: SendouqRank["tier"] | null;
  peakXp: string | null;
  team: TeamData | null;
}
