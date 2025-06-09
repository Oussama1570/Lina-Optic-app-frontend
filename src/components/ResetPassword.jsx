import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import "../Styles/StylesLogin.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search);
  const oobCode = query.get("oobCode");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ❗ If reset code is missing
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

  // 🔁 Handle password reset
  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await confirmPasswordReset(auth, oobCode, password);

      // ✅ Success alert
     alert("✅ Votre mot de passe a été réinitialisé avec succès.");
navigate("/login");

    } catch (err) {
      console.error("Reset error:", err);

      // ❌ Error alert
      alert("❌ Lien invalide ou expiré. Veuillez demander un nouveau lien.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Réinitialiser votre mot de passe</h2>

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
