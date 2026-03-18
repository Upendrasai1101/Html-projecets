import React, { useState } from 'react';

function Transfer({ isAuthenticated, transferTokens, balance }) {
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    setLoading(true);
    setMessage(null);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const result = transferTokens(recipientId.trim(), Number(amount));
    setMessage(result);
    if (result.success) { setRecipientId(''); setAmount(''); }
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <section className="transfer-section section" id="transfer">
        <div className="section-container">
          <h2 className="section-title">📤 Transfer Tokens</h2>
          <p className="section-subtitle">Send WAV tokens to any Principal ID</p>
          <div className="card transfer-card">
            <div className="locked-overlay">
              <div className="locked-icon">🔒</div>
              <p className="locked-text">Please authenticate to transfer tokens</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="transfer-section section" id="transfer">
      <div className="section-container">
        <h2 className="section-title">📤 Transfer Tokens</h2>
        <p className="section-subtitle">Send WAV tokens to anyone</p>
        <div className="card transfer-card">
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <span style={{ fontSize: '2.5rem' }}>💸</span>
            <h3 style={{ fontFamily: "'Orbitron', monospace", color: '#e0f0ff', margin: '10px 0' }}>Send WAV Tokens</h3>
            <p style={{ color: '#6a9ec4', fontSize: '0.9rem' }}>
              Available: <strong style={{ color: '#00ff88' }}>{balance.toLocaleString()} WAV</strong>
            </p>
          </div>
          <div className="transfer-form">
            <input type="text" className="input-field" placeholder="Recipient Principal ID"
              value={recipientId} onChange={(e) => setRecipientId(e.target.value)} />
            <div className="transfer-row">
              <input type="number" className="input-field" placeholder="Amount (WAV)"
                value={amount} onChange={(e) => setAmount(e.target.value)} min="1" />
              <button className="btn btn-primary" onClick={() => setAmount(Math.floor(balance / 2).toString())}
                style={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>Half</button>
              <button className="btn btn-primary" onClick={() => setAmount(balance.toString())}
                style={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>Max</button>
            </div>
            <button className="btn btn-primary transfer-btn" onClick={handleTransfer}
              disabled={loading || !recipientId.trim() || !amount}>
              {loading ? (<><span className="spinner"></span><span>Transferring...</span></>) :
               (<><span>📤</span><span>Transfer Tokens</span></>)}
            </button>
          </div>
          {message && (
            <div className={"message " + (message.success ? 'message-success' : 'message-error')}>
              <span>{message.success ? '✅' : '❌'}</span><span>{message.message}</span>
            </div>
          )}
          <div className="message message-info" style={{ marginTop: '15px' }}>
            <span>ℹ️</span><span>Transfer checks your balance first. Insufficient funds will be rejected.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Transfer;
