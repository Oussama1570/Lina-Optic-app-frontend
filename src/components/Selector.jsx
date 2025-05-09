import React from "react";
import { useTranslation } from "react-i18next";
import "../Styles/StylesSelector.css";

const Selector = ({ label, options = [], value, onChange }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  return (
    <div className="selector-wrapper" dir={isRTL ? "rtl" : "ltr"}>
      {label && <label className="selector-label">{label}</label>}
      <select
        className="selector-dropdown"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{t("select_option")}</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Selector;
