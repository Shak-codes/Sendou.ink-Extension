import Button from "../../../components/Button/Button";
import styles from "./styles.module.scss";
import Profile from "../../../components/Profile/Profile";
import { saveToBackend } from "../../utils";
import manualScoring from "/images/manualScoring.png";
import lazyScoring from "/images/lazyScoring.png";
import finalScore from "/images/scoreEnd.png";

const VerifyScreen = ({ data, actions }) => {
  const { userData, scoringMethod, error } = data;
  const { resetData, saveToConfig, onError } = actions;
  return (
    <section className={styles.container}>
      <header>
        <h2>Verify</h2>
        <h3>Is the data below correct?</h3>
      </header>
      <Profile userData={userData} />

      <section className={styles.scoreMethodContainer}>
        <h4>Scoring Method: {scoringMethod}</h4>
        <p>Your scoreboard will look as follows</p>
        <section className={styles.scoreExampleContainer}>
          <section className={styles.scoreExamples}>
            <p className="bold">During the set</p>
            <img
              className={styles.scoreImage}
              src={scoringMethod === "manual" ? manualScoring : lazyScoring}
            />
          </section>
          <section>
            <p className="bold">After the set</p>
            <img className={styles.scoreImage} src={finalScore} />
          </section>
        </section>
      </section>

      <div className={styles.buttonContainer}>
        <Button text="Go back" onClick={resetData} />
        <Button
          animated
          text="Looks good!"
          onClick={() => saveToBackend(userData)}
          onError={onError}
          onSuccess={() => saveToConfig()}
        />
      </div>
      {!!error && <p className={`${styles.text} ${styles.error}`}>{error}</p>}
    </section>
  );
};

export default VerifyScreen;
