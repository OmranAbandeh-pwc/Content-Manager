import React, { useState } from "react";
import { IconSun, IconMoon, IconUser } from "@tabler/icons-react";
import styles from "./Header.module.scss";
import { useTheme } from "../../contexts/ThemeContext"
import Image from "../common/Image/Image";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";

const Header: React.FC = () => {
    const { theme, themeColors, toggleTheme } = useTheme();
    const { t } = useTranslation();

  return (
    <header className={`${styles.header}`}>
      
      {/* Left – Logo */}
      <div className={styles.logo}>
        <Image src=""/>
        <span>{t('welcome')}</span>
      </div>

      {/* Right – Actions */}
      <div className={styles.actions}>

        {/* Language Button */}
        {/* <button className={styles.langBtn}>EN</button> */}
        <LanguageSwitcher/>
        {/* Theme Toggle */}
        <button
          className={styles.iconBtn}
          onClick={toggleTheme}
        >
          {theme === "dark" ? (
            <IconSun size={20} stroke={1.5} />
          ) : (
            <IconMoon size={20} stroke={1.5} />
          )}
        </button>

        {/* User Button */}
        <button className={styles.iconBtn}>
          <IconUser size={20} stroke={1.5} />
        </button>

      </div>
    </header>
  );
};

export default Header;
