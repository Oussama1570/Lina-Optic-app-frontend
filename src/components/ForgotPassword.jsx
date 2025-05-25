import React, { useState } from "react";
import axios from "axios";
import getBaseUrl from "../utils/baseURL";
import { Link } from "react-router-dom";
import "../Styles/StylesLogin.css"; // Optional: reuse login styles

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await axios.post(`${getBaseUrl()}/api/auth/reset-password-request`, { email });
      setMessage("✅ Lien de réinitialisation envoyé à votre email.");
    } catch (err) {
      setMessage("❌ Utilisateur introuvable ou erreur serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Mot de passe oublié ?</h2>

        {message && <p className="login-message">{message}</p>}

        <form onSubmit={handleRequest} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Entrez votre email</label>
            <input
              type="email"
              id="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Envoi en cours..." : "Envoyer le lien"}
          </button>
        </form>

        <p className="login-footer-link">
          <Link to="/login" className="login-link">Retour à la connexion</Link>
        </p>

        <p className="login-rights">©2025 Lina Optic. Tous droits réservés.</p>
      </div>
    </div>
  );
};

export default ForgotPassword;
