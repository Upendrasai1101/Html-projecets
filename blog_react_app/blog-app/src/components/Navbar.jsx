import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ArticleIcon from "@mui/icons-material/Article";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAuth } from "../context/AuthContext";

// ── Navbar Component ──────────────────────────────────────────
// Uses: React Router (Link, useNavigate), useAuth (Context API),
//       useState, conditional rendering, Material UI Icons
const Navbar = () => {
  const { user, logout }    = useAuth();       // Context API
  const navigate            = useNavigate();   // React Router
  const location            = useLocation();   // React Router
  const [menuOpen, setMenuOpen] = useState(false); // useState

  // ES6 Arrow Function — handle logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ES6 Arrow Function — check active route for styling
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <ArticleIcon style={{ color: "#6c63ff", marginRight: "6px" }} />
          Blog-React
        </Link>

        {/* Desktop Links */}
        <ul className="navbar__links">
          <li><Link to="/"      className={`nav-link ${isActive("/")      ? "nav-link--active" : ""}`}>Home</Link></li>
          <li><Link to="/blog"  className={`nav-link ${isActive("/blog")  ? "nav-link--active" : ""}`}>Blog</Link></li>
          {/* Conditional rendering — show Create only if logged in */}
          {user && (
            <li><Link to="/create" className={`nav-link ${isActive("/create") ? "nav-link--active" : ""}`}>Write</Link></li>
          )}
        </ul>

        {/* Auth Buttons */}
        <div className="navbar__auth">
          {/* Conditional rendering — login or user menu */}
          {user ? (
            <div className="navbar__user">
              <Link to="/profile" className="navbar__avatar">
                <AccountCircleIcon style={{ fontSize: "1.8rem", color: "#6c63ff" }} />
                <span>{user.name}</span>
              </Link>
              <button className="btn btn--ghost" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <Link to="/login" className="btn btn--primary">Login</Link>
          )}
        </div>

        {/* Mobile Hamburger — conditional rendering */}
        <button className="navbar__hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Menu — conditional rendering */}
      {menuOpen && (
        <div className="navbar__mobile">
          <Link to="/"      onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/blog"  onClick={() => setMenuOpen(false)}>Blog</Link>
          {user && <Link to="/create"  onClick={() => setMenuOpen(false)}>Write</Link>}
          {user && <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>}
          {user
            ? <button onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</button>
            : <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          }
        </div>
      )}
    </nav>
  );
};

export default Navbar;
