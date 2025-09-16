import { useMatch } from "../../../../context/MatchContext";
import Maplist from "../../../components/Maplist/Maplist";

const Maps = () => {
  const matchData = useMatch();

  return (
    <main>
      <Maplist matchData={matchData} />
    </main>
  );
};

export default Maps;
