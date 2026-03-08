# 📝 Blog API Project

A Blog API with full CRUD operations built using Node.js and Express.
No database — data is stored in memory.

---

## How to Run

This project needs TWO terminals open at the same time.

**Terminal 1 — Start the API server (port 4000):**
```
node server.js
```

**Terminal 2 — Start the frontend server (port 3000):**
```
nodemon index.js
```

**Then open in browser:**
```
http://localhost:3000
```

---

## API Endpoints (server.js on port 4000)

| Method | Route         | What it does         |
|--------|---------------|----------------------|
| GET    | /posts        | Get all posts        |
| GET    | /posts/:id    | Get one post         |
| POST   | /posts        | Create a new post    |
| PATCH  | /posts/:id    | Update a post        |
| DELETE | /posts/:id    | Delete a post        |

---

## Project Structure

```
blog-api-project/
├── server.js          ← Blog API (port 4000)
├── index.js           ← Frontend server (port 3000)
├── package.json
├── public/
│   └── css/style.css  ← Styles
└── views/
    ├── index.ejs      ← Home page (all posts)
    └── modify.ejs     ← Create / Edit form
```
