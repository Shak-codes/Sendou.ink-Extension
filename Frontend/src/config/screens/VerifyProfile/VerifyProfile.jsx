import Button from "../../../components/Button/Button";
import styles from "./styles.module.scss";

const VerifyProfile = ({ resetConfig, configData, saveConfig }) => {
  return (
    <>
      <h2 className={styles.text}>Verify Profile</h2>
      <p className={styles.text}>Is the data below correct?</p>
      <div className={styles.buttonContainer}>
        <Button text="Go back" onClick={resetConfig} />
        <Button text="Looks good!" onClick={saveConfig} />
      </div>
    </>
  );
};

export default VerifyProfile;
