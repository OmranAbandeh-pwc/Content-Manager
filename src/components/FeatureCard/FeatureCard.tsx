import { PRPJECT_CONTENT } from "../../constants/content";
import styles from "./FeatureCard.module.scss";
import { IconCircleCheck } from "@tabler/icons-react";

const FeatureCard = () => {
  return (
    <div className={styles.featureCardContainer}>
      <div className={styles.iconBox}>
        <IconCircleCheck size={40} color="white" />
      </div>
      <h1>{PRPJECT_CONTENT.title}</h1>
      <p className={styles.subTitle}>{PRPJECT_CONTENT.description}</p>
    </div>
  );
};

export default FeatureCard;
