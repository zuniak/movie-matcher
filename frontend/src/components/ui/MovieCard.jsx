import PropTypes from 'prop-types'
import PlatformLogo from './PlatformLogo'
import styles from './MovieCard.module.css'

const PLATFORM_COLORS = {
  Netflix: '#E60914',
  'HBO Max': '#8A2BE2',
  'Disney+': '#0072D7',
  'Prime Video': '#00A8E1',
}

export default function MovieCard({ movie, onLike, onSkip, onInfo, progress }) {
  return (
    <article className={styles.card}>
      <div className={styles.posterWrapper}>
        <img
          className={styles.poster}
          src={movie.poster}
          alt={movie.title}
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.nextSibling?.classList?.add(styles.posterFallback)
          }}
        />
        <div className={styles.posterPlaceholder}>
          <span className={styles.posterPlaceholderTitle}>{movie.title}</span>
        </div>
        <div className={styles.platforms}>
          {movie.platforms.map((p) => (
            <span
              key={p}
              className={styles.platform}
              style={{ backgroundColor: PLATFORM_COLORS[p] ?? '#555' }}
              title={p}
            >
              <PlatformLogo platform={p} size={16} />
            </span>
          ))}
        </div>
        {progress && (
          <span className={styles.progress}>
            {progress.current} z {progress.total}
          </span>
        )}
      </div>

      <div className={styles.info}>
        <h2 className={styles.title}>{movie.title}</h2>
        <p className={styles.meta}>
          {movie.year} · {movie.duration} · ⭐ {movie.rating}
        </p>
        <div className={styles.genres}>
          {movie.genre.map((g) => (
            <span key={g} className={styles.genre}>
              {g}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.actionBtn} ${styles.skip}`}
          onClick={onSkip}
          aria-label="Odrzuć"
        >
          ✕
        </button>
        <button
          className={`${styles.actionBtn} ${styles.info}`}
          onClick={onInfo}
          aria-label="Szczegóły"
        >
          ℹ
        </button>
        <button
          className={`${styles.actionBtn} ${styles.like}`}
          onClick={onLike}
          aria-label="Lubię"
        >
          ♥
        </button>
      </div>
    </article>
  )
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    genre: PropTypes.arrayOf(PropTypes.string).isRequired,
    platforms: PropTypes.arrayOf(PropTypes.string).isRequired,
    description: PropTypes.string.isRequired,
    poster: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    duration: PropTypes.string.isRequired,
    watchUrls: PropTypes.objectOf(PropTypes.string).isRequired,
  }).isRequired,
  onLike: PropTypes.func.isRequired,
  onSkip: PropTypes.func.isRequired,
  onInfo: PropTypes.func.isRequired,
  progress: PropTypes.shape({
    current: PropTypes.number,
    total: PropTypes.number,
  }),
}
