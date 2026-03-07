// ─────────────────────────────────────────────────────
//  Cocktail Finder - index.js
//  API Used  : TheCocktailDB (https://www.thecocktaildb.com/api.php)
//  Libraries : Express, Axios, EJS
// ─────────────────────────────────────────────────────

import express from "express";
import axios from "axios";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const app  = express();
const PORT = 3000;

// ── Base URL for CocktailDB API ───────────────────────
const API_BASE = "https://www.thecocktaildb.com/api/json/v1/1";

// ── Middleware ────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

// ─────────────────────────────────────────────────────
//  HELPER FUNCTION
//  CocktailDB stores ingredients as ingredient1, ingredient2...
//  This function collects them into a clean array
// ─────────────────────────────────────────────────────
function getIngredients(drink) {
  const ingredients = [];

  // Loop through all 15 possible ingredient slots
  for (let i = 1; i <= 15; i++) {
    const ingredient = drink[`strIngredient${i}`];
    const measure    = drink[`strMeasure${i}`];

    // Stop if ingredient slot is empty
    if (!ingredient) break;

    ingredients.push({
      name:    ingredient,
      measure: measure ? measure.trim() : "As needed",
    });
  }

  return ingredients;
}

// ─────────────────────────────────────────────────────
//  ROUTES
// ─────────────────────────────────────────────────────

// GET / → Home page with a random cocktail on load
app.get("/", async (req, res) => {
  try {
    // Call API to get a random cocktail
    const response = await axios.get(`${API_BASE}/random.php`);
    const drink    = response.data.drinks[0];

    // Build clean ingredients list using helper function
    const ingredients = getIngredients(drink);

    res.render("index", {
      drink:       drink,
      ingredients: ingredients,
      searchQuery: "",
      error:       null,
    });

  } catch (error) {
    console.log("API Error on home:", error.message);

    res.render("index", {
      drink:       null,
      ingredients: [],
      searchQuery: "",
      error:       "Could not load cocktail. Please try again.",
    });
  }
});

// GET /search → Search cocktail by name
app.get("/search", async (req, res) => {
  const query = req.query.name;

  // If user submitted empty search, go back home
  if (!query || query.trim() === "") {
    return res.redirect("/");
  }

  try {
    // Call API to search by cocktail name
    const response = await axios.get(`${API_BASE}/search.php?s=${query}`);
    const drinks   = response.data.drinks;

    // API returns null if nothing is found
    if (!drinks) {
      return res.render("index", {
        drink:       null,
        ingredients: [],
        searchQuery: query,
        error:       `No cocktail found for "${query}". Try another name!`,
      });
    }

    // Show the first result
    const drink      = drinks[0];
    const ingredients = getIngredients(drink);

    res.render("index", {
      drink:       drink,
      ingredients: ingredients,
      searchQuery: query,
      error:       null,
    });

  } catch (error) {
    console.log("API Error on search:", error.message);

    res.render("index", {
      drink:       null,
      ingredients: [],
      searchQuery: query,
      error:       "Something went wrong. Please try again.",
    });
  }
});

// GET /random → Fetch a new random cocktail
app.get("/random", async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/random.php`);
    const drink    = response.data.drinks[0];
    const ingredients = getIngredients(drink);

    res.render("index", {
      drink:       drink,
      ingredients: ingredients,
      searchQuery: "",
      error:       null,
    });

  } catch (error) {
    console.log("API Error on random:", error.message);
    res.redirect("/");
  }
});

// ── Start Server ──────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
