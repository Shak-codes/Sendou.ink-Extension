export interface DbUser {
  discordId: string;
  sendouId: number;
  twitchId: string;
  sendouName: string;
  twitchName: string;
}

export interface UserRef {
  sendouId: number;
  twitchId: string;
  twitchName: string;
}
