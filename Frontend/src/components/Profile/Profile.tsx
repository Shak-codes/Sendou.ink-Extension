import styles from "./styles.module.scss";

const Profile = ({ userData }) => {
  return (
    <main className={styles.profileContainer}>
      <a href={userData.sendou_url} target="_blank" rel="noopener noreferrer">
        <img
          className={styles.profileImage}
          src={userData.avatar_url}
          alt="User avatar"
          width="100"
          height="100"
        />
      </a>
      <div className={styles.userInfo}>
        <h2>{userData.sendou_name}</h2>
      </div>
    </main>
  );
};

export default Profile;
