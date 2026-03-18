import React from 'react';

function Authentication({ isAuthenticated, principalId, onLogin, onLogout }) {
  return (
    <section className="auth-section section" id="auth">
      <div className="section-container">
        <h2 className="section-title">🔐 Internet Identity</h2>
        <p className="section-subtitle">
          Secure, anonymous blockchain authentication.
        </p>
        <div className="card auth-card">
          {!isAuthenticated ? (
            <>
              <div className="auth-icon">🛡️</div>
              <h3 className="auth-title">Authenticate to Continue</h3>
              <p className="auth-description">
                Internet Identity assigns you a unique Principal ID, letting you
                interact with the blockchain anonymously. No personal data required.
              </p>
              <div className="auth-features">
                <div className="auth-feature"><span className="auth-feature-icon">🔒</span><span>Anonymous & Secure</span></div>
                <div className="auth-feature"><span className="auth-feature-icon">🧬</span><span>Biometric Support</span></div>
                <div className="auth-feature"><span className="auth-feature-icon">🌐</span><span>Decentralized Auth</span></div>
                <div className="auth-feature"><span className="auth-feature-icon">⚡</span><span>Instant Access</span></div>
              </div>
              <br />
              <button className="auth-btn" onClick={onLogin}>
                <span>🌊</span><span>Create Identity</span>
              </button>
            </>
          ) : (
            <div className="auth-success">
              <div className="auth-success-icon">✅</div>
              <h3 className="auth-title">Identity Verified</h3>
              <p className="auth-description">
                You are authenticated! Your Principal ID is your passport to the WavCoin ecosystem.
              </p>
              <div className="auth-principal">Principal: {principalId}</div>
              <div className="auth-features">
                <div className="auth-feature"><span className="auth-feature-icon">✅</span><span>Check Balances</span></div>
                <div className="auth-feature"><span className="auth-feature-icon">✅</span><span>Claim from Faucet</span></div>
                <div className="auth-feature"><span className="auth-feature-icon">✅</span><span>Transfer Tokens</span></div>
                <div className="auth-feature"><span className="auth-feature-icon">✅</span><span>Full Access</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Authentication;
