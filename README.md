# ResumeXpert — AI Resume Builder

Create a job-ready resume in minutes — with professional templates, a live preview editor and a built-in **ATS score checker**. 100% free, no sign-up, fully private.

**Everything runs in your browser.** There is no backend and no account system: your resumes are stored locally (IndexedDB + localStorage) and never leave your device. The whole app deploys to Vercel as a single static site.

## Features

- **No sign-up, no server** — your data lives in your browser (IndexedDB), works offline
- Guided resume editor: personal info, contact, work experience, education, skills, projects, certifications, languages, interests
- Live resume preview while editing + multiple templates & themes
- Automatic resume thumbnail generation
- One-click PDF download
- **ATS score checker** — runs automatically on the resume you just built (no re-uploading), with optional job-description keyword matching; upload a PDF to check an external resume
- Completion percentage & ATS badges on every resume card

## Tech stack

- React 19 + Vite 7 + Tailwind CSS 4
- IndexedDB (resumes) + localStorage (profile/preferences) via a tiny promise wrapper (`frontend/src/lib/idb.js`)
- pdfjs-dist for in-browser PDF text extraction (ATS checker uploads)
- html2canvas + html2pdf.js for thumbnails and PDF export

## Project structure

```
frontend/
├── src/
│   ├── lib/
│   │   ├── idb.js           # IndexedDB promise wrapper
│   │   ├── resumeStore.js   # resume CRUD + local profile (replaces an API)
│   │   └── ats.js           # ATS scoring engine + PDF text extraction
│   ├── pages/               # LandingPage, Dashboard, AtsChecker
│   └── components/          # editor, forms, templates, modals
└── index.html
vercel.json                  # build config + SPA fallback rewrite
```

## Running locally

Prerequisite: Node 18+.

```bash
npm install          # or: cd frontend && npm install
npm run dev          # opens http://localhost:5173
```

That's it — no database, no environment variables, no backend.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel reads `vercel.json` — leave Framework Preset, Build Command, Output Directory and Install Command at their defaults.
4. Click **Deploy**. No environment variables are needed.

Every future push to the main branch redeploys automatically.

## Data & privacy

- Resumes (including generated thumbnails) are stored in your browser's **IndexedDB**; your display name is stored in **localStorage**.
- Nothing is ever sent to a server — there is no server.
- Clearing your browser's site data will delete saved resumes, so export any resume you want to keep as a PDF.
