import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../../../firebase/firebase.config";
import "../../../Styles/StylesLogin.css";
import { Helmet } from "react-helmet";


const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      alert("❌ Les nouveaux mots de passe ne correspondent pas.");

      setLoading(false);
      return;
    }

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

     alert("✅ Votre mot de passe a été changé avec succès.");
navigate("/user-dashboard");

    } catch (error) {
      console.error("Erreur :", error);

      if (error.code === "auth/wrong-password") {
        Swal.fire({
          icon: "error",
          title: "Mot de passe incorrect",
          text: "❌ Le mot de passe actuel est incorrect.",
          confirmButtonColor: "#d33",
        });
      } else {
        alert("❌ Le mot de passe actuel est incorrect.");

      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Helmet>
        <title>Changer le mot de passe</title>
      </Helmet>

      <div className="login-container">
        <h2 className="login-title">Changer le mot de passe</h2>

        <form onSubmit={handleChangePassword} className="login-form">
          <div className="form-group">
            <label>Mot de passe actuel</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Nouveau mot de passe</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
