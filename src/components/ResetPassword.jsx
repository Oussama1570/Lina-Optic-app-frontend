import React, { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import "../Styles/StylesLogin.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search);
  const oobCode = query.get("oobCode");

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Redirect or show error if oobCode is missing
  if (!oobCode) {
    return (
      <div className="login-page">
        <div className="login-container">
          <h2 className="login-title">Lien invalide</h2>
          <p className="login-message">Le lien est manquant ou expiré.</p>
          <Link to="/forgot-password" className="login-link">
            Demander un nouveau lien
          </Link>
          <p className="login-rights">©2025 Lina Optic. Tous droits réservés.</p>
        </div>
      </div>
    );
  }

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await confirmPasswordReset(auth, oobCode, password);
      setMessage("✅ Mot de passe réinitialisé avec succès.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Reset error:", err);
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
