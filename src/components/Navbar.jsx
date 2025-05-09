import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaUserCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import "../Styles/StylesNavbar.css";

import { useTranslation } from "react-i18next";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { currentUser, logout } = useAuth();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    document.body.dir = isRTL ? "rtl" : "ltr";
  }, [isRTL]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      // ✅ Also close mobile menu on outside click
      if (isMobileMenuOpen && !e.target.closest(".mobile-menu-panel") && !e.target.closest(".mobile-menu-btn")) {
        setIsMobileMenuOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);
  

  return (
    <header className="navbar-container">
      <nav className="navbar-content">
        {/* Logo */}
        <div className="navbar-left">
          <Link to="/" className="logo">
            <div className="lina-optic-logo">LINA OPTIC</div>
          </Link>
        </div>
  
        {/* Mobile Toggle */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <FaBars className="menu-icon" />
        </button>
  
        {/* Desktop Navigation */}
        {/* Desktop Navigation */}
<ul className="nav-links desktop-only">
  <li><Link to="/">{t("home")}</Link></li>

  <li className="nav-item dropdown">
    <span>{t("solaire")}</span>
    <ul className="dropdown-menu">
      <li><Link to="/products">{t("solaire homme")}</Link></li>
      <li><Link to="/products">{t("solaire femme")}</Link></li>
    </ul>
  </li>

  <li className="nav-item dropdown">
    <span>{t("optique")}</span>
    <ul className="dropdown-menu">
      <li><Link to="/products">{t("vue homme")}</Link></li>
      <li><Link to="/products">{t("vue femme")}</Link></li>
    </ul>
  </li>

  <li><Link to="/products">{t("lentilles")}</Link></li>
  <li><Link to="/products">{t("enfants")}</Link></li>
  <li><Link to="/about">{t("about-menu")}</Link></li>
  <li><Link to="/contact">{t("contact-menu")}</Link></li>
</ul>

        {/* Icons */}
        <div className="nav-icons">
          <Link to="/cart" className="cart-icon">
            <FaShoppingCart className="icon" />
            {cartItems.length > 0 && (
              <span className="cart-badge">{cartItems.length}</span>
            )}
          </Link>
  
          <div className="user-section" ref={dropdownRef}>
            {currentUser ? (
              <>
                <button
                  className="user-avatar-btn"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <FaUserCircle className="user-icon logged-in" />
                </button>
  
                {isDropdownOpen && (
                  <div className="user-dropdown">
                    <ul>
                      <li><Link to="/user-dashboard">{t("dashboard")}</Link></li>
                      <li><Link to="/orders">{t("orders")}</Link></li>
                      <li><button onClick={logout}>{t("logout")}</button></li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login" className="login-icon">
                <FaUserCircle className="icon" />
              </Link>
            )}
          </div>
  
          <div className="language-switcher-wrapper">
            {/* Language Switcher Placeholder */}
          </div>
        </div>
      </nav>
  
      {/* Mobile Menu */}
      {/* Mobile Menu */}
{isMobileMenuOpen && (
  <div className="mobile-menu-panel">
    <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)}>
      <FaTimes />
    </button>
    <ul>
      <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>{t("home")}</Link></li>
      <li><Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>{t("solaire homme")}</Link></li>
      <li><Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>{t("solaire femme")}</Link></li>
      <li><Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>{t("vue homme")}</Link></li>
      <li><Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>{t("vue femme")}</Link></li>
      <li><Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>{t("lentilles")}</Link></li>
      <li><Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>{t("enfants")}</Link></li>
      <li><Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>{t("about-menu")}</Link></li>
      <li><Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>{t("contact-menu")}</Link></li>
    </ul>
  </div>
)}

   
    </header>
  );
  
};

export default Navbar;
