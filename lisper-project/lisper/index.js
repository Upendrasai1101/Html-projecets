import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import axios from "axios";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const saltRounds = 10;

// In-memory user store (no DB needed for demo)
const users = [];

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "lisper-secret-key-2024",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const user = users.find((u) => u.email === email);
      if (!user) return done(null, false, { message: "User not found." });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return done(null, false, { message: "Incorrect password." });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => done(null, user.email));
passport.deserializeUser((email, done) => {
  const user = users.find((u) => u.email === email);
  done(null, user || false);
});

// Auth middleware
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

// ─── ROUTES ───────────────────────────────────────────────────────────────────

// Home
app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

// Register
app.get("/register", (req, res) => {
  res.render("register", { error: null });
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.render("register", { error: "Email and password are required." });

  if (users.find((u) => u.email === email))
    return res.render("register", { error: "Email already registered." });

  try {
    const hashed = await bcrypt.hash(password, saltRounds);
    const newUser = { email, password: hashed };
    users.push(newUser);

    req.login(newUser, (err) => {
      if (err) return res.render("register", { error: "Login failed after register." });
      res.redirect("/secrets");
    });
  } catch (err) {
    res.render("register", { error: "Something went wrong. Try again." });
  }
});

// Login
app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.render("login", { error: info?.message || "Login failed." });
    req.login(user, (err) => {
      if (err) return next(err);
      res.redirect("/secrets");
    });
  })(req, res, next);
});

// Logout
app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

// Secrets (protected)
app.get("/secrets", isAuthenticated, async (req, res) => {
  try {
    const response = await axios.get("https://secrets-api.appbrewery.com/random");
    const secret = response.data;
    res.render("secrets", { user: req.user, secret });
  } catch (err) {
    res.render("secrets", {
      user: req.user,
      secret: {
        secret: "Even the shadows have stories they dare not speak aloud.",
        username: "anonymous",
        score: 9.5,
      },
    });
  }
});

// API: get new secret (AJAX)
app.get("/api/new-secret", isAuthenticated, async (req, res) => {
  try {
    const response = await axios.get("https://secrets-api.appbrewery.com/random");
    res.json(response.data);
  } catch (err) {
    res.json({
      secret: "The quietest rooms hold the loudest confessions.",
      username: "ghost",
      score: 8.7,
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n🤫 Lisper running at http://localhost:${PORT}\n`);
});
