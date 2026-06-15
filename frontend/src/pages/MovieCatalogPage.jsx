import { useMemo, useState } from 'react'
import { MOVIES } from '../data/movies'
import styles from './MovieCatalogPage.module.css'

const ALL_GENRES = Array.from(new Set(MOVIES.flatMap((movie) => movie.genre)))
const ALL_PLATFORMS = Array.from(new Set(MOVIES.flatMap((movie) => movie.platforms)))

export default function MovieCatalogPage() {
  const [query, setQuery] = useState('')
  const [selectedGenres, setSelectedGenres] = useState([])
  const [selectedPlatforms, setSelectedPlatforms] = useState([])

  const toggleGenre = (genre) =>
    setSelectedGenres((current) =>
      current.includes(genre) ? current.filter((item) => item !== genre) : [...current, genre]
    )

  const togglePlatform = (platform) =>
    setSelectedPlatforms((current) =>
      current.includes(platform) ? current.filter((item) => item !== platform) : [...current, platform]
    )

  const clearFilters = () => {
    setQuery('')
    setSelectedGenres([])
    setSelectedPlatforms([])
  }

  const filteredMovies = useMemo(
    () =>
      MOVIES.filter((movie) => {
        const matchesQuery = query
          ? `${movie.title} ${movie.description}`.toLowerCase().includes(query.toLowerCase())
          : true
        const matchesGenre =
          selectedGenres.length === 0 || selectedGenres.some((genreItem) => movie.genre.includes(genreItem))
        const matchesPlatform =
          selectedPlatforms.length === 0 ||
          selectedPlatforms.some((platformItem) => movie.platforms.includes(platformItem))
        return matchesQuery && matchesGenre && matchesPlatform
      }),
    [query, selectedGenres, selectedPlatforms]
  )

  const activeFilters =
    selectedGenres.length + selectedPlatforms.length > 0
      ? [
          selectedGenres.length > 0
            ? `${selectedGenres.length} gatunek${selectedGenres.length === 1 ? '' : 'y'}`
            : null,
          selectedPlatforms.length > 0
            ? `${selectedPlatforms.length} platform${selectedPlatforms.length === 1 ? 'a' : 'y'}`
            : null,
        ]
          .filter(Boolean)
          .join(', ')
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
            <button
              type="button"
              className={`${styles.filterChip} ${selectedGenres.length === 0 ? styles.activeChip : ''}`}
              onClick={() => setSelectedGenres([])}
            >
              Wszystkie
            </button>
            {ALL_GENRES.map((item) => (
              <button
                key={item}
                type="button"
                className={`${styles.filterChip} ${selectedGenres.includes(item) ? styles.activeChip : ''}`}
                onClick={() => toggleGenre(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <p className={styles.filterLabel}>Platformy</p>
          <div className={styles.filterChips}>
            <button
              type="button"
              className={`${styles.filterChip} ${selectedPlatforms.length === 0 ? styles.activeChip : ''}`}
              onClick={() => setSelectedPlatforms([])}
            >
              Wszystkie
            </button>
            {ALL_PLATFORMS.map((item) => (
              <button
                key={item}
                type="button"
                className={`${styles.filterChip} ${selectedPlatforms.includes(item) ? styles.activeChip : ''}`}
                onClick={() => togglePlatform(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      {filteredMovies.length === 0 ? (
        <div className={styles.emptyState}>
          Brak filmów pasujących do wybranych filtrów.
        </div>
      ) : (
        <div className={styles.movieGrid}>
          {filteredMovies.map((movie) => (
            <article key={movie.id} className={styles.movieCard}>
              <div className={styles.posterWrapper}>
                <img src={movie.poster} alt={movie.title} className={styles.posterImage} />
              </div>
              <div className={styles.movieInfo}>
                <div className={styles.movieHeader}>
                  <div>
                    <h2 className={styles.movieTitle}>{movie.title}</h2>
                    <p className={styles.movieMeta}>
                      {movie.year} · {movie.duration}
                    </p>
                  </div>
                  <span className={styles.rating}>{movie.rating.toFixed(1)}</span>
                </div>

                <p className={styles.movieDescription}>{movie.description}</p>

                <div className={styles.tagRow}>
                  {movie.genre.map((tag) => (
                    <span key={`${movie.id}-${tag}`} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className={styles.platformRow}>
                  {movie.platforms.map((platformItem) => (
                    <span key={`${movie.id}-${platformItem}`} className={styles.platform}>
                      {platformItem}
                    </span>
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
