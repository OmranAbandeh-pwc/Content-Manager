import React from "react";
import styles from "./Image.module.scss";

interface ImagePropsType {
  src: string;
  alt?: string;
  customClass?: string;
}

const Image: React.FC<ImagePropsType> = ({ src, alt, customClass }) => {
  return <img src={src} alt={alt} className={`${customClass}`} />;
};

export default Image;
