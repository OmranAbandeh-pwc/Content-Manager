import { LoadingSpinnerProps } from './LoadingSpinner.types';
import styles from './LoadingSpinner.module.scss';

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  fullScreen = false,
  text,
  className = '',
}) => {
  const spinner = (
    <div className={styles.spinnerContainer}>
      <div
        className={`
          ${styles.spinner} 
          ${styles[`spinner--${size}`]} 
          ${styles[`spinner--${color}`]}
          ${className}
        `}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p className={styles.spinnerText}>{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={styles.fullScreenOverlay}>
        {spinner}
      </div>
    );
  }

  return spinner;
};