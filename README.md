# AI Resume Builder

A full-stack resume builder: create, edit, and download professional resumes as PDFs.
Built with **React 19 + Vite + Tailwind CSS 4** on the frontend and **Express 5 + MongoDB (Mongoose)** on the backend, with JWT authentication.

## Features

- Sign up / log in with JWT authentication
- Guided resume editor (personal info, contact, work experience, education, skills, projects, certifications, languages, interests)
- Live resume preview while editing
- Multiple templates and themes
- Automatic resume thumbnail generation
- One-click PDF download
- Resume completion percentage tracking

## Project structure

```
.
├── api/index.js        # Vercel serverless entry point (wraps the Express app)
├── backend/            # Express API (routes, controllers, models, middleware)
├── frontend/           # React + Vite frontend
├── vercel.json         # Vercel build config + routing rewrites
└── package.json        # Root scripts + backend dependencies (used by the serverless function)
```

## Running locally

Prerequisites: Node 18+ and a MongoDB database (local or [Atlas](https://www.mongodb.com/cloud/atlas)).

```bash
# 1. install everything
npm install
cd frontend && npm install && cd ..

# 2. configure environment
cp .env.example .env        # then edit .env and set MONGO_URI and JWT_SECRET

# 3. run backend (port 4000) and frontend (port 5173) together
npm run dev
```

Open http://localhost:5173 — the frontend calls the API on http://localhost:4000 by default in development.

### Environment variables

Root `.env` (see `.env.example`):

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | yes | MongoDB connection string |
| `JWT_SECRET` | recommended | Secret used to sign auth tokens (a dev fallback is used if unset) |

`frontend/.env` (optional — only when hosting the backend separately):

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the API. Unset = same origin in production, `http://localhost:4000` in development. |

## Deploying to Vercel

The whole app deploys to Vercel as **one project**: the frontend is built as a static site and the Express API runs as a serverless function behind a `/api/*` rewrite (both configured in `vercel.json` — no manual dashboard settings needed).

### 1. Create a MongoDB Atlas database (required)

The app needs MongoDB. The free M0 tier works:

1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas), create a cluster (M0, free).
2. Create a database user (username + password).
3. Under **Network Access**, add an IP allowlist entry `0.0.0.0/0` (allow from anywhere) — Vercel functions run from rotating IPs.
4. Get the connection string (Drivers → Node.js), e.g.
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/resume?retryWrites=true&w=majority`

> ⚠️ Note: the database used by this repo's original `.env` no longer exists — you must create your own cluster and use your own connection string.

### 2. Push this repo to GitHub

Already done if you're reading this on GitHub. Otherwise push the repo to your account.

### 3. Import the project in Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
2. Vercel reads `vercel.json`, so leave **Framework Preset**, **Build Command**, **Output Directory** and **Install Command** at their defaults — no changes needed.
3. Under **Environment Variables**, add:
   - `MONGO_URI` = your Atlas connection string from step 1
   - `JWT_SECRET` = any long random string (e.g. generated with `openssl rand -hex 32`)
4. Click **Deploy** and wait for the build to finish.

### 4. Done

Your app is live — the frontend and the API are served from the same domain (`https://<your-project>.vercel.app`), so no CORS or extra environment variables are needed. Every future `git push` to the main branch automatically redeploys.

## Notes

- Uploaded images (resume thumbnails, profile photos) are stored **inside MongoDB** as data URLs — no external storage service is needed, and the approach works on serverless hosts with read-only filesystems. Image uploads are limited to 2 MB.
- The API handles the full request path (`/api/auth/...`, `/api/resume/...`) — see `backend/app.js`.
