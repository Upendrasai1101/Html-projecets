import React from 'react';

function InfoSection() {
  const cards = [
    { icon: '🪙', title: 'Tokens vs. Coins', description: 'A coin requires its own blockchain, while a token utilizes an existing blockchain like Ethereum or the Internet Computer.', items: ['Coins: BTC, ETH, ICP', 'Tokens: Shiba Inu, WavCoin', 'Tokens are easier to create', 'Lower barrier to entry'] },
    { icon: '🗄️', title: 'Hashmap Balances', description: 'Token balances are stored using hashmaps mapping Principal IDs to token amounts.', items: ['Key: Principal ID', 'Value: Token count', 'Efficient O(1) lookups', 'Motoko base library'] },
    { icon: '🚰', title: 'Faucet Mechanism', description: 'The faucet distributes tokens using transfer() from the canister treasury.', items: ['Shared keyword for caller ID', 'Transfers from canister balance', 'Prevents supply inflation', '10,000 WAV per claim'] },
    { icon: '📤', title: 'Transfer Function', description: 'Send tokens between accounts with balance verification and async processing.', items: ['Checks sender balance first', 'Deducts from sender', 'Message caller auth', 'Async/await for safety'] },
    { icon: '💾', title: 'Data Persistence', description: 'Non-stable types need pre/postupgrade methods to survive canister upgrades.', items: ['preupgrade(): Save to stable array', 'postupgrade(): Restore from array', 'Stable keyword for simple types', 'Tuples: (Principal, Nat) pairs'] },
    { icon: '🔐', title: 'Internet Identity', description: 'Anonymous blockchain authentication with no passwords or data leaks.', items: ['Unique Principal ID per user', 'No personal data required', 'Device-based verification', 'Multiple identity anchors'] }
  ];

  const useCases = [
    { icon: '🏠', title: 'Asset Representation', desc: 'Tokenize real-world assets like property, art, or commodities on the blockchain.' },
    { icon: '🎮', title: 'Gaming & NFTs', desc: 'In-game currencies, collectibles, and digital ownership verified on-chain.' },
    { icon: '🏦', title: 'DeFi Applications', desc: 'Lending, borrowing, and yield farming with decentralized protocols.' },
    { icon: '🎫', title: 'Access & Governance', desc: 'Gate access to services or vote on protocol decisions with tokens.' }
  ];

  return (
    <section className="info-section section" id="info">
      <div className="section-container">
        <h2 className="section-title">📚 How WavCoin Works</h2>
        <p className="section-subtitle">Dive deep into the technology behind WavCoin</p>
        <div className="divider"></div>
        <div className="info-grid">
          {cards.map((card, i) => (
            <div className="card info-card" key={i}>
              <span className="info-card-icon">{card.icon}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <ul>{card.items.map((item, j) => <li key={j}>{item}</li>)}</ul>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '60px' }}>
          <h2 className="section-title">🌐 Use Cases</h2>
          <p className="section-subtitle">Tokens power the decentralized economy</p>
          <div className="divider"></div>
          <div className="info-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            {useCases.map((item, i) => (
              <div className="card info-card" key={i}>
                <span className="info-card-icon">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default InfoSection;
