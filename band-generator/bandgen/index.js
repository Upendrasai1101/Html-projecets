import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// ── Adjectives & Nouns for band name generation ──────────────────────────────
const adjectives = [
  "Cosmic", "Neon", "Velvet", "Savage", "Electric", "Hollow", "Crimson",
  "Frozen", "Mystic", "Silent", "Blazing", "Phantom", "Rusty", "Twisted",
  "Nuclear", "Acid", "Golden", "Broken", "Lunar", "Toxic", "Raging",
  "Ancient", "Burning", "Midnight", "Rotten", "Wicked", "Shattered",
  "Cursed", "Neon", "Volcanic", "Glowing", "Endless", "Feral", "Iron"
];

const nouns = [
  "Wolves", "Thunder", "Prophets", "Machines", "Snakes", "Ghosts",
  "Shadows", "Rebels", "Chaos", "Demons", "Angels", "Wizards", "Foxes",
  "Daggers", "Robots", "Vipers", "Skulls", "Panthers", "Ravens", "Comets",
  "Echoes", "Tornadoes", "Sirens", "Titans", "Phantoms", "Outlaws",
  "Serpents", "Drifters", "Nomads", "Sparks", "Legends", "Crows", "Knives"
];

const prefixes = [
  "The", "DJ", "MC", "Sir", "Lord", "Lady", "Captain", "Doctor", "Professor", ""
];

function generateBandName() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  return prefix ? `${prefix} ${adj} ${noun}` : `${adj} ${noun}`;
}

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

// ── Routes ────────────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.render("index", { bandName: null, generated: false });
});

app.post("/generate", (req, res) => {
  const bandName = generateBandName();
  res.render("index", { bandName, generated: true });
});

app.listen(PORT, () => {
  console.log(`\n🎸 Band Generator running at http://localhost:${PORT}\n`);
});
