import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { getSession } from '../services/sessionService'
import { fetchMovieById } from '../services/movieService'
import MoviePoster from '../components/ui/MoviePoster'
import styles from './MatchResultPage.module.css'

const WATCH_URL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

export default function MatchResultPage() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSession(sessionId)
      .then((session) => {
        if (session.matchedMovieId) {
          return fetchMovieById(session.matchedMovieId)
        }
        return null
      })
      .then((m) => setMovie(m))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [sessionId])

  useEffect(() => {
    if (loading) return
    const end = Date.now() + 2500
    const colors = ['#e60914', '#ffffff', '#ffcc00'];
    (function frame() {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors })
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors })
      if (Date.now() < end) requestAnimationFrame(frame)
    })()
  }, [loading])

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Ładowanie wyniku…</div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <MoviePoster
        src={movie?.poster}
        alt={movie?.title ?? ''}
        className={movie?.poster ? styles.poster : styles.posterFallback}
      />

      <div className={styles.content}>
        <p className={styles.kicker}>🎉 Macie dopasowanie!</p>
        <h1 className={styles.title}>{movie?.title ?? 'Nieznany film'}</h1>
        {movie && (
          <>
            <p className={styles.meta}>
              {movie.year} · {movie.duration} · ⭐ {movie.rating}
            </p>
            <div className={styles.genres}>
              {movie.genre.map((g) => (
                <span key={g} className={styles.genre}>{g}</span>
              ))}
            </div>
            {movie.description && (
              <p className={styles.description}>{movie.description}</p>
            )}
          </>
        )}
      </div>

      <div className={styles.footer}>
        <a
          className={styles.btnWatch}
          href={WATCH_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Oglądaj teraz →
        </a>
        <button className={styles.btnBack} onClick={() => navigate('/dashboard')}>
          Wróć do strony głównej
        </button>
      </div>
    </div>
  )
}
