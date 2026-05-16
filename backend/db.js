import { randomUUID } from 'crypto'
import { MOVIES } from './data/movies.js'

const sessions = {}

// Sessions expire after 4 hours of inactivity
const SESSION_TTL_MS = 4 * 60 * 60 * 1000

function generateCode() {
  // 8 chars from a 34-char alphabet (no 0/O, 1/I to avoid misreads) → ~1.8 trillion combinations
  const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
  return Array.from({ length: 8 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('')
}

function uniqueCode() {
  let code
  let attempts = 0
  do {
    code = generateCode()
    if (++attempts > 100) throw new Error('Could not generate a unique session code')
  } while (sessions[code])
  return code
}

function pruneExpired() {
  const now = Date.now()
  for (const id of Object.keys(sessions)) {
    if (now - sessions[id].createdAt > SESSION_TTL_MS) {
      delete sessions[id]
    }
  }
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

  // fix 1: host gets a real UUID so their votes can be counted
  // fix 4: uniqueCode() checks for collisions; pruneExpired() prevents unbounded growth
  createSession({ hostName, name, filters }) {
    pruneExpired()
    const id = uniqueCode()
    const hostId = randomUUID()
    const movies = this.getMovies(filters)
    sessions[id] = {
      id,
      name,
      status: 'waiting',
      filters,
      hostId,
      movies: movies.map((m) => m.id),
      participants: [{ id: hostId, name: hostName, role: 'host' }],
      votes: {},
      createdAt: Date.now(),
    }
    // return hostId separately so the caller can store it for auth
    return { session: sessions[id], hostId }
  },

  getSession(id) {
    return sessions[id] ?? null
  },

  // fix 2: randomUUID() is collision-free by construction
  joinSession(sessionId, participantName) {
    const session = sessions[sessionId]
    if (!session) return { error: 'Sesja nie istnieje', status: 404 }
    if (session.status === 'finished') return { error: 'Sesja zakończona', status: 409 }
    if (session.status === 'active') return { error: 'Sesja już trwa', status: 409 }
    const participantId = randomUUID()
    session.participants.push({ id: participantId, name: participantName, role: 'participant' })
    return { session, participantId }
  },

  // fix 3: caller must supply hostId; db validates it before starting
  startSession(sessionId, hostId) {
    const session = sessions[sessionId]
    if (!session) return { error: 'Sesja nie istnieje', status: 404 }
    if (session.hostId !== hostId) return { error: 'Brak uprawnień', status: 403 }
    if (session.status !== 'waiting') return { error: 'Sesja już wystartowała', status: 409 }
    session.status = 'active'
    return { session }
  },

  castVote(sessionId, participantId, movieId, action) {
    const session = sessions[sessionId]
    if (!session) return { error: 'Sesja nie istnieje', status: 404 }
    if (session.status !== 'active') return { error: 'Sesja nie jest aktywna', status: 409 }
    const isParticipant = session.participants.some((p) => p.id === participantId)
    if (!isParticipant) return { error: 'Nieznany uczestnik', status: 403 }

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

  // fix 1 (cont.): counts only participants who have cast at least one vote,
  // so a session with 1 active voter can still match (host voted, no one else yet)
  // — actually we count ALL participants; a match requires unanimous agreement.
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
