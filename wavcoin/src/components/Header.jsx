import React from 'react';

function Header({ isAuthenticated, principalId, balance, onLogout }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="header">
      <div className="header-logo">
        <span className="logo-icon">🌊</span>
        <span className="logo-text">WAVCOIN</span>
      </div>
      <nav className="header-nav">
        <span className="nav-link" onClick={() => scrollTo('auth')}>Identity</span>
        <span className="nav-link" onClick={() => scrollTo('balance')}>Balance</span>
        <span className="nav-link" onClick={() => scrollTo('faucet')}>Faucet</span>
        <span className="nav-link" onClick={() => scrollTo('transfer')}>Transfer</span>
        <span className="nav-link" onClick={() => scrollTo('info')}>Learn</span>
      </nav>
      <div className="header-right">
        {isAuthenticated && (
          <>
            <div className="header-balance">
              <span>🪙</span>
              <span>{balance.toLocaleString()} WAV</span>
            </div>
            <div className="header-user">
              <span>🔐</span>
              <span>{principalId.slice(0, 12)}...</span>
            </div>
            <button className="logout-btn" onClick={onLogout}>Logout</button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
