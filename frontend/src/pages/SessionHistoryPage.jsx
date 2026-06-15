import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { fetchMovieById } from '../services/movieService'
import { getSessionHistory } from '../services/sessionHistoryService'
import SessionHistoryCard from '../components/SessionHistoryCard'
import styles from './SessionHistoryPage.module.css'

const MOCK_USER = { uid: 'guest', email: 'guest@movie.io', displayName: 'Guest' }

export default function SessionHistoryPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [movieMap, setMovieMap] = useState({})

  useEffect(() => {
    const sessions = getSessionHistory(user ?? MOCK_USER)
    setHistory(sessions)

    const ids = [...new Set(sessions.map((s) => s.matchedMovieId).filter(Boolean))]
    if (ids.length === 0) return

    Promise.all(ids.map((id) => fetchMovieById(id).then((m) => [id, m]).catch(() => [id, null])))
      .then((entries) => setMovieMap(Object.fromEntries(entries.filter(([, m]) => m))))
  }, [user])

  const handleCreate = () => navigate('/setup')

  return (
    <div className={styles.historyPage}>
      <header className={styles.pageHeader}>
        <span className={styles.brand}>MOVIEMATCH</span>
        <div className={styles.avatarSmall}>{user?.displayName?.charAt(0).toUpperCase() ?? 'A'}</div>
      </header>

      <div className={styles.pageIntro}>
        <h1 className={styles.pageTitle}>Historia sesji</h1>
        <p className={styles.pageDescription}>
          Przeglądaj swoje wcześniejsze dopasowania i szybko wracaj do ulubionych filmów.
        </p>
      </div>

      {history.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>Brak historii sesji</p>
          <p className={styles.emptyText}>
            Rozpocznij pierwszą sesję filmową, a pojawi się tu dla szybkiego dostępu.
          </p>
          <button type="button" className={styles.createButton} onClick={handleCreate}>
            Utwórz nową sesję
          </button>
        </div>
      ) : (
        <div className={styles.historyList}>
          {history.map((session) => {
            const movie = movieMap[session.matchedMovieId] ?? null
            const handleClick = () => {
              if (session.status === 'finished' && movie) {
                window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')
              } else if (session.status === 'active') {
                navigate(`/session/${session.id}`)
              } else {
                navigate(`/lobby/${session.id}`)
              }
            }
            return (
              <SessionHistoryCard
                key={session.id}
                session={session}
                movie={movie}
                onClick={handleClick}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
