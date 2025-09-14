import {
  FIELDS,
  GET_AVATAR,
  GET_PROFILE_DATA,
  GET_TWITCH_NAME,
  ADD_USER,
} from "./constants";

export const getUserData = async (channelId, discordId) => {
  try {
    const [twitchResponse, profileResponse, discordAvatarResponse] =
      await Promise.all([
        fetch(`${GET_TWITCH_NAME}/${channelId}`),
        fetch(`${GET_PROFILE_DATA}/${discordId}`),
        fetch(`${GET_AVATAR}/${discordId}`),
      ]);

    if (profileResponse.status === 404) {
      return { data: null, error: "Invalid User ID" };
    } else if (profileResponse.status >= 500) {
      return {
        data: null,
        error: "Something went wrong, please try again later",
      };
    }

    const [twitchName, profileData, discordAvatarUrl] = await Promise.all([
      twitchResponse.json(),
      profileResponse.json(),
      discordAvatarResponse.json(),
    ]);

    return {
      data: {
        ...profileData,
        twitchId: channelId,
        twitchName,
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
  console.log("Saved data: ", data);
  for (const field of FIELDS) {
    if (!data[field]) {
      console.log(`Missing ${field}`);
      return false;
    }
  }
  return true;
};
