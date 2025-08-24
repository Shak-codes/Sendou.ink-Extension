import {
  FIELDS,
  GET_AVATAR,
  GET_PROFILE_DATA,
  GET_TWITCH_NAME,
  ADD_USER,
} from "./constants";

export const getUserData = async (channelId, discordId) => {
  try {
    const [twitchResponse, profileResponse, avatarResponse] = await Promise.all(
      [
        fetch(`${GET_TWITCH_NAME}/${channelId}`),
        fetch(`${GET_PROFILE_DATA}/${discordId}`),
        fetch(`${GET_AVATAR}/${discordId}`),
      ]
    );

    if (profileResponse.status === 404) {
      return { data: null, error: "Invalid User ID" };
    } else if (profileResponse.status >= 500) {
      return {
        data: null,
        error: "Something went wrong, please try again later",
      };
    }

    const [twitchName, profileData, avatarUrl] = await Promise.all([
      twitchResponse.json(),
      profileResponse.json(),
      avatarResponse.json(),
    ]);

    const { currentRank, teams, id, name, url, peakXp } = profileData;
    const team = teams?.[0];
    const sendouq_rank = currentRank
      ? `${currentRank.tier.name}${currentRank.tier.isPlus ? "+" : ""}`
      : null;

    return {
      data: {
        discord_id: discordId,
        twitch_id: channelId,
        sendou_id: id,
        twitch_name: twitchName,
        sendou_name: name,
        sendou_url: url,
        avatar_url: avatarUrl,
        team: team?.name ?? null,
        team_url: team?.teamPageUrl ?? null,
        team_role: team?.role ?? null,
        peak_rank: peakXp,
        sendouq_rank,
      },
      error: null,
    };
  } catch (err) {
    console.error("Failed to fetch data:", err);
    return { data: null, error: "An unexpected error occurred" };
  }
};

export const saveToBackend = async (userData) => {
  try {
    const response = await fetch(ADD_USER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      console.error(`Server error: ${response.status}`);
      return {
        response: null,
        error: "Server error. Please try again later.",
      };
    }

    return {
      response: response.json(),
      error: null,
    };
  } catch (err) {
    console.error("Save config failed:", err);
    return {
      response: null,
      error: "Network error. Please check your connection and try again.",
    };
  }
};

export const validUserData = (data) => {
  for (const field of FIELDS) {
    if (!data[field]) return false;
  }
  return true;
};
