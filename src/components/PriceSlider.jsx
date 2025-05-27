// src/components/PriceSlider.jsx

import React from "react";
import FadeInSection from "../Animations/FadeInSection"; // ✅ Fade on scroll
import "../Styles/StylesPriceSlider.css";

/**
 * PriceSlider component with fade-in animation on scroll.
 * @param {number} min - Minimum slider value.
 * @param {number} max - Maximum slider value.
 * @param {number[]} priceRange - Current selected range.
 * @param {function} onChange - Handler to update price range.
 */
const PriceSlider = ({ min, max, priceRange, onChange }) => {
  return (
    <FadeInSection delay={0.1}>
      <div className="price-slider-container">
        <h3 className="price-slider-title">Prix</h3>

        <div className="price-slider-labels">
          <span>{priceRange[0]} €</span>
          <span>{priceRange[1]} €</span>
        </div>

        <input
          type="range"
          min={min}
          max={max}
          value={priceRange[0]}
          onChange={(e) => onChange([+e.target.value, priceRange[1]])}
          className="price-slider-input"
        />

        <input
          type="range"
          min={min}
          max={max}
          value={priceRange[1]}
          onChange={(e) => onChange([priceRange[0], +e.target.value])}
          className="price-slider-input"
        />
      </div>
    </FadeInSection>
  );
};

export default PriceSlider;
