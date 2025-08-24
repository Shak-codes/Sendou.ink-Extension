import styles from "./styles.module.scss";
import Button from "../../../components/Button/Button";
import Profile from "../../../components/Profile/Profile";

const DetailsScreen = ({ data, resetConfig }) => {
  return (
    <section className={styles.container}>
      <header>
        <h2>Hey there, {data.twitch_name}!</h2>
        <h3>Here's your current Sendou.ink data</h3>
      </header>
      <Profile userData={data} />
      <h4>Scoring Method: {data.scoringMethod}</h4>
      <p>Your scoreboard will look as follows</p>
      <div className={styles.restartContainer}>
        <p>Made a mistake? You can start over by clicking the button below.</p>
        <Button text="Start over" onClick={resetConfig} />
      </div>
    </section>
  );
};

export default DetailsScreen;
