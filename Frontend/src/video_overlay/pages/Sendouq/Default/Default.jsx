import { useMatch } from "../../../../context/MatchContext";
import { useConfig } from "../../../../context/ConfigContext";
import Navbar from "../../../components/Navbar/Navbar";
import Scoreboard from "../../../components/Scoreboard/Scoreboard";
import Maplist from "../../../components/Maplist/Maplist";

const Default = () => {
  const matchData = useMatch();
  console.log("Match data: ", matchData);
  const streamerData = useConfig();

  return (
    <>
      <Navbar />
      {matchData && streamerData && (
        <main>
          <Scoreboard matchData={matchData} streamerData={streamerData} />
          <Maplist matchData={matchData} />
        </main>
      )}
    </>
  );
};

export default Default;
