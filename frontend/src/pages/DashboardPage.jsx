import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useSession } from '../hooks/useSession'
import { MOVIES } from '../data/movies'
import styles from './DashboardPage.module.css'

const suggested = MOVIES.slice(0, 3)

const recentSessions = [
  { title: 'Family Movie Night', subtitle: 'Matched: Spider-Man: Across the Universe', time: '2d ago' },
  { title: 'Friday Date Night', subtitle: 'Matched: Past Lives', time: '5d ago' },
]

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const { session } = useSession()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/auth')
  }

  const openSessionPath = session?.status === 'active' ? `/session/${session.id}` : session?.status === 'waiting' ? `/lobby/${session.id}` : null

  return (
    <div className={`screen ${styles.dashboard}`}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.brand}>MOVIEMATCH</span>
          <p className={styles.pageLabel}>Przegląd</p>
        </div>
        <div className={styles.avatarSmall} aria-label="User profile">
          {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'A'}
        </div>
      </header>

      <section className={styles.heroCard}>
        <div className={styles.heroIntro}>
          <p className={styles.heroKicker}>
            Witaj ponownie{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}
          </p>
          <h1 className={styles.heroTitle}>Gotowy na wieczór filmowy?</h1>
          <p className={styles.heroSubtitle}>Znajdź film, który wszyscy naprawdę chcą obejrzeć.</p>
        </div>

        <div className={styles.buttonRow}>
          <button className={styles.primaryButton} type="button" onClick={() => navigate('/setup')}>
            Nowa sesja
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
            Dołącz do sesji
          </button>
        </div>

        {openSessionPath ? (
          <div className={styles.statusCard}>
            <div>
              <p className={styles.sessionCode}>{session.code ?? session.id}</p>
              <p className={styles.sessionInfo}>
                {session.participants?.length ?? 1}{' '}
                {(session.participants?.length ?? 1) === 1 ? 'uczestnik' : 'uczestników'} · {session.status === 'active' ? 'w trakcie' : 'lobby'}
              </p>
            </div>
            <button
              className={styles.rejoinButton}
              type="button"
              onClick={() => navigate(openSessionPath)}
            >
              Przejdź do sesji →
            </button>
          </div>
        ) : null}
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
          <h2>Ostatnie sesje</h2>
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
