import styles from "./styles.module.scss";

const Profile = ({ userData }) => {
  console.log("User Data", userData);
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
      <section className={styles.userInfo}>
        <h2 className={styles.userName}>{userData.sendou_name}</h2>
        {!!userData.team && !!userData.team_url && (
          <section className={styles.teamContainer}>
            <img
              className={styles.teamImage}
              src={userData.team_url}
              alt="Team Picture"
              width="40"
              height="40"
            />
            <section className={styles.teamDetails}>
              <h4 className={styles.teamName}>{userData.team}</h4>
              <h5 className={styles.teamRole}>{userData.team_role}</h5>
            </section>
          </section>
        )}

        {!!userData.sendouq_rank && (
          <h3 className={styles.sqRank}>{userData.sendouq_rank}</h3>
        )}
      </section>
    </main>
  );
};

export default Profile;
