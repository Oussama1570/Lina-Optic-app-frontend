import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  // 🔄 Handle field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 📤 Submit the form to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('https://lina-optic-app-backend.vercel.app/api/contact', formData);

      // ✅ Success alert
      Swal.fire({
  icon: 'success',
  title: 'Message envoyé !',
  text: 'Votre message a été envoyé avec succès.',
  confirmButtonColor: '#3085d6',
  showCloseButton: true,
  allowOutsideClick: false,
  allowEscapeKey: false,
});


      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      // ❌ Error alert
      Swal.fire({
  icon: 'error',
  title: 'Erreur',
  text: 'Une erreur est survenue. Veuillez réessayer.',
  confirmButtonColor: '#d33',
  showCloseButton: true,
  allowOutsideClick: false,
  allowEscapeKey: false,
});

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-form-container">
      <h3 className="contact-title">Envoyez-nous un message</h3>
      <p className="contact-description">
        Pour toute demande de rendez-vous, question ou conseil optique, notre équipe vous répond rapidement.
      </p>

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

        <button type="submit" disabled={loading}>
          {loading ? "Envoi en cours..." : "Envoyer le message"}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
