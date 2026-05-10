import { useNavigate } from 'react-router-dom'
import styles from './SplashPage.module.css'

export default function SplashPage() {
  const navigate = useNavigate()

  return (
    <div className={`screen ${styles.splash}`}>
      <div className={styles.hero}>
        <div className={styles.logoIcon}>🎬</div>
        <h1 className={styles.title}>Movie Matcher</h1>
        <p className={styles.tagline}>Znajdź film, który wszyscy pokochają</p>
      </div>

      <div className={styles.features}>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>👥</span>
          <div>
            <strong>Grupowe swipowanie</strong>
            <p>Głosujcie razem w czasie rzeczywistym</p>
          </div>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>🎯</span>
          <div>
            <strong>Inteligentne filtry</strong>
            <p>Gatunek, platforma, rok produkcji</p>
          </div>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>⚡</span>
          <div>
            <strong>Zero rejestracji</strong>
            <p>Wejdź i zacznij w kilka sekund</p>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.btnPrimary} onClick={() => navigate('/login?mode=host')}>
          Utwórz sesję
        </button>
        <button className={styles.btnSecondary} onClick={() => navigate('/login?mode=join')}>
          Dołącz do sesji
        </button>
      </div>
    </div>
  )
}
