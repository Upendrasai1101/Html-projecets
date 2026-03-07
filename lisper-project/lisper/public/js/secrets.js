// Cached secrets for the grid
const cachedSecrets = [];

async function loadNewSecret() {
  const btn = document.getElementById("revealBtn");
  const textEl = document.getElementById("secretText");
  const authorEl = document.getElementById("secretAuthor");
  const scoreEl = document.getElementById("secretScore");

  btn.classList.add("loading");
  btn.disabled = true;

  // Fade out
  textEl.style.opacity = "0";

  try {
    const res = await fetch("/api/new-secret");
    const data = await res.json();

    await sleep(350);

    textEl.textContent = `"${data.secret}"`;
    authorEl.textContent = data.username || "anonymous";
    scoreEl.textContent = data.score ? data.score.toFixed(1) : "—";

    // Fade in
    textEl.style.opacity = "1";

    // Add to grid
    addToGrid(data);
  } catch (err) {
    console.error("Failed to load secret:", err);
    textEl.textContent = `"Even the API keeps secrets sometimes."`;
    textEl.style.opacity = "1";
  }

  btn.classList.remove("loading");
  btn.disabled = false;
}

function addToGrid(secret) {
  cachedSecrets.unshift(secret);
  if (cachedSecrets.length > 9) cachedSecrets.pop();
  renderGrid();
}

function renderGrid() {
  const grid = document.getElementById("secretsGrid");
  grid.innerHTML = "";

  cachedSecrets.forEach((s, i) => {
    const card = document.createElement("div");
    card.className = "grid-secret-card";
    card.style.animationDelay = `${i * 0.05}s`;
    card.innerHTML = `
      <p>"${escapeHtml(s.secret)}"</p>
      <div class="card-meta">
        <span>— ${escapeHtml(s.username || "anonymous")}</span>
        <span class="card-score">★ ${s.score ? s.score.toFixed(1) : "—"}</span>
      </div>
    `;
    card.addEventListener("click", () => displaySecret(s));
    grid.appendChild(card);
  });
}

function displaySecret(s) {
  const textEl = document.getElementById("secretText");
  const authorEl = document.getElementById("secretAuthor");
  const scoreEl = document.getElementById("secretScore");

  textEl.style.opacity = "0";
  setTimeout(() => {
    textEl.textContent = `"${s.secret}"`;
    authorEl.textContent = s.username || "anonymous";
    scoreEl.textContent = s.score ? s.score.toFixed(1) : "—";
    textEl.style.opacity = "1";
  }, 250);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// Auto-load some secrets for the grid on page load
(async function preloadGrid() {
  const count = 6;
  for (let i = 0; i < count; i++) {
    try {
      const res = await fetch("/api/new-secret");
      const data = await res.json();
      cachedSecrets.push(data);
    } catch (_) {}
    await sleep(100);
  }
  renderGrid();
})();
