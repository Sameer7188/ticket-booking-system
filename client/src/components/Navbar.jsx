// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /* ─────────── Handlers ─────────── */
  const toggleMenu   = () => setIsMenuOpen((p) => !p);
  const closeMenu    = () => setIsMenuOpen(false);
  const handleLogout = () => {
    logout();
    navigate('/');
    closeMenu();
  };

  /* ─────────── Render ─────────── */
  return (
    <nav className="navbar">
      {/* =====  Top‑bar  ===== */}
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          🎟️ Book<span>my</span>Ticket
        </Link>

        {/* Desktop links */}
        <div className="navbar-desktop">
          <Link to="/" className="navbar-link">
            🏠 Home
          </Link>

          {user ? (
            <>
              <div className="user-greeting">Hi, {user.name}</div>
              <Link to="/receipts" className="navbar-link">
                🧾 Receipts
              </Link>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="register-btn">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Hamburger (tablet / mobile) */}
        <button
          className="menu-toggle mobile-menu-btn"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* =====  Mobile slide‑down  ===== */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-link" onClick={closeMenu}>
            🏠 Home
          </Link>

          {user ? (
            <>
              <div className="mobile-user-greeting">Hi, {user.name}</div>
              <Link
                to="/receipts"
                className="mobile-link"
                onClick={closeMenu}
              >
                🧾 Receipts
              </Link>
              <button
                className="mobile-logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-link" onClick={closeMenu}>
                Login
              </Link>
              <Link
                to="/register"
                className="mobile-register-btn"
                onClick={closeMenu}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
