import { Router } from 'express'
import { db } from './db.js'

const router = Router()

// GET /api/movies
router.get('/movies', (req, res) => {
  const platforms = req.query.platforms?.split(',').filter(Boolean) ?? []
  const genres = req.query.genres?.split(',').filter(Boolean) ?? []
  const yearFrom = Number(req.query.yearFrom ?? 1900)
  const yearTo = Number(req.query.yearTo ?? 2099)

  const movies = db.getMovies({ platforms, genres, yearFrom, yearTo })
  res.json({ data: movies, total: movies.length })
})

// GET /api/movies/:id
router.get('/movies/:id', (req, res) => {
  const movie = db.getMovieById(req.params.id)
  if (!movie) return res.status(404).json({ error: 'Film nie znaleziony' })
  res.json({ data: movie })
})

// POST /api/sessions  { hostName, name, filters }
// Response includes hostId — client must store it to call /start
router.post('/sessions', (req, res) => {
  const { hostName, name, filters } = req.body
  try {
    const { session, hostId } = db.createSession({ hostName, name, filters })
    res.status(201).json({ data: { session, hostId } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/sessions/:id
router.get('/sessions/:id', (req, res) => {
  const session = db.getSession(req.params.id)
  if (!session) return res.status(404).json({ error: 'Sesja nie istnieje' })
  res.json({ data: session })
})

// POST /api/sessions/:id/join  { participantName }
router.post('/sessions/:id/join', (req, res) => {
  const { participantName } = req.body
  const result = db.joinSession(req.params.id, participantName)
  if (result.error) return res.status(result.status).json({ error: result.error })
  res.json({ data: result })
})

// POST /api/sessions/:id/start  { hostId }
// fix 3: only the host (verified by hostId) can start the session
router.post('/sessions/:id/start', (req, res) => {
  const { hostId } = req.body
  if (!hostId) return res.status(400).json({ error: 'Wymagany hostId' })
  const result = db.startSession(req.params.id, hostId)
  if (result.error) return res.status(result.status).json({ error: result.error })
  res.json({ data: result.session })
})

// POST /api/sessions/:id/vote  { participantId, movieId, action: 'like' | 'skip' }
router.post('/sessions/:id/vote', (req, res) => {
  const { participantId, movieId, action } = req.body
  const result = db.castVote(req.params.id, participantId, movieId, action)
  if (result.error) return res.status(result.status).json({ error: result.error })
  res.json({ data: result })
})

// GET /api/sessions/:id/result
router.get('/sessions/:id/result', (req, res) => {
  const session = db.getSession(req.params.id)
  if (!session) return res.status(404).json({ error: 'Sesja nie istnieje' })
  if (!session.matchedMovieId) return res.status(404).json({ error: 'Brak dopasowania' })

  const movie = db.getMovieById(session.matchedMovieId)
  const contenders = db.getCloseContenders(session, session.matchedMovieId)
  res.json({ data: { movie, contenders, participants: session.participants } })
})

export default router
