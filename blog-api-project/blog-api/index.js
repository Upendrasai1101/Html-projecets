// ─────────────────────────────────────────────────────
//  index.js  —  Frontend Server
//  This server runs on port 3000
//  It talks to the Blog API (port 4000) using Axios
//  and renders EJS pages for the user
// ─────────────────────────────────────────────────────

import express from "express";
import axios   from "axios";
import { fileURLToPath } from "url";
import { dirname, join  } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const app     = express();
const PORT    = 3000;

// ── Our Blog API base URL ─────────────────────────────
const API_URL = "http://localhost:4000";

// ── Middleware ────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

// ─────────────────────────────────────────────────────
//  ROUTES
// ─────────────────────────────────────────────────────

// GET / → Fetch all posts from API and show them
app.get("/", async (req, res) => {
  try {
    // Ask our API for all posts
    const response = await axios.get(`${API_URL}/posts`);
    const posts    = response.data;

    res.render("index", { posts: posts, error: null });

  } catch (error) {
    console.log("Error fetching posts:", error.message);
    res.render("index", { posts: [], error: "Could not load posts. Is the API server running?" });
  }
});

// GET /new → Show the form to create a new post
app.get("/new", (req, res) => {
  res.render("modify", {
    heading: "Create New Post",
    post:    null,       // no existing post data needed
    submit:  "Publish",
  });
});

// POST /api/posts → Send new post data to the API
app.post("/api/posts", async (req, res) => {
  try {
    await axios.post(`${API_URL}/posts`, {
      title:   req.body.title,
      content: req.body.content,
      author:  req.body.author,
    });

    res.redirect("/");

  } catch (error) {
    console.log("Error creating post:", error.message);
    res.redirect("/");
  }
});

// GET /edit/:id → Show the edit form with existing post data
app.get("/edit/:id", async (req, res) => {
  try {
    // Fetch the specific post from API
    const response = await axios.get(`${API_URL}/posts/${req.params.id}`);

    res.render("modify", {
      heading: "Edit Post",
      post:    response.data,  // pass existing data to pre-fill the form
      submit:  "Save Changes",
    });

  } catch (error) {
    console.log("Error fetching post:", error.message);
    res.redirect("/");
  }
});

// POST /api/posts/:id → Send updated post data to the API (PATCH)
app.post("/api/posts/:id", async (req, res) => {
  try {
    // PATCH only sends the fields the user filled in
    await axios.patch(`${API_URL}/posts/${req.params.id}`, {
      title:   req.body.title,
      content: req.body.content,
      author:  req.body.author,
    });

    res.redirect("/");

  } catch (error) {
    console.log("Error updating post:", error.message);
    res.redirect("/");
  }
});

// GET /api/posts/delete/:id → Tell API to delete the post
app.get("/api/posts/delete/:id", async (req, res) => {
  try {
    await axios.delete(`${API_URL}/posts/${req.params.id}`);
    res.redirect("/");

  } catch (error) {
    console.log("Error deleting post:", error.message);
    res.redirect("/");
  }
});

// ── Start the Frontend Server ─────────────────────────
app.listen(PORT, () => {
  console.log(`Frontend running on http://localhost:${PORT}`);
});
