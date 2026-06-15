import { useState } from 'react'
import styles from '../pages/SessionHistoryPage.module.css'

const STATUS_LABELS = {
  finished: 'Zakończona',
  active: 'Aktywna',
  pending: 'Oczekująca',
}

export default function SessionHistoryCard({ session, movie, onClick }) {
  const [imgError, setImgError] = useState(false)
  const sessionDate = new Date(session.createdAt).toLocaleString('pl-PL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const finished = session.status === 'finished'
  const actionLabel = finished ? 'Oglądaj' : session.status === 'active' ? 'Dołącz' : 'Otwórz lobby'

  return (
    <button type="button" className={styles.historyCard} onClick={onClick}>
      <div className={styles.cardWrapper}>
        <div className={styles.posterFrame}>
          {movie && !imgError ? (
            <img
              src={movie.poster}
              alt={movie.title}
              className={styles.posterImage}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className={styles.posterPlaceholder}>
              <span className={styles.posterPlaceholderIcon}>🎬</span>
              {movie?.title && (
                <span className={styles.posterPlaceholderTitle}>{movie.title}</span>
              )}
            </div>
          )}
        </div>

        <div className={styles.cardMeta}>
          <div className={styles.cardHeader}>
            <div>
              <p className={styles.sessionDate}>{sessionDate}</p>
              <p className={styles.sessionTitle}>{session.name}</p>
            </div>
            <span className={`${styles.statusPill} ${styles[`status_${session.status}`]}`}>
              {STATUS_LABELS[session.status] ?? 'Oczekująca'}
            </span>
          </div>

          <p className={styles.movieTitle}>{movie?.title ?? 'Oczekujące dopasowanie'}</p>
          <p className={styles.movieSubtitle}>{movie ? movie.genre.join(' • ') : 'Sesja w toku'}</p>
          <p className={styles.sessionInfo}>
            {session.participants} uczestnik{session.participants === 1 ? '' : 'ów'}
          </p>

          <div className={styles.tagRow}>
            {(movie?.platforms || session.tags || []).slice(0, 3).map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>

          <div className={styles.matchBox}>
            <span className={styles.matchLabel}>
              {finished ? 'DOPASOWANIE' : session.status === 'active' ? 'SESJA NA ŻYWO' : 'OCZEKUJE'}
            </span>
            <span className={styles.watchNow}>{actionLabel}</span>
          </div>
        </div>
      </div>
    </button>
  )
}
