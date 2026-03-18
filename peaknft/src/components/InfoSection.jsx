import React from 'react';

function InfoSection() {
  const cards = [
    { icon:'🎨', title:'Minting NFTs', description:'Upload an image and name to create a unique canister on the Internet Computer blockchain storing your NFT data.', items:['Each NFT gets a unique canister','Image stored on-chain','Instant ownership assignment','Loader shows minting progress'] },
    { icon:'🛒', title:'Buy & Sell', description:'List your NFTs for sale with a custom price in WAV tokens. Buyers can purchase directly from the Discover page.', items:['Set your own price in WAV','WavCoin token transactions','Ownership transfers on purchase','Funds go to the seller'] },
    { icon:'🔍', title:'Discover Page', description:'Browse all NFTs currently listed for sale. See prices, creators, and buy with one click.', items:['Real-time listing updates','Price tags on every NFT','One-click purchasing','Filter by availability'] },
    { icon:'🖼️', title:'Your Collection', description:'View all NFTs you own — minted or purchased. List them for sale or keep them in your gallery.', items:['Gallery view of owned NFTs','Sell or unlist anytime','Track your digital assets','React Router navigation'] },
    { icon:'🪙', title:'WavCoin Integration', description:'All transactions use WavCoin (WAV) tokens. You receive 50,000 WAV upon authentication.', items:['Token-based economy','Balance tracking','Transfer on purchase','Canister fund management'] },
    { icon:'🔐', title:'Blockchain Identity', description:'Internet Identity provides anonymous authentication with unique Principal IDs for secure NFT ownership.', items:['Anonymous & decentralized','No passwords needed','Biometric verification','Ownership tracked by Principal'] }
  ];

  return (
    <section className="section" id="info">
      <div className="section-container">
        <h2 className="section-title">📚 How PeakNFT Works</h2>
        <p className="section-subtitle">Everything you need to know about our NFT marketplace</p>
        <div className="divider"></div>
        <div className="info-grid">
          {cards.map((c, i) => (
            <div className="card info-card" key={i}>
              <span className="info-card-icon">{c.icon}</span>
              <h3>{c.title}</h3>
              <p>{c.description}</p>
              <ul>{c.items.map((item, j) => <li key={j}>{item}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default InfoSection;
