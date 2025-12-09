import { useState } from "react";
import Button from "../common/Button/Button";
import styles from "./AuthCard.module.scss";
import TextInput from "../common/Inputs/TextInput/TextInput";
import TextButton from "../common/TextButton/TextButton";
import { PRPJECT_CONTENT } from "../../constants/content";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

type AuthType = "login" | "signup";

interface FormData {
  fullName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const AuthCard = () => {
  const [authType, setAuthType] = useState<AuthType>("login");
  const { login, signup, isLoading, error, setError } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };
  const switchAuthType = (type: AuthType) => {
    setAuthType(type);
    setErrors({});
    setFormData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Signup specific validations
    if (authType === "signup") {
      if (!formData.fullName?.trim()) {
        newErrors.fullName = "Full name is required";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (authType === "login") {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.fullName!, formData.email, formData.password);
      }

      // Redirect to dashboard on success
      navigate("/");
    } catch (err) {
      // Error is already handled in AuthContext
      console.error("Authentication error:", err);
    }
  };
  return (
    <div className={styles.authContainer}>
      {/* Auth Type Switch */}
      <div className={styles.authSwitchButtonBox}>
        <Button
          className={`${styles.btn} ${
            authType === "login" ? styles.atciveBtn : ""
          }`}
          text={PRPJECT_CONTENT.login}
          onClick={() => switchAuthType("login")}
        />
        <Button
          className={`${styles.btn} ${
            authType === "signup" ? styles.atciveBtn : ""
          }`}
          text={PRPJECT_CONTENT.signup}
          onClick={() => switchAuthType("signup")}
        />
      </div>

      <form onSubmit={handleSubmit} className={styles.authForm}>
        <div className={styles.inputsContainer}>
          {authType === "signup" && (
            <TextInput
              label={PRPJECT_CONTENT.fullName}
              type="text"
              placeholder={PRPJECT_CONTENT.fullNamePlaceholder}
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              errorMessage={errors.fullName}
            />
          )}

          <TextInput
            label={PRPJECT_CONTENT.emailAddress}
            type="email"
            placeholder={PRPJECT_CONTENT.emailAddressPlaceholder}
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            errorMessage={errors.email}
          />

          <TextInput
            label={PRPJECT_CONTENT.password}
            type="password"
            placeholder={PRPJECT_CONTENT.passwordPlaceholder}
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            errorMessage={errors.password}
          />

          {authType === "signup" && (
            <TextInput
              label={PRPJECT_CONTENT.confirmPassword}
              type="password"
              placeholder={PRPJECT_CONTENT.confirmPasswordPlaceholder}
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              errorMessage={errors.confirmPassword}
            />
          )}
        </div>
        <div className={styles.forgotPasswordContainer}>
          <TextButton
            href="/forgot-password"
            className={styles.forgotPasswordButton}
            variant="primary"
            size="sm"
          >
            {PRPJECT_CONTENT.forgotPassword}
          </TextButton>
        </div>

        <Button
          className={styles.submitBtn}
          text={
            authType === "login"
              ? PRPJECT_CONTENT.signin
              : PRPJECT_CONTENT.createAccount
          }
          onClick={handleSubmit}
        />
      </form>
    </div>
  );
};

export default AuthCard;
