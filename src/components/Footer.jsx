import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "../Styles/StylesFooter.css";

const Footer = () => {
  return (
    <footer className="lina-footer">
      <div className="footer-grid">
        {/* À propos */}
        <div className="footer-section">
          <h4>À propos</h4>
          <p>
            Lina Optic propose des montures modernes, des verres de haute qualité
            et un service client irréprochable pour tous vos besoins optiques.
          </p>

          {/* Embedded Google Map */}
          <div className="footer-map-small">
 <iframe
    width="100%"
    height="300"
    frameBorder="0"
    scrolling="no"
    marginHeight="0"
    marginWidth="0"
    src="https://www.openstreetmap.org/export/embed.html?bbox=10.0905%2C36.8100%2C10.0925%2C36.8115&layer=mapnik&marker=36.8109%2C10.0915"
    title="Lina Optic – Manouba"
  ></iframe>
</div>

        </div>

        {/* Liens rapides */}
        <div className="footer-section">
          <h4>Liens rapides</h4>
          <ul>
            <li><a href="/">Accueil</a></li>
            <li><a href="/products">Nos produits</a></li>
            <li><a href ="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h4>Contact</h4>
          <p>
            <FaMapMarkerAlt className="footer-icon" /> 
            292 Avenue Khaled Ebn El Walid, Douar Hicher 61, avenue Habib Bourguiba, Manouba
          </p>
          <p><FaPhoneAlt className="footer-icon" /> +216 22 344 803</p>
          <p><FaEnvelope className="footer-icon" /> linaopticlunettes@gmail.com</p>

          <div className="footer-socials">
            <a
              href="https://www.instagram.com/linaoptic2"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Lina Optic"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100063696517447"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook Lina Optic"
            >
              <FaFacebookF />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Lina Optic – Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
