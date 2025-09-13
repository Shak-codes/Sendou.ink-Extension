import { supabase } from "../db";
import {
  SendouqMatchData,
  SendouqMatchRef,
  SendouqPlayer,
} from "../types/sendouq";
import { SendouUser } from "../types/sendouUser";
import { RedisPlayer, RedisSendouqMatch } from "../types/redis";
import { UserRef } from "../types/dbUser";
import config from "../config";
import { sendouFetch, getExtensionToken, printLog } from "./utils";

export const getUsers = async (): Promise<UserRef[]> => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("twitchName, sendouId");

    if (error) throw error;

    return data as UserRef[];
  } catch (error) {
    console.error("Error fetching registered users:", error);
    throw error;
  }
};

export const getLiveUsers = async (): Promise<UserRef[]> => {
  const { TWITCH_CLIENT_ID } = config;
  try {
    const { data, error } = await supabase
      .from("users")
      .select("twitchName, sendouId, twitchId");

    if (error) throw error;
    if (!data) return [];

    const token = await getExtensionToken();

    const names = data.map((u) => u.twitchName);
    printLog(`Names: ${names}`);
    if (names.length === 0) return [];

    const userLogins = names.map((u) => `user_login=${u}`).join("&");
    const url = `https://api.twitch.tv/helix/streams?${userLogins}`;

    const res = await fetch(url, {
      headers: {
        "Client-ID": TWITCH_CLIENT_ID!,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        `Twitch API error: ${res.status} ${res.statusText} - ${JSON.stringify(
          err
        )}`
      );
    }

    const body: any = await res.json();
    const liveSet = new Set(body.data.map((stream: any) => stream.user_login));

    return data.filter((user) => liveSet.has(user.twitchName));
  } catch (error) {
    console.error("Error fetching registered users:", error);
    throw error;
  }
};

export const getMatches = async (
  liveUsers: UserRef[]
): Promise<SendouqMatchRef[]> => {
  const { NODE_ENV } = config;
  if (NODE_ENV !== "production") {
    return [
      {
        twitchName: "5hak_",
        sendouId: 41605,
        twitchId: 81661426,
        matchId: 89177,
      },
    ];
  }

  const matches = await Promise.all(
    liveUsers.map(async (user) => {
      try {
        const data = await sendouFetch<{ matchId: number | null }>(
          `/sendouq/active-match/${user.sendouId}`
        );

        if (data.matchId) {
          return { ...user, matchId: data.matchId };
        }
      } catch (error) {
        console.error(`Error fetching match for user ${user.sendouId}:`, error);
      }

      return null;
    })
  );

  return matches.filter((u) => u !== null);
};

export const getMatchData = async (
  userMatch: SendouqMatchRef
): Promise<RedisSendouqMatch> => {
  try {
    const matchDetails = await sendouFetch<SendouqMatchData>(
      `/sendouq/match/${userMatch.matchId}`
    );

    const enrichPlayer = async (
      player: SendouqPlayer
    ): Promise<RedisPlayer> => {
      try {
        const userData = await sendouFetch<SendouUser>(
          `/user/${player.userId}`
        );

        return {
          ...player,
          url: userData.url,
          avatarUrl: userData.avatarUrl,
        };
      } catch (error) {
        console.error(
          `Error fetching profile for user ${player.userId}:`,
          error
        );
        throw error;
      }
    };

    const enrichedAlpha = await Promise.all(
      matchDetails.teamAlpha.players.map(enrichPlayer)
    );

    const enrichedBravo = await Promise.all(
      matchDetails.teamBravo.players.map(enrichPlayer)
    );

    return {
      ...matchDetails,
      teamAlpha: {
        ...matchDetails.teamAlpha,
        players: enrichedAlpha,
      },
      teamBravo: {
        ...matchDetails.teamBravo,
        players: enrichedBravo,
      },
    };
  } catch (error) {
    console.error(`Error fetching match ${userMatch.matchId}: `, error);
    throw error;
  }
};
