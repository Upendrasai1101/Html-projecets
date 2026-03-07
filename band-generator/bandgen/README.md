# 🎸 Band Name Generator

A dynamic band name generator built with **Node.js**, **Express**, and **EJS**.

## Features
- Random band name generation using adjectives + nouns
- EJS templating with **partials** (header & footer)
- Session-tracked history of recent names
- Clean rock-aesthetic UI

## Setup

```bash
npm install
npm run dev
```

Open: `http://localhost:3000`

## Project Structure

```
band-generator/
├── index.js                  # Express server + logic
├── package.json
├── public/
│   ├── css/style.css         # Styles
│   └── js/main.js            # Client-side JS
└── views/
    ├── index.ejs             # Main page
    └── partials/
        ├── header.ejs        # EJS partial - head/nav
        └── footer.ejs        # EJS partial - footer
```

## EJS Tags Used
- `<%= %>` — Output variable
- `<%- %>` — Unescaped output (for partials)
- `<% %>` — Logic (if/else)
- `<%- include('partials/header') %>` — Partials
