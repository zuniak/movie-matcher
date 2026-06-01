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
  const [loadError, setLoadError] = useState('')
  const [voting, setVoting] = useState(false)
  const [voteError, setVoteError] = useState('')
  const pollRef = useRef(null)

  const done = !loading && !loadError && movies.length > 0 && currentIndex >= movies.length

  const goToResult = useCallback(() => {
    clearInterval(pollRef.current)
    navigate(`/session/${sessionId}/result`)
  }, [navigate, sessionId])

  // Poll session status throughout the entire swiping lifecycle —
  // not just on the "done" screen. This ensures all participants are
  // redirected as soon as any participant triggers the match.
  const pollStatus = useCallback(async () => {
    try {
      const session = await getSession(sessionId)
      if (session.status === 'finished') goToResult()
    } catch {
      // keep polling — transient network errors shouldn't break the session
    }
  }, [sessionId, goToResult])

  useEffect(() => {
    pollRef.current = setInterval(pollStatus, POLL_INTERVAL)
    return () => clearInterval(pollRef.current)
  }, [pollStatus])

  const loadMovies = useCallback(async () => {
    try {
      const session = await getSession(sessionId)
      if (session.status === 'finished') {
        goToResult()
        return
      }
      if (!session.movies?.length) {
        setLoadError('Sesja nie zawiera żadnych filmów. Wróć i zmień filtry.')
        return
      }
      const fetched = await Promise.all(session.movies.map((id) => fetchMovieById(id)))
      const valid = fetched.filter(Boolean)
      if (valid.length === 0) {
        setLoadError('Nie udało się załadować filmów. Spróbuj ponownie.')
        return
      }
      setMovies(valid)
    } catch (err) {
      setLoadError(err.message ?? 'Błąd połączenia z sesją.')
    } finally {
      setLoading(false)
    }
  }, [sessionId, goToResult])

  useEffect(() => {
    loadMovies()
  }, [loadMovies])

  const vote = async (action) => {
    if (voting || currentIndex >= movies.length) return
    setVoteError('')
    setVoting(true)
    const movie = movies[currentIndex]
    try {
      const result = await castVote(sessionId, participantId, movie.id, action)
      if (result.match) {
        goToResult()
        return
      }
      setCurrentIndex((i) => i + 1)
    } catch (err) {
      // If vote rejected because session finished, navigate immediately
      // instead of showing the 409 error message
      if (err.message?.includes('aktywna') || err.message?.includes('istnieje')) {
        pollStatus()
      } else {
        setVoteError(err.message)
      }
    } finally {
      setVoting(false)
    }
  }

  if (loading) {
    return (
      <div className={`screen ${styles.swiping}`}>
        <p className={styles.loading}>Ładowanie filmów…</p>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className={`screen ${styles.swiping}`}>
        <div className={styles.done}>
          <p className={styles.doneIcon}>⚠️</p>
          <h2>Coś poszło nie tak</h2>
          <p>{loadError}</p>
          <button
            className={styles.retryBtn}
            onClick={() => {
              setLoadError('')
              setLoading(true)
              loadMovies()
            }}
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    )
  }

  const progressPct = movies.length > 0 ? (currentIndex / movies.length) * 100 : 0

  if (done) {
    return (
      <div className={`screen ${styles.swiping}`}>
        <div className={styles.done}>
          <p className={styles.doneIcon}>🎬</p>
          <h2>Oceniłeś wszystkie filmy!</h2>
          <p>Czekaj na pozostałych uczestników…</p>
          <div className={styles.spinner} />
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
          <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
        </div>
      </header>

      {voteError && <p className={styles.voteError}>{voteError}</p>}

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
