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
              Lundi – Samedi : 9h à 18h
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

      {/* ===============================
          🗺️ Google Map Location
      =============================== */}
      <div className="contact-map-wrapper">
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
  );
};

export default Contact;
