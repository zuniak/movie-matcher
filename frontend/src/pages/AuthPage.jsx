import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import styles from './AuthPage.module.css'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
      navigate('/')
    } catch (err) {
      setError(err.message)
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
        <h1 className={styles.title}>{isLogin ? 'Zaloguj się' : 'Zarejestruj się'}</h1>
        <p className={styles.subtitle}>
          {isLogin ? 'Witaj z powrotem!' : 'Utwórz nowe konto'}
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              placeholder="twoj@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.btnSubmit} type="submit" disabled={loading}>
            {loading ? 'Ładowanie...' : isLogin ? 'Zaloguj się' : 'Zarejestruj się'}
          </button>
        </form>

        <p className={styles.switchMode}>
          {isLogin ? 'Nie masz konta? ' : 'Masz już konto? '}
          <button className={styles.switchBtn} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Zarejestruj się' : 'Zaloguj się'}
          </button>
        </p>
      </div>
    </div>
  )
}