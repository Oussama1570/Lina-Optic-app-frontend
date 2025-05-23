import React, { useContext } from "react";
import { LanguageContext } from './../contextLanguage/LanguageContext';


const LanguageSwitcher = () => {
  const { language, changeLanguage } = useContext(LanguageContext);

  return (
    <select
      value={language}
      onChange={(e) => changeLanguage(e.target.value)}
      className="language-switcher"
    >
      <option value="en">🇬🇧 English</option>
      <option value="fr">🇫🇷 Français</option>
      <option value="ar">🇸🇦 العربية</option>
    </select>
  );
};

export default LanguageSwitcher;
