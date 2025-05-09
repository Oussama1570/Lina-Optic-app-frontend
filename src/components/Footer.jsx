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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1597.1655808683242!2d10.093258385006342!3d36.81058361188362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd326e58495445%3A0x26a54a14bcb31d74!2sLINA%20OPTIC!5e0!3m2!1sfr!2stn!4v1745577727048!5m2!1sfr!2stn"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map"
            ></iframe>
          </div>
        </div>

        {/* Liens rapides */}
        <div className="footer-section">
          <h4>Liens rapides</h4>
          <ul>
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/products">Nos produits</Link></li>
            <li><Link to="/contact">Contact</Link></li>
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
          <p><FaEnvelope className="footer-icon" /> linaoptic@gmail.com</p>

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
              href="https://www.facebook.com/profile.php?id=100063746152338"
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
