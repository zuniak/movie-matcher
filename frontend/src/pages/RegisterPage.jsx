import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../firebase'
import { useAuth } from '../hooks/useAuth'
import { getAuthError } from '../utils/firebaseError'
import styles from './RegisterPage.module.css'

export default function RegisterPage() {
  const { user } = useAuth()
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!firstName.trim()) return setError('Podaj imię')
    if (password !== confirmPassword) return setError('Hasła nie są identyczne')
    if (password.length < 6) return setError('Hasło musi mieć min. 6 znaków')

    setLoading(true)
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, {
        displayName: firstName.trim(),
      })
      navigate('/dashboard')
    } catch (err) {
      setError(getAuthError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`screen ${styles.register}`}>
      <header className={styles.header}>
        <Link to="/auth" className={styles.back}>← Powrót</Link>
        <span className={styles.logo}>🎬 Movie Matcher</span>
      </header>

      <div className={styles.content}>
        <h1 className={styles.title}>Zarejestruj się</h1>
        <p className={styles.subtitle}>Utwórz nowe konto</p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label}>Imię</label>
            <input
              className={styles.input}
              type="text"
              placeholder="np. Julita"
              value={firstName}
              onChange={(e) => { e.target.setCustomValidity(''); setFirstName(e.target.value) }}
              onInvalid={(e) => e.target.setCustomValidity('Podaj swoje imię.')}
              required
              autoFocus
            />
          </div>

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

          <div className={styles.field}>
            <label className={styles.label}>Powtórz hasło</label>
            <input
              className={styles.input}
              type="password"
              placeholder="powtórz hasło"
              value={confirmPassword}
              onChange={(e) => { e.target.setCustomValidity(''); setConfirmPassword(e.target.value) }}
              onInvalid={(e) => e.target.setCustomValidity('Powtórz hasło.')}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.btnSubmit} type="submit" disabled={loading}>
            {loading ? 'Rejestracja...' : 'Zarejestruj się'}
          </button>
        </form>

        <p className={styles.switchMode}>
          Masz już konto?{' '}
          <Link to="/auth">Zaloguj się</Link>
        </p>
      </div>
    </div>
  )
}