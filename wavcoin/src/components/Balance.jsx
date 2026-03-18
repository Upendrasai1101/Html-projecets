import React, { useState } from 'react';

function Balance({ isAuthenticated, principalId, getBalance }) {
  const [lookupId, setLookupId] = useState('');
  const [displayBalance, setDisplayBalance] = useState(null);
  const [isOwn, setIsOwn] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleCheckBalance = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    const idToCheck = lookupId.trim() || principalId;
    const bal = getBalance(idToCheck);
    setDisplayBalance(bal);
    setIsOwn(!lookupId.trim() || lookupId.trim() === principalId);
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <section className="balance-section section" id="balance">
        <div className="section-container">
          <h2 className="section-title">💰 Token Balance</h2>
          <p className="section-subtitle">Check your WAV token balance</p>
          <div className="card balance-card">
            <div className="locked-overlay">
              <div className="locked-icon">🔒</div>
              <p className="locked-text">Please authenticate to view your balance</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="balance-section section" id="balance">
      <div className="section-container">
        <h2 className="section-title">💰 Token Balance</h2>
        <p className="section-subtitle">Query any Principal ID to check WAV token holdings</p>
        <div className="card balance-card">
          {displayBalance !== null ? (
            <div className="balance-display">
              <span className="balance-amount">{displayBalance.toLocaleString()}</span>
              <span className="balance-label">{isOwn ? 'Your' : ''} WAV Tokens</span>
            </div>
          ) : (
            <div className="balance-display">
              <span className="balance-amount" style={{ opacity: 0.3 }}>—</span>
              <span className="balance-label">WAV Tokens</span>
            </div>
          )}
          <div className="balance-input-group">
            <input type="text" className="input-field"
              placeholder={principalId ? "Default: " + principalId.slice(0, 20) + "..." : "Enter Principal ID"}
              value={lookupId} onChange={(e) => setLookupId(e.target.value)} />
            <button className="btn btn-primary" onClick={handleCheckBalance} disabled={loading}>
              {loading ? <span className="spinner"></span> : '🔍 Check'}
            </button>
          </div>
          <div className="message message-info" style={{ marginTop: '20px' }}>
            <span>💡</span><span>Leave empty to check your own balance, or enter any Principal ID</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Balance;
