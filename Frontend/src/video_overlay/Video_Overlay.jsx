import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import Profile from "../components/Profile/Profile";
import SendouQ from "./SendouQ/SendouQ";
import { testData } from "./SendouQ/testData";

const Video_Overlay = () => {
  const twitch = window.Twitch.ext;
  const [configData, setConfigData] = useState(null);
  const [display, setDisplay] = useState("profile"); // One of: profile | sendouq | tournament(TBD at a later date)
  const [displayNav, setDisplaynav] = useState(true);

  const selectTab = (tab) => {
    setDisplay(tab);
  };

  useEffect(() => {
    twitch.configuration.onChanged(() => {
      if (twitch.configuration.broadcaster) {
        console.log("Found configuration data!");
        setConfigData(JSON.parse(twitch.configuration.broadcaster.content));
      }
    });
  }, []);
  return (
    <section className={styles.container}>
      {displayNav && (
        <header className={styles.navbar}>
          <section
            className={styles.toggle}
            onClick={() => selectTab("profile")}
          >
            <h3>Profile</h3>
          </section>
          <section
            className={styles.toggle}
            onClick={() => selectTab("sendouq")}
          >
            <h3>SendouQ</h3>
          </section>
        </header>
      )}
      {!!configData && display === "profile" && (
        <Profile userData={configData} />
      )}
      {!!configData && display === "sendouq" && (
        <SendouQ matchData={testData} streamerData={configData} />
      )}
    </section>
  );
};

export default Video_Overlay;
