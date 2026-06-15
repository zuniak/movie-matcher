import { useEffect, useMemo, useState } from 'react'
import { fetchMovies } from '../services/movieService'
import MoviePoster from '../components/ui/MoviePoster'
import styles from './MovieCatalogPage.module.css'

export default function MovieCatalogPage() {
  const [allMovies, setAllMovies] = useState([])
  const [query, setQuery] = useState('')
  const [selectedGenres, setSelectedGenres] = useState([])
  const [selectedPlatforms, setSelectedPlatforms] = useState([])

  useEffect(() => {
    fetchMovies().then(setAllMovies).catch(() => {})
  }, [])

  const allGenres = useMemo(() => [...new Set(allMovies.flatMap((m) => m.genre))], [allMovies])
  const allPlatforms = useMemo(() => [...new Set(allMovies.flatMap((m) => m.platforms))], [allMovies])

  const toggleGenre = (genre) =>
    setSelectedGenres((prev) => prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre])

  const togglePlatform = (platform) =>
    setSelectedPlatforms((prev) => prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform])

  const clearFilters = () => { setQuery(''); setSelectedGenres([]); setSelectedPlatforms([]) }

  const filteredMovies = useMemo(
    () =>
      allMovies.filter((movie) => {
        const matchesQuery = query
          ? `${movie.title} ${movie.description}`.toLowerCase().includes(query.toLowerCase())
          : true
        const matchesGenre = selectedGenres.length === 0 || selectedGenres.some((g) => movie.genre.includes(g))
        const matchesPlatform = selectedPlatforms.length === 0 || selectedPlatforms.some((p) => movie.platforms.includes(p))
        return matchesQuery && matchesGenre && matchesPlatform
      }),
    [allMovies, query, selectedGenres, selectedPlatforms]
  )

  const activeFilters =
    selectedGenres.length + selectedPlatforms.length > 0
      ? [
          selectedGenres.length > 0 ? `${selectedGenres.length} gatunek${selectedGenres.length === 1 ? '' : 'y'}` : null,
          selectedPlatforms.length > 0 ? `${selectedPlatforms.length} platform${selectedPlatforms.length === 1 ? 'a' : 'y'}` : null,
        ].filter(Boolean).join(', ')
      : 'Brak aktywnych filtrów'

  return (
    <div className={styles.catalog}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.brand}>MOVIEMATCH</span>
          <p className={styles.pageLabel}>Przegląd filmów</p>
        </div>
      </header>

      <section className={styles.heroCard}>
        <div>
          <p className={styles.heroKicker}>Katalog</p>
          <h1 className={styles.heroTitle}>Wszystkie filmy</h1>
          <p className={styles.heroSubtitle}>
            Przeglądaj pełną bazę tytułów i znajdź coś idealnego na kolejny wieczór filmowy.
          </p>
        </div>
      </section>

      <section className={styles.filterPanel}>
        <div className={styles.filterRow}>
          <label className={styles.searchLabel}>
            Szukaj
            <input
              type="search"
              placeholder="Wpisz tytuł lub opis..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={styles.searchInput}
            />
          </label>
          <button type="button" className={styles.clearButton} onClick={clearFilters}>
            Wyczyść filtry
          </button>
        </div>

        <p className={styles.filterSummary}>{activeFilters}</p>

        <div className={styles.filterGroup}>
          <p className={styles.filterLabel}>Gatunki</p>
          <div className={styles.filterChips}>
            <button type="button" className={`${styles.filterChip} ${selectedGenres.length === 0 ? styles.activeChip : ''}`} onClick={() => setSelectedGenres([])}>
              Wszystkie
            </button>
            {allGenres.map((item) => (
              <button key={item} type="button" className={`${styles.filterChip} ${selectedGenres.includes(item) ? styles.activeChip : ''}`} onClick={() => toggleGenre(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <p className={styles.filterLabel}>Platformy</p>
          <div className={styles.filterChips}>
            <button type="button" className={`${styles.filterChip} ${selectedPlatforms.length === 0 ? styles.activeChip : ''}`} onClick={() => setSelectedPlatforms([])}>
              Wszystkie
            </button>
            {allPlatforms.map((item) => (
              <button key={item} type="button" className={`${styles.filterChip} ${selectedPlatforms.includes(item) ? styles.activeChip : ''}`} onClick={() => togglePlatform(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      {filteredMovies.length === 0 ? (
        <div className={styles.emptyState}>
          {allMovies.length === 0 ? 'Ładowanie...' : 'Brak filmów pasujących do wybranych filtrów.'}
        </div>
      ) : (
        <div className={styles.movieGrid}>
          {filteredMovies.map((movie) => (
            <article key={movie.id} className={styles.movieCard}>
              <div className={styles.posterWrapper}>
                <MoviePoster src={movie.poster} alt={movie.title} className={styles.posterImage} />
              </div>
              <div className={styles.movieInfo}>
                <div className={styles.movieHeader}>
                  <div>
                    <h2 className={styles.movieTitle}>{movie.title}</h2>
                    <p className={styles.movieMeta}>{movie.year} · {movie.duration}</p>
                  </div>
                  <span className={styles.rating}>{movie.rating.toFixed(1)}</span>
                </div>
                <p className={styles.movieDescription}>{movie.description}</p>
                <div className={styles.tagRow}>
                  {movie.genre.map((tag) => (
                    <span key={`${movie.id}-${tag}`} className={styles.tag}>{tag}</span>
                  ))}
                </div>
                <div className={styles.platformRow}>
                  {movie.platforms.map((p) => (
                    <span key={`${movie.id}-${p}`} className={styles.platform}>{p}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
