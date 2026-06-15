import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../firebase'
import { useAuth } from '../hooks/useAuth'
import { getAuthError } from '../utils/firebaseError'
import styles from './RegisterPage.module.css'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validators = {
  firstName: (v) => (!v.trim() ? 'Podaj swoje imię.' : ''),
  email: (v) => {
    if (!v) return 'Podaj adres email.'
    if (!EMAIL_RE.test(v)) return 'Wpisz prawidłowy adres email (np. imie@domena.pl).'
    return ''
  },
  password: (v) => {
    if (!v) return 'Podaj hasło.'
    if (v.length < 6) return 'Hasło musi mieć min. 6 znaków.'
    return ''
  },
  confirmPassword: (v, password) => {
    if (!v) return 'Powtórz hasło.'
    if (v !== password) return 'Hasła nie są identyczne.'
    return ''
  },
}

export default function RegisterPage() {
  const { user } = useAuth()
  const [fields, setFields] = useState({ firstName: '', email: '', password: '', confirmPassword: '' })
  const [fieldErrors, setFieldErrors] = useState({ firstName: '', email: '', password: '', confirmPassword: '' })
  const [touched, setTouched] = useState({ firstName: false, email: false, password: false, confirmPassword: false })
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/dashboard')
  }, [user, navigate])

  const touch = (field) => setTouched((t) => ({ ...t, [field]: true }))

  const validate = (field, value) =>
    field === 'confirmPassword'
      ? validators.confirmPassword(value, fields.password)
      : validators[field](value)

  const handleChange = (field, value) => {
    const updated = { ...fields, [field]: value }
    setFields(updated)
    if (touched[field]) {
      const err = field === 'confirmPassword'
        ? validators.confirmPassword(value, updated.password)
        : validators[field](value)
      setFieldErrors((e) => ({ ...e, [field]: err }))
      if (field === 'password' && touched.confirmPassword) {
        setFieldErrors((e) => ({ ...e, confirmPassword: validators.confirmPassword(updated.confirmPassword, value) }))
      }
    }
  }

  const handleBlur = (field) => {
    touch(field)
    setFieldErrors((e) => ({ ...e, [field]: validate(field, fields[field]) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    const errors = {
      firstName: validators.firstName(fields.firstName),
      email: validators.email(fields.email),
      password: validators.password(fields.password),
      confirmPassword: validators.confirmPassword(fields.confirmPassword, fields.password),
    }
    setFieldErrors(errors)
    setTouched({ firstName: true, email: true, password: true, confirmPassword: true })
    if (Object.values(errors).some(Boolean)) return
    setLoading(true)
    try {
      const result = await createUserWithEmailAndPassword(auth, fields.email, fields.password)
      await updateProfile(result.user, { displayName: fields.firstName.trim() })
      navigate('/dashboard')
    } catch (err) {
      setSubmitError(getAuthError(err))
    } finally {
      setLoading(false)
    }
  }

  const field = (name, label, type = 'text', placeholder = '') => (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <input
        className={`${styles.input} ${touched[name] && fieldErrors[name] ? styles.inputError : ''}`}
        type={type}
        placeholder={placeholder}
        value={fields[name]}
        onChange={(e) => handleChange(name, e.target.value)}
        onBlur={() => handleBlur(name)}
        autoFocus={name === 'firstName'}
      />
      {touched[name] && fieldErrors[name] && <p className={styles.fieldError}>{fieldErrors[name]}</p>}
    </div>
  )

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
          {field('firstName', 'Imię', 'text', 'np. Zuza')}
          {field('email', 'Email', 'email', 'twoj@email.com')}
          {field('password', 'Hasło', 'password', 'min. 6 znaków')}
          {field('confirmPassword', 'Powtórz hasło', 'password', 'powtórz hasło')}

          {submitError && <p className={styles.error}>{submitError}</p>}

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
