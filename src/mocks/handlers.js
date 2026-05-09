import { delay, http, HttpResponse } from 'msw'
import { db } from './db'

const SIMULATED_DELAY = 300 // ms — realistic network feel

export const handlers = [
  // GET /api/movies?platforms=Netflix,HBO Max&genres=Dramat&yearFrom=2000&yearTo=2024
  http.get('/api/movies', async ({ request }) => {
    await delay(SIMULATED_DELAY)
    const url = new URL(request.url)
    const platforms = url.searchParams.get('platforms')?.split(',').filter(Boolean) ?? []
    const genres = url.searchParams.get('genres')?.split(',').filter(Boolean) ?? []
    const yearFrom = Number(url.searchParams.get('yearFrom') ?? 1900)
    const yearTo = Number(url.searchParams.get('yearTo') ?? 2099)

    const movies = db.getMovies({ platforms, genres, yearFrom, yearTo })
    return HttpResponse.json({ data: movies, total: movies.length })
  }),

  // GET /api/movies/:id
  http.get('/api/movies/:id', async ({ params }) => {
    await delay(SIMULATED_DELAY)
    const movie = db.getMovieById(params.id)
    if (!movie) return HttpResponse.json({ error: 'Film nie znaleziony' }, { status: 404 })
    return HttpResponse.json({ data: movie })
  }),

  // POST /api/sessions  { hostName, name, filters }
  http.post('/api/sessions', async ({ request }) => {
    await delay(SIMULATED_DELAY)
    const body = await request.json()
    const session = db.createSession(body)
    return HttpResponse.json({ data: session }, { status: 201 })
  }),

  // GET /api/sessions/:id
  http.get('/api/sessions/:id', async ({ params }) => {
    await delay(SIMULATED_DELAY)
    const session = db.getSession(params.id)
    if (!session) return HttpResponse.json({ error: 'Sesja nie istnieje' }, { status: 404 })
    return HttpResponse.json({ data: session })
  }),

  // POST /api/sessions/:id/join  { participantName }
  http.post('/api/sessions/:id/join', async ({ params, request }) => {
    await delay(SIMULATED_DELAY)
    const { participantName } = await request.json()
    const result = db.joinSession(params.id, participantName)
    if (result.error) return HttpResponse.json({ error: result.error }, { status: result.status })
    return HttpResponse.json({ data: result })
  }),

  // POST /api/sessions/:id/start
  http.post('/api/sessions/:id/start', async ({ params }) => {
    await delay(SIMULATED_DELAY)
    const result = db.startSession(params.id)
    if (result.error) return HttpResponse.json({ error: result.error }, { status: result.status })
    return HttpResponse.json({ data: result })
  }),

  // POST /api/sessions/:id/vote  { participantId, movieId, action: 'like' | 'skip' }
  http.post('/api/sessions/:id/vote', async ({ params, request }) => {
    await delay(SIMULATED_DELAY)
    const { participantId, movieId, action } = await request.json()
    const result = db.castVote(params.id, participantId, movieId, action)
    if (result.error) return HttpResponse.json({ error: result.error }, { status: result.status })
    return HttpResponse.json({ data: result })
  }),

  // GET /api/sessions/:id/result
  http.get('/api/sessions/:id/result', async ({ params }) => {
    await delay(SIMULATED_DELAY)
    const session = db.getSession(params.id)
    if (!session) return HttpResponse.json({ error: 'Sesja nie istnieje' }, { status: 404 })
    if (!session.matchedMovieId) {
      return HttpResponse.json({ error: 'Brak dopasowania' }, { status: 404 })
    }
    const movie = db.getMovieById(session.matchedMovieId)
    const contenders = db.getCloseContenders(session, session.matchedMovieId)
    return HttpResponse.json({ data: { movie, contenders, participants: session.participants } })
  }),
]
