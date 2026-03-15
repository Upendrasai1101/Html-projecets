# 🏦 DBank — Decentralized Bank on Internet Computer

A decentralized banking app built on the Internet Computer Protocol (ICP) using Motoko smart contracts.

## Features
- 💰 Deposit funds
- 💸 Withdraw funds
- 📈 Auto compound interest
- 🔗 Blockchain secured

## Setup

### Prerequisites
- DFX SDK installed
- Node.js installed

### Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start local ICP network
dfx start --clean

# 3. Deploy canisters (new terminal)
dfx deploy

# 4. Start frontend
npm start
```

Visit: `http://localhost:8080`

## Tech Stack
- **Motoko** — Smart contract language for ICP
- **DFX** — Internet Computer SDK
- **HTML + CSS + JS** — Frontend
- **Webpack** — Module bundler

## How It Works
1. `main.mo` — Motoko canister handles all balance logic on-chain
2. `index.js` — Frontend calls canister methods via DFINITY agent
3. Interest compounds automatically on every transaction
