import React from 'react';
import { Link } from 'react-router-dom';
import NFTItem from './NFTItem';

function Collection({ nfts, listForSale, unlistNFT, isAuthenticated }) {
  if (!isAuthenticated) {
    return (
      <section className="page-section section">
        <div className="section-container">
          <h2 className="section-title">🖼️ My Collection</h2>
          <p className="section-subtitle">View your owned NFTs</p>
          <div className="card">
            <div className="locked-overlay">
              <div className="locked-icon">🔒</div>
              <p className="locked-text">Please connect your identity to view your collection</p>
              <Link to="/" className="btn btn-gold" style={{marginTop:'15px'}}>Go to Login</Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section section">
      <div className="section-container">
        <h2 className="section-title">🖼️ My Collection</h2>
        <p className="section-subtitle">Your owned NFTs — mint or buy more to grow your collection</p>
        {nfts.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-icon">🏔️</div>
              <p className="empty-text">Your collection is empty. Start by minting or buying NFTs!</p>
              <div style={{display:'flex',gap:'12px',justifyContent:'center'}}>
                <Link to="/mint" className="btn btn-gold">🎨 Mint NFT</Link>
                <Link to="/discover" className="btn btn-purple">🔍 Discover</Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="message message-info" style={{maxWidth:'600px',margin:'0 auto 25px'}}>
              <span>💡</span><span>You own {nfts.length} NFT{nfts.length !== 1 ? 's' : ''}. Click "Sell" to list on the marketplace.</span>
            </div>
            <div className="nft-grid">
              {nfts.map(nft => (
                <NFTItem key={nft.id} nft={nft} mode="collection" onSell={listForSale} onUnlist={unlistNFT} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Collection;
