import Button from "../../../components/Button/Button";
import styles from "./styles.module.scss";
import Profile from "../../../components/Profile/Profile";

const DisplayProfile = ({ data, resetConfig }) => {
  return (
    <section className={styles.container}>
      <header>
        <h2 className={styles.text}>Hey there, {data.twitch_name}!</h2>
        <h3 className={styles.text}>Here's your current Sendou.ink data</h3>
      </header>
      <Profile userData={data} />
      <div className={styles.restartContainer}>
        <p className={styles.text}>
          Made a mistake? You can start over by clicking the button below.
        </p>
        <Button text="Start over" onClick={resetConfig} />
      </div>
    </section>
  );
};

export default DisplayProfile;
