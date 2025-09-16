import { Routes, Route, Navigate } from "react-router-dom";
import { MatchProvider } from "../context/MatchContext";
import { useConfig } from "../context/ConfigContext";
import Sendouq from "./pages/Sendouq/Sendouq";
import Profile from "./pages/Profile/Profile";
import Error from "./pages/Error/Error";

const VideoOverlay = () => {
  const streamerData = useConfig();

  if (streamerData === null || streamerData === undefined) {
    console.log("Streamer data not found! Rendering Error screen!");
    return (
      <Routes>
        <Route path="*" element={<Error />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/profile" replace />} />
      <Route path="/profile" element={<Profile />} />
      <Route
        path="/sendouq/*"
        element={
          <MatchProvider>
            <Sendouq />
          </MatchProvider>
        }
      />
    </Routes>
  );
};

export default VideoOverlay;
