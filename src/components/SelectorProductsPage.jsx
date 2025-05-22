import React, { useState, useEffect, useRef } from "react";
import FadeInSection from "../Animations/FadeInSection.jsx";
import "../Styles/StylesSelectorProductsPage.css";

const SelectorsPageProducts = ({ options = [], onSelect, label, selected: externalSelected }) => {
  const isFirstRender = useRef(true);
  const [selected, setSelected] = useState(["All"]);

  // ✅ Sync from parent (URL param) only on first render
  useEffect(() => {
    if (isFirstRender.current && Array.isArray(externalSelected)) {
      setSelected(externalSelected);
      isFirstRender.current = false;
    }
  }, [externalSelected]);

  // ✅ Notify parent only on user interaction (not on first sync)
  useEffect(() => {
    if (!isFirstRender.current && Array.isArray(selected)) {
      onSelect(selected);
    }
  }, [selected]);

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
                checked={Array.isArray(selected) && selected.includes(option)}
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
