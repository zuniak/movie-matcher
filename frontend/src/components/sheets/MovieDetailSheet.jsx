import PropTypes from 'prop-types'
import PlatformLogo from '../ui/PlatformLogo'
import styles from './MovieDetailSheet.module.css'

const PLATFORM_COLORS = {
  Netflix: '#E60914',
  'HBO Max': '#8A2BE2',
  'Disney+': '#0072D7',
  'Prime Video': '#00A8E1',
}

export default function MovieDetailSheet({ movie, onClose }) {
  if (!movie) return null

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.sheet}>
        <div className={styles.handle} />
        <div className={styles.content}>
          <div className={styles.top}>
            <img className={styles.poster} src={movie.poster} alt={movie.title} loading="lazy" />
            <div className={styles.meta}>
              <h2 className={styles.title}>{movie.title}</h2>
              <p className={styles.year}>
                {movie.year} · {movie.duration}
              </p>
              <p className={styles.rating}>⭐ {movie.rating} / 10</p>
              <div className={styles.genres}>
                {movie.genre.map((g) => (
                  <span key={g} className={styles.genre}>
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.description}>
            <p className={styles.descLabel}>Fabuła</p>
            <p>{movie.description}</p>
          </div>

          <div className={styles.platforms}>
            <p className={styles.descLabel}>Dostępne na</p>
            <div className={styles.platformList}>
              {movie.platforms.map((p) => (
                <a
                  key={p}
                  href={movie.watchUrls[p]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.platformLink}
                  style={{ backgroundColor: PLATFORM_COLORS[p] ?? '#555' }}
                >
                  <PlatformLogo platform={p} size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <button className={styles.closeBtn} onClick={onClose}>
          Zamknij
        </button>
      </div>
    </>
  )
}

MovieDetailSheet.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    duration: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    genre: PropTypes.arrayOf(PropTypes.string).isRequired,
    poster: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    platforms: PropTypes.arrayOf(PropTypes.string).isRequired,
    watchUrls: PropTypes.objectOf(PropTypes.string).isRequired,
  }),
  onClose: PropTypes.func.isRequired,
}
