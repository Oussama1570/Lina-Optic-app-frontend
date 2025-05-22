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
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    document.body.dir = isRTL ? "rtl" : "ltr";
  }, [isRTL]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (
        isMobileMenuOpen &&
        !e.target.closest(".mobile-menu-panel") &&
        !e.target.closest(".mobile-menu-btn")
      ) {
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
          <a href="/" className="logo">
            <div className="lina-optic-logo">LINA OPTIC</div>
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <FaBars className="menu-icon" />
        </button>

        {/* Desktop Navigation */}
        <ul className="nav-links desktop-only">
          <li><a href="/">Accueil</a></li>

          <li className="nav-item dropdown">
            <a href="/products?subCategory=Solaire">solaire</a>

            <ul className="dropdown-menu">
              <li><a href="/products?category=Hommes&subCategory=Solaire">solaire homme</a></li>
              <li><a href="/products?category=Femmes&subCategory=Solaire">solaire femme</a></li>
              </ul>
           </li>
        
          

          <li className="nav-item dropdown">
            <a href="/products?subCategory=Optique">optique</a>

            <ul className="dropdown-menu">
              <li><a href="/products?category=Hommes&subCategory=Optique">vue homme</a></li>
              <li><a href="/products?category=Femmes&subCategory=Optique">vue femme</a></li>
            </ul>
          </li>

          <li><a href="/products?subCategory=Lentilles">lentilles</a></li>
          <li><a href="/products?category=Enfants">enfants</a>
</li>
          <li><a href="/about">A propos</a></li>
          <li><a href="/contact">Contactez-nous</a></li>
        </ul>

        {/* Icons */}
        <div className="nav-icons">
          <a href="/cart" className="cart-icon">
            <FaShoppingCart className="icon" />
            {cartItems.length > 0 && (
              <span className="cart-badge">{cartItems.length}</span>
            )}
          </a>

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
                      <li><a href="/user-dashboard">Tableau de Bord</a></li>
                      <li><a href="/orders">Ordres</a></li>
                      <li><button onClick={logout}>Déconnexion</button></li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <a href="/login" className="login-icon">
                <FaUserCircle className="icon" />
              </a>
            )}
          </div>

          <div className="language-switcher-wrapper">
            {/* Language Switcher Placeholder */}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-panel">
          <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)}>
            <FaTimes />
          </button>
          <ul>
            <li><a href="/" onClick={() => setIsMobileMenuOpen(false)}>Accueil</a></li>
            <li><a href="/products?subCategory=Solaire" onClick={() => setIsMobileMenuOpen(false)}>solaire homme</a></li>
            <li><a href="/products?subCategory=Solaire" onClick={() => setIsMobileMenuOpen(false)}>solaire femme</a></li>
            <li><a href="/products?subCategory=Optique" onClick={() => setIsMobileMenuOpen(false)}>vue homme</a></li>
            <li><a href="/products?subCategory=Optique" onClick={() => setIsMobileMenuOpen(false)}>vue femme</a></li>
            <li><a href="/products?subCategory=Lentilles" onClick={() => setIsMobileMenuOpen(false)}>lentilles</a></li>
            <li><a href="/products?mainCategory=Enfants" onClick={() => setIsMobileMenuOpen(false)}>enfants</a></li>
            <li><a href="/about" onClick={() => setIsMobileMenuOpen(false)}>A propos</a></li>
            <li><a href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contactez-nous</a></li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
