import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Minter({ mintNFT, isAuthenticated }) {
  const [name, setName] = useState('');
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [minted, setMinted] = useState(false);
  const [mintedNFT, setMintedNFT] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageData(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleMint = async () => {
    if (!name.trim() || !imageData) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 2500));
    const nft = mintNFT(name.trim(), imageData);
    setMintedNFT(nft);
    setLoading(false);
    setMinted(true);
  };

  const resetForm = () => {
    setName(''); setImageData(null); setMinted(false); setMintedNFT(null);
  };

  if (!isAuthenticated) {
    return (
      <section className="page-section section">
        <div className="section-container">
          <h2 className="section-title">🎨 Mint NFT</h2>
          <p className="section-subtitle">Create unique NFTs on the blockchain</p>
          <div className="card minter-card">
            <div className="locked-overlay">
              <div className="locked-icon">🔒</div>
              <p className="locked-text">Please connect your identity to mint NFTs</p>
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
        <h2 className="section-title">🎨 Mint NFT</h2>
        <p className="section-subtitle">Upload an image and create a unique canister on the Internet Computer</p>
        <div className="card minter-card">
          {loading ? (
            <div className="mint-loader">
              <div className="loader-spinner"></div>
              <p className="loader-text">Creating canister on blockchain...</p>
              <p style={{color:'#64748b',fontSize:'0.8rem',marginTop:'8px'}}>Storing NFT data on the Internet Computer</p>
            </div>
          ) : minted && mintedNFT ? (
            <div className="mint-success">
              <div className="mint-success-icon">🎉</div>
              <h3>NFT Minted Successfully!</h3>
              <p style={{color:'#64748b',fontSize:'0.85rem'}}>"{mintedNFT.name}" is now in your collection</p>
              {mintedNFT.image && <img src={mintedNFT.image} alt={mintedNFT.name} className="minted-preview" />}
              <p style={{color:'#475569',fontSize:'0.75rem',fontFamily:"'Orbitron',monospace",margin:'10px 0'}}>ID: {mintedNFT.id}</p>
              <div style={{display:'flex',gap:'10px',justifyContent:'center',marginTop:'15px'}}>
                <Link to="/collection" className="btn btn-emerald">View Collection</Link>
                <button className="btn btn-outline" onClick={resetForm}>Mint Another</button>
              </div>
            </div>
          ) : (
            <div className="mint-form">
              <div className={"upload-area" + (imageData ? " has-image" : "")} onClick={() => document.getElementById('nft-upload').click()}>
                {imageData ? (
                  <><span className="upload-icon">✅</span><p className="upload-text">Image selected — click to change</p><img src={imageData} alt="Preview" className="image-preview" /></>
                ) : (
                  <><span className="upload-icon">📁</span><p className="upload-text">Click to upload image (JPG, PNG, GIF)</p><p style={{color:'#3a4a60',fontSize:'0.75rem',marginTop:'5px'}}>This will be stored on the blockchain canister</p></>
                )}
                <input id="nft-upload" type="file" accept="image/*" className="upload-input" onChange={handleImageUpload} />
              </div>
              <input type="text" className="input-field" placeholder="NFT Name (e.g., Mountain Aurora)" value={name} onChange={(e) => setName(e.target.value)} />
              <button className="btn btn-gold btn-full" onClick={handleMint} disabled={!name.trim() || !imageData}>
                <span>🎨</span><span>Mint NFT</span>
              </button>
              {(!name.trim() || !imageData) && (
                <div className="message message-info"><span>💡</span><span>Upload an image and enter a name to mint</span></div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Minter;
