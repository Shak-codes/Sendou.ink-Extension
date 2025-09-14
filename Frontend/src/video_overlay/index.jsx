import ReactDOM from "react-dom/client";
import Video_Overlay from "./Video_Overlay";
import { HashRouter } from "react-router-dom";
import { ConfigProvider } from "../context/ConfigContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
    <ConfigProvider>
      <Video_Overlay />
    </ConfigProvider>
  </HashRouter>
);
