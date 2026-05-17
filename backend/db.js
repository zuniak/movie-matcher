import { randomUUID } from 'crypto'
import { MOVIES } from './data/movies.js'

const sessions = {}

const SESSION_TTL_MS = 4 * 60 * 60 * 1000

function generateCode() {
  const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
  return Array.from(
    { length: 8 },
    () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  ).join('')
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
    if (now - sessions[id].createdAt > SESSION_TTL_MS) delete sessions[id]
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
      skips: {},
      createdAt: Date.now(),
    }
    return { session: sessions[id], hostId }
  },

  getSession(id) {
    return sessions[id] ?? null
  },

  joinSession(sessionId, participantName) {
    const session = sessions[sessionId]
    if (!session) return { error: 'Sesja nie istnieje', status: 404 }
    if (session.status === 'finished') return { error: 'Sesja zakończona', status: 409 }
    if (session.status === 'active') return { error: 'Sesja już trwa', status: 409 }
    const participantId = randomUUID()
    session.participants.push({ id: participantId, name: participantName, role: 'participant' })
    return { session, participantId }
  },

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
    if (!session.participants.some((p) => p.id === participantId)) {
      return { error: 'Nieznany uczestnik', status: 403 }
    }

    if (action === 'like') {
      if (!session.votes[participantId]) session.votes[participantId] = []
      if (!session.votes[participantId].includes(movieId)) {
        session.votes[participantId].push(movieId)
      }
    } else if (action === 'skip') {
      // bug 4: record skips so we know a participant has seen the movie
      if (!session.skips[participantId]) session.skips[participantId] = []
      if (!session.skips[participantId].includes(movieId)) {
        session.skips[participantId].push(movieId)
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
    // bug 3: a participant with no votes entry is AFK and would block the match forever.
    // Rule: only participants who have cast at least one vote (like or skip) are counted.
    // An AFK participant who never interacted is excluded from the required quorum.
    const activeIds = session.participants
      .map((p) => p.id)
      .filter(
        (uid) =>
          (session.votes[uid]?.length ?? 0) > 0 || (session.skips[uid]?.length ?? 0) > 0
      )

    if (activeIds.length === 0) return null

    const counts = {}
    for (const uid of activeIds) {
      for (const mid of session.votes[uid] ?? []) {
        counts[mid] = (counts[mid] ?? 0) + 1
      }
    }

    const matchId = Object.keys(counts).find((id) => counts[id] === activeIds.length)
    return matchId ? { movieId: matchId, matchedBy: activeIds } : null
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
