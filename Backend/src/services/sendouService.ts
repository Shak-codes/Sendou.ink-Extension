import { TeamData, SendouData, UserDataResponse } from "../types";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

export const fetchUserData = async (
  discord_id: string
): Promise<UserDataResponse> => {
  const SINK_ROUTE = process.env.SINK_ROUTE;
  const SINK_TOKEN = process.env.SINK_TOKEN;

  if (!SINK_ROUTE || !SINK_TOKEN) {
    throw new Error("Missing Sendou credentials");
  }

  const profileUrl = `${SINK_ROUTE}/user/${discord_id}`;

  const profileResponse = await fetch(profileUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${SINK_TOKEN}`,
    },
  });

  if (!profileResponse.ok) {
    const error = new Error(
      `Failed to fetch profile data: ${profileResponse.statusText}`
    );
    // @ts-ignore - attach status code for easier handling
    error.status = response.status;
    throw error;
  }

  const profileData = (await profileResponse.json()) as SendouData;

  const {
    discordId,
    id: sendouId,
    name: sendouName,
    url: sendouUrl,
    avatarUrl,
    peakXp,
    currentRank,
    teams,
  } = profileData;
  const sqRank = currentRank ? currentRank.tier : null;

  const userData = {
    discordId,
    sendouId,
    sendouName,
    sendouUrl,
    avatarUrl,
    sqRank,
    peakXp,
  };

  if (!teams.length)
    return {
      ...userData,
      team: null,
    };

  const { id: teamId, role } = teams[0];

  const teamUrl = `${SINK_ROUTE}/team/${teamId}`;
  const teamResponse = await fetch(teamUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${SINK_TOKEN}`,
    },
  });

  if (!teamResponse.ok) {
    const error = new Error(
      `Failed to fetch team data: ${teamResponse.statusText}`
    );
    // @ts-ignore - attach status code for easier handling
    error.status = teamResponse.status;
    throw error;
  }

  const teamData = (await teamResponse.json()) as TeamData;

  return {
    ...userData,
    team: {
      ...teamData,
      role,
    },
  };
};
