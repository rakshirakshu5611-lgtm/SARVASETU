import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import en from "./en";
import kn from "./kn";
import hi from "./hi";

const translations = {
  en,
  kn,
  hi,
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem("sarvasetu_language");

    if (savedLanguage && translations[savedLanguage]) {
      return savedLanguage;
    }

    return "en";
  });

  useEffect(() => {
    localStorage.setItem("sarvasetu_language", language);
  }, [language]);

  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
    }
  };

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const value = {
    language,
    changeLanguage,
    t,
    availableLanguages: Object.keys(translations),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
};

export default LanguageContext;