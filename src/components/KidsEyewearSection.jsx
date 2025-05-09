import React from "react";
import "../Styles/StylesKidsEyewearSection.css";
import { Link } from "react-router-dom";
import kidsGlassesn2 from "../assets/Kid Glasses Section/Kid Glasses Section n°2.png";

const KidsEyewearSection = () => {
  return (
    <div className="kids-section">
      <div className="kids-text">
        <h2 className="kids-title">Lunettes pour Enfants</h2>
        <p className="kids-description">
          Offrez à vos enfants une vision claire avec style ! Chez <strong>Lina Optic</strong>, nous avons sélectionné des montures légères, colorées et résistantes – idéales pour le quotidien des petits aventuriers.
        </p>
        <p className="kids-description">
          Confortables et tendance, nos modèles s’adaptent parfaitement aux visages des enfants, tout en assurant une protection optimale.
        </p>

        {/* ✅ Button that links to Products page */}
        <Link to="/products" className="kids-button">
          VOIR LA COLLECTION
        </Link>
      </div>

      <div className="kids-image-container">
        <img
          src={kidsGlassesn2}
          alt="Enfant avec lunettes Lina Optic"
          className="kids-image"
        />
      </div>
    </div>
  );
};

export default KidsEyewearSection;
