import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { MOVIES } from '../data/movies'
import styles from './DashboardPage.module.css'

const suggested = MOVIES.slice(0, 3)

const recentSessions = [
  { title: 'Family Movie Night', subtitle: 'Matched: Spider-Man: Across the Universe', time: '2d ago' },
  { title: 'Friday Date Night', subtitle: 'Matched: Past Lives', time: '5d ago' },
]

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/auth')
  }

  return (
    <div className={`screen ${styles.dashboard}`}>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.pageLabel}>Dashboard</p>
          <h1 className={styles.pageTitle}>Good evening, {user?.displayName ?? 'Alex'}</h1>
        </div>
        <div className={styles.avatarCircle} aria-label="User profile">
          {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'A'}
        </div>
      </header>

      <section className={styles.heroCard}>
        <div className={styles.brandRow}>
          <span className={styles.brandMark}>MOVIEMATCH</span>
          <span className={styles.brandDot} />
        </div>

        <p className={styles.heroSubtitle}>Ready to find tonight’s watch?</p>

        <div className={styles.buttonRow}>
          <button className={styles.primaryButton} type="button" onClick={() => navigate('/setup')}>
            New session
          </button>
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={() =>
              navigate('/login?mode=join', {
                state: { returnPath: '/dashboard' },
              })
            }
          >
            Join session
          </button>
        </div>

        <div className={styles.statusCard}>
          <div>
            <p className={styles.sessionCode}>CIN-847</p>
            <p className={styles.sessionInfo}>3 participants · waiting</p>
          </div>
          <button className={styles.rejoinButton} type="button">
            Rejoin →
          </button>
        </div>
      </section>

      <section className={styles.suggestedSection}>
        <div className={styles.sectionHeading}>
          <h2>Suggested Today</h2>
          <button type="button" className={styles.viewAllButton} onClick={() => navigate('/setup')}>
            View all
          </button>
        </div>

        <div className={styles.suggestedGrid}>
          {suggested.map((movie) => (
            <article key={movie.id} className={styles.suggestedCard}>
              <div
                className={styles.suggestedImage}
                style={{ backgroundImage: `url(${movie.poster})` }}
              >
                <span className={styles.suggestedBadge}>{movie.platforms[0]}</span>
              </div>
              <div className={styles.suggestedCopy}>
                <h3>{movie.title}</h3>
                <p>
                  {movie.genre.join(' • ')} • {movie.year}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.recentSection}>
        <div className={styles.sectionHeading}>
          <h2>Recent Sessions</h2>
        </div>

        <div className={styles.recentList}>
          {recentSessions.map((session) => (
            <div key={session.title} className={styles.recentItem}>
              <div>
                <p className={styles.recentTitle}>{session.title}</p>
                <p className={styles.recentSubtitle}>{session.subtitle}</p>
              </div>
              <span className={styles.recentTime}>{session.time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
