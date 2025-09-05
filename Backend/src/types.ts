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

export interface TeamMembership extends TeamData {
  role: string;
}

export interface SendouData {
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

export interface UserRecord {
  discordId: string;
  sendouId: string;
  twitchId: string;
  sendouName: string;
  twitchName: string;
}

export interface UserDataResponse {
  discordId: string;
  sendouId: string;
  sendouName: string;
  sendouUrl: string;
  sendouAvatarUrl: string;
  sqRank: SendouqRank["tier"] | null;
  peakXp: string | null;
  team: TeamMembership | null;
}
