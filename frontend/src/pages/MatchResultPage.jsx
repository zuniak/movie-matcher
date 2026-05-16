import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getSessionResult } from '../services/sessionService'
import styles from './MatchResultPage.module.css'

const PLATFORM_COLORS = {
  Netflix: '#E60914',
  'HBO Max': '#8A2BE2',
  'Disney+': '#0072D7',
  'Prime Video': '#00A8E1',
}

export default function MatchResultPage() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getSessionResult(sessionId)
      .then(setResult)
      .catch((err) => setError(err.message))
  }, [sessionId])

  if (error) {
    return (
      <div className={`screen ${styles.result}`}>
        <div className={styles.errorState}>
          <p>Nie znaleziono dopasowania 😕</p>
          <Link to="/dashboard">Wróć do strony głównej</Link>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className={`screen ${styles.result}`}>
        <p className={styles.loading}>Ładowanie wyniku…</p>
      </div>
    )
  }

  const { movie, contenders, participants } = result

  return (
    <div className={`screen ${styles.result}`}>
      <div className={styles.confetti} aria-hidden>
        {['🎉', '🎊', '⭐', '🍿', '🎬'].map((e, i) => (
          <span key={i} className={styles.confettiPiece} style={{ '--i': i }}>
            {e}
          </span>
        ))}
      </div>

      <div className={styles.content}>
        <p className={styles.matchLabel}>It&apos;s a Match!</p>

        <div className={styles.winner}>
          <img className={styles.poster} src={movie.poster} alt={movie.title} />
          <div className={styles.winnerInfo}>
            <h1 className={styles.title}>{movie.title}</h1>
            <p className={styles.meta}>
              {movie.year} · ⭐ {movie.rating}
            </p>
            <p className={styles.matchedBy}>
              Wybrany przez {participants.length}{' '}
              {participants.length === 1 ? 'osobę' : 'osoby'}
            </p>
            <div className={styles.watchLinks}>
              {movie.platforms.map((p) => (
                <a
                  key={p}
                  href={movie.watchUrls[p]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.watchBtn}
                  style={{ backgroundColor: PLATFORM_COLORS[p] ?? '#555' }}
                >
                  Oglądaj na {p}
                </a>
              ))}
            </div>
          </div>
        </div>

        {contenders.length > 0 && (
          <div className={styles.contenders}>
            <p className={styles.contendersLabel}>Close Contenders</p>
            <div className={styles.contendersList}>
              {contenders.map((m) => (
                <div key={m.id} className={styles.contender}>
                  <img className={styles.contenderPoster} src={m.poster} alt={m.title} />
                  <p className={styles.contenderTitle}>{m.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className={styles.newSessionBtn} onClick={() => navigate('/')}>
          Nowa sesja
        </button>
      </div>
    </div>
  )
}
