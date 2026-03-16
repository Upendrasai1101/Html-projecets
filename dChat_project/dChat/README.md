# 💬 dChat — Decentralized Chat App

A real-time decentralized chat application built on the Internet Computer Protocol (ICP).

## Features
- 💬 Send & receive messages on blockchain
- 👤 Username support
- 🎨 Colorful avatar system
- ⚡ Auto-refresh every 3 seconds
- 🔗 All messages stored on-chain permanently

## Setup

### Prerequisites
- DFX SDK installed
- Node.js installed
- WSL (Windows users)

### Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start local ICP network
dfx start --clean --background

# 3. Deploy canisters
dfx deploy

# 4. Start frontend
npm start
```

Visit: `http://localhost:8080`

## Tech Stack
- **Motoko** — Smart contract (ICP)
- **DFX** — Internet Computer SDK
- **HTML + CSS + JS** — Frontend
- **Webpack** — Module bundler

## How It Works
1. User sets username (saved in localStorage)
2. Messages sent via `sendMessage()` canister call
3. Messages fetched via `getMessages()` query
4. Auto-polls every 3 seconds for new messages
