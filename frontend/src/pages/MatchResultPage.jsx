import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getSessionResult } from '../services/sessionService'
import MoviePoster from '../components/ui/MoviePoster'
import styles from './MatchResultPage.module.css'
import { getSession } from '../services/sessionService'
import { updateSessionHistory } from '../services/sessionHistoryService'
import { useAuth } from '../hooks/useAuth'
import { useSession } from '../hooks/useSession'

const WATCH_URL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

export default function MatchResultPage() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const { setHostSession, setJoinedSession } = useSession()


useEffect(() => {
  async function loadResult() {
    try {
      const [resultData, sessionData] = await Promise.all([
        getSessionResult(sessionId),
        getSession(sessionId),
      ])

      setResult(resultData)

      if (user) {
        const autoSaveEnabled = JSON.parse(
          localStorage.getItem('mm_autosave') ?? 'true'
        )

        if (autoSaveEnabled) {
          updateSessionHistory(user, sessionId, {
            status: 'finished',
            matchedMovieId: resultData.movie.id,
            participants: resultData.participants.length,
            name: sessionData.name,
            tags: [
              ...(sessionData.filters?.genres || []),
              ...(sessionData.filters?.platforms || []),
            ],
          })
        }

        const notificationsEnabled = JSON.parse(
          localStorage.getItem('mm_notifications') ?? 'false'
        )

        if (
          notificationsEnabled &&
          'Notification' in window &&
          Notification.permission === 'granted'
        ) {
          new Notification('MovieMatch', {
            body: `Znaleziono dopasowanie: ${resultData.movie.title}`,
          })
        }

        setHostSession(null)
      } else {
        setJoinedSession(null, null)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  loadResult()
}, [sessionId, user, setHostSession, setJoinedSession])

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
          <MoviePoster
            src={movie.poster}
            alt={movie.title}
            className={styles.poster}
          />
          <div className={styles.winnerInfo}>
            <h1 className={styles.title}>{movie.title}</h1>
            <p className={styles.meta}>
              {movie.year} · ⭐ {movie.rating}
            </p>

            <div className={styles.matchedByRow}>
              <div className={styles.avatarStack}>
                {participants.map((p) => (
                  <div key={p.id} className={styles.avatar} title={p.name}>
                    {p.name[0].toUpperCase()}
                  </div>
                ))}
              </div>
              <p className={styles.matchedBy}>
                Wybrany przez {participants.length}{' '}
                {participants.length === 1 ? 'osobę' : 'osoby'}
              </p>
            </div>

            <a
              href={WATCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.watchBtn}
            >
              Oglądaj teraz →
            </a>
          </div>
        </div>

        {contenders && contenders.length > 0 && (
          <div className={styles.contenders}>
            <p className={styles.contendersLabel}>Bliscy rywale</p>
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

        <button className={styles.newSessionBtn} onClick={() => navigate('/dashboard')}>
          Wróć do strony głównej
        </button>
      </div>
    </div>
  )
}
