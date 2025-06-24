import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import { GET_PROFILE_DATA, GET_TWITCH_NAME } from "./constants";
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

  useEffect(() => {
    const twitchExt = window.Twitch?.ext;

    if (!twitchExt) {
      return;
    }

    twitchExt.onAuthorized((auth) => {
      twitchExt.channelId = auth.channelId;
      console.log(`Channel ID: ${auth.channelId}`);

      // Load saved config from Twitch Config Service
      twitchExt.configuration.broadcaster.get().then((cfg) => {
        try {
          const data = JSON.parse(cfg.content || "{}");
          setConfigData(data);
        } catch (err) {
          console.error("Failed to parse config", err);
        }
      });
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
        sendou_id: profileData.id,
        twitch_id: ext.channelId,
        twitch_name: twitchName,
        sendou_name: profileData.name,
        sendou_url: profileData.url,
        avatar_url: profileData.avatarUrl,
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

  const saveConfig = async (config) => {
    await ext.configuration.broadcaster.set(JSON.stringify(config));
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
        />
      )}
      {!!configData && !verifyData && <DisplayProfile />}
    </div>
  );
};

export default Config;
