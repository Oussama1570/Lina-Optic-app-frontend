import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import "../Styles/StylesRegister.css";

const Register = () => {
  // 🔐 Local state for optional messages (if needed)
  const [message, setMessage] = useState("");

  // 🔐 Auth methods from context
  const { registerUser, signInWithGoogle } = useAuth();

  // 🚀 Navigation after registration
  const navigate = useNavigate();

  // 📋 React Hook Form setup
  const { register, handleSubmit, formState: { errors } } = useForm();

  // 🌍 i18n translation hook
  const { t } = useTranslation();

  // ✅ Success alert with SweetAlert
  const showSuccessAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: "success",
      confirmButtonColor: "#444",
      confirmButtonText: t("register.continue_shopping"),
      timer: 2000,
    });
  };

  // ❌ Error alert with SweetAlert
  const showErrorAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: "error",
      confirmButtonColor: "#d33",
      confirmButtonText: t("register.try_again"),
    });
  };

  // 📤 Form submission logic
  const onSubmit = async (data) => {
    try {
      await registerUser(data.email, data.password);
      showSuccessAlert(t("register.success_title"), t("register.success_text"));
      navigate("/");
    } catch (error) {
      showErrorAlert(t("register.error_title"), t("register.error_text"));
      console.error(error);
    }
  };

  // 🔐 Google Sign-in logic
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      showSuccessAlert(t("register.google_success_title"), t("register.success_text"));
      navigate("/");
    } catch (error) {
      showErrorAlert(t("register.google_error_title"), t("register.try_again"));
      console.error(error);
    }
  };

  // ================================================
  // ⬇️ RETURN SECTION: Markup with form and UI logic
  // ================================================
  return (
    <div className="register-page">
      <div className="register-container">
        {/* 🔹 Title */}
        <h2 className="register-title">{t("register.create_account")}</h2>

        {/* 🔹 Optional message */}
        {message && <p className="register-message">{message}</p>}

        {/* 🔹 Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">{t("register.email_label")}</label>
            <input
              {...register("email", { required: true })}
              type="email"
              id="email"
              placeholder={t("register.email_placeholder")}
              className="input"
            />
            {errors.email && <p className="input-error">{t("register.email_required")}</p>}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">{t("register.password_label")}</label>
            <input
              {...register("password", { required: true })}
              type="password"
              id="password"
              placeholder={t("register.password_placeholder")}
              className="input"
            />
            {errors.password && <p className="input-error">{t("register.password_required")}</p>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-primary">
            {t("register.register_btn")}
          </button>
        </form>

        {/* 🔹 Forgot Password */}
        <p className="register-footer-link">
          <Link to="/forgot-password" className="text-link">
            Mot de passe oublié ?
          </Link>
        </p>

        {/* 🔹 Already have an account */}
        <p className="register-footer-link">
          {t("register.have_account")}{" "}
          <Link to="/login" className="text-link">{t("register.login_link")}</Link>
        </p>

        {/* 🔹 Google Auth */}
        <div className="google-login">
          <button onClick={handleGoogleSignIn} className="btn-google">
            <FaGoogle className="google-icon" />
            {t("register.google_btn")}
          </button>
        </div>

        {/* 🔹 Footer Rights */}
        <p className="register-rights">
          ©2025 Lina Optic. {t("register.rights")}
        </p>
      </div>
    </div>
  );
};

export default Register;
