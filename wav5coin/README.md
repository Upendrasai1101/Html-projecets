cd ~/wav5coin

# Clean old data
rm -rf .dfx

# Start local replica
dfx start --clean --background

# Wait
sleep 10

# Deploy
dfx deploy

# Create .env
node setup-env.js

# Start website
npm start
# Open new terminal tab and test
dfx canister call wav5coin_backend getName
dfx canister call wav5coin_backend payOut
dfx canister call wav5coin_backend balanceOf "(principal \"$(dfx identity get-principal)\")"
dfx canister call wav5coin_backend getAllBalances