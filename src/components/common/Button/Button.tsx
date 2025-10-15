import { useTheme } from "../../../contexts/ThemeContext";
import styles from "./Button.module.scss";

interface ButtonProps {
  text: string;
  className?: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, className, onClick }) => {
  const { theme, themeColors, toggleTheme } = useTheme();

  return (
    <button className={`${styles.button} ${className}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
