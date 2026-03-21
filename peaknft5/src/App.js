import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

let connectToIC, getActor, userPrincipal;

const GRADIENTS = ["ng1","ng2","ng3","ng4","ng5","ng6"];
const EMOJIS = ["🏔️","🌄","❄️","🦅","🌲","🏞️","⛰️","🌋","🗻","🌅"];

const saveImage = (nftId, imageData) => { try { localStorage.setItem("nft_img_" + nftId, imageData); } catch(e) {} };
const getImage = (nftId) => { try { return localStorage.getItem("nft_img_" + nftId); } catch(e) { return null; } };

function App() {
  const [connected, setConnected] = useState(false);
  const [connError, setConnError] = useState("");
  const [principal, setPrincipal] = useState("");
  const [page, setPage] = useState("home");
  const [totalMinted, setTotalMinted] = useState(0);
  const [totalListings, setTotalListings] = useState(0);
  const [wavBalance, setWavBalance] = useState(0);

  const [mintName, setMintName] = useState("");
  const [mintImage, setMintImage] = useState(null);
  const [mintMsg, setMintMsg] = useState(null);
  const [mintLoading, setMintLoading] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [mintedNft, setMintedNft] = useState(null);

  const [myNfts, setMyNfts] = useState([]);
  const [colLoading, setColLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [discLoading, setDiscLoading] = useState(false);
  const [sellPrices, setSellPrices] = useState({});
  const [sellMsgs, setSellMsgs] = useState({});
  const [showSellInput, setShowSellInput] = useState({});
  const [buyMsgs, setBuyMsgs] = useState({});
  const [buyLoading, setBuyLoading] = useState({});
  const [detailId, setDetailId] = useState("");
  const [detailResult, setDetailResult] = useState("");
  const [detailLoading, setDetailLoading] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      const actor = getActor();
      if (!actor) return;
      const [m, l] = await Promise.all([actor.getTotalMinted(), actor.getTotalListings()]);
      setTotalMinted(Number(m));
      setTotalListings(Number(l));
    } catch (e) {}
  }, []);

  const loadWavBalance = useCallback(async () => {
    try {
      const actor = getActor();
      if (!actor) return;
      const balance = await actor.getWalletBalance();
      setWavBalance(Number(balance));
    } catch (e) {}
  }, []);

  const loadMyNFTs = useCallback(async () => {
    setColLoading(true);
    try {
      const actor = getActor();
      const ids = await actor.getUserNFTs(userPrincipal);
      const nfts = [];
      for (const id of ids) {
        const name = await actor.getNFTName(id);
        const price = await actor.getPrice(id);
        nfts.push({
          id,
          name: name.length > 0 ? name[0] : id,
          listed: price.length > 0,
          price: price.length > 0 ? Number(price[0]) : 0,
          image: getImage(id),
          gradient: GRADIENTS[nfts.length % GRADIENTS.length],
          emoji: EMOJIS[nfts.length % EMOJIS.length]
        });
      }
      setMyNfts(nfts);
    } catch (e) { console.error(e); }
    setColLoading(false);
  }, []);

  const loadListings = useCallback(async () => {
    setDiscLoading(true);
    try {
      const actor = getActor();
      const list = await actor.getListings();
      const items = [];
      for (const [id, price] of list) {
        const name = await actor.getNFTName(id);
        const creator = await actor.getCreator(id);
        items.push({
          id,
          name: name.length > 0 ? name[0] : id,
          price: Number(price),
          creator: creator.length > 0 ? creator[0].toText().slice(0, 15) + "..." : "Unknown",
          image: getImage(id),
          gradient: GRADIENTS[items.length % GRADIENTS.length],
          emoji: EMOJIS[items.length % EMOJIS.length]
        });
      }
      setListings(items);
    } catch (e) { console.error(e); }
    setDiscLoading(false);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const icMod = await import("./ic");
        connectToIC = icMod.connectToIC;
        getActor = icMod.getActor;
        userPrincipal = icMod.userPrincipal;
        setPrincipal(userPrincipal.toText());
        await connectToIC();
        setConnected(true);
        // Load everything on connect
        await loadWavBalance();
        await loadStats();
        await loadMyNFTs(); // Auto load collection!
      } catch (e) {
        setConnError(e.message || "Failed to connect");
      }
    };
    init();
  }, [loadStats, loadWavBalance, loadMyNFTs]);

  useEffect(() => {
    if (!connected) return;
    if (page === "collection") loadMyNFTs();
    if (page === "discover") loadListings();
  }, [page, connected, loadMyNFTs, loadListings]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setMintMsg({ ok: false, text: "Image too large! Max 2MB." }); return; }
    const reader = new FileReader();
    reader.onloadend = () => setMintImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleMint = async () => {
    if (!mintName.trim()) return;
    if (!mintImage) { setMintMsg({ ok: false, text: "Please upload an image!" }); return; }
    setMintLoading(true); setMintMsg(null); setMintSuccess(false);
    try {
      const actor = getActor();
      const result = await actor.mint(mintName.trim());
      const isOk = result.startsWith("Success");
      setMintMsg({ ok: isOk, text: result });
      if (isOk) {
        const idMatch = result.match(/ID: (nft-\d+)/);
        const nftId = idMatch ? idMatch[1] : null;
        if (nftId && mintImage) saveImage(nftId, mintImage);
        setMintedNft({ id: nftId, name: mintName.trim(), image: mintImage });
        setMintSuccess(true);
        await loadStats();
        await loadMyNFTs();
      }
    } catch (e) { setMintMsg({ ok: false, text: e.message }); }
    setMintLoading(false);
  };

  const resetMint = () => { setMintName(""); setMintImage(null); setMintMsg(null); setMintSuccess(false); setMintedNft(null); };

  const handleSell = async (nftId) => {
    const price = sellPrices[nftId];
    if (!price || Number(price) <= 0) { setSellMsgs(p => ({...p, [nftId]: {ok:false,text:"Enter valid price!"}})); return; }
    try {
      const actor = getActor();
      const result = await actor.listForSale(nftId, BigInt(price));
      setSellMsgs(p => ({...p, [nftId]: {ok: result.startsWith("Success"), text: result}}));
      setSellPrices(p => ({...p, [nftId]: ""}));
      setShowSellInput(p => ({...p, [nftId]: false}));
      await loadMyNFTs(); await loadStats();
    } catch (e) { setSellMsgs(p => ({...p, [nftId]: {ok:false,text:e.message}})); }
  };

  const handleUnlist = async (nftId) => {
    try {
      const actor = getActor();
      const result = await actor.unlist(nftId);
      setSellMsgs(p => ({...p, [nftId]: {ok: result.startsWith("Success"), text: result}}));
      await loadMyNFTs(); await loadStats();
    } catch (e) { setSellMsgs(p => ({...p, [nftId]: {ok:false,text:e.message}})); }
  };

  const handleBuy = async (nftId) => {
    setBuyLoading(p => ({...p, [nftId]: true}));
    try {
      const actor = getActor();
      const result = await actor.buy(nftId);
      setBuyMsgs(p => ({...p, [nftId]: {ok: result.startsWith("Success"), text: result}}));
      if (result.startsWith("Success")) { await loadWavBalance(); await loadListings(); await loadStats(); }
    } catch (e) { setBuyMsgs(p => ({...p, [nftId]: {ok:false,text:e.message}})); }
    setBuyLoading(p => ({...p, [nftId]: false}));
  };

  const handleDetail = async () => {
    if (!detailId.trim()) return;
    setDetailLoading(true);
    try {
      const actor = getActor();
      const result = await actor.getNFTDetails(detailId.trim());
      setDetailResult(result);
    } catch (e) { setDetailResult("Error: " + e.message); }
    setDetailLoading(false);
  };

  const NFTCard = ({ nft, mode }) => (
    <div className="ncard">
      <div className={"nimg " + (!nft.image ? nft.gradient : "")}
        style={nft.image ? {backgroundImage:"url("+nft.image+")",backgroundSize:"cover",backgroundPosition:"center"} : {}}>
        {!nft.image && nft.emoji}
        {nft.listed && mode === "collection" && <div className="ntag">{nft.price} WAV</div>}
        {mode === "discover" && <div className="ntag">{nft.price} WAV</div>}
      </div>
      <div className="ninfo">
        <div className="nname">{nft.name}</div>
        {mode === "discover" && <div className="ncr">by {nft.creator}</div>}
        <div className="nid">{nft.id}</div>
        {mode === "collection" && (
          <div className="nacts">
            {nft.listed ? (
              <>
                <span style={{color:"#10b981",fontSize:"0.75rem"}}>{nft.price} WAV</span>
                <button onClick={() => handleUnlist(nft.id)} style={{fontSize:"0.7rem",padding:"5px 10px",background:"rgba(239,68,68,0.2)",border:"1px solid rgba(239,68,68,0.3)",color:"#f87171"}}>❌ Unlist</button>
              </>
            ) : !showSellInput[nft.id] ? (
              <button onClick={() => setShowSellInput(p => ({...p, [nft.id]: true}))} style={{fontSize:"0.7rem",padding:"5px 12px"}}>💰 Sell</button>
            ) : (
              <div style={{display:"flex",gap:"5px",width:"100%",flexWrap:"wrap"}}>
                <input placeholder="Price" value={sellPrices[nft.id]||""} onChange={e => setSellPrices(p=>({...p,[nft.id]:e.target.value}))} type="number" min="1" style={{width:"70px"}} />
                <button className="bgr" onClick={() => handleSell(nft.id)} style={{fontSize:"0.7rem",padding:"5px 10px"}}>✅</button>
                <button onClick={() => setShowSellInput(p=>({...p,[nft.id]:false}))} style={{fontSize:"0.7rem",padding:"5px 10px",background:"transparent",border:"1px solid rgba(255,255,255,0.15)",color:"#94a3b8"}}>✕</button>
              </div>
            )}
          </div>
        )}
        {mode === "discover" && (
          <div className="nacts">
            <button className="bgr" onClick={() => handleBuy(nft.id)} disabled={buyLoading[nft.id]} style={{fontSize:"0.75rem",padding:"6px 14px"}}>
              {buyLoading[nft.id] ? <><span className="spin"></span>Buying...</> : "🛒 Buy "+nft.price+" WAV"}
            </button>
          </div>
        )}
        {mode === "collection" && sellMsgs[nft.id] && <div className={"msg "+(sellMsgs[nft.id].ok?"mok":"mer")} style={{fontSize:"0.7rem",padding:"5px 8px",marginTop:5}}>{sellMsgs[nft.id].text}</div>}
        {mode === "discover" && buyMsgs[nft.id] && <div className={"msg "+(buyMsgs[nft.id].ok?"mok":"mer")} style={{fontSize:"0.7rem",padding:"5px 8px",marginTop:5}}>{buyMsgs[nft.id].text}</div>}
      </div>
    </div>
  );

  return (
    <div className="app">
      <div className="bg"></div>
      <header className="header">
        <div className="logo">🏔️ <span>PEAKNFT5</span></div>
        <div className="hr">
          <div className={"hb "+(connected?"hon":"hoff")}>{connected?"🟢 Blockchain":"🔴 Offline"}</div>
          {connected && <div className="hn">💰 {wavBalance.toLocaleString()} WAV</div>}
          {connected && <div className="hn">🎨 {totalMinted} NFTs</div>}
        </div>
      </header>

      <div className="nav-tabs">
        {["home","mint","collection","discover","details"].map(p => (
          <div key={p} className={"nav-tab"+(page===p?" nav-active":"")} onClick={() => setPage(p)}>
            {p==="home"?"🏠 Home":p==="mint"?"🎨 Mint":p==="collection"?"🖼️ Collection":p==="discover"?"🔍 Discover":"🔎 Details"}
          </div>
        ))}
      </div>

      <main>
        {connError && <section className="card cred"><h2>❌ Error</h2><p className="desc">{connError}</p></section>}

        {/* HOME */}
        {page==="home" && <>
          <section className="card">
            <h2>🔐 Your Identity</h2>
            <div className="pbox">{principal||"Loading..."}</div>
            {connected && <p className="hint">✅ Connected to blockchain</p>}
          </section>
          <section className="card">
            <h2>📊 Stats</h2>
            <div className="stats-row">
              <div className="stat-box"><span className="stat-num">{wavBalance.toLocaleString()}</span><span className="stat-lbl">WAV Balance</span></div>
              <div className="stat-box"><span className="stat-num">{myNfts.length}</span><span className="stat-lbl">My NFTs</span></div>
              <div className="stat-box"><span className="stat-num">{totalListings}</span><span className="stat-lbl">For Sale</span></div>
            </div>
          </section>
          <section className="card">
            <h2>📚 How It Works</h2>
            <div className="cpts">
              <div className="cpt"><h3>🎨 Mint</h3><p>Upload image + name → unique NFT on blockchain</p></div>
              <div className="cpt"><h3>💰 List</h3><p>Set price → list on marketplace</p></div>
              <div className="cpt"><h3>🛒 Buy</h3><p>Buy NFTs using WAV coins</p></div>
              <div className="cpt"><h3>🖼️ Collect</h3><p>View + manage your NFTs</p></div>
              <div className="cpt"><h3>💎 WAV</h3><p>100K WAV given on first connect!</p></div>
              <div className="cpt"><h3>💾 Persist</h3><p>Data survives blockchain upgrades</p></div>
            </div>
          </section>
        </>}

        {/* MINT */}
        {page==="mint" && <section className="card cpur">
          <h2>🎨 Mint New NFT</h2>
          <p className="desc">Upload image + name → create on blockchain</p>
          {!connected ? <p className="desc">⚠️ Connect first</p>
          : mintLoading ? <div className="mint-loader"><div className="loader-spin"></div><p style={{color:"#8b5cf6"}}>Minting on blockchain...</p></div>
          : mintSuccess && mintedNft ? <div className="mint-done">
              <div style={{fontSize:"3rem"}}>🎉</div>
              <h3 style={{color:"#10b981",margin:"10px 0"}}>Minted!</h3>
              {mintedNft.image && <img src={mintedNft.image} alt={mintedNft.name} className="mint-preview" />}
              <p style={{color:"#475569",fontSize:"0.72rem",fontFamily:"'Orbitron',monospace"}}>{mintedNft.id}</p>
              <div style={{display:"flex",gap:10,justifyContent:"center",marginTop:15}}>
                <button className="bgr" onClick={() => setPage("collection")}>🖼️ Collection</button>
                <button onClick={resetMint} style={{background:"transparent",border:"1px solid rgba(245,158,11,0.3)",color:"#f59e0b"}}>🎨 Mint More</button>
              </div>
            </div>
          : <>
              <div className={"upload-area"+(mintImage?" has-img":"")} onClick={() => document.getElementById('nft-upload').click()}>
                {mintImage ? <><img src={mintImage} alt="Preview" className="upload-preview" /><p className="upload-change">✅ Click to change</p></>
                : <><div className="upload-icon">📁</div><p className="upload-text">Click to upload</p><p className="upload-hint">Max 2MB</p></>}
                <input id="nft-upload" type="file" accept="image/*" style={{display:"none"}} onChange={handleImageUpload} />
              </div>
              <div className="icol">
                <input placeholder="NFT Name" value={mintName} onChange={e => setMintName(e.target.value)} />
                <button className="bpu bful" onClick={handleMint} disabled={!mintName.trim()||!mintImage}>🎨 Mint NFT</button>
              </div>
              {mintMsg && <div className={"msg "+(mintMsg.ok?"mok":"mer")}>{mintMsg.ok?"✅":"❌"} {mintMsg.text}</div>}
            </>}
        </section>}

        {/* COLLECTION */}
        {page==="collection" && <section className="card">
          <h2>🖼️ My Collection ({myNfts.length})</h2>
          <p className="desc">Your NFTs — including 5 default NFTs!</p>
          {colLoading ? <div className="empty"><span className="spin"></span> Loading...</div>
          : myNfts.length===0 ? <div className="empty"><div className="empty-icon">🏔️</div><p>No NFTs!</p><button onClick={() => setPage("mint")} style={{marginTop:12}}>🎨 Mint</button></div>
          : <div className="nfts">{myNfts.map(nft => <NFTCard key={nft.id} nft={nft} mode="collection" />)}</div>}
          {connected && <button onClick={loadMyNFTs} style={{marginTop:15}} disabled={colLoading}>🔄 Refresh</button>}
        </section>}

        {/* DISCOVER */}
        {page==="discover" && <section className="card cgld">
          <h2>🔍 Discover ({listings.length})</h2>
          <p className="desc">Buy NFTs using WAV coins!</p>
          {discLoading ? <div className="empty"><span className="spin"></span> Loading...</div>
          : listings.length===0 ? <div className="empty"><div className="empty-icon">🏔️</div><p>None listed!</p></div>
          : <div className="nfts">{listings.map(nft => <NFTCard key={nft.id} nft={nft} mode="discover" />)}</div>}
          {connected && <button onClick={loadListings} style={{marginTop:15}} disabled={discLoading}>🔄 Refresh</button>}
        </section>}

        {/* DETAILS */}
        {page==="details" && <section className="card">
          <h2>🔎 NFT Details</h2>
          <div className="irow">
            <input placeholder="nft-1" value={detailId} onChange={e => setDetailId(e.target.value)} />
            <button onClick={handleDetail} disabled={detailLoading||!detailId.trim()}>🔎 Lookup</button>
          </div>
          {detailResult && <div className="pbox" style={{color:detailResult.startsWith("Error")?"#f87171":"#10b981",fontSize:"0.75rem",whiteSpace:"pre-wrap"}}>{detailResult}</div>}
        </section>}
      </main>

      <footer className="footer">
        <p>🏔️ PeakNFT5 — NFT Marketplace on Internet Computer</p>
      </footer>
    </div>
  );
}

export default App;
