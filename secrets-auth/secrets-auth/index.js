import express from "express";
import axios from "axios";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// ── Middleware ────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

// ── In-memory users (no database) ────────────────────
const users = [
  { username: "user1", password: "pass1" },
];

// ── Simple session (no passport, pure express) ────────
let loggedInUser = null;

// ── Routes ────────────────────────────────────────────

// Home
app.get("/", (req, res) => {
  res.render("index", { error: null, user: loggedInUser });
});

// Register
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  const exists = users.find((u) => u.username === username);
  if (exists) {
    return res.render("index", { error: "Username already taken!", user: null });
  }

  users.push({ username, password });
  loggedInUser = username;
  res.redirect("/secrets");
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.render("index", { error: "Wrong username or password!", user: null });
  }

  loggedInUser = username;
  res.redirect("/secrets");
});

// Secrets — protected route + Axios API call
app.get("/secrets", async (req, res) => {
  if (!loggedInUser) {
    return res.redirect("/");
  }

  try {
    // Using Axios to call the Secrets REST API
    const response = await axios.get("https://secrets-api.appbrewery.com/random");
    const secret = response.data;
    res.render("secrets", { user: loggedInUser, secret });
  } catch (error) {
    console.error("API Error:", error.message);
    res.render("secrets", {
      user: loggedInUser,
      secret: {
        secret: "The API is taking a break... but your secrets are safe.",
        username: "anonymous",
        score: 0,
      },
    });
  }
});

// Logout
app.get("/logout", (req, res) => {
  loggedInUser = null;
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
