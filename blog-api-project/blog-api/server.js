// ─────────────────────────────────────────────────────
//  server.js  —  Blog API
//  This is the BACK-END API server (runs on port 4000)
//  It stores blog posts in memory and handles:
//    GET    /posts        → get all posts
//    GET    /posts/:id    → get one post
//    POST   /posts        → create a new post
//    PATCH  /posts/:id    → update part of a post
//    DELETE /posts/:id    → delete a post
// ─────────────────────────────────────────────────────

import express from "express";

const app  = express();
const PORT = 4000;

// ── Middleware ────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────────────────
//  IN-MEMORY DATA STORE
//  No database — posts are stored in this array
//  Data resets when server restarts
// ─────────────────────────────────────────────────────
let posts = [
  {
    id:      1,
    title:   "10 Things You Should Know About Node.js",
    content: "Node.js is a powerful runtime built on Chrome's V8 engine. It allows developers to use JavaScript on the server side, making full-stack development seamless and efficient.",
    author:  "John Smith",
    date:    "2024-01-10",
  },
  {
    id:      2,
    title:   "Why Express.js is the Best Framework",
    content: "Express.js is minimal and flexible. It provides a robust set of features for web and mobile apps, making it the most popular Node.js framework out there.",
    author:  "Jane Doe",
    date:    "2024-02-15",
  },
  {
    id:      3,
    title:   "Getting Started with RESTful APIs",
    content: "REST APIs use HTTP methods like GET, POST, PATCH, and DELETE to perform CRUD operations. They are the backbone of modern web development.",
    author:  "Bob Wilson",
    date:    "2024-03-05",
  },
];

// ── Track the next ID to assign ───────────────────────
let nextId = 4;

// ─────────────────────────────────────────────────────
//  ROUTES
// ─────────────────────────────────────────────────────

// GET /posts → Return ALL posts
app.get("/posts", (req, res) => {
  res.json(posts);
});

// GET /posts/:id → Return ONE post by ID
app.get("/posts/:id", (req, res) => {
  const id   = parseInt(req.params.id);
  const post = posts.find((p) => p.id === id);

  // If post not found, send 404
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  res.json(post);
});

// POST /posts → Create a NEW post
app.post("/posts", (req, res) => {
  const { title, content, author } = req.body;

  // Build the new post object
  const newPost = {
    id:      nextId++,
    title:   title,
    content: content,
    author:  author || "Anonymous",
    date:    new Date().toISOString().split("T")[0], // e.g. 2024-03-08
  };

  // Add to our posts array
  posts.push(newPost);

  // Return the new post with 201 Created status
  res.status(201).json(newPost);
});

// PATCH /posts/:id → Update PART of an existing post
app.patch("/posts/:id", (req, res) => {
  const id   = parseInt(req.params.id);
  const post = posts.find((p) => p.id === id);

  // If post not found, send 404
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  // Only update the fields that were sent in the request
  // If a field is not sent, keep the existing value
  if (req.body.title)   post.title   = req.body.title;
  if (req.body.content) post.content = req.body.content;
  if (req.body.author)  post.author  = req.body.author;

  res.json(post);
});

// DELETE /posts/:id → Remove a post
app.delete("/posts/:id", (req, res) => {
  const id    = parseInt(req.params.id);
  const index = posts.findIndex((p) => p.id === id);

  // If post not found, send 404
  if (index === -1) {
    return res.status(404).json({ error: "Post not found" });
  }

  // Remove the post from array
  posts.splice(index, 1);

  res.json({ message: "Post deleted successfully" });
});

// ── Start the API Server ──────────────────────────────
app.listen(PORT, () => {
  console.log(`Blog API running on http://localhost:${PORT}`);
});
