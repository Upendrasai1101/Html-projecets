// ============================================================
// DBANK — index.js
// Frontend JS — connects to Motoko canister on ICP
// ============================================================

import { dbank } from "../../declarations/dbank";

// ── Set current year in footer ────────────────────────────────
document.getElementById("year").textContent = new Date().getFullYear();

// ── Helper: Update balance display ───────────────────────────
async function updateBalance() {
  const balance = await dbank.checkBalance();
  document.getElementById("balance").innerHTML =
    `<span>$${balance.toFixed(2)}</span>`;
}

// ── Helper: Show status message ───────────────────────────────
function showStatus(message, type = "success") {
  const statusEl = document.getElementById("status-msg");
  statusEl.textContent = message;
  statusEl.className   = `status-msg status-msg--${type} status-msg--visible`;
  // Auto hide after 3 seconds
  setTimeout(() => {
    statusEl.className = "status-msg";
  }, 3000);
}

// ── Helper: Set loading state on button ──────────────────────
function setLoading(btnEl, loading) {
  btnEl.disabled     = loading;
  btnEl.textContent  = loading ? "Processing..." : btnEl.dataset.label;
}

// ── Initialize app on page load ───────────────────────────────
window.addEventListener("load", async () => {
  // Compound interest on load
  await dbank.compound();
  // Fetch and display balance
  await updateBalance();
});

// ── Deposit Form ──────────────────────────────────────────────
const depositForm = document.getElementById("deposit-form");
const depositBtn  = depositForm.querySelector("button");
depositBtn.dataset.label = "Deposit";

depositForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const amount = parseFloat(document.getElementById("input-amount").value);

  if (!amount || amount <= 0) {
    showStatus("Please enter a valid amount!", "error");
    return;
  }

  setLoading(depositBtn, true);

  try {
    await dbank.topUp(amount);           // call Motoko canister
    await dbank.compound();              // compound interest
    await updateBalance();               // refresh balance
    document.getElementById("input-amount").value = "";
    showStatus(`Successfully deposited $${amount.toFixed(2)}! 💰`, "success");
  } catch (err) {
    showStatus("Deposit failed. Try again!", "error");
    console.error(err);
  } finally {
    setLoading(depositBtn, false);
  }
});

// ── Withdraw Form ─────────────────────────────────────────────
const withdrawForm = document.getElementById("withdraw-form");
const withdrawBtn  = withdrawForm.querySelector("button");
withdrawBtn.dataset.label = "Withdraw";

withdrawForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const amount = parseFloat(document.getElementById("withdraw-amount").value);

  if (!amount || amount <= 0) {
    showStatus("Please enter a valid amount!", "error");
    return;
  }

  setLoading(withdrawBtn, true);

  try {
    await dbank.withdraw(amount);        // call Motoko canister
    await dbank.compound();              // compound interest
    await updateBalance();               // refresh balance
    document.getElementById("withdraw-amount").value = "";
    showStatus(`Successfully withdrew $${amount.toFixed(2)}! 💸`, "success");
  } catch (err) {
    showStatus("Withdrawal failed. Insufficient funds?", "error");
    console.error(err);
  } finally {
    setLoading(withdrawBtn, false);
  }
});
