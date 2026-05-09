import { MOVIES } from '../data/movies'

/**
 * @param {{
 *   platforms?: string[]
 *   genres?: string[]
 *   yearFrom?: number
 *   yearTo?: number
 *   type?: 'movie' | 'series'
 * }} filters
 * @returns {Movie[]}
 */
export function filterMovies(filters = {}) {
  const {
    platforms = [],
    genres = [],
    yearFrom = 1900,
    yearTo = new Date().getFullYear(),
  } = filters

  return MOVIES.filter((movie) => {
    if (platforms.length > 0 && !platforms.includes(movie.platform)) return false
    if (genres.length > 0 && !movie.genre.some((g) => genres.includes(g))) return false
    if (movie.year < yearFrom || movie.year > yearTo) return false
    return true
  })
}

/**
 * Finds the movie that all participants liked.
 * Returns the first match (most liked), or null if none.
 *
 * @param {Record<string, string[]>} votes  { userId -> [movieId, ...] }
 * @returns {{ movie: Movie, matchedBy: string[] } | null}
 */
export function findMatch(votes) {
  const userIds = Object.keys(votes)
  if (userIds.length === 0) return null

  // Count how many users liked each movie
  const likeCounts = {}
  for (const userId of userIds) {
    for (const movieId of votes[userId]) {
      likeCounts[movieId] = (likeCounts[movieId] ?? 0) + 1
    }
  }

  // Full match: everyone liked it
  const fullMatchId = Object.keys(likeCounts).find((id) => likeCounts[id] === userIds.length)

  if (fullMatchId) {
    const movie = MOVIES.find((m) => m.id === fullMatchId)
    return { movie, matchedBy: userIds }
  }

  return null
}

/**
 * Returns runner-up movies sorted by like count (excluding the winner).
 *
 * @param {Record<string, string[]>} votes
 * @param {string} winnerId
 * @param {number} limit
 * @returns {Movie[]}
 */
export function getCloseContenders(votes, winnerId, limit = 4) {
  const likeCounts = {}
  for (const movieIds of Object.values(votes)) {
    for (const id of movieIds) {
      if (id !== winnerId) {
        likeCounts[id] = (likeCounts[id] ?? 0) + 1
      }
    }
  }

  return Object.entries(likeCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([id]) => MOVIES.find((m) => m.id === id))
    .filter(Boolean)
}

export function getMovieById(id) {
  return MOVIES.find((m) => m.id === id) ?? null
}
