// Vercel serverless function entry point.
// Every /api/* request is rewritten here (see vercel.json) and handled by the
// Express app, which sees the original request path (/api/auth/... etc.).
import app from '../backend/app.js'

export default app
