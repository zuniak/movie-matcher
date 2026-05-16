import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSession } from '../hooks/useSession'
import { getSession, castVote } from '../services/sessionService'
import { fetchMovieById } from '../services/movieService'
import MovieCard from '../components/ui/MovieCard'
import MovieDetailSheet from '../components/sheets/MovieDetailSheet'
import styles from './SwipingSessionPage.module.css'

export default function SwipingSessionPage() {
  const { sessionId } = useParams()
  const { participantId } = useSession()
  const navigate = useNavigate()

  const [movies, setMovies] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [detailMovie, setDetailMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)

  const loadMovies = useCallback(async () => {
    try {
      const session = await getSession(sessionId)
      if (session.status === 'finished') {
        navigate(`/session/${sessionId}/result`)
        return
      }
      const fetched = await Promise.all(session.movies.map((id) => fetchMovieById(id)))
      setMovies(fetched.filter(Boolean))
    } finally {
      setLoading(false)
    }
  }, [sessionId, navigate])

  useEffect(() => {
    loadMovies()
  }, [loadMovies])

  const vote = async (action) => {
    if (voting || currentIndex >= movies.length) return
    setVoting(true)
    const movie = movies[currentIndex]
    try {
      const result = await castVote(sessionId, participantId, movie.id, action)
      if (result.match) {
        navigate(`/session/${sessionId}/result`)
        return
      }
    } catch {
      // continue swiping even on error
    } finally {
      setVoting(false)
    }
    setCurrentIndex((i) => i + 1)
  }

  if (loading) {
    return (
      <div className={`screen ${styles.swiping}`}>
        <p className={styles.loading}>Ładowanie filmów…</p>
      </div>
    )
  }

  if (currentIndex >= movies.length) {
    return (
      <div className={`screen ${styles.swiping}`}>
        <div className={styles.done}>
          <p className={styles.doneIcon}>🎬</p>
          <h2>Oceniłeś wszystkie filmy!</h2>
          <p>Czekaj na pozostałych uczestników…</p>
        </div>
      </div>
    )
  }

  const current = movies[currentIndex]

  return (
    <div className={`screen ${styles.swiping}`}>
      <header className={styles.header}>
        <span className={styles.progress}>
          {currentIndex + 1} z {movies.length}
        </span>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${((currentIndex) / movies.length) * 100}%` }}
          />
        </div>
      </header>

      <div className={styles.cardArea}>
        <MovieCard
          movie={current}
          onLike={() => vote('like')}
          onSkip={() => vote('skip')}
          onInfo={() => setDetailMovie(current)}
          progress={{ current: currentIndex + 1, total: movies.length }}
        />
      </div>

      <MovieDetailSheet movie={detailMovie} onClose={() => setDetailMovie(null)} />
    </div>
  )
}
