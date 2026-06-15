import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useSession } from '../hooks/useSession'
import { fetchMovies } from '../services/movieService'
import MoviePoster from '../components/ui/MoviePoster'
import styles from './DashboardPage.module.css'

const recentSessions = [
  { title: 'Family Movie Night', subtitle: 'Matched: Spider-Man: Across the Universe', time: '2d ago' },
  { title: 'Friday Date Night', subtitle: 'Matched: Past Lives', time: '5d ago' },
]

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const { session } = useSession()
  const navigate = useNavigate()
  const [suggested, setSuggested] = useState([])

  useEffect(() => {
    fetchMovies()
      .then((movies) => setSuggested(movies.slice(0, 3)))
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/auth')
  }

  const openSessionPath = session?.status === 'active' ? `/session/${session.id}` : session?.status === 'waiting' ? `/lobby/${session.id}` : null

  return (
    <div className={styles.dashboard}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.brand}>MOVIEMATCH</span>
          <p className={styles.pageLabel}>PRZEGLĄD</p>
        </div>
        <button className={styles.avatarSmall} onClick={handleLogout} title="Wyloguj">
          {user?.displayName?.charAt(0).toUpperCase() ?? 'A'}
        </button>
      </header>

      {openSessionPath && (
        <section className={styles.statusCard}>
          <div>
            <p className={styles.sessionInfo}>Sesja w toku</p>
            <p className={styles.sessionCode}>{session.name}</p>
          </div>
          <button className={styles.rejoinButton} onClick={() => navigate(openSessionPath)}>
            Wróć →
          </button>
        </section>
      )}

      <section className={styles.heroCard}>
        <p className={styles.heroKicker}>WITAJ PONOWNIE, {(user?.displayName ?? 'UŻYTKOWNIKU').toUpperCase()}</p>
        <h1 className={styles.heroTitle}>Gotowy na wieczór filmowy?</h1>
        <p className={styles.heroSubtitle}>Znajdź film, który wszyscy naprawdę chcą obejrzeć.</p>
        <div className={styles.buttonRow}>
          <button className={styles.primaryButton} onClick={() => navigate('/setup')}>Nowa sesja</button>
          <button className={styles.secondaryButton} onClick={() => navigate('/login?mode=join')}>Dołącz do sesji</button>
        </div>
      </section>

      <section className={styles.suggestedSection}>
        <div className={styles.sectionHeading}>
          <h2>Propozycje</h2>
          <button type="button" className={styles.viewAllButton} onClick={() => navigate('/catalog')}>
            Zobacz wszystkie
          </button>
        </div>

        <div className={styles.suggestedGrid}>
          {suggested.map((movie) => (
            <a
              key={movie.id}
              className={styles.suggestedCard}
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={styles.suggestedImage}>
                <MoviePoster src={movie.poster} alt={movie.title} className={styles.suggestedPoster} />
                <span className={styles.suggestedBadge}>{movie.platforms[0]}</span>
              </div>
              <div className={styles.suggestedCopy}>
                <h3>{movie.title}</h3>
                <p>{movie.genre.join(' • ')} • {movie.year}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className={styles.recentSection}>
        <div className={styles.sectionHeading}>
          <h2>Ostatnie sesje</h2>
        </div>

        <div className={styles.recentList}>
          {recentSessions.map((s) => (
            <div key={s.title} className={styles.recentItem}>
              <div>
                <p className={styles.recentTitle}>{s.title}</p>
                <p className={styles.recentSubtitle}>{s.subtitle}</p>
              </div>
              <span className={styles.recentTime}>{s.time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
