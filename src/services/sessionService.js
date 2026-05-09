import { filterMovies } from './movieService'

const SESSION_STORAGE_KEY = 'mm_sessions'

function loadSessions() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function saveSessions(sessions) {
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions))
}

function generateCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

/**
 * @param {{
 *   hostName: string
 *   name: string
 *   filters: object
 * }} options
 * @returns {Session}
 */
export function createSession({ hostName, name, filters }) {
  const sessions = loadSessions()
  const id = generateCode()
  const movies = filterMovies(filters)

  const session = {
    id,
    name,
    status: 'waiting', // 'waiting' | 'active' | 'finished'
    filters,
    movies: movies.map((m) => m.id),
    participants: [{ id: 'host', name: hostName, role: 'host' }],
    votes: {}, // { participantId -> [movieId] }
    createdAt: Date.now(),
  }

  sessions[id] = session
  saveSessions(sessions)
  return session
}

/**
 * @param {string} sessionId
 * @param {string} participantName
 * @returns {Session}
 */
export function joinSession(sessionId, participantName) {
  const sessions = loadSessions()
  const session = sessions[sessionId]
  if (!session) throw new Error('Sesja nie istnieje')
  if (session.status === 'finished') throw new Error('Sesja zakończona')

  const participantId = `p_${Date.now()}`
  session.participants.push({ id: participantId, name: participantName, role: 'participant' })
  saveSessions(sessions)
  return { session, participantId }
}

export function getSession(sessionId) {
  const sessions = loadSessions()
  return sessions[sessionId] ?? null
}

export function startSession(sessionId) {
  const sessions = loadSessions()
  if (!sessions[sessionId]) throw new Error('Sesja nie istnieje')
  sessions[sessionId].status = 'active'
  saveSessions(sessions)
  return sessions[sessionId]
}

/**
 * Records a like vote for a movie from a participant.
 * @returns {Session}
 */
export function castVote(sessionId, participantId, movieId) {
  const sessions = loadSessions()
  const session = sessions[sessionId]
  if (!session) throw new Error('Sesja nie istnieje')

  if (!session.votes[participantId]) session.votes[participantId] = []
  if (!session.votes[participantId].includes(movieId)) {
    session.votes[participantId].push(movieId)
  }

  saveSessions(sessions)
  return session
}

export function finishSession(sessionId) {
  const sessions = loadSessions()
  if (!sessions[sessionId]) throw new Error('Sesja nie istnieje')
  sessions[sessionId].status = 'finished'
  saveSessions(sessions)
  return sessions[sessionId]
}

/** Mock sessions for development/demo purposes */
export const MOCK_SESSIONS = [
  {
    id: 'DEMO01',
    name: 'Family Movie Night',
    status: 'finished',
    matchedMovieId: '8', // Spider-Man
    participants: [
      { id: 'p1', name: 'Alex', role: 'host' },
      { id: 'p2', name: 'Jordan', role: 'participant' },
      { id: 'p3', name: 'Sam', role: 'participant' },
    ],
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'DEMO02',
    name: 'Friday Date Night',
    status: 'finished',
    matchedMovieId: '2', // Past Lives
    participants: [
      { id: 'p1', name: 'Alex', role: 'host' },
      { id: 'p2', name: 'Jordan', role: 'participant' },
    ],
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
]
