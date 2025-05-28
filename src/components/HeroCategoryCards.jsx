import React, { useRef } from "react";
import "../Styles/StylesHeroCategoryCards.css";
import femmeImage from "../assets/Glasses/Img HeroCategory Card Women Glasses.png";
import hommeImage from "../assets/Glasses/Img HeroCategory Card Men Glasses.png";
import { Link } from "react-router-dom";

const HeroCategoryCards = () => {
  // 🧭 Custom zoom tracking effect
  const handleMouseMove = (e, zoomRef) => {
    const zoom = zoomRef.current;
    const rect = zoom.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    zoom.style.backgroundPosition = `${x}% ${y}%`;
  };

  // 🛑 Reset position to center when mouse leaves
  const handleMouseLeave = (zoomRef) => {
    zoomRef.current.style.backgroundPosition = "center center";
  };

  // 🪞 References for image zoom layers
  const femmeZoomRef = useRef(null);
  const hommeZoomRef = useRef(null);

  return (
    <div className="category-cards-container">
      {/* 🔴 Card: Femme */}
      <Link to="/products?category=Femmes" className="category-card-link-wrapper">
        <div
          className="category-card"
          onMouseMove={(e) => handleMouseMove(e, femmeZoomRef)}
          onMouseLeave={() => handleMouseLeave(femmeZoomRef)}
        >
          <div
            ref={femmeZoomRef}
            className="zoom-layer"
            style={{ backgroundImage: `url(${femmeImage})` }}
          ></div>
          <div className="card-overlay">
            <p className="card-subtitle">Lunettes pour Elle</p>
            <h3 className="card-title">Beauté Visuelle</h3>
            <span className="card-link">VOIR LA COLLECTION</span>
          </div>
        </div>
      </Link>

      {/* 🔵 Card: Homme */}
      <Link to="/products?category=Hommes" className="category-card-link-wrapper">
        <div
          className="category-card"
          onMouseMove={(e) => handleMouseMove(e, hommeZoomRef)}
          onMouseLeave={() => handleMouseLeave(hommeZoomRef)}
        >
          <div
            ref={hommeZoomRef}
            className="zoom-layer"
            style={{ backgroundImage: `url(${hommeImage})` }}
          ></div>
          <div className="card-overlay">
            <p className="card-subtitle">Lunettes pour Lui</p>
            <h3 className="card-title">Audace Élégante</h3>
            <span className="card-link">VOIR LA COLLECTION</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default HeroCategoryCards;
