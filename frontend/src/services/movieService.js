async function api(path, options) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Błąd serwera')
  return json.data
}

/**
 * @param {{
 *   platforms?: string[]
 *   genres?: string[]
 *   yearFrom?: number
 *   yearTo?: number
 * }} filters
 */
export async function fetchMovies(filters = {}) {
  const params = new URLSearchParams()
  if (filters.platforms?.length) params.set('platforms', filters.platforms.join(','))
  if (filters.genres?.length) params.set('genres', filters.genres.join(','))
  if (filters.yearFrom) params.set('yearFrom', filters.yearFrom)
  if (filters.yearTo) params.set('yearTo', filters.yearTo)

  const query = params.toString()
  return api(`/movies${query ? `?${query}` : ''}`)
}

export async function fetchMovieById(id) {
  return api(`/movies/${id}`)
}
