import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth"; // 🔐 Firebase methods for password update
import { auth } from "../../../firebase/firebase.config"; // 🔗 Firebase config
import "../../../Styles/StylesLogin.css"; // 🎨 Import form styles
import { Helmet } from "react-helmet"; // 🧠 For dynamic page title
import Swal from "sweetalert2"; // 💬 SweetAlert for messages

const ChangePassword = () => {
  // 🔐 State to handle form inputs
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // 🧭 Navigate after success

  // ✅ Main function to change password
  const handleChangePassword = async (e) => {
    e.preventDefault(); // 🚫 Prevent default form behavior
    setLoading(true);   // ⏳ Show loading state

    // ❗ Validate password confirmation
    if (newPassword !== confirmPassword) {
      Swal.fire("Erreur", "❌ Les nouveaux mots de passe ne correspondent pas.", "error");
      setLoading(false);
      return;
    }

    try {
      const user = auth.currentUser; // ✅ Get current authenticated user

      // 🔐 Reauthenticate with current password (Firebase requires this)
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // 🔁 Update to the new password
      await updatePassword(user, newPassword);

      // ✅ Show success alert and redirect to dashboard
      Swal.fire("Succès", "✅ Mot de passe mis à jour avec succès.", "success");
      setTimeout(() => navigate("/user-dashboard"), 2000);
    } catch (error) {
      console.error("Erreur :", error);
      // 🔥 Handle common Firebase error codes
      if (error.code === "auth/wrong-password") {
        Swal.fire("Erreur", "❌ Le mot de passe actuel est incorrect.", "error");
      } else {
        Swal.fire("Erreur", "❌ Une erreur est survenue. Veuillez réessayer.", "error");
      }
    } finally {
      setLoading(false); // ✅ Reset loading
    }
  };

  return (
    <div className="login-page">
      <Helmet>
        <title>Changer le mot de passe</title> {/* 🧠 SEO-friendly page title */}
      </Helmet>

      <div className="login-container">
        <h2 className="login-title">Changer le mot de passe</h2>

        {/* 🔐 Password change form */}
        <form onSubmit={handleChangePassword} className="login-form">
          {/* 🔑 Current password input */}
          <div className="form-group">
            <label>Mot de passe actuel</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          {/* ✏️ New password input */}
          <div className="form-group">
            <label>Nouveau mot de passe</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          {/* 🔁 Confirm new password input */}
          <div className="form-group">
            <label>Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* ✅ Submit button */}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
