import { SendouqGame } from "./sendouq";

export interface RedisPlayer {
  userId: number;
  rank: {
    name: string;
    isPlus: boolean;
  };
  avatarUrl: string;
  url: string;
}

export interface RedisSendouqMatch {
  mapList: SendouqGame[];
  teamAlpha: {
    score: number;
    players: RedisPlayer[];
  };
  teamBravo: {
    score: number;
    players: RedisPlayer[];
  };
}
