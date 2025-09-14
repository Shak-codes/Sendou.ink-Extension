import { createContext, useContext, useEffect, useState } from "react";
import { testData } from "./testData";

const MatchContext = createContext();

export const useMatch = () => useContext(MatchContext);

export const MatchProvider = ({ children }) => {
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    // fetch("/api/redis/match")
    //   .then((res) => res.json())
    //   .then((data) => setMatchData(data));

    // const eventSource = new EventSource("/api/sse/match");
    // eventSource.onmessage = (e) => {
    //   const update = JSON.parse(e.data);
    //   setMatchData((prev) => ({ ...prev, ...update }));
    // };

    // return () => eventSource.close();
    setMatchData(testData);
  }, []);

  return (
    <MatchContext.Provider value={matchData}>{children}</MatchContext.Provider>
  );
};
