const { execSync } = require("child_process");
const fs = require("fs");
try {
  const id = execSync("dfx canister id peaknft5_backend").toString().trim();
  fs.writeFileSync(".env", "REACT_APP_CANISTER_ID=" + id + "\nREACT_APP_IC_HOST=http://127.0.0.1:4943\nSKIP_PREFLIGHT_CHECK=true\nGENERATE_SOURCEMAP=false\n");
  console.log("✅ .env created! Canister ID: " + id);
} catch (e) {
  console.error("❌ Error. Make sure dfx deploy succeeded.");
  fs.writeFileSync(".env", "REACT_APP_CANISTER_ID=\nREACT_APP_IC_HOST=http://127.0.0.1:4943\nSKIP_PREFLIGHT_CHECK=true\nGENERATE_SOURCEMAP=false\n");
}
