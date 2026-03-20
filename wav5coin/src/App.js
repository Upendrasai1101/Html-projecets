import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

let connectToIC, getActor, userPrincipal, Principal;
let icLoaded = false;

function App() {
  const [connected, setConnected] = useState(false);
  const [connError, setConnError] = useState("");
  const [principal, setPrincipal] = useState("");
  const [tokenInfo, setTokenInfo] = useState({});
  const [myBalance, setMyBalance] = useState(null);
  const [canBal, setCanBal] = useState(null);
  const [lookupId, setLookupId] = useState("");
  const [lookupRes, setLookupRes] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [faucetMsg, setFaucetMsg] = useState(null);
  const [faucetLoading, setFaucetLoading] = useState(false);
  const [txTo, setTxTo] = useState("");
  const [txAmt, setTxAmt] = useState("");
  const [txMsg, setTxMsg] = useState(null);
  const [txLoading, setTxLoading] = useState(false);

  const loadBalances = useCallback(async () => {
    try {
      const actor = getActor();
      if (!actor) return;
      const [bal, cb] = await Promise.all([
        actor.balanceOf(userPrincipal),
        actor.getCanisterBalance()
      ]);
      setMyBalance(Number(bal));
      setCanBal(Number(cb));
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const icModule = await import("./ic");
        connectToIC = icModule.connectToIC;
        getActor = icModule.getActor;
        userPrincipal = icModule.userPrincipal;
        const principalModule = await import("@dfinity/principal");
        Principal = principalModule.Principal;
        icLoaded = true;

        setPrincipal(userPrincipal.toText());
        await connectToIC();
        setConnected(true);

        const actor = getActor();
        const [name, symbol, supply, fAmt, holders, cb] = await Promise.all([
          actor.getName(), actor.getSymbol(), actor.getTotalSupply(),
          actor.getFaucetAmount(), actor.getHolderCount(), actor.getCanisterBalance()
        ]);
        setTokenInfo({
          name, symbol,
          supply: Number(supply), faucetAmt: Number(fAmt),
          holders: Number(holders)
        });
        setCanBal(Number(cb));

        const bal = await actor.balanceOf(userPrincipal);
        setMyBalance(Number(bal));
      } catch (e) {
        console.error("Connection error:", e);
        setConnError(e.message || "Failed to connect");
      }
    };
    init();
  }, []);

  const handleCheckBalance = async () => {
    setLookupLoading(true);
    setLookupRes(null);
    try {
      const actor = getActor();
      const id = lookupId.trim() ? Principal.fromText(lookupId.trim()) : userPrincipal;
      const bal = await actor.balanceOf(id);
      setLookupRes({ ok: true, val: Number(bal) });
    } catch (e) {
      setLookupRes({ ok: false, val: e.message });
    }
    setLookupLoading(false);
  };

  const handleFaucet = async () => {
    setFaucetLoading(true);
    setFaucetMsg(null);
    try {
      const actor = getActor();
      const result = await actor.payOut();
      setFaucetMsg({ ok: result.startsWith("Success"), text: result });
      await loadBalances();
    } catch (e) {
      setFaucetMsg({ ok: false, text: e.message });
    }
    setFaucetLoading(false);
  };

  const handleTransfer = async () => {
    setTxLoading(true);
    setTxMsg(null);
    try {
      const actor = getActor();
      const to = Principal.fromText(txTo.trim());
      const result = await actor.transfer(to, BigInt(txAmt));
      setTxMsg({ ok: result.startsWith("Success"), text: result });
      if (result.startsWith("Success")) { setTxTo(""); setTxAmt(""); }
      await loadBalances();
    } catch (e) {
      setTxMsg({ ok: false, text: e.message });
    }
    setTxLoading(false);
  };

  return (
    <div className="app">
      <div className="bg"></div>

      <header className="header">
        <div className="logo">🌊 <span>WAV5COIN</span></div>
        <div className="hdr-right">
          <div className={"hdr-badge " + (connected ? "hdr-on" : "hdr-off")}>
            {connected ? "🟢 Blockchain" : "🔴 Offline"}
          </div>
          {connected && myBalance !== null && (
            <div className="hdr-bal">🪙 {myBalance.toLocaleString()} WAV</div>
          )}
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="hero-icon">🌊</div>
          <h1><span className="grad">WAV5COIN</span></h1>
          <p className="hero-sub">Full-Stack Blockchain Token</p>
          <p className="hero-desc">
            React Frontend + Motoko Backend — connected via @dfinity/agent.
            Every button click talks to the REAL Internet Computer blockchain!
          </p>
        </section>

        {/* ERROR */}
        {connError && (
          <section className="card ce">
            <h2>❌ Connection Error</h2>
            <p className="desc">{connError}</p>
            <p className="hint">Make sure dfx is running. Run these commands:</p>
            <p className="pbox" style={{color:"#ff6b6b",borderColor:"rgba(255,100,100,0.2)",background:"rgba(255,50,50,0.05)"}}>
              cd ~/wav5coin && dfx start --clean --background && dfx deploy && node setup-env.js
            </p>
          </section>
        )}

        {/* IDENTITY */}
        <section className="card">
          <h2>🔐 Your Blockchain Identity</h2>
          <p className="desc">Your unique Principal ID — generated by Ed25519 keypair, stored in browser</p>
          <div className="pbox">{principal || "Loading..."}</div>
          {connected && <p className="hint">✅ This identity is connected to the live blockchain canister</p>}
        </section>

        {/* TOKEN INFO */}
        {connected && (
          <section className="card">
            <h2>📋 Token Info — Live from Blockchain</h2>
            <div className="igrid">
              <div className="iitem"><span>Name</span><span className="v">{tokenInfo.name}</span></div>
              <div className="iitem"><span>Symbol</span><span className="v">{tokenInfo.symbol}</span></div>
              <div className="iitem"><span>Total Supply</span><span className="v">{tokenInfo.supply?.toLocaleString()}</span></div>
              <div className="iitem"><span>Faucet</span><span className="v">{tokenInfo.faucetAmt?.toLocaleString()}</span></div>
              <div className="iitem"><span>Holders</span><span className="v">{tokenInfo.holders}</span></div>
              <div className="iitem"><span>Treasury</span><span className="v">{canBal?.toLocaleString()} WAV</span></div>
            </div>
          </section>
        )}

        {/* BALANCE */}
        {connected && (
          <section className="card">
            <h2>💰 Your Balance</h2>
            <div className="bbal">{myBalance !== null ? myBalance.toLocaleString() : "—"}</div>
            <div className="blbl">WAV Tokens</div>

            <h3 style={{marginTop:25,color:"#5a8ab5",fontSize:"0.9rem"}}>🔍 Lookup Any Balance</h3>
            <div className="irow">
              <input placeholder="Principal ID (empty = yours)" value={lookupId}
                onChange={e => setLookupId(e.target.value)} />
              <button onClick={handleCheckBalance} disabled={lookupLoading}>
                {lookupLoading ? <><span className="spin"></span>Checking</> : "🔍 Check"}
              </button>
            </div>
            {lookupRes && (
              <div className={lookupRes.ok ? "res" : "msg mer"}>
                {lookupRes.ok ? lookupRes.val.toLocaleString() + " WAV" : "❌ " + lookupRes.val}
              </div>
            )}
          </section>
        )}

        {/* FAUCET */}
        {connected && (
          <section className="card cg">
            <h2>🚰 Faucet — Claim Free Tokens</h2>
            <p className="desc">Get 10,000 WAV from canister treasury using transfer() — not minting new tokens!</p>
            <div className="famt">10,000 WAV</div>
            <div style={{textAlign:"center"}}>
              <div className="treas">🏦 Treasury: {canBal?.toLocaleString()} WAV</div>
            </div>
            <button className="bbtn" onClick={handleFaucet} disabled={faucetLoading}>
              {faucetLoading ? <><span className="spin"></span>Claiming...</> : "🌊 Claim Tokens"}
            </button>
            {faucetMsg && (
              <div className={"msg " + (faucetMsg.ok ? "mok" : "mer")}>
                {faucetMsg.ok ? "✅" : "❌"} {faucetMsg.text}
              </div>
            )}
          </section>
        )}

        {/* TRANSFER */}
        {connected && (
          <section className="card cb">
            <h2>📤 Transfer Tokens</h2>
            <p className="desc">Send WAV to any Principal ID. Balance checked before transfer.</p>
            <p className="ybal">Your balance: <strong>{myBalance?.toLocaleString() || 0} WAV</strong></p>
            <div className="icol">
              <input placeholder="Recipient Principal ID" value={txTo}
                onChange={e => setTxTo(e.target.value)} />
              <input type="number" placeholder="Amount (WAV)" value={txAmt}
                onChange={e => setTxAmt(e.target.value)} min="1" />
              <button onClick={handleTransfer} disabled={txLoading || !txTo || !txAmt}>
                {txLoading ? <><span className="spin"></span>Sending...</> : "📤 Transfer"}
              </button>
            </div>
            {txMsg && (
              <div className={"msg " + (txMsg.ok ? "mok" : "mer")}>
                {txMsg.ok ? "✅" : "❌"} {txMsg.text}
              </div>
            )}
          </section>
        )}

        {/* CONCEPTS */}
        <section className="card">
          <h2>📚 How This Works</h2>
          <div className="cpts">
            <div className="cpt"><h3>🌊 Frontend</h3><p>React app connected via @dfinity/agent to real blockchain canister</p></div>
            <div className="cpt"><h3>⚙️ Backend</h3><p>Motoko persistent actor with HashMap balances on Internet Computer</p></div>
            <div className="cpt"><h3>🗄️ HashMap</h3><p>Principal → Nat key-value pairs for O(1) balance lookups</p></div>
            <div className="cpt"><h3>🔑 Shared</h3><p>msg.caller identifies who calls each function on blockchain</p></div>
            <div className="cpt"><h3>🚰 Faucet</h3><p>Uses transfer() from canister balance, not minting new tokens</p></div>
            <div className="cpt"><h3>💾 Persistence</h3><p>preupgrade/postupgrade saves HashMap to stable arrays across upgrades</p></div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>🌊 wav5coin — Full-Stack Blockchain Project</p>
        <p>React + Motoko + @dfinity/agent + Internet Computer</p>
      </footer>
    </div>
  );
}

export default App;
