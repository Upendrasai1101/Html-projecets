# 🤫 Lisper — Anonymous Secrets App

> Inspired by Whisper. Share your secrets anonymously.

## Features

- **Home Page** — Hero landing with floating secret previews
- **Register / Login** — Secure authentication with bcrypt password hashing
- **Protected Secrets Page** — Only accessible after authentication
- **Secrets API** — Fetches random secrets from `secrets-api.appbrewery.com`
- **Live Secret Feed** — Reveal new secrets with one click
- **Session Management** — Passport.js + express-session

## Tech Stack

- **Node.js** + **Express** — Server & routing
- **EJS** — Templating
- **Passport.js** — Authentication (Local Strategy)
- **bcrypt** — Password hashing
- **Axios** — HTTP requests to Secrets API
- **express-session** — Session management

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run with Nodemon (development)

```bash
npm run dev
```

### 3. Run normally

```bash
npm start
```

### 4. Open in browser

```
http://localhost:3000
```

## Project Structure

```
lisper/
├── index.js              # Main server file
├── package.json
├── .env                  # Environment variables
├── public/
│   ├── css/style.css     # All styles
│   └── js/secrets.js     # Client-side secret fetching
└── views/
    ├── home.ejs          # Landing page
    ├── register.ejs      # Registration form
    ├── login.ejs         # Login form
    └── secrets.ejs       # Protected secrets page
```

## Authentication Flow

1. User registers → password hashed with bcrypt → stored in memory
2. User logs in → Passport validates → session created
3. `/secrets` route checks `isAuthenticated()` → redirect to `/login` if not

## Notes

- This demo uses **in-memory storage** (no database). Users reset when the server restarts.
- For production, replace in-memory `users[]` with a PostgreSQL/MongoDB database.
- The `SESSION_SECRET` in `.env` should be changed to a strong random string in production.
