import { MOVIES } from './data/movies.js'

const sessions = {}

function generateCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

export const db = {
  getMovies({ platforms = [], genres = [], yearFrom = 1900, yearTo = 2099 } = {}) {
    return MOVIES.filter((m) => {
      if (platforms.length && !m.platforms.some((p) => platforms.includes(p))) return false
      if (genres.length && !m.genre.some((g) => genres.includes(g))) return false
      if (m.year < yearFrom || m.year > yearTo) return false
      return true
    })
  },

  getMovieById(id) {
    return MOVIES.find((m) => m.id === id) ?? null
  },

  createSession({ hostName, name, filters }) {
    const id = generateCode()
    const movies = this.getMovies(filters)
    sessions[id] = {
      id,
      name,
      status: 'waiting',
      filters,
      movies: movies.map((m) => m.id),
      participants: [{ id: 'host', name: hostName, role: 'host' }],
      votes: {},
      createdAt: Date.now(),
    }
    return sessions[id]
  },

  getSession(id) {
    return sessions[id] ?? null
  },

  joinSession(sessionId, participantName) {
    const session = sessions[sessionId]
    if (!session) return { error: 'Sesja nie istnieje', status: 404 }
    if (session.status === 'finished') return { error: 'Sesja zakończona', status: 409 }
    const participantId = `p_${Date.now()}`
    session.participants.push({ id: participantId, name: participantName, role: 'participant' })
    return { session, participantId }
  },

  startSession(sessionId) {
    const session = sessions[sessionId]
    if (!session) return { error: 'Sesja nie istnieje', status: 404 }
    session.status = 'active'
    return session
  },

  castVote(sessionId, participantId, movieId, action) {
    const session = sessions[sessionId]
    if (!session) return { error: 'Sesja nie istnieje', status: 404 }
    if (action === 'like') {
      if (!session.votes[participantId]) session.votes[participantId] = []
      if (!session.votes[participantId].includes(movieId)) {
        session.votes[participantId].push(movieId)
      }
    }
    const match = this.findMatch(session)
    if (match) {
      session.status = 'finished'
      session.matchedMovieId = match.movieId
    }
    return { session, match }
  },

  findMatch(session) {
    const userIds = session.participants.map((p) => p.id)
    const counts = {}
    for (const uid of userIds) {
      for (const mid of session.votes[uid] ?? []) {
        counts[mid] = (counts[mid] ?? 0) + 1
      }
    }
    const matchId = Object.keys(counts).find((id) => counts[id] === userIds.length)
    return matchId ? { movieId: matchId, matchedBy: userIds } : null
  },

  getCloseContenders(session, winnerId, limit = 4) {
    const counts = {}
    for (const mids of Object.values(session.votes)) {
      for (const id of mids) {
        if (id !== winnerId) counts[id] = (counts[id] ?? 0) + 1
      }
    }
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([id]) => MOVIES.find((m) => m.id === id))
      .filter(Boolean)
  },
}
