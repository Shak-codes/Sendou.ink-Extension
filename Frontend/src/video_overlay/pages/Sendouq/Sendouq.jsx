import { Routes, Route } from "react-router-dom";
import Default from "./Default/Default";
import Score from "./Score/Score";
import Maps from "./Maps/Maps";

const Sendouq = () => {
  return (
    <Routes>
      <Route index element={<Default />} />
      <Route path="score" element={<Score />} />
      <Route path="maps" element={<Maps />} />
    </Routes>
  );
};

export default Sendouq;
