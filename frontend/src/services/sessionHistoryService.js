import { MOVIES } from '../data/movies'
import { MOCK_SESSIONS } from './sessionService'

const STORAGE_PREFIX = 'movie-matcher-history:'

function storageKey(user) {
  if (!user) return null
  return STORAGE_PREFIX + (user.uid || user.email || 'anonymous')
}

function readStorage(key) {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function writeStorage(key, value) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(value))
}

function normalizeSession(session) {
  let participants = 1
  if (Array.isArray(session.participants)) {
    participants = session.participants.length
  } else if (typeof session.participants === 'number') {
    participants = session.participants
  }

  return {
    id: session.id,
    name: session.name || session.id,
    code: session.code || session.id,
    status: session.status || 'pending',
    matchedMovieId: session.matchedMovieId || null,
    participants,
    createdAt: session.createdAt ?? Date.now(),
    tags: session.tags || [],
    filters: session.filters || {},
  }
}

function createSeedHistory() {
  return MOCK_SESSIONS.map((session) => normalizeSession(session))
}

export function getSessionHistory(user) {
  const key = storageKey(user)
  if (!key) return []

  const stored = readStorage(key)
  if (Array.isArray(stored) && stored.length > 0) {
    return stored.map(normalizeSession)
  }

  const seed = createSeedHistory()
  writeStorage(key, seed)
  return seed
}

export function addSessionHistory(user, session) {
  const key = storageKey(user)
  if (!key) return []

  const current = getSessionHistory(user)
  const next = [normalizeSession(session), ...current]
  writeStorage(key, next)
  return next
}

export function findMovieById(movieId) {
  return MOVIES.find((movie) => movie.id === movieId) || null
}

export function pickMovieForFilters(filters) {
  const candidate = MOVIES.find((movie) => {
    const matchesPlatform =
      !filters.platforms?.length ||
      movie.platforms.some((platform) => filters.platforms.includes(platform))
    const matchesGenre =
      !filters.genres?.length ||
      filters.genres.every((genre) => movie.genre.includes(genre))
    const matchesYear =
      (!filters.yearFrom || movie.year >= filters.yearFrom) &&
      (!filters.yearTo || movie.year <= filters.yearTo)
    return matchesPlatform && matchesGenre && matchesYear
  })
  return candidate || MOVIES[0] || null
}
