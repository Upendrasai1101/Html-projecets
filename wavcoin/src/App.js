import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Balance from './components/Balance';
import Faucet from './components/Faucet';
import Transfer from './components/Transfer';
import Authentication from './components/Authentication';
import InfoSection from './components/InfoSection';
import Footer from './components/Footer';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principalId, setPrincipalId] = useState('');
  const [balances, setBalances] = useState({});
  const [totalSupply] = useState(1000000);
  const CANISTER_ID = 'wavcoin-canister-001';
  const FAUCET_AMOUNT = 10000;

  useEffect(() => {
    setBalances(prev => ({ ...prev, [CANISTER_ID]: totalSupply }));
  }, [totalSupply]);

  const handleLogin = () => {
    const id = 'wav-' + Math.random().toString(36).substr(2, 9) + '-' + Math.random().toString(36).substr(2, 9);
    setPrincipalId(id);
    setIsAuthenticated(true);
    if (!balances[id]) setBalances(prev => ({ ...prev, [id]: 0 }));
  };

  const handleLogout = () => { setIsAuthenticated(false); setPrincipalId(''); };
  const getBalance = (id) => balances[id] || 0;

  const claimFromFaucet = () => {
    if (!isAuthenticated) return { success: false, message: 'Please authenticate first!' };
    const cb = balances[CANISTER_ID] || 0;
    if (cb < FAUCET_AMOUNT) return { success: false, message: 'Faucet is empty!' };
    setBalances(prev => ({
      ...prev,
      [CANISTER_ID]: prev[CANISTER_ID] - FAUCET_AMOUNT,
      [principalId]: (prev[principalId] || 0) + FAUCET_AMOUNT
    }));
    return { success: true, message: 'Successfully claimed ' + FAUCET_AMOUNT.toLocaleString() + ' WAV tokens!' };
  };

  const transferTokens = (recipientId, amount) => {
    if (!isAuthenticated) return { success: false, message: 'Please authenticate first!' };
    if (!recipientId) return { success: false, message: 'Please enter a recipient ID!' };
    if (amount <= 0) return { success: false, message: 'Amount must be greater than 0!' };
    const sb = balances[principalId] || 0;
    if (sb < amount) return { success: false, message: 'Insufficient funds! You have ' + sb.toLocaleString() + ' WAV.' };
    setBalances(prev => ({
      ...prev,
      [principalId]: prev[principalId] - amount,
      [recipientId]: (prev[recipientId] || 0) + amount
    }));
    return { success: true, message: 'Successfully transferred ' + amount.toLocaleString() + ' WAV!' };
  };

  return (
    <div className="App">
      <div className="ocean-bg">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
        <div className="bubbles">
          {[...Array(25)].map((_, i) => (
            <div key={i} className="bubble" style={{
              left: Math.random() * 100 + '%',
              animationDuration: (4 + Math.random() * 8) + 's',
              animationDelay: (Math.random() * 5) + 's',
              width: (5 + Math.random() * 20) + 'px',
              height: (5 + Math.random() * 20) + 'px',
              opacity: 0.1 + Math.random() * 0.3
            }}></div>
          ))}
        </div>
        <div className="light-rays">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="ray" style={{ left: (10 + i * 20) + '%', animationDelay: (i * 0.5) + 's' }}></div>
          ))}
        </div>
      </div>
      <div className="particles">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: Math.random() * 100 + '%', top: Math.random() * 100 + '%',
            animationDuration: (10 + Math.random() * 20) + 's',
            animationDelay: (Math.random() * 10) + 's',
            width: (2 + Math.random() * 4) + 'px', height: (2 + Math.random() * 4) + 'px'
          }}></div>
        ))}
      </div>
      <Header isAuthenticated={isAuthenticated} principalId={principalId} balance={getBalance(principalId)} onLogout={handleLogout} />
      <main>
        <Hero />
        <Authentication isAuthenticated={isAuthenticated} principalId={principalId} onLogin={handleLogin} onLogout={handleLogout} />
        <Balance isAuthenticated={isAuthenticated} principalId={principalId} getBalance={getBalance} />
        <Faucet isAuthenticated={isAuthenticated} claimFromFaucet={claimFromFaucet} canisterBalance={getBalance(CANISTER_ID)} />
        <Transfer isAuthenticated={isAuthenticated} transferTokens={transferTokens} balance={getBalance(principalId)} />
        <InfoSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
