import cors from 'cors'
import express from 'express'
import routes from './routes.js'

const app = express()
const PORT = process.env.PORT ?? 3001

// TODO (bug 10): replace hardcoded origin with ALLOWED_ORIGIN env var before any deployment
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? 'http://localhost:5173'
app.use(cors({ origin: ALLOWED_ORIGIN }))
app.use(express.json())
app.use('/api', routes)

// TODO (bug 9): sessions{} lives in memory and resets on every restart.
//   Replace with a persistent store (Redis / SQLite) for production.
// TODO (bug 11): hostId/participantId passed in request body is not real auth.
//   Add JWT or session cookies before exposing this to the internet.

app.listen(PORT, () => {
  console.log(`Mock backend running at http://localhost:${PORT}`)
})
