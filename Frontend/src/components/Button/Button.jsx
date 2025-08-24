import React, { useState } from "react";
import styles from "./styles.module.scss";

function Button({
  variant = "normal",
  selected = false,
  text,
  onClick,
  onError = null,
  onSuccess = null,
  animated = false,
  disabled = false,
}) {
  const [state, setState] = useState("idle"); // 'idle' | 'loading' | 'loadingFade' | 'success' | 'failure'

  const handleClick = async () => {
    if (!onClick) return;

    if (!animated) {
      const result = await onClick();
      if (result.error && !!onError) {
        await onError(result);
        return;
      }
      if (!!onSuccess) await onSuccess(result);
      setState("idle");
      return;
    }

    setState("loading");
    console.log("OnClick!");
    const result = await onClick();

    setState("loadingFade");
    console.log("Loading Fade!");
    await new Promise((r) => setTimeout(r, 750));

    if (result.error) {
      setState("failure");
      onError(result);
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
    const baseClass =
      variant === "radio" && selected
        ? `${styles.button} ${styles.selected}`
        : styles.button;

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
      disabled={disabled || state !== "idle"}
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
