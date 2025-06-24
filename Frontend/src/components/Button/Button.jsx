import React, { useState } from "react";
import styles from "./styles.module.scss";

function Button({
  text,
  onClick,
  onError = null,
  onSuccess = null,
  animated,
  disabled = false,
}) {
  const [state, setState] = useState("idle"); // 'idle' | 'loading' | 'loadingFade' | 'success' | 'failure'

  const handleClick = async () => {
    if (!onClick) return;

    if (!animated) {
      const result = await onClick();
      if (result === undefined || result === null) {
        await onError();
        return;
      }
      if (onSuccess) await onSuccess(result);
      return;
    }

    setState("loading");
    const result = await onClick();

    setState("loadingFade");
    await new Promise((r) => setTimeout(r, 750));

    if (result === undefined || result === null) {
      setState("failure");
      await onError();
      await new Promise((r) => setTimeout(r, 1500));
      setState("idle");
      return;
    }

    setState("success");
    await new Promise((r) => setTimeout(r, 1500));

    setState("idle");
    await onSuccess(result);
  };

  const ButtonClasses = (state) => {
    const baseClass = styles.button;

    switch (state) {
      case "loading":
        return `${baseClass} ${styles.loading}`;
      case "loadingFade":
        return `${baseClass} ${styles.loading} ${styles.fadeOut}`;
      case "success":
        return `${baseClass} ${styles.success}`;
      case "failure":
        return `${baseClass} ${styles.failure}`;
      default:
        return baseClass;
    }
  };

  return (
    <button
      onClick={handleClick}
      className={ButtonClasses(state)}
      disabled={disabled}
    >
      <div className={styles.buttonContent}>{text}</div>
      {(state == "loading" || state === "loadingFade") && (
        <div className={styles.loadingIcon}></div>
      )}
      {state == "success" && <div className={styles.checkmark}>✓</div>}
      {state == "failure" && <div className={styles.cross}>X</div>}
    </button>
  );
}

export default Button;
