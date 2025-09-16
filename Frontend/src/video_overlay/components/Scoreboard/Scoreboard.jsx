import styles from "./styles.module.scss";
import { useNavigate, useLocation } from "react-router-dom";

const Scoreboard = ({ matchData, streamerData }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    teamAlpha: { players: alphaPlayers, score: alphaScore },
    teamBravo: { players: bravoPlayers, score: bravoScore },
  } = matchData;
  const { scoringMethod, twitchName, discordId } = streamerData;

  const isLazy = scoringMethod === "lazy";
  const isManual = scoringMethod === "manual";

  const hasWinner = alphaScore === 4 || bravoScore === 4;
  const displayScore = (isLazy && hasWinner) || isManual;
  const columns = displayScore ? 5 : 4;

  const streamerAlpha = alphaPlayers.find(
    (player) => player.discordId === discordId
  );
  const streamerBravo = bravoPlayers.find(
    (player) => player.discordId === discordId
  );

  const goToScore = () => {
    if (location.pathname !== "/sendouq/score") {
      navigate("score");
    }
  };

  return (
    <section
      onClick={goToScore}
      className={styles.scoreboardContainer}
      style={{ gridTemplateColumns: `repeat(${columns}, auto)` }}
    >
      <h2
        className={`${styles.alphaHeader} ${
          streamerAlpha && styles.streamerTeam
        }`}
        title={`${streamerAlpha ? `${twitchName}'s team` : "Opponent's team"}`}
      >
        Alpha
      </h2>
      <h2
        className={`${styles.bravoHeader} ${
          streamerBravo && styles.streamerTeam
        }`}
        title={`${streamerBravo ? `${twitchName}'s team` : "Opponent's team"}`}
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
  );
};

export default Scoreboard;
