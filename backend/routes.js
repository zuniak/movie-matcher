import { Router } from 'express'
import { db } from './db.js'

const router = Router()

function parseYear(value, fallback) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

// GET /api/movies
router.get('/movies', (req, res) => {
  const platforms = req.query.platforms?.split(',').filter(Boolean) ?? []
  const genres = req.query.genres?.split(',').filter(Boolean) ?? []
  // bug 8: guard against NaN from malformed query params
  const yearFrom = parseYear(req.query.yearFrom, 1900)
  const yearTo = parseYear(req.query.yearTo, 2099)

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
router.post('/sessions', (req, res) => {
  const { hostName, name, filters } = req.body
  // bug 5: validate hostName so p.name[0] can never crash the lobby view
  if (!hostName?.trim()) return res.status(400).json({ error: 'hostName jest wymagany' })
  try {
    const { session, hostId } = db.createSession({
      hostName: hostName.trim(),
      name: name?.trim() || 'Wieczór filmowy',
      filters,
    })
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
  // bug 5: validate participantName so p.name[0] can never crash the lobby view
  if (!participantName?.trim()) return res.status(400).json({ error: 'participantName jest wymagany' })
  const result = db.joinSession(req.params.id, participantName.trim())
  if (result.error) return res.status(result.status).json({ error: result.error })
  res.json({ data: result })
})

// POST /api/sessions/:id/start  { hostId }
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
  if (!participantId || !movieId || !['like', 'skip'].includes(action)) {
    return res.status(400).json({ error: 'Wymagane: participantId, movieId, action (like|skip)' })
  }
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
