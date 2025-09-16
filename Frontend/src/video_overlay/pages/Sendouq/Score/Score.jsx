import { useMatch } from "../../../../context/MatchContext";
import { useConfig } from "../../../../context/ConfigContext";
import Scoreboard from "../../../components/Scoreboard/Scoreboard";

const Score = () => {
  const matchData = useMatch();
  const streamerData = useConfig();

  return (
    <main>
      <Scoreboard matchData={matchData} streamerData={streamerData} />
    </main>
  );
};

export default Score;
