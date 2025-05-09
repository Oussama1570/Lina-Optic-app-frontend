import React from "react";
import { FaTruck, FaInstagram, FaFacebookF } from "react-icons/fa";
import "../Styles/StylesFreeShippingBanner.css";

const FreeShippingBanner = () => {
  return (
    <div className="free-shipping-banner">
      <div className="shipping-content">
        <FaTruck className="truck-icon" />
        Livraison Gratuite ! <span>Commandez dès maintenant vos lunettes chez Lina Optic.</span>
      </div>

      <div className="shipping-socials">
        <a
          href="https://www.instagram.com/linaoptic2"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
          aria-label="Instagram Lina Optic Manouba"
        >
          <FaInstagram />
        </a>
        <a
          href="https://www.facebook.com/profile.php?id=100063746152338"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
          aria-label="Facebook Lina Optic Manouba"
        >
          <FaFacebookF />
        </a>
      </div>
    </div>
  );
};

export default FreeShippingBanner;
