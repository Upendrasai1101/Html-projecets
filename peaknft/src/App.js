import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Authentication from './components/Authentication';
import Minter from './components/Minter';
import Collection from './components/Collection';
import Discover from './components/Discover';
import InfoSection from './components/InfoSection';
import Footer from './components/Footer';

const SAMPLE_NFTS = [
  { id:'nft-s1', name:'Alpine Sunrise', image:null, gradient:'linear-gradient(135deg,#f093fb,#f5576c)', emoji:'🌄', owner:'peak-gallery', creator:'peak-gallery', listed:true, price:800 },
  { id:'nft-s2', name:'Frozen Peak', image:null, gradient:'linear-gradient(135deg,#4facfe,#00f2fe)', emoji:'🏔️', owner:'peak-gallery', creator:'peak-gallery', listed:true, price:1200 },
  { id:'nft-s3', name:'Mountain Lake', image:null, gradient:'linear-gradient(135deg,#43e97b,#38f9d7)', emoji:'🏞️', owner:'peak-gallery', creator:'peak-gallery', listed:true, price:650 },
  { id:'nft-s4', name:'Snow Summit', image:null, gradient:'linear-gradient(135deg,#a18cd1,#fbc2eb)', emoji:'❄️', owner:'peak-gallery', creator:'peak-gallery', listed:true, price:1500 },
  { id:'nft-s5', name:'Valley Mist', image:null, gradient:'linear-gradient(135deg,#fccb90,#d57eeb)', emoji:'🌫️', owner:'peak-gallery', creator:'peak-gallery', listed:true, price:450 },
  { id:'nft-s6', name:'Eagle Nest', image:null, gradient:'linear-gradient(135deg,#a1c4fd,#c2e9fb)', emoji:'🦅', owner:'peak-gallery', creator:'peak-gallery', listed:true, price:2000 }
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principalId, setPrincipalId] = useState('');
  const [wavBalance, setWavBalance] = useState(0);
  const [allNfts, setAllNfts] = useState(SAMPLE_NFTS);

  const handleLogin = () => {
    const id = 'peak-' + Math.random().toString(36).substr(2,9) + '-' + Math.random().toString(36).substr(2,9);
    setPrincipalId(id);
    setIsAuthenticated(true);
    setWavBalance(50000);
  };

  const handleLogout = () => { setIsAuthenticated(false); setPrincipalId(''); setWavBalance(0); };

  const mintNFT = (name, imageData) => {
    const nft = {
      id: 'nft-' + Date.now() + '-' + Math.random().toString(36).substr(2,5),
      name, image: imageData, gradient: null, emoji: null,
      owner: principalId, creator: principalId, listed: false, price: 0
    };
    setAllNfts(prev => [...prev, nft]);
    return nft;
  };

  const listForSale = (nftId, price) => {
    setAllNfts(prev => prev.map(n => n.id === nftId && n.owner === principalId ? { ...n, listed: true, price } : n));
    return { success: true, message: 'NFT listed for ' + price + ' WAV!' };
  };

  const unlistNFT = (nftId) => {
    setAllNfts(prev => prev.map(n => n.id === nftId && n.owner === principalId ? { ...n, listed: false, price: 0 } : n));
    return { success: true, message: 'NFT unlisted!' };
  };

  const buyNFT = (nftId) => {
    const nft = allNfts.find(n => n.id === nftId);
    if (!nft) return { success: false, message: 'NFT not found!' };
    if (!nft.listed) return { success: false, message: 'Not for sale!' };
    if (nft.owner === principalId) return { success: false, message: 'You own this!' };
    if (wavBalance < nft.price) return { success: false, message: 'Insufficient WAV! Need ' + nft.price + ' WAV.' };
    setWavBalance(prev => prev - nft.price);
    setAllNfts(prev => prev.map(n => n.id === nftId ? { ...n, owner: principalId, listed: false, price: 0 } : n));
    return { success: true, message: 'Purchased ' + nft.name + ' for ' + nft.price + ' WAV!' };
  };

  const getUserNFTs = () => allNfts.filter(n => n.owner === principalId);
  const getListedNFTs = () => allNfts.filter(n => n.listed && n.owner !== principalId);

  return (
    <BrowserRouter>
      <div className="App">
        <div className="mountain-bg">
          <div className="stars-container">
            {[...Array(80)].map((_,i) => (
              <div key={i} className="star" style={{
                left: Math.random()*100+'%', top: Math.random()*45+'%',
                width: (1+Math.random()*3)+'px', height: (1+Math.random()*3)+'px',
                animationDuration: (2+Math.random()*4)+'s', animationDelay: (Math.random()*3)+'s'
              }}/>
            ))}
          </div>
          <div className="aurora"></div>
          <div className="mountain mountain-far"></div>
          <div className="mountain mountain-mid"></div>
          <div className="mountain mountain-near"></div>
          <div className="mountain-trees"></div>
          {[...Array(4)].map((_,i) => (
            <div key={i} className="cloud" style={{
              left: (i*25+Math.random()*10)+'%', top: (10+Math.random()*25)+'%',
              width: (120+Math.random()*150)+'px', height: (30+Math.random()*30)+'px',
              animationDuration: (50+Math.random()*40)+'s', animationDelay: (Math.random()*20)+'s'
            }}/>
          ))}
          <div className="snow-container">
            {[...Array(40)].map((_,i) => (
              <div key={i} className="snowflake" style={{
                left: Math.random()*100+'%',
                animationDuration: (6+Math.random()*10)+'s', animationDelay: (Math.random()*8)+'s',
                width: (2+Math.random()*4)+'px', height: (2+Math.random()*4)+'px',
                opacity: 0.15+Math.random()*0.4
              }}/>
            ))}
          </div>
        </div>

        <Header isAuthenticated={isAuthenticated} principalId={principalId} balance={wavBalance} onLogin={handleLogin} onLogout={handleLogout} />
        <main>
          <Routes>
            <Route path="/" element={<><Hero /><Authentication isAuthenticated={isAuthenticated} principalId={principalId} balance={wavBalance} onLogin={handleLogin} /><InfoSection /></>} />
            <Route path="/discover" element={<Discover nfts={getListedNFTs()} buyNFT={buyNFT} isAuthenticated={isAuthenticated} balance={wavBalance} />} />
            <Route path="/mint" element={<Minter mintNFT={mintNFT} isAuthenticated={isAuthenticated} />} />
            <Route path="/collection" element={<Collection nfts={getUserNFTs()} listForSale={listForSale} unlistNFT={unlistNFT} isAuthenticated={isAuthenticated} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
