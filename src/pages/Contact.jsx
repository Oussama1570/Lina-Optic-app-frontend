import React, { useState } from 'react';
import ContactForm from '../components/Contact-form.jsx';
import "../Styles/StylesContact.css";
import "../Styles/StylesContact-form.css";
import { Helmet } from "react-helmet";

const Contact = () => {
  const [successMessage, setSuccessMessage] = useState(null);

  return (
    <div className="contact-page">
      {/* 🔖 SEO title */}
      <Helmet>
        <title>Contact | Lina Optic</title>
      </Helmet>

      {/* ===============================
          🏞️ Hero Section with Animated Title
      =============================== */}
      <section className="contact-hero">
        <h1 className="contact-hero-title">Restons en contact 👓</h1>
        <p className="contact-hero-subtitle">
          Notre équipe est à votre écoute pour toute question ou prise de rendez-vous.
        </p>
      </section>

      {/* ===============================
          📬 Contact Info + Form Side-by-Side
      =============================== */}
      <div className="contact-content-wrapper">
        {/* 📍 Contact Details Block */}
        <div className="contact-info">
          <h2 className="contact-info-title">📍 Nos coordonnées</h2>
          <ul className="contact-info-list">
            <li>
              <span className="contact-icon">📌</span>
              61 rue Habib Bourguiba, Manouba 2010
            </li>
            <li>
              <span className="contact-icon">📧</span>
              linaopticlunettes@gmail.com
            </li>
            <li>
              <span className="contact-icon">📞</span>
              +216 53 123 456
            </li>
            <li>
              <span className="contact-icon">⏰</span>
              Lundi – Samedi : 8h à 20h
            </li>
          </ul>
        </div>

        {/* 📝 Contact Form Block */}
        <div className="contact-form-wrapper">
          <ContactForm onSuccess={setSuccessMessage} />
          {successMessage && (
            <p className="message-status">{successMessage}</p>
          )}
        </div>
      </div>

      {/* =============================== 🗺️ Google Map Location =============================== */}
<div className="contact-map-wrapper">
<div className="footer-map-small">
  <iframe
  key={Date.now()}
  width="100%"
  height="300"
  frameBorder="0"
  scrolling="no"
  marginHeight="0"
  marginWidth="0"
  src={`https://www.openstreetmap.org/export/embed.html?bbox=10.0905%2C36.8100%2C10.0925%2C36.8115&layer=mapnik&marker=36.8109%2C10.0915&t=${Date.now()}`}
  title="Lina Optic – Manouba"
/>

</div>



</div>

    </div>
  );
};

export default Contact;
