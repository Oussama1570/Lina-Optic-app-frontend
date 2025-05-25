import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import getBaseUrl from "../utils/baseURL";
import "../Styles/StylesLogin.css"; // Optional: reuse existing login styles

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post(`${getBaseUrl()}/api/auth/reset-password/${token}`, { password });
      setMessage("✅ Mot de passe réinitialisé avec succès.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage("❌ Lien invalide ou expiré.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Réinitialiser votre mot de passe</h2>

        {message && <p className="login-message">{message}</p>}

        <form onSubmit={handleReset} className="login-form">
          <div className="form-group">
            <label htmlFor="password">Nouveau mot de passe</label>
            <input
              type="password"
              id="password"
              placeholder="Entrez un nouveau mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
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

export default ResetPassword;
