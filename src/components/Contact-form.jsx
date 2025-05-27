import React, { useState } from 'react';
import axios from 'axios';

const ContactForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔄 Handle field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 📤 Submit the form to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 🌐 Send message to your backend endpoint
      await axios.post('https://lina-optic-app-backend.vercel.app/api/contact', formData);

      onSuccess("✅ Votre message a été envoyé avec succès !");
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError("❌ Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-form-container">
      {/* 🎯 Animated Title with underline effect handled in CSS */}
      <h3 className="contact-title">Envoyez-nous un message</h3>
      <p className="contact-description">
        Pour toute demande de rendez-vous, question ou conseil optique, notre équipe vous répond rapidement.
      </p>

      {/* 📝 Contact Form */}
      <form onSubmit={handleSubmit} className="contact-form">
        <input
          type="text"
          name="name"
          placeholder="Votre nom complet"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Votre adresse e-mail"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="subject"
          placeholder="Objet de votre message"
          value={formData.subject}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Écrivez votre message ici..."
          value={formData.message}
          onChange={handleChange}
          required
        />

        {/* 🔘 Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? "Envoi en cours..." : "Envoyer le message"}
        </button>

        {/* ✅ / ❌ Feedback */}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default ContactForm;
