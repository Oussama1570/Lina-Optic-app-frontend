import React from "react";
import "../Styles/StylesLentillesSection.css";
import lentillesSectionImg1 from "../../src/assets/Lentilles Section/Img1 Lentilles Section.png"; // replace with your image path
import { Link } from 'react-router-dom';

const LentillesSection = () => {
  return (
    <div className="lentilles-section">
      <div className="lentilles-content">
        <h2 className="lentilles-title">Lentilles de Contact</h2>
        <p className="lentilles-description">
          Découvrez notre gamme de lentilles de contact chez <strong>Lina Optic</strong>. Que vous cherchiez confort, clarté ou style, nos lentilles s’adaptent à votre quotidien avec précision. 
        </p>
        <p className="lentilles-description">
          Disponibles en différentes corrections et coloris, elles sont idéales pour un usage quotidien ou occasionnel. Offrez à vos yeux une nouvelle vision !
        </p>
        <Link to="/products" className="section-button">
            VOIR LA COLLECTION
          </Link>
      </div>
      <div className="lentilles-image-container">
        <img src={lentillesSectionImg1} alt="Lentilles de Contact Lina Optic" className="lentilles-image" />
      </div>
    </div>
  );
};

export default LentillesSection;
