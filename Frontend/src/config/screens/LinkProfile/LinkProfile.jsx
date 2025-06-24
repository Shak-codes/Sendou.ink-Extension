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
    <>
      <h2 className={styles.text}>Welcome!</h2>
      <p className={styles.text}>
        To set up this extension, please provide the 'User ID' of the Discord
        account linked to your Sendou.ink account.
      </p>
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
      <div className={styles.bottomContainer}>
        <Button
          animated
          text="Link Account"
          onClick={initiateLink}
          onError={onError}
          onSuccess={onSuccess}
          disabled={!discordId}
        />
      </div>
    </>
  );
};

export default LinkProfile;
