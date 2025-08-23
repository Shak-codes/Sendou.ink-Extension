import { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import { getUserData, saveUserData, validUserData } from "./utils";
import { ConfigureScreen, VerifyProfile, DisplayProfile } from "./screens";

const Config = () => {
  const twitch = window.Twitch.ext;
  const [discordId, setDiscordId] = useState("");
  const [scoringMethod, setScoringMethod] = useState("manual"); // One of 'manual' | 'lazy'
  const [configData, setConfigData] = useState(null);
  const [error, setError] = useState(null);
  const [screen, setScreen] = useState("loading"); // One of 'loading' | 'configure' | 'verify' | 'details'

  useEffect(() => {
    twitch.configuration.onChanged(() => {
      const save = twitch.configuration.broadcaster;
      if (save && validUserData(JSON.parse(save.content))) {
        console.log("Found configuration data!");
        setConfigData(JSON.parse(twitch.configuration.broadcaster.content));
        setScreen("details");
      } else {
        console.log("Could not find valid user data!");
        setScreen("configure");
      }
    });

    twitch.onAuthorized(async (auth) => {
      twitch.channelId = auth.channelId;
      console.log(`Channel ID: ${auth.channelId}`);
    });
  }, []);

  const successGetUserData = (response) => {
    console.log("Got user data!");
    setConfigData(response.data);
  };

  const failGetUserData = (response) => {
    console.log("Failed to get user data");
    setError(response.error);
  };

  const updateConfig = async (data) => {
    setConfigData(data);
    setVerifyData(true);
  };

  const resetConfig = () => {
    setConfigData(null);
    setDiscordId("");
    setVerifyData(false);
    console.log("Reset values!");
  };

  const handleDiscordId = (e) => {
    setDiscordId(e.target.value);
  };

  const handleScoring = (method) => {
    setScoringMethod(method);
  };

  return (
    <div className={styles.container}>
      {screen === "configure" && (
        <ConfigureScreen
          data={{
            channelId: twitch.channelId,
            discordId,
            scoringMethod,
            error,
          }}
          actions={{
            handleDiscordId,
            setScoringMethod,
            failGetUserData,
            successGetUserData,
            getUserData,
          }}
        />
      )}
      {/* {screen === "verify" && (
        <VerifyProfile
          resetConfig={resetConfig}
          configData={configData}
          saveConfig={saveConfig}
          error={error}
          onError={onError}
          onSuccess={verifySuccess}
        />
      )}
      {screen === "details" && (
        <DisplayProfile data={configData} resetConfig={resetConfig} />
      )} */}
    </div>
  );
};

export default Config;
