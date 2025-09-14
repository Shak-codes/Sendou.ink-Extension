import styles from "./styles.module.scss";
import { MAP_ASSETS } from "../../../config/constants";
import { useState } from "react";
import { useMatch } from "../../../context/MatchContext";
import { useConfig } from "../../../context/ConfigContext";

const Default = ({ streamerData }) => {
  const matchData = useMatch();
  const streamerData = useConfig();
  const {
    teamAlpha: { players: alphaPlayers, score: alphaScore },
    teamBravo: { players: bravoPlayers, score: bravoScore },
    mapList: maps,
  } = matchData;

  const { scoring_method, twitch_name } = streamerData;

  const topMapColumns = 4;
  const [topMaps, bottomMaps] = [
    maps.slice(0, topMapColumns),
    maps.slice(topMapColumns),
  ];

  const isLazy = scoring_method === "lazy";
  const isManual = scoring_method === "manual";
  const hasWinner = alphaScore === 4 || bravoScore === 4;

  const [displayScore, setDisplayScore] = useState(
    (isLazy && hasWinner) || isManual
  );
  const [gridColumns, setGridColumns] = useState(displayScore ? 5 : 4);

  const streamerAlpha = alphaPlayers.find(
    (player) => player.discordId === streamerData.discord_id
  );
  const streamerBravo = bravoPlayers.find(
    (player) => player.discordId === streamerData.discord_id
  );

  return (
    <main>
      <section
        className={styles.necessaryInfo}
        style={{ gridTemplateColumns: `repeat(${gridColumns}, auto)` }}
      >
        <h2
          className={`${styles.alphaHeader} ${
            streamerAlpha && styles.streamerTeam
          }`}
          title={`${
            streamerAlpha ? `${twitch_name}'s team` : "Opponent's team"
          }`}
        >
          Alpha
        </h2>
        <h2
          className={`${styles.bravoHeader} ${
            streamerBravo && styles.streamerTeam
          }`}
          title={`${
            streamerBravo ? `${twitch_name}'s team` : "Opponent's team"
          }`}
        >
          Bravo
        </h2>
        {displayScore && (
          <>
            <h2 className={styles.scoreHeader}>Score</h2>
            <h2 className={styles.alphaScore}>{alphaScore}</h2>
            <h2 className={styles.bravoScore}>{bravoScore}</h2>
          </>
        )}
        {alphaPlayers.map(({ name, url, avatarUrl }, i) => (
          <a
            key={name}
            href={url}
            className={styles.avatarContainer}
            style={{ gridRow: 2, gridColumn: i + 1 }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={avatarUrl}
              alt={`${name}'s Avatar`}
              title={name}
              className={styles.avatar}
            />
          </a>
        ))}
        {bravoPlayers.map(({ name, url, avatarUrl }, i) => (
          <a
            key={name}
            href={url}
            className={styles.avatarContainer}
            style={{ gridRow: 4, gridColumn: i + 1 }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={avatarUrl}
              alt={`${name}'s Avatar`}
              title={name}
              className={styles.avatar}
            />
          </a>
        ))}
      </section>
      <section className={styles.mapContainer}>
        <section
          className={styles.topMaps}
          style={{
            gridTemplateColumns: `repeat(${topMapColumns}, auto)`,
          }}
        >
          {topMaps.map((entry, i) => {
            const stage = entry.map.stage;
            const url = `/stages/${stage.id}.png`;
            console.log("url", url);
            return (
              <img
                src={`${MAP_ASSETS}/${stage.id}.png`}
                className={styles.map}
                alt={`Stage ${i} - ${stage.name}`}
                title={stage.name}
              />
            );
          })}
          {topMaps.map((entry) => {
            const mode = entry.map.mode;
            const url = `${MAP_ASSETS}/${mode}.png`;
            console.log("url", url);
            return (
              <img src={url} className={styles.mode} alt={mode} title={mode} />
            );
          })}
        </section>
        <section
          className={styles.bottomMaps}
          style={{
            gridTemplateColumns: `repeat(${bottomMaps.length}, auto)`,
          }}
        >
          {bottomMaps.map((entry, i) => {
            const stage = entry.map.stage;
            const url = `${MAP_ASSETS}/${stage.id}.png`;
            console.log("url", url);
            return (
              <img
                src={url}
                className={styles.map}
                alt={`Stage ${bottomMaps.length + i} - ${stage.name}`}
                title={stage.name}
              />
            );
          })}
          {bottomMaps.map((entry) => {
            const mode = entry.map.mode;
            const url = `${MAP_ASSETS}/${mode}.png`;
            console.log("url", url);
            return (
              <img src={url} className={styles.mode} alt={mode} title={mode} />
            );
          })}
        </section>
      </section>
    </main>
  );
};

export default Default;
