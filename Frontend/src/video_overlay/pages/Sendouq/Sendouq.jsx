import { Routes, Route, Navigate } from "react-router-dom";
import Default from "./Default";
import Score from "./Score";
import Maps from "./Maps";

const Sendouq = () => {
  return (
    <Routes>
      <Route path="/" element={<Default />} />
      <Route path="score" element={<Score />} />
      <Route path="maps" element={<Maps />} />
    </Routes>
  );
};

export default Sendouq;
