import ReactDOM from "react-dom/client";
import VideoOverlay from "./VideoOverlay";
import { HashRouter } from "react-router-dom";
import { ConfigProvider } from "../context/ConfigContext";
import "../styles/globals.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
    <ConfigProvider>
      <VideoOverlay />
    </ConfigProvider>
  </HashRouter>
);
