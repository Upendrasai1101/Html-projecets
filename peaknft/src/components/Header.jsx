import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header({ isAuthenticated, principalId, balance, onLogin, onLogout }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? ' active' : '';

  return (
    <header className="header">
      <Link to="/" className="header-logo">
        <span className="logo-icon">🏔️</span>
        <span className="logo-text">PEAKNFT</span>
      </Link>
      <nav className="header-nav">
        <Link to="/" className={"nav-link" + isActive("/")}>Home</Link>
        <Link to="/discover" className={"nav-link" + isActive("/discover")}>Discover</Link>
        <Link to="/mint" className={"nav-link" + isActive("/mint")}>Mint</Link>
        <Link to="/collection" className={"nav-link" + isActive("/collection")}>Collection</Link>
      </nav>
      <div className="header-right">
        {isAuthenticated ? (
          <>
            <div className="header-balance"><span>🪙</span><span>{balance.toLocaleString()} WAV</span></div>
            <div className="header-user"><span>🔐</span><span>{principalId.slice(0,12)}...</span></div>
            <button className="logout-btn" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <button className="login-btn" onClick={onLogin}>🏔️ Connect</button>
        )}
      </div>
    </header>
  );
}

export default Header;
