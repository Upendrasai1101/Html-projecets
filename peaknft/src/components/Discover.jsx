import React from 'react';
import { Link } from 'react-router-dom';
import NFTItem from './NFTItem';

function Discover({ nfts, buyNFT, isAuthenticated, balance }) {
  return (
    <section className="page-section section">
      <div className="section-container">
        <h2 className="section-title">🔍 Discover NFTs</h2>
        <p className="section-subtitle">Browse NFTs listed for sale by other creators and collectors</p>

        {!isAuthenticated && (
          <div className="message message-info" style={{maxWidth:'500px',margin:'0 auto 25px'}}>
            <span>🔐</span><span>Connect your identity to buy NFTs — <Link to="/" style={{color:'#f59e0b'}}>Login here</Link></span>
          </div>
        )}

        {isAuthenticated && (
          <div className="message message-info" style={{maxWidth:'500px',margin:'0 auto 25px'}}>
            <span>🪙</span><span>Your balance: <strong>{balance.toLocaleString()} WAV</strong></span>
          </div>
        )}

        {nfts.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-icon">🏔️</div>
              <p className="empty-text">No NFTs listed for sale right now.</p>
              <Link to="/mint" className="btn btn-gold">🎨 Mint & List Yours</Link>
            </div>
          </div>
        ) : (
          <div className="nft-grid">
            {nfts.map(nft => (
              <NFTItem key={nft.id} nft={nft} mode="discover" onBuy={buyNFT} isAuthenticated={isAuthenticated} balance={balance} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Discover;
