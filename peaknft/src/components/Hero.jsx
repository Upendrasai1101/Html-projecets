import React, { useState, useEffect } from 'react';

function Hero() {
  const [minted, setMinted] = useState(2847);
  const [volume, setVolume] = useState(142500);

  useEffect(() => {
    const i = setInterval(() => {
      setMinted(p => p + Math.floor(Math.random() * 3));
      setVolume(p => p + Math.floor(Math.random() * 500));
    }, 4000);
    return () => clearInterval(i);
  }, []);

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-badge"><span>⛰️</span><span>Decentralized NFT Marketplace</span></div>
        <div className="hero-icon">🏔️</div>
        <h1>
          <span className="gradient-text">PEAKNFT</span><br />
          <span style={{ fontSize: '0.45em', color: '#64748b', fontWeight: 400 }}>
            Mint, Collect & Trade Digital Art on the Blockchain
          </span>
        </h1>
        <p className="hero-subtitle">
          Create unique NFTs by minting them as canisters on the Internet Computer.
          Browse, buy, and sell with WavCoin tokens — fully decentralized.
        </p>
        <div className="hero-stats">
          <div className="stat-item"><span className="stat-value">{minted.toLocaleString()}</span><span className="stat-label">NFTs Minted</span></div>
          <div className="stat-item"><span className="stat-value">6</span><span className="stat-label">Featured</span></div>
          <div className="stat-item"><span className="stat-value">{volume.toLocaleString()}</span><span className="stat-label">WAV Volume</span></div>
          <div className="stat-item"><span className="stat-value">50,000</span><span className="stat-label">Free WAV</span></div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
