import React, { useState } from "react";
import styles from "./styles.module.scss";

const Input = ({
  id,
  value,
  onFocus,
  onChange,
  label,
  help,
  error,
  type = "text",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <input
          type={type === "password" && !showPassword ? "password" : "text"}
          id={id}
          className={`${styles.roundedInput} ${value ? styles.active : ""} ${
            !!error ? styles.errorInput : ""
          }`}
          value={value}
          onFocus={onFocus}
          onChange={onChange}
        />
        <label
          htmlFor={id}
          className={`${styles.inputLabel} ${value ? styles.active : ""}`}
        >
          {label}
        </label>
      </div>
      {!!error && <span className={styles.error}>{error}</span>}
      {help && <span className={styles.help}>{help}</span>}
    </div>
  );
};

export default Input;
