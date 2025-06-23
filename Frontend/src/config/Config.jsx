import React, { useState, useEffect } from "react";
import { URLS } from "../../public/constants";
import styles from "./styles.module.scss";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";

function Config() {
  const [discordId, setDiscordId] = useState("");
  const [status, setStatus] = useState("");
  const [ext, setExt] = useState(null);
  const [error, setError] = useState("");
  const [configData, setConfigData] = useState(null);

  useEffect(() => {
    const twitchExt = window.Twitch?.ext;

    if (!twitchExt) {
      setStatus("Twitch extension helper not found.");
      return;
    }

    setExt(twitchExt);

    twitchExt.onAuthorized((auth) => {
      twitchExt.authToken = auth.token;
      twitchExt.channelId = auth.channelId;

      // Load saved config from Twitch Config Service
      twitchExt.configuration.broadcaster.get().then((cfg) => {
        try {
          const data = JSON.parse(cfg.content || "{}");
          if (data.discordId) setDiscordId(data.discordId);
        } catch (err) {
          console.error("Failed to parse config", err);
        }
      });
    });
  }, []);

  const linkAccount = async () => {
    const response = await fetch(`TEST`);
    console.log(`response.ok ${response.ok}`);
    if (response.ok) setConfigData(response.json);
    else if (response.status == 404) setError("Invalid User ID");
    else setError("Something went wrong, please try again later");
  };

  const saveConfig = async () => {
    if (!ext) {
      setStatus("Twitch extension not initialized");
      return;
    }

    setStatus("Validating...");

    try {
      const res = await fetch(`https://api.sendou.ink/discord/${discordId}`);
      if (!res.ok) {
        setStatus("Invalid Discord ID");
        return;
      }
      const userData = await res.json();

      await ext.configuration.broadcaster.set(
        ext.authToken,
        JSON.stringify({ discordId })
      );

      const saveRes = await fetch("/api/link", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ext.authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          broadcasterId: ext.channelId,
          discordId,
          sendouId: userData.sendouId,
        }),
      });

      if (!saveRes.ok) {
        setStatus("Failed to save config on backend");
        return;
      }

      setStatus("Saved! ✅");
    } catch (error) {
      setStatus("Error during save: " + error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.text}>Welcome!</h2>
      <p className={styles.text}>
        To set up this extension, please provide the 'User ID' of the Discord
        account linked to your Sendou.ink account.
      </p>
      <Input
        id="userid"
        value={discordId}
        onChange={(e) => setDiscordId(e.target.value)}
        label="User ID"
        help={
          <>
            Can't find your User ID? Read this{" "}
            <a className={styles.link} href={URLS.USER_ID} target="_blank">
              article
            </a>
          </>
        }
        error={error}
      />
      <div className={styles.bottomContainer}>
        <Button text="Submit" onClick={linkAccount} disabled={!discordId} />
      </div>
    </div>
  );
}

export default Config;
