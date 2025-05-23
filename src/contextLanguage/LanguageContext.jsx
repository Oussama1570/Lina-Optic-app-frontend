import React, { createContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// ✅ Correct named export
export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const localLang = localStorage.getItem("language");
  const defaultLang = localLang || "fr"; // fallback to 'fr' if no saved lang
  const [language, setLanguage] = useState(defaultLang);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };

  useEffect(() => {
    changeLanguage(defaultLang); // ensure language is applied properly
  }, []);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
