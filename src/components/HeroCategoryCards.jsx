import React from "react";
import "../Styles/StylesHeroCategoryCards.css";
import femmeImage from "../assets/Glasses/Img HeroCategory Card Women Glasses.png";
import hommeImage from "../assets/Glasses/Img HeroCategory Card Men Glasses.png";
import { Link } from "react-router-dom";

const HeroCategoryCards = () => {
  return (
    <div className="category-cards-container">
      <div
        className="category-card"
        style={{ backgroundImage: `url(${femmeImage})` }}
      >
        <div className="card-overlay">
          <p className="card-subtitle">Lunettes pour Elle</p>
          <h3 className="card-title">Beauté Visuelle</h3>
          <a href="/products?category=Femmes" className="card-link">
            VOIR LA COLLECTION
          </a>

        </div>
      </div>

      <div
        className="category-card"
        style={{ backgroundImage: `url(${hommeImage})` }}
      >
        <div className="card-overlay">
          <p className="card-subtitle">Lunettes pour Lui</p>
          <h3 className="card-title">Audace Élégante</h3>
          
          <a href="/products?category=Hommes" className="card-link">
            VOIR LA COLLECTION
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroCategoryCards;
