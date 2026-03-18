import React, { useState } from 'react';

function Faucet({ isAuthenticated, claimFromFaucet, canisterBalance }) {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const handleClaim = async () => {
    setLoading(true);
    setMessage(null);
    await new Promise(resolve => setTimeout(resolve, 1200));
    const result = claimFromFaucet();
    setMessage(result);
    if (result.success) setClaimed(true);
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <section className="faucet-section section" id="faucet">
        <div className="section-container">
          <h2 className="section-title">🚰 Token Faucet</h2>
          <p className="section-subtitle">Claim free WAV tokens to get started</p>
          <div className="card faucet-card">
            <div className="locked-overlay">
              <div className="locked-icon">🔒</div>
              <p className="locked-text">Please authenticate to claim tokens</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="faucet-section section" id="faucet">
      <div className="section-container">
        <h2 className="section-title">🚰 Token Faucet</h2>
        <p className="section-subtitle">Claim free WAV tokens from the canister treasury</p>
        <div className="card faucet-card">
          <div className="faucet-icon">💧</div>
          <h3 style={{ fontFamily: "'Orbitron', monospace", color: '#e0f0ff', marginBottom: '10px' }}>
            Free Token Distribution
          </h3>
          <p style={{ color: '#6a9ec4', fontSize: '0.9rem', lineHeight: 1.7 }}>
            The faucet uses <strong style={{ color: '#00d4ff' }}>transfer()</strong> to allocate
            <strong style={{ color: '#00ff88' }}> 10,000 WAV</strong> from the canister balance.
          </p>
          <div className="faucet-amount">10,000 WAV</div>
          <div className="faucet-supply">
            <span>🏦</span><span>Canister Treasury: {canisterBalance.toLocaleString()} WAV</span>
          </div>
          <button className="btn btn-success claim-btn" onClick={handleClaim} disabled={loading || claimed}>
            {loading ? (<><span className="spinner"></span><span>Processing...</span></>) :
             claimed ? (<><span>✅</span><span>Claimed!</span></>) :
             (<><span>🌊</span><span>Claim Tokens</span></>)}
          </button>
          {message && (
            <div className={"message " + (message.success ? 'message-success' : 'message-error')}>
              <span>{message.success ? '✅' : '❌'}</span><span>{message.message}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Faucet;
