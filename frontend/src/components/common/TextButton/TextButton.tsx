import styles from "./TextButton.module.scss";

interface TextButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  underline?: boolean;
}

const TextButton: React.FC<TextButtonProps> = ({
  children,
  onClick,
  href,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  underline = false,
}) => {
  const buttonClasses = `${styles.textButton} ${styles[variant]} ${
    styles[size]
  } ${underline ? styles.underline : ""} ${className}`;

  // If href is provided, render as link
  if (href) {
    return (
      <a
        href={href}
        className={buttonClasses}
        onClick={disabled ? (e) => e.preventDefault() : onClick}
        aria-disabled={disabled}
      >
        {children}
      </a>
    );
  }

  // Otherwise render as button
  return (
    <button
      type="button"
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default TextButton;
