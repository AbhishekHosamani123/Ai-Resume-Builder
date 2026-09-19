import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import userRoutes from './routes/userRoutes.js'
import resumeRoutes from './routes/resumeRoutes.js'
import { connectDB } from './config/db.js'

const app = express()

app.use(cors())

// Large limit because image uploads are stored as data URLs inside the resume JSON
app.use(express.json({ limit: '16mb' }))

// Path normalization for serverless environments: if the platform hands the
// function a URL that includes the function entry path, strip it so Express
// routes still resolve. Must run before route matching.
app.use((req, _res, next) => {
    if (/^\/api\/index(\.js)?(?=\/|$)/.test(req.url)) {
        req.url = req.url.replace(/^\/api\/index(\.js)?/, '')
    }
    next()
})

// Ensure the MongoDB connection is ready before handling a request.
// On serverless (Vercel) the connection is created on the first invocation
// and reused from cache afterwards (see backend/config/db.js).
app.use(async (_req, res, next) => {
    try {
        await connectDB()
        next()
    } catch (err) {
        res.status(500).json({ message: 'Database connection failed', error: err.message })
    }
})

app.use('/api/auth', userRoutes)
app.use('/api/resume', resumeRoutes)

app.get('/', (_req, res) => {
    res.send('API Working')
})

app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found' })
})

export default app
