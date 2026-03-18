import React, { useState } from 'react';

function NFTItem({ nft, mode, onSell, onBuy, onUnlist, isAuthenticated, balance }) {
  const [sellPrice, setSellPrice] = useState('');
  const [showPriceInput, setShowPriceInput] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bought, setBought] = useState(false);

  const handleSellClick = () => {
    if (!showPriceInput) { setShowPriceInput(true); return; }
    const price = Number(sellPrice);
    if (price <= 0) { setMessage({success:false,message:'Enter a valid price!'}); return; }
    const result = onSell(nft.id, price);
    setMessage(result);
    setShowPriceInput(false);
    setSellPrice('');
  };

  const handleUnlist = () => {
    const result = onUnlist(nft.id);
    setMessage(result);
  };

  const handleBuy = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const result = onBuy(nft.id);
    setMessage(result);
    if (result.success) setBought(true);
    setLoading(false);
  };

  const imageStyle = nft.image
    ? { backgroundImage: 'url(' + nft.image + ')', backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: nft.gradient || 'linear-gradient(135deg,#334155,#1e293b)' };

  return (
    <div className="nft-card">
      <div className="nft-image" style={imageStyle}>
        {nft.emoji && <span className="nft-emoji">{nft.emoji}</span>}
        {mode === 'discover' && nft.listed && !bought && <div className="nft-price-tag">{nft.price} WAV</div>}
        {mode === 'collection' && nft.listed && <div className="nft-listed-tag">Listed</div>}
        {bought && <div className="nft-sold-overlay">✅ PURCHASED</div>}
      </div>
      <div className="nft-info">
        <div className="nft-name">{nft.name}</div>
        <div className="nft-creator">Creator: {nft.creator.slice(0,18)}...</div>

        {mode === 'collection' && !nft.listed && (
          <div className="nft-actions">
            {!showPriceInput ? (
              <button className="btn btn-gold btn-sm" onClick={handleSellClick}>💰 Sell</button>
            ) : (
              <div className="sell-input-row">
                <input type="number" className="input-field" placeholder="Price (WAV)" value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)} min="1" style={{padding:'8px 12px',fontSize:'0.8rem'}} />
                <button className="btn btn-emerald btn-sm" onClick={handleSellClick}>Confirm</button>
                <button className="btn btn-outline btn-sm" onClick={() => {setShowPriceInput(false);setSellPrice('');}}>✕</button>
              </div>
            )}
          </div>
        )}

        {mode === 'collection' && nft.listed && (
          <div className="nft-actions">
            <span style={{color:'#10b981',fontSize:'0.8rem',fontFamily:"'Orbitron',monospace"}}>{nft.price} WAV</span>
            <button className="btn btn-outline btn-sm" onClick={handleUnlist}>Unlist</button>
          </div>
        )}

        {mode === 'discover' && !bought && (
          <div className="nft-actions">
            <button className="btn btn-gold btn-sm" onClick={handleBuy} disabled={loading || !isAuthenticated}>
              {loading ? <><span className="spinner"></span><span>Buying...</span></> : <><span>🛒</span><span>Buy for {nft.price} WAV</span></>}
            </button>
          </div>
        )}

        {message && (
          <div className={"message " + (message.success ? 'message-success' : 'message-error')} style={{fontSize:'0.78rem',padding:'8px 12px'}}>
            <span>{message.success ? '✅' : '❌'}</span><span>{message.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default NFTItem;
