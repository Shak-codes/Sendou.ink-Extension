import { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import {
  GET_PROFILE_DATA,
  GET_TWITCH_NAME,
  ADD_USER,
  GET_AVATAR,
} from "./constants";
import { LinkProfile, VerifyProfile, DisplayProfile } from "./screens";

const Config = () => {
  const twitch = window.Twitch.ext;
  const [discordId, setDiscordId] = useState("");
  const [error, setError] = useState({
    message: null,
    display: false,
  });
  const [configData, setConfigData] = useState(null);
  const [verifyData, setVerifyData] = useState(false);
  const [displayProfile, setDisplayProfile] = useState(false);

  useEffect(() => {
    twitch.configuration.onChanged(() => {
      if (twitch.configuration.broadcaster) {
        console.log("Found configuration data!");
        setConfigData(JSON.parse(twitch.configuration.broadcaster.content));
        setDisplayProfile(true);
      }
    });

    twitch.onAuthorized(async (auth) => {
      twitch.channelId = auth.channelId;
      console.log(`Channel ID: ${auth.channelId}`);
    });
  }, []);

  const initiateLink = async () => {
    try {
      const [twitchResponse, profileResponse, avatarResponse] =
        await Promise.all([
          fetch(`${GET_TWITCH_NAME}/${twitch.channelId}`),
          fetch(`${GET_PROFILE_DATA}/${discordId}`),
          fetch(`${GET_AVATAR}/${discordId}`),
        ]);

      if (profileResponse.status === 404) {
        setError((prev) => ({ ...prev, message: "Invalid User ID" }));
        return;
      } else if (profileResponse.status >= 500) {
        setError((prev) => ({
          ...prev,
          message: "Something went wrong, please try again later",
        }));
        return;
      }

      const [twitchName, profileData, avatarUrl] = await Promise.all([
        twitchResponse.json(),
        profileResponse.json(),
        avatarResponse.json(),
      ]);

      console.log("Avatar URL", avatarUrl);

      const { currentRank, teams, id, name, url, peakXp } = profileData;
      const team = teams?.[0];
      const sendouq_rank = currentRank
        ? `${currentRank.tier.name}${currentRank.tier.isPlus ? "+" : ""}`
        : null;

      return {
        discord_id: discordId,
        twitch_id: twitch.channelId,
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
      };
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError((prev) => ({
        ...prev,
        message: "An unexpected error occurred",
      }));
    }
  };

  const updateConfig = async (data) => {
    setConfigData(data);
    setVerifyData(true);
  };

  const saveConfig = async () => {
    try {
      const response = await fetch(ADD_USER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(configData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save user config: ${response.status}`);
      }

      twitch.configuration.set("broadcaster", "1", JSON.stringify(configData));

      const result = await response.json();
      console.log("User saved:", result);
      return result;
    } catch (err) {
      console.error("Save config failed:", err);
      setError({
        message: "Failed to save user data. Please try again later.",
        display: true,
      });
    }
  };

  const onError = async () => {
    setError((prev) => ({
      ...prev,
      display: true,
    }));
  };

  const resetConfig = () => {
    setConfigData(null);
    setDiscordId("");
    setVerifyData(false);
    console.log("Reset values!");
  };

  const handleIdChange = (e) => {
    setDiscordId(e.target.value);
  };

  const verifySuccess = () => {
    setDisplayProfile(true);
    setVerifyData(false);
    console.log("Verified Success!");
  };

  return (
    <div className={styles.container}>
      {!configData && !verifyData && (
        <LinkProfile
          discordId={discordId}
          onChange={handleIdChange}
          error={error}
          onError={onError}
          initiateLink={initiateLink}
          onSuccess={updateConfig}
        />
      )}
      {!!configData && verifyData && (
        <VerifyProfile
          resetConfig={resetConfig}
          configData={configData}
          saveConfig={saveConfig}
          error={error}
          onError={onError}
          onSuccess={verifySuccess}
        />
      )}
      {!!configData && !verifyData && displayProfile && (
        <DisplayProfile data={configData} resetConfig={resetConfig} />
      )}
    </div>
  );
};

export default Config;
