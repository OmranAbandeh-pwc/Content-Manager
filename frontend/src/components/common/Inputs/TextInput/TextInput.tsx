import { useState } from "react";
import commonStyles from "../InputStyles.module.scss";
import styles from "./TextInput.module.scss";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

interface TextInputProps {
  label?: string;
  customClassName?: string;
  errorMessage?: string;
  placeholder?: string;
  type?: "text" | "password" | "email" | "number" | "tel";
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}
const TextInput: React.FC<TextInputProps> = ({
  label,
  customClassName,
  errorMessage,
  placeholder,
  type = "text",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === "password";
  const inputType = isPasswordType && showPassword ? "text" : type;

  return (
    <div className={commonStyles["inputWrapper"]}>
      {label && <label className={commonStyles["labelInput"]}>{label}</label>}

      <div className={styles.inputContainer}>
        <input
          className={commonStyles["textInput"]}
          type={inputType}
          placeholder={placeholder}
          {...props}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.togglePassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? (
              <IconEyeOff size={25} stroke={1.5} />
            ) : (
              <IconEye size={25} stroke={1.5} />
            )}
          </button>
        )}
      </div>

      {errorMessage && (
        <span className={commonStyles["errorMessage"]}>{errorMessage}</span>
      )}
    </div>
  );
};

export default TextInput;
