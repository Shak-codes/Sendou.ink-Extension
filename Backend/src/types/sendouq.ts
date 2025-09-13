interface SendouqMap {
  mode: "SZ" | "RM" | "TC" | "CB" | "TW";
  stage: {
    id: number;
    name: string;
  };
}

export interface SendouqGame {
  map: SendouqMap;
  winnerTeamId: number;
  source: string;
  participatedUserIds: null;
  points: null;
}

export interface SendouqPlayer {
  userId: number;
  rank: {
    name: string;
    isPlus: boolean;
  };
}

export interface SendouqMatchData {
  mapList: SendouqGame[];
  teamAlpha: {
    score: number;
    players: SendouqPlayer[];
  };
  teamBravo: {
    score: number;
    players: SendouqPlayer[];
  };
}

export interface SendouqMatchRef {
  matchId: number;
  twitchName: string;
  twitchId: number;
  sendouId: number;
}
