import React, { useState, useEffect } from "react";
import FadeInSection from "../Animations/FadeInSection.jsx"; 
import "../Styles/StylesSelectorProductsPage.css";

const SelectorsPageProducts = ({ options = [], onSelect, label }) => {
  const [selected, setSelected] = useState(["All"]);

  useEffect(() => {
    onSelect(selected);
  }, [selected, onSelect]);

  const handleChange = (value) => {
    let updated = [];

    if (value === "All") {
      updated = ["All"];
    } else {
      if (selected.includes(value)) {
        updated = selected.filter((item) => item !== value);
      } else {
        updated = [...selected.filter((item) => item !== "All"), value];
      }

      if (updated.length === 0) {
        updated = ["All"];
      }
    }

    setSelected(updated);
  };

  return (
    <FadeInSection delay={0.1}>
      <div className="selector-sidebar-lina">
        <h3 className="selector-title">{label}</h3>
        <div className="selector-options-grid">
          {options.map((option, index) => (
            <label key={index} className="selector-option-card">
              <input
                type="checkbox"
                value={option}
                checked={selected.includes(option)}
                onChange={() => handleChange(option)}
                className="selector-checkbox"
              />
              <span className="selector-label">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </FadeInSection>
  );
};

export default SelectorsPageProducts;
