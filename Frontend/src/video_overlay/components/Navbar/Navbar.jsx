import { useNavigate, useLocation } from "react-router-dom";
import styles from "./styles.module.scss";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goToProfile = () => {
    if (location.pathname !== "/profile") {
      navigate("/profile");
    }
  };

  const goToSendouq = () => {
    if (location.pathname !== "/sendouq") {
      navigate("/sendouq");
    }
  };

  return (
    <header className={styles.navbar}>
      <section className={styles.toggle} onClick={goToProfile}>
        <h3>Profile</h3>
      </section>
      <section className={styles.toggle} onClick={goToSendouq}>
        <h3>SendouQ</h3>
      </section>
    </header>
  );
};

export default Navbar;
