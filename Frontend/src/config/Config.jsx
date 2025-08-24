import { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import { getUserData, validUserData } from "./utils";
import { ConfigureScreen, VerifyScreen, DisplayProfile } from "./screens";

const Config = () => {
  const twitch = window.Twitch.ext;
  const [discordId, setDiscordId] = useState("");
  const [scoringMethod, setScoringMethod] = useState("manual"); // One of 'manual' | 'lazy'
  const [userData, setUserData] = useState(null);
  const [config, setConfig] = useState(null);
  const [error, setError] = useState(null);
  const [screen, setScreen] = useState("loading"); // One of 'loading' | 'configure' | 'verify' | 'details'

  useEffect(() => {
    twitch.configuration.onChanged(() => {
      const save = twitch.configuration.broadcaster;
      if (save && validUserData(JSON.parse(save.content))) {
        console.log("Found configuration data!");
        setConfig(JSON.parse(twitch.configuration.broadcaster.content));
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

  const handleDiscordId = (e) => {
    setDiscordId(e.target.value);
  };

  const successGetUserData = (response) => {
    console.log("Got user data!");
    setUserData(response.data);
    setScreen("verify");
  };

  const onError = (response) => {
    setError(response.error);
  };

  const resetData = () => {
    setConfig(null);
    setDiscordId("");
    setScoringMethod("manual");
    setScreen("configure");
    console.log("Reset values!");
  };

  const saveToConfig = () => {
    const data = {
      ...userData,
      scoringMethod,
    };
    twitch.configuration.set("broadcaster", "1", JSON.stringify(data));
    setConfig(data);
    setScreen("details");
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
            onError,
            successGetUserData,
            getUserData,
          }}
        />
      )}
      {screen === "verify" && (
        <VerifyScreen
          data={{
            userData,
            scoringMethod,
            error,
          }}
          actions={{
            resetData,
            saveToConfig,
            onError,
          }}
        />
      )}
      {/* {screen === "details" && (
        <DisplayProfile data={configData} resetConfig={resetConfig} />
      )} */}
    </div>
  );
};

export default Config;
