# 🍹 Cocktail Finder

A web app that fetches random and searchable cocktail recipes
using the free CocktailDB API — built with Node.js, Express, Axios, and EJS.

---

## How to Run

**Step 1 — Install dependencies:**
```
npm install
```

**Step 2 — Start the server:**
```
nodemon index.js
```

**Step 3 — Open in browser:**
```
http://localhost:3000
```

---

## Features

- 🎲 Random cocktail on every page load
- 🔍 Search any cocktail by name
- 🧪 Shows ingredients + measurements
- 📋 Shows full instructions
- 🖼️ Shows cocktail image from API

---

## API Used

**TheCocktailDB** — https://www.thecocktaildb.com/api.php

- No API key needed
- CORS enabled
- Free to use

Endpoints used:
- `GET /random.php`        → Random cocktail
- `GET /search.php?s=name` → Search by name

---

## Project Structure

```
cocktail-finder/
├── index.js                  ← Express server + all routes
├── package.json
├── public/
│   ├── css/main.css          ← All styles
│   └── js/main.js            ← Client-side JS
└── views/
    ├── index.ejs             ← Main page template
    └── partials/
        ├── header.ejs        ← Header partial
        └── footer.ejs        ← Footer partial
```

---

## Built With

- Node.js
- Express.js
- Axios (HTTP requests to API)
- EJS (templating)
