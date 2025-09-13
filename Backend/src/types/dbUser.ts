export interface DbUser {
  discordId: string;
  sendouId: number;
  twitchId: number;
  sendouName: string;
  twitchName: string;
}

export interface UserRef {
  sendouId: number;
  twitchId: number;
  twitchName: string;
}
