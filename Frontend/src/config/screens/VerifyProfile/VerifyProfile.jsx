import Button from "../../../components/Button/Button";
import styles from "./styles.module.scss";
import Profile from "../../../components/Profile/Profile";

const VerifyProfile = ({
  resetConfig,
  configData,
  saveConfig,
  error,
  onError,
  onSuccess,
}) => {
  return (
    <section className={styles.container}>
      <header>
        <h2 className={styles.text}>Verify Profile</h2>
        <h3 className={styles.text}>Is the data below correct?</h3>
      </header>
      <Profile userData={configData} />
      <div className={styles.buttonContainer}>
        <Button text="Go back" onClick={resetConfig} />
        <Button
          animated
          text="Looks good!"
          onClick={saveConfig}
          onError={onError}
          onSuccess={onSuccess}
        />
      </div>
    </section>
  );
};

export default VerifyProfile;
