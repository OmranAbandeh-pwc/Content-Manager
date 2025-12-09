
import styles from "./LoginPage.module.scss";
import AuthCard from "../../../components/AuthCard/AuthCard";
import FeatureCard from "../../../components/FeatureCard/FeatureCard";

const LoginPage = () => {
  return (
    <div className={styles.loginContainer}>
      <FeatureCard/>
      <AuthCard />
    </div>
  );
};

export default LoginPage;
