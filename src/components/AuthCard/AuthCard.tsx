import { useState } from "react";
import Button from "../common/Button/Button";
import styles from "./AuthCard.module.scss";
import TextInput from "../common/Inputs/TextInput/TextInput";

const AuthCard = () => {
  const [btnType, setBtnType] = useState("login");
  return (
    <div className={styles.authContainer}>
      <div className={styles.authSwitchButtonBox}>
        <Button
          className={`${styles.btn} ${
            btnType === "login" ? styles.atciveBtn : ""
          }`}
          text={"Login"}
          onClick={() => setBtnType("login")}
        />
        <Button
          className={`${styles.btn} ${
            btnType === "signup" ? styles.atciveBtn : ""
          }`}
          text={"Signup"}
          onClick={() => setBtnType("signup")}
        />
      </div>

      <div className={styles.inputsContainer}>
        <TextInput label="Full Name" placeholder="Omran Abandeh" />
        <TextInput label="Email Address" placeholder="you@example.com" />
        <TextInput label="Password" placeholder="********" />
        <TextInput label="Confirm Password" placeholder="********" />
      </div>
    </div>
  );
};

export default AuthCard;
