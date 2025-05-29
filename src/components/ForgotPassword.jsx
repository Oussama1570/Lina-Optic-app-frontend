import React, { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import Swal from "sweetalert2";
import "../Styles/StylesLogin.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);

      // ✅ Success popup
      Swal.fire({
        icon: "success",
        title: "Lien envoyé",
        text: "Un lien de réinitialisation a été envoyé à votre adresse email.",
        confirmButtonColor: "#3085d6",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      setEmail(""); // Clear input
    } catch (error) {
      console.error("Erreur de réinitialisation:", error);

      // ❌ Error popup
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Adresse email invalide ou utilisateur introuvable.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Mot de passe oublié ?</h2>

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
