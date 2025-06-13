import React, { useRef } from "react";
import "../Styles/StylesHeroCategoryCards.css"; // 🎨 Import custom styles
import femmeImage from "../assets/Glasses/Img HeroCategory Card Women Glasses.png"; // 👓 Image for women's glasses
import hommeImage from "../assets/Glasses/Img HeroCategory Card Men Glasses.png";   // 👓 Image for men's glasses
import { Link } from "react-router-dom";

const HeroCategoryCards = () => {
  // 🧭 Handle mouse movement to create a zoom-follow effect
  const handleMouseMove = (e, zoomRef) => {
    const zoom = zoomRef.current;
    const rect = zoom.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    zoom.style.backgroundPosition = `${x}% ${y}%`; // Set background position based on cursor
  };

  // 🛑 Reset zoom to center when mouse leaves the card
  const handleMouseLeave = (zoomRef) => {
    zoomRef.current.style.backgroundPosition = "center center";
  };

  // 🪞 Refs for accessing DOM elements for each zoom layer
  const femmeZoomRef = useRef(null);
  const hommeZoomRef = useRef(null);

  return (
    <div className="category-cards-container">
      {/* 🔴 Hero Card for Women's Glasses */}
      <a href="/products?category=Femmes" className="category-card-link-wrapper">
        <div
          className="category-card"
          onMouseMove={(e) => handleMouseMove(e, femmeZoomRef)}   // Track mouse movement
          onMouseLeave={() => handleMouseLeave(femmeZoomRef)}    // Reset on leave
        >
          <div
            ref={femmeZoomRef}
            className="zoom-layer"
            style={{ backgroundImage: `url(${femmeImage})` }}     // Set background image for zoom effect
          ></div>
          <div className="card-overlay">
            <p className="card-subtitle">Lunettes pour Elle</p>
            <h3 className="card-title">Beauté Visuelle</h3>
            <span className="card-link">VOIR LA COLLECTION</span>
          </div>
        </div>
      </a>

      {/* 🔵 Hero Card for Men's Glasses */}
      <a href="/products?category=Hommes" className="category-card-link-wrapper">
        <div
          className="category-card"
          onMouseMove={(e) => handleMouseMove(e, hommeZoomRef)}   // Track mouse movement
          onMouseLeave={() => handleMouseLeave(hommeZoomRef)}    // Reset on leave
        >
          <div
            ref={hommeZoomRef}
            className="zoom-layer"
            style={{ backgroundImage: `url(${hommeImage})` }}     // Set background image for zoom effect
          ></div>
          <div className="card-overlay">
            <p className="card-subtitle">Lunettes pour Lui</p>
            <h3 className="card-title">Audace Élégante</h3>
            <span className="card-link">VOIR LA COLLECTION</span>
          </div>
        </div>
      </a>
    </div>
  );
};

export default HeroCategoryCards;
