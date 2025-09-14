import { createContext, useContext, useEffect, useState } from "react";

const ConfigContext = createContext(undefined);

export const ConfigProvider = ({ children }) => {
  const twitch = window.Twitch.ext;
  const [configData, setConfigData] = useState(undefined);

  useEffect(() => {
    twitch.configuration.onChanged(() => {
      if (twitch.configuration.broadcaster) {
        console.log("Found configuration data!");
        setConfigData(JSON.parse(twitch.configuration.broadcaster.content));
      } else {
        console.log("No config found!");
        setConfigData(null);
      }
    });
  }, []);

  return (
    <ConfigContext.Provider value={configData}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
