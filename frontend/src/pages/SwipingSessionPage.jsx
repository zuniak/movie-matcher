import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSession } from '../hooks/useSession'
import { getSession, castVote } from '../services/sessionService'
import { fetchMovieById } from '../services/movieService'
import MovieCard from '../components/ui/MovieCard'
import MovieDetailSheet from '../components/sheets/MovieDetailSheet'
import styles from './SwipingSessionPage.module.css'

const POLL_INTERVAL = 2000

export default function SwipingSessionPage() {
  const { sessionId } = useParams()
  const { participantId } = useSession()
  const navigate = useNavigate()

  const [movies, setMovies] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [detailMovie, setDetailMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)
  const navigatedRef = useRef(false)

  const goToResult = useCallback(() => {
    if (navigatedRef.current) return
    navigatedRef.current = true
    navigate(`/session/${sessionId}/result`)
  }, [sessionId, navigate])

  const loadMovies = useCallback(async () => {
    try {
      const session = await getSession(sessionId)
      if (session.status === 'finished') {
        goToResult()
        return
      }
      const fetched = await Promise.all(session.movies.map((id) => fetchMovieById(id)))
      setMovies(fetched.filter(Boolean))
    } finally {
      setLoading(false)
    }
  }, [sessionId, goToResult])

  useEffect(() => {
    loadMovies()
  }, [loadMovies])

  // Poll session status so all participants get redirected when a match is found
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const session = await getSession(sessionId)
        if (session.status === 'finished') {
          goToResult()
        }
      } catch {
        // ignore poll errors
      }
    }, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [sessionId, goToResult])

  const vote = async (action) => {
    if (voting || currentIndex >= movies.length) return
    setVoting(true)
    const movie = movies[currentIndex]
    try {
      const result = await castVote(sessionId, participantId, movie.id, action)
      if (result.match) {
        goToResult()
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
      <div className={styles.cardArea}>
        <MovieCard
          movie={current}
          onLike={() => vote('like')}
          onSkip={() => vote('skip')}
          onInfo={() => setDetailMovie(current)}
        />
      </div>

      <MovieDetailSheet movie={detailMovie} onClose={() => setDetailMovie(null)} />
    </div>
  )
}
