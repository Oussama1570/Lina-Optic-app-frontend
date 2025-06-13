import React from "react"; 
import "../Styles/StylesLentillesSection.css";
import lentillesSectionImg1 from "../../src/assets/Lentilles Section/Img1 Lentilles Section.png";
import { Link } from 'react-router-dom';

const LentillesSection = () => {
  return (
    <section className="lentilles-section">
      {/* 📝 Left side content block */}
      <div className="lentilles-content">
        {/* 🔗 Title links to lentilles subCategory */}
        <a href="/products?subCategory=Lentilles">
          <h2 className="lentilles-title">Lentilles de Contact</h2>
        </a>

        {/* 📄 Descriptions promoting the product */}
        <p className="lentilles-description">
          Découvrez notre gamme de lentilles de contact chez <strong>Lina Optic</strong>. Que vous cherchiez confort, clarté ou style, nos lentilles s’adaptent à votre quotidien avec précision.
        </p>
        <p className="lentilles-description">
          Disponibles en différentes corrections et coloris, elles sont idéales pour un usage quotidien ou occasionnel. Offrez à vos yeux une nouvelle vision !
        </p>

        {/* 🔘 Call-to-action button */}
        <a href="/products?subCategory=Lentilles" className="section-button">
          VOIR LA COLLECTION
        </a>
      </div>

      {/* 🖼️ Right side image block */}
      <div className="lentilles-image-container">
        <a href="/products?subCategory=Lentilles">
          <img
            src={lentillesSectionImg1}
            alt="Lentilles de Contact Lina Optic"
            className="lentilles-image"
          />
        </a>
      </div>
    </section>
  );
};

export default LentillesSection;
