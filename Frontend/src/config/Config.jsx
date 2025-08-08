import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import {
  GET_PROFILE_DATA,
  GET_TWITCH_NAME,
  ADD_USER,
  GET_USER,
} from "./constants";
import { LinkProfile, VerifyProfile, DisplayProfile } from "./screens";

const Config = () => {
  const [discordId, setDiscordId] = useState("");
  const [ext, setExt] = useState(null);
  const [error, setError] = useState({
    message: null,
    display: false,
  });
  const [configData, setConfigData] = useState(null);
  const [verifyData, setVerifyData] = useState(false);
  const [displayProfile, setDisplayProfile] = useState(false);

  useEffect(() => {
    const twitchExt = window.Twitch?.ext;

    if (!twitchExt) {
      return;
    }

    twitchExt.onAuthorized(async (auth) => {
      twitchExt.channelId = auth.channelId;
      console.log(`Channel ID: ${auth.channelId}`);

      try {
        const response = await fetch(`${GET_USER}/${auth.channelId}`);
        const userData = await response.json();
        console.log("Fetched user data:", userData);
        setConfigData(userData);
        setDisplayProfile(true);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    });

    setExt(twitchExt);
  }, []);

  const initiateLink = async () => {
    try {
      const [twitchResponse, profileResponse] = await Promise.all([
        fetch(`${GET_TWITCH_NAME}/${ext.channelId}`),
        fetch(`${GET_PROFILE_DATA}/${discordId}`),
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

      const [twitchName, profileData] = await Promise.all([
        twitchResponse.json(),
        profileResponse.json(),
      ]);

      return {
        discord_id: discordId,
        twitch_id: ext.channelId,
        sendou_id: profileData.id,
        twitch_name: twitchName,
        sendou_name: profileData.name,
        sendou_url: profileData.url,
        avatar_url: profileData.avatarUrl,
        peak_rank: null,
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
