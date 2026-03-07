// Track generated names in session and update the chips grid
const grid = document.getElementById("examplesGrid");
const bandNameEl = document.getElementById("bandName");

// Store history in sessionStorage
let history = JSON.parse(sessionStorage.getItem("bandHistory") || "[]");

// If a new band name was just generated, add it
if (bandNameEl) {
  const newName = bandNameEl.textContent.trim();
  if (newName && !history.includes(newName)) {
    history.unshift(newName);
    if (history.length > 8) history = history.slice(0, 8);
    sessionStorage.setItem("bandHistory", JSON.stringify(history));
  }
}

// Render history chips
if (grid && history.length > 0) {
  grid.innerHTML = history
    .map(name => `<div class="ex-chip">${name}</div>`)
    .join("");
}

// Button click effect
const btn = document.getElementById("genBtn");
if (btn) {
  btn.addEventListener("click", () => {
    btn.style.transform = "scale(0.96)";
    setTimeout(() => btn.style.transform = "", 150);
  });
}
