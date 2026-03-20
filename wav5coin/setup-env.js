const { execSync } = require("child_process");
const fs = require("fs");

try {
  const canisterId = execSync("dfx canister id wav5coin_backend").toString().trim();
  const envContent = `REACT_APP_CANISTER_ID=${canisterId}\nREACT_APP_IC_HOST=http://127.0.0.1:4943\nSKIP_PREFLIGHT_CHECK=true\nGENERATE_SOURCEMAP=false\n`;
  fs.writeFileSync(".env", envContent);
  console.log("✅ .env created! Canister ID: " + canisterId);
} catch (e) {
  console.error("❌ Error getting canister ID. Make sure dfx deploy succeeded.");
  const fallback = `REACT_APP_CANISTER_ID=\nREACT_APP_IC_HOST=http://127.0.0.1:4943\nSKIP_PREFLIGHT_CHECK=true\nGENERATE_SOURCEMAP=false\n`;
  fs.writeFileSync(".env", fallback);
}
