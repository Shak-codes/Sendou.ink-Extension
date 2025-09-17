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
    id: number;
    score: number;
    players: RedisPlayer[];
  };
  teamBravo: {
    id: number;
    score: number;
    players: RedisPlayer[];
  };
  confirmed: boolean;
}
