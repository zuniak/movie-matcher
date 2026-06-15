import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import styles from './SplashScreenPage.module.css'

export default function SplashScreenPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  return (
    <div className={`screen ${styles.splash}`}>
      <div className={styles.backgroundGlow} />
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.badge} aria-hidden="true">
            <span className={styles.icon}>🎬</span>
          </div>
          <h1 className={styles.title}>MOVIE MATCHER</h1>
          <p className={styles.tagline}>Znajdź film, który wszyscy naprawdę chcą obejrzeć.</p>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.primary}
            type="button"
            onClick={() => navigate('/auth')}
          >
            Zaloguj się lub utwórz konto
          </button>
          <button
            className={styles.secondary}
            type="button"
            onClick={() => navigate('/login?mode=host')}
          >
            Kontynuuj jako gość
          </button>
        </div>

        <p className={styles.note}>Sesje gościnne nie są zapisywane.</p>
      </div>
    </div>
  )
}
