import { useTheme } from "../../../contexts/ThemeContext";
import Button from "../../../components/common/Button/Button";
import styles from "./LoginPage.module.scss";
import AuthCard from "../../../components/AuthCard/AuthCard";

const LoginPage = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className={styles.loginContainer}>
      <AuthCard />
    </div>
  );
};

export default LoginPage;
