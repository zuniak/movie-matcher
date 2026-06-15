import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useAuth } from '../hooks/useAuth'
import { getAuthError } from '../utils/firebaseError'
import styles from './AuthPage.module.css'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateEmail(val) {
  if (!val) return 'Podaj adres email.'
  if (!EMAIL_RE.test(val)) return 'Wpisz prawidłowy adres email (np. imie@domena.pl).'
  return ''
}

function validatePassword(val) {
  if (!val) return 'Podaj hasło.'
  return ''
}

export default function AuthPage() {
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' })
  const [touched, setTouched] = useState({ email: false, password: false })
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  useEffect(() => {
    if (user) navigate(from, { replace: true })
  }, [user, navigate, from])

  const touch = (field) => setTouched((t) => ({ ...t, [field]: true }))

  const handleEmailChange = (val) => {
    setEmail(val)
    if (touched.email) setFieldErrors((e) => ({ ...e, email: validateEmail(val) }))
  }

  const handlePasswordChange = (val) => {
    setPassword(val)
    if (touched.password) setFieldErrors((e) => ({ ...e, password: validatePassword(val) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    const errors = { email: validateEmail(email), password: validatePassword(password) }
    setFieldErrors(errors)
    setTouched({ email: true, password: true })
    if (errors.email || errors.password) return
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setSubmitError(getAuthError(err))
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
              className={`${styles.input} ${touched.email && fieldErrors.email ? styles.inputError : ''}`}
              type="email"
              placeholder="twoj@email.com"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onBlur={() => { touch('email'); setFieldErrors((err) => ({ ...err, email: validateEmail(email) })) }}
              autoFocus
            />
            {touched.email && fieldErrors.email && <p className={styles.fieldError}>{fieldErrors.email}</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Hasło</label>
            <input
              className={`${styles.input} ${touched.password && fieldErrors.password ? styles.inputError : ''}`}
              type="password"
              placeholder="min. 6 znaków"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              onBlur={() => { touch('password'); setFieldErrors((err) => ({ ...err, password: validatePassword(password) })) }}
            />
            {touched.password && fieldErrors.password && <p className={styles.fieldError}>{fieldErrors.password}</p>}
          </div>

          {submitError && <p className={styles.error}>{submitError}</p>}

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
