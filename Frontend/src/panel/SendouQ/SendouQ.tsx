import { useState } from "react";
import styles from "./styles.module.scss";

const SendouQ = ({ streamerData, matchData }) => {
  const alpha = matchData.teamAlpha;
  const alphaPlayers = alpha.players;
  const bravo = matchData.teamBravo;
  const bravoPlayers = bravo.players;
  const [displayDetails, setDisplayDetails] = useState(true);

  const streamerAlpha = alphaPlayers.find(
    (player) => player.discordId === streamerData.discord_id
  );
  const streamerBravo = bravoPlayers.find(
    (player) => player.discordId === streamerData.discord_id
  );

  return (
    <main>
      <section className={styles.necessaryInfo}>
        <h2
          className={`${styles.alphaHeader} ${
            streamerAlpha && styles.streamerTeam
          }`}
          title={`${
            streamerAlpha
              ? `${streamerData.twitch_name}'s team`
              : "Opponent's team"
          }`}
        >
          Alpha
        </h2>
        <h2
          className={`${styles.bravoHeader} ${
            streamerBravo && styles.streamerTeam
          }`}
          title={`${
            streamerBravo
              ? `${streamerData.twitch_name}'s team`
              : "Opponent's team"
          }`}
        >
          Bravo
        </h2>
        <h2 className={styles.scoreHeader}>Score</h2>
        <h2 className={styles.alphaScore}>{alpha.score}</h2>
        <h2 className={styles.bravoScore}>{bravo.score}</h2>
        {alphaPlayers.map(({ name, url, avatarUrl }, i) => (
          <a
            href={url}
            className={styles.avatarContainer}
            style={{ gridRow: 2, gridColumn: i + 1 }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              key={name}
              src={avatarUrl}
              alt={`${name}'s Avatar`}
              title={name}
              className={styles.avatar}
            />
          </a>
        ))}
        {bravoPlayers.map(({ name, url, avatarUrl }, i) => (
          <a
            href={url}
            className={styles.avatarContainer}
            style={{ gridRow: 2, gridColumn: i + 1 }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              key={name}
              src={avatarUrl}
              alt={`${name}'s Avatar`}
              title={name}
              className={styles.avatar}
              style={{ gridRow: 4, gridColumn: i + 1 }}
            />
          </a>
        ))}
      </section>
      {displayDetails && (
        <section className={styles.detailsContainer}></section>
      )}
    </main>
  );
};

export default SendouQ;
