import styles from "./styles.module.scss";

const Profile = ({ userData }) => {
  console.log("User Data", userData);
  const { sqRank, team } = userData;
  return (
    <main className={styles.profileContainer}>
      <a href={userData.sendouUrl} target="_blank" rel="noopener noreferrer">
        <img
          className={styles.profileImage}
          src={userData.avatarUrl}
          alt="User avatar"
          width="100"
          height="100"
        />
      </a>
      <section className={styles.userInfo}>
        <h2 className={styles.userName}>{userData.sendouName}</h2>
        {!!userData.team && !!userData.team.teamPageUrl && (
          <section className={styles.teamContainer}>
            <a
              href={team.teamPageUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className={styles.teamImage}
                src={team.logoUrl}
                alt="Team Picture"
                width="40"
                height="40"
              />
            </a>
            <section className={styles.teamDetails}>
              <h4 className={styles.teamName}>{team.name}</h4>
              <h5 className={styles.teamRole}>{team.role}</h5>
            </section>
          </section>
        )}

        {!!sqRank &&
          (sqRank.isPlus ? (
            <h3 className={styles.sqRank}>{sqRank.name}+</h3>
          ) : (
            <h3 className={styles.sqRank}>{sqRank.name}</h3>
          ))}
      </section>
    </main>
  );
};

export default Profile;
