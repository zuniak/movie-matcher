import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useAuth } from '../hooks/useAuth'
import { getAuthError } from '../utils/firebaseError'
import styles from './AuthPage.module.css'

export default function AuthPage() {
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true })
    }
  }, [user, navigate, from])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(getAuthError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`screen ${styles.auth}`}>
      <header className={styles.header}>
        <Link to="/" className={styles.back}>← Powrót</Link>
        <span className={styles.logo}>🎬 Movie Matcher</span>
      </header>

      <div className={styles.content}>
        <h1 className={styles.title}>Zaloguj się</h1>
        <p className={styles.subtitle}>Witaj z powrotem!</p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              placeholder="twoj@email.com"
              value={email}
              onChange={(e) => { e.target.setCustomValidity(''); setEmail(e.target.value) }}
              onInvalid={(e) => e.target.setCustomValidity(
                e.target.validity.valueMissing ? 'Podaj adres email.' : 'Wpisz prawidłowy adres email (np. imie@domena.pl).'
              )}
              required
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Hasło</label>
            <input
              className={styles.input}
              type="password"
              placeholder="min. 6 znaków"
              value={password}
              onChange={(e) => { e.target.setCustomValidity(''); setPassword(e.target.value) }}
              onInvalid={(e) => e.target.setCustomValidity('Podaj hasło.')}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.btnSubmit} type="submit" disabled={loading}>
            {loading ? 'Logowanie...' : 'Zaloguj się'}
          </button>
        </form>

        <p className={styles.switchMode}>
          Nie masz konta?{' '}
          <Link to="/register">Zarejestruj się</Link>
        </p>
      </div>
    </div>
  )
}