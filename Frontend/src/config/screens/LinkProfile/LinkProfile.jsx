import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import styles from "./styles.module.scss";
import { URLS } from "../../../../public/constants";

const LinkProfile = ({
  discordId,
  onChange,
  initiateLink,
  onError,
  onSuccess,
  error,
}) => {
  return (
    <section className={styles.container}>
      <header>
        <h2 className={styles.text}>Welcome!</h2>
        <h3 className={styles.text}>
          To set up this extension, please provide the 'User ID' of the Discord
          account linked to your Sendou.ink account.
        </h3>
      </header>
      <main>
        <Input
          id="userid"
          value={discordId}
          onChange={onChange}
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
      </main>
      <Button
        animated
        text="Link Account"
        onClick={initiateLink}
        onError={onError}
        onSuccess={onSuccess}
        disabled={!discordId}
      />
    </section>
  );
};

export default LinkProfile;
