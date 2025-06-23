import React, { useState } from "react";
import styles from "./styles.module.scss";

function Button({ text, onClick, animated, disabled = false }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClick = async () => {
    if (onClick && animated) {
      setLoading(true);
      await onClick();
      setLoading(false);
      setSuccess(true);
    } else if (onClick) {
      await onClick();
    }
  };

  const classNames = [
    styles.button,
    loading && styles.loading,
    success && styles.success,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button onClick={handleClick} className={classNames} disabled={disabled}>
      <div className={styles.buttonContent}>{text}</div>
      {loading && <div className={styles.loader}></div>}
      {success && <div className={styles.checkmark}>✓</div>}
    </button>
  );
}

export default Button;
