import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// In-memory posts store
let posts = [
  {
    id: 1,
    title: "Welcome to My Blog",
    content: "This is your first blog post! You can edit or delete it, and create new ones using the button above. Enjoy writing!",
    author: "Admin",
    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    tag: "General",
  },
];
let nextId = 2;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

// ── ROUTES ────────────────────────────────────────────────────────────────────

// Home — view all posts
app.get("/", (req, res) => {
  res.render("index", { posts });
});

// New post form
app.get("/new", (req, res) => {
  res.render("new", { error: null });
});

// Create post
app.post("/posts", (req, res) => {
  const { title, content, author, tag } = req.body;
  if (!title || !content) return res.render("new", { error: "Title and content are required." });

  posts.unshift({
    id: nextId++,
    title: title.trim(),
    content: content.trim(),
    author: author?.trim() || "Anonymous",
    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    tag: tag?.trim() || "General",
  });

  res.redirect("/");
});

// View single post
app.get("/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) return res.redirect("/");
  res.render("post", { post });
});

// Edit form
app.get("/posts/:id/edit", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) return res.redirect("/");
  res.render("edit", { post, error: null });
});

// Update post
app.post("/posts/:id/update", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) return res.redirect("/");

  const { title, content, author, tag } = req.body;
  if (!title || !content) return res.render("edit", { post, error: "Title and content are required." });

  post.title = title.trim();
  post.content = content.trim();
  post.author = author?.trim() || post.author;
  post.tag = tag?.trim() || post.tag;
  post.edited = true;

  res.redirect("/");
});

// Delete post
app.post("/posts/:id/delete", (req, res) => {
  posts = posts.filter((p) => p.id !== parseInt(req.params.id));
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`\n📝 Blog App running at http://localhost:${PORT}\n`);
});
