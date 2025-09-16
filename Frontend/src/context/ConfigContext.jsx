import { createContext, useContext, useEffect, useState } from "react";

const ConfigContext = createContext(undefined);

export const ConfigProvider = ({ children }) => {
  const [configData, setConfigData] = useState(undefined);

  useEffect(() => {
    if (!window.Twitch || !window.Twitch.ext) {
      console.warn("Twitch helper not ready yet");
      return;
    }

    const twitch = window.Twitch.ext;

    const handleConfigUpdate = () => {
      try {
        if (twitch.configuration?.broadcaster?.content) {
          console.log(
            "Found config:",
            twitch.configuration.broadcaster.content
          );
          setConfigData(JSON.parse(twitch.configuration.broadcaster.content));
        } else {
          console.log("No broadcaster config found.");
          setConfigData(null);
        }
      } catch (err) {
        console.error("Failed to parse broadcaster config", err);
        setConfigData(null);
      }
    };

    // Ensure we don’t touch config until Twitch authorizes the extension
    twitch.onAuthorized(() => {
      console.log("✅ Authorized with Twitch");
      handleConfigUpdate();
    });

    // React to any config changes
    twitch.configuration.onChanged(handleConfigUpdate);

    return () => {
      // No official "off" API, but we can null out handlers to avoid leaks
      twitch.configuration.onChanged(() => {});
    };
  }, []);

  return (
    <ConfigContext.Provider value={configData}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
