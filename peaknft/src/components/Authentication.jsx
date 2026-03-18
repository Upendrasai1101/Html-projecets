import React from 'react';

function Authentication({ isAuthenticated, principalId, balance, onLogin }) {
  return (
    <section className="auth-section section" id="auth">
      <div className="section-container">
        <h2 className="section-title">🔐 Internet Identity</h2>
        <p className="section-subtitle">Authenticate to mint, buy, and sell NFTs securely</p>
        <div className="card auth-card">
          {!isAuthenticated ? (
            <>
              <div className="auth-icon">🛡️</div>
              <h3 className="auth-title">Connect Your Identity</h3>
              <p className="auth-description">
                Internet Identity gives you a unique Principal ID to interact with the blockchain anonymously.
                You will receive 50,000 WAV tokens to start buying NFTs.
              </p>
              <div className="auth-features">
                <div className="auth-feature"><span>🎨</span><span>Mint NFTs</span></div>
                <div className="auth-feature"><span>🛒</span><span>Buy & Sell</span></div>
                <div className="auth-feature"><span>🔒</span><span>Secure Auth</span></div>
                <div className="auth-feature"><span>🪙</span><span>50K WAV Free</span></div>
              </div>
              <br />
              <button className="auth-btn" onClick={onLogin}><span>🏔️</span><span>Create Identity</span></button>
            </>
          ) : (
            <div className="auth-success">
              <div className="auth-success-icon">✅</div>
              <h3 className="auth-title">Identity Verified</h3>
              <p className="auth-description">Welcome to PeakNFT! You have <strong style={{color:'#f59e0b'}}>{balance.toLocaleString()} WAV</strong> to spend.</p>
              <div className="auth-principal">Principal: {principalId}</div>
              <div className="auth-features">
                <div className="auth-feature"><span>✅</span><span>Mint NFTs</span></div>
                <div className="auth-feature"><span>✅</span><span>Browse Discover</span></div>
                <div className="auth-feature"><span>✅</span><span>Buy NFTs</span></div>
                <div className="auth-feature"><span>✅</span><span>Sell NFTs</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Authentication;
