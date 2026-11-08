import React from "react";
import { useLanguage } from "../i18n/LanguageContext";

const LanguageSelector = () => {
  const { language, changeLanguage, t } = useLanguage();

  return (
    <div style={styles.wrapper}>
      <label htmlFor="language-select" style={styles.label}>
        {t("language")}
      </label>

      <select
        id="language-select"
        value={language}
        onChange={(e) => {
          console.log("Language changed to:", e.target.value);
          changeLanguage(e.target.value);
        }}
        style={styles.select}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#919D85";
          e.currentTarget.style.boxShadow =
            "0 0 0 3px rgba(145, 157, 133, 0.15)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#C8C1AA";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <option value="en">{t("english")}</option>
        <option value="kn">{t("kannada")}</option>
        <option value="hi">{t("hindi")}</option>
      </select>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#3E4435",
    whiteSpace: "nowrap",
  },

  select: {
    padding: "8px 12px",
    borderRadius: "9px",
    border: "1px solid #C8C1AA",
    background: "#F2EEE1",
    color: "#3E4435",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    outline: "none",
    transition: "all 0.2s ease",
  },
};

export default LanguageSelector;