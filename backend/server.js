// Local development / standalone server entry.
// The same app is used by the Vercel serverless function (see api/index.js).
import app from './app.js'
import { connectDB } from './config/db.js'

const port = process.env.PORT || 4000

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`server started on http://localhost:${port}`)
        })
    })
    .catch(() => {
        console.error('Server not started because the database connection failed.')
        process.exit(1)
    })

export default app
