import React from "react";
import OurSellers from "./OurSellers";
import { Helmet } from "react-helmet";
import LinaCarousel from './../../components/LinaCarousel';
import "../../Styles/StylesHome.css";
import HeroCategoryCards from "../../components/HeroCategoryCards";
import LentillesSection from './../../components/LentillesSection.jsx';
import KidsEyewearSection from './../../components/KidsEyewearSection';

const Home = () => {
  return (
    <div className="main-content">
      <div className="home-container">
        <Helmet>
          <title>Accueil</title>
          <meta name="description" content="Lina Optic - Votre opticien de confiance depuis plus de 15 ans." />
        </Helmet>

        {/* ✨ Carousel Section */}
        <LinaCarousel />

        {/* 🏡 Hero Section */}
        <section className="hero-section">
          <h2 className="welcome-title">Bienvenue chez <span>Lina Optic</span></h2>
          <p className="welcome-text">
            Depuis plus de 15 ans, Lina Optic vous accompagne dans le choix de vos lunettes de vue et de soleil avec expertise et passion.
            Découvrez notre large gamme de montures pour hommes, femmes et enfants, adaptées à tous les styles et besoins visuels.
          </p>
          <p className="welcome-text">
            Notre équipe d’opticiens diplômés est à votre écoute pour vous conseiller et vous garantir un confort visuel optimal au quotidien.
          </p>
        </section>

        <HeroCategoryCards/>

        {/* 🛍️ Our Sellers Section */}
        <section className="sellers-section">
          <div className="text-center">
            <h2 className="section-title">Nos Meilleures Ventes</h2>
            <p className="section-subtitle">
              Découvrez les montures les plus populaires choisies par nos clients.
            </p>
          </div>
          <OurSellers />
        </section>

{/* Lentilles Section */}
<section>
<LentillesSection/>
</section>


{/*  Kids Eyewear Section */}
<section>
<KidsEyewearSection />
</section>

      </div>
    </div>
  );
};

export default Home;
