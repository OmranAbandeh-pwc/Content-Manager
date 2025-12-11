export { LoadingSpinner } from './LoadingSpinner';
export type { LoadingSpinnerProps } from './LoadingSpinner.types';

// ============================================
// ALTERNATIVE SPINNER COMPONENTS
// ============================================

// Dots Spinner
import dotsStyles from './DotsSpinner.module.scss';

export const DotsSpinner: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`${dotsStyles.dotsContainer} ${className}`}>
      <div className={dotsStyles.dot} />
      <div className={dotsStyles.dot} />
      <div className={dotsStyles.dot} />
    </div>
  );
};