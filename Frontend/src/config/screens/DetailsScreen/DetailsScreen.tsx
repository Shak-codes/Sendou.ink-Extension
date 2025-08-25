import styles from "./styles.module.scss";
import Button from "../../../components/Button/Button";
import Profile from "../../../components/Profile/Profile";
import manualScoring from "/images/manualScoring.png";
import lazyScoring from "/images/lazyScoring.png";
import finalScore from "/images/scoreEnd.png";

const DetailsScreen = ({ data, resetConfig }) => {
  return (
    <section className={styles.container}>
      <header>
        <h2>Hey there, {data.twitch_name}!</h2>
        <h3>Here's your current Sendou.ink data</h3>
      </header>
      <Profile userData={data} />

      <section className={styles.scoreMethodContainer}>
        <h4>Scoring Method: {data.scoring_method}</h4>
        <p>Your scoreboard will look as follows</p>
        <section className={styles.scoreExampleContainer}>
          <section className={styles.scoreExamples}>
            <p className="bold">During the set</p>
            <img
              className={styles.scoreImage}
              src={
                data.scoring_method === "manual" ? manualScoring : lazyScoring
              }
            />
          </section>
          <section>
            <p className="bold">After the set</p>
            <img className={styles.scoreImage} src={finalScore} />
          </section>
        </section>
      </section>

      <div className={styles.restartContainer}>
        <p>Made a mistake? You can start over by clicking the button below.</p>
        <Button text="Start over" onClick={resetConfig} />
      </div>
    </section>
  );
};

export default DetailsScreen;
