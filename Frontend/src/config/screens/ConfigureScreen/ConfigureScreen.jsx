import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import styles from "./styles.module.scss";
import { URLS } from "../../../../public/constants";

const ConfigureScreen = ({ data, actions }) => {
  const { channelId, discordId, scoringMethod, error } = data;
  const {
    handleDiscordId,
    setScoringMethod,
    getUserData,
    failGetUserData,
    successGetUserData,
  } = actions;
  return (
    <section className={styles.container}>
      <header>
        <h2 className={styles.text}>Welcome!</h2>
        <h3 className={styles.text}>
          To set up this extension, please fill in the following.
        </h3>
      </header>
      <main>
        <section className={styles.userIdContainer}>
          <h4 className={styles.text}>
            Please provide the 'User ID' of the Discord account linked to your
            Sendou.ink account.
          </h4>
          <Input
            id="userid"
            value={discordId}
            onChange={handleDiscordId}
            label="User ID"
            help={
              <>
                Can't find your User ID? Read this{" "}
                <a className={styles.link} href={URLS.USER_ID} target="_blank">
                  article
                </a>
              </>
            }
            error={error}
          />
        </section>
        <section className={styles.scoringContainer}>
          <h4 className={styles.text}>Please select a scoring method.</h4>
          {scoringMethod === "manual" && (
            <p className={styles.text}>
              Sendou.ink doesn't support automatic score updates for SendouQ
              matches. With manual scoring, the scoreboard will be present
              during a set, and either you(the streamer) or a moderator have to
              update the scoreboard within the extension after each match.
            </p>
          )}
          {scoringMethod === "lazy" && (
            <p className={styles.text}>
              Sendou.ink doesn't support automatic score updates for SendouQ
              matches. With lazy scoring, the scoreboard will not be present
              during a set. Upon the set finishing, the scoreboard will be
              displayed for a brief period of time with the final score.
            </p>
          )}
          <section className={styles.buttonContainer}>
            <Button
              variant="radio"
              selected={scoringMethod === "manual"}
              onClick={() => setScoringMethod("manual")}
              text="Manual"
            />
            <Button
              variant="radio"
              selected={scoringMethod === "lazy"}
              onClick={() => setScoringMethod("lazy")}
              text="Lazy"
            />
          </section>
        </section>
      </main>
      <Button
        animated
        text="Link Account"
        onClick={() => getUserData(channelId, discordId)}
        onError={failGetUserData}
        onSuccess={successGetUserData}
        disabled={!discordId}
      />
    </section>
  );
};

export default ConfigureScreen;
