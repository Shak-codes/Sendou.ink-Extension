interface Map {
  mode: "SZ" | "RM" | "TC" | "CB" | "TW";
  stage: {
    id: number;
    name: string;
  };
}

interface MapResult {
  map: Map;
  winnerTeamId: number;
  source: string;
  participatedUserIds: null;
  points: null;
}

interface Player {
  userId: number;
  rank: {
    name: string;
    isPlus: boolean;
  };
}

export interface SendouqMatchData {
  mapList: MapResult[];
  teamAlpha: {
    score: number;
    players: Player[];
  };
  teamBravo: {
    score: number;
    players: Player[];
  };
}
