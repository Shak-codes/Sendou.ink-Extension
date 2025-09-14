import { Routes, Route, Navigate } from "react-router-dom";
import { MatchProvider } from "../context/MatchContext";
import { useConfig } from "../context/ConfigContext";

const Video_Overlay = () => {
  const configData = useConfig();

  return (
    <Routes>
      <Route path="/" element={<div></div>} />
      <Route path="/profile" element={<div></div>} />
      <Route
        path="/sendouq"
        element={
          <MatchProvider>
            <div></div>
          </MatchProvider>
        }
      />
      <Route path="/error" element={<div></div>} />
    </Routes>
    // <main className={styles.container}>
    //   {displayNav && (
    //     <header className={styles.navbar}>
    //       <section
    //         className={styles.toggle}
    //         onClick={() => selectTab("profile")}
    //       >
    //         <h3>Profile</h3>
    //       </section>
    //       <section
    //         className={styles.toggle}
    //         onClick={() => selectTab("sendouq")}
    //       >
    //         <h3>SendouQ</h3>
    //       </section>
    //     </header>
    //   )}
    //   {!!configData && display === "profile" && (
    //     <Profile userData={configData} />
    //   )}
    //   {!!configData && display === "sendouq" && (
    //     <SendouQ matchData={testData} streamerData={configData} />
    //   )}
    // </main>
  );
};

export default Video_Overlay;
