
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const switchLang = (lang: "en" | "ar") => {
    i18n.changeLanguage(lang);

    // RTL / LTR support
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    // Optional: persist theme
    localStorage.setItem("lang", lang);
  };

  return (
    <div>
      <button onClick={() => switchLang("en")}>EN</button>
      <button onClick={() => switchLang("ar")}>AR</button>
    </div>
  );
};

export default LanguageSwitcher;
