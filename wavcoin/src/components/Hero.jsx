import React, { useState, useEffect } from 'react';

function Hero() {
  const [price, setPrice] = useState(0.0042);
  const [holders, setHolders] = useState(1337);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrice(prev => {
        const change = (Math.random() - 0.48) * 0.0005;
        return Math.max(0.001, +(prev + change).toFixed(4));
      });
      setHolders(prev => prev + Math.floor(Math.random() * 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-badge">
          <span>⚡</span>
          <span>Built on the Internet Computer</span>
        </div>
        <div className="hero-coin">🌊</div>
        <h1>
          <span className="gradient-text">WAVCOIN</span>
          <br />
          <span style={{ fontSize: '0.5em', color: '#6a9ec4', fontWeight: 400 }}>
            Ride the Wave of Decentralized Finance
          </span>
        </h1>
        <p className="hero-subtitle">
          A community-driven token inspired by the power of the ocean.
          Create, claim, and transfer WAV tokens on the blockchain.
        </p>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-value">${price}</span>
            <span className="stat-label">Price</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">1,000,000</span>
            <span className="stat-label">Total Supply</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">$4,200,000</span>
            <span className="stat-label">Market Cap</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{holders.toLocaleString()}</span>
            <span className="stat-label">Holders</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
