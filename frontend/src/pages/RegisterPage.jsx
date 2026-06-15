import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../firebase'
import { useAuth } from '../hooks/useAuth'
import { getAuthError } from '../utils/firebaseError'
import styles from './RegisterPage.module.css'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DEBOUNCE_MS = 500

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
  const timers = useRef({})
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/dashboard')
  }, [user, navigate])

  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), [])

  const scheduleValidate = (field, value, currentFields) => {
    clearTimeout(timers.current[field])
    timers.current[field] = setTimeout(() => {
      const err = field === 'confirmPassword'
        ? validators.confirmPassword(value, currentFields.password)
        : validators[field](value)
      setTouched((t) => ({ ...t, [field]: true }))
      setFieldErrors((e) => ({ ...e, [field]: err }))
    }, DEBOUNCE_MS)
  }

  const commitValidate = (field, currentFields) => {
    clearTimeout(timers.current[field])
    const value = currentFields[field]
    const err = field === 'confirmPassword'
      ? validators.confirmPassword(value, currentFields.password)
      : validators[field](value)
    setTouched((t) => ({ ...t, [field]: true }))
    setFieldErrors((e) => ({ ...e, [field]: err }))
  }

  const handleChange = (field, value) => {
    const updated = { ...fields, [field]: value }
    setFields(updated)
    scheduleValidate(field, value, updated)
    // when password changes, also re-schedule confirmPassword if it's been touched
    if (field === 'password' && touched.confirmPassword) {
      scheduleValidate('confirmPassword', updated.confirmPassword, updated)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    Object.values(timers.current).forEach(clearTimeout)
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

  const renderField = (name, label, type = 'text', placeholder = '') => (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <input
        className={`${styles.input} ${touched[name] && fieldErrors[name] ? styles.inputError : ''}`}
        type={type}
        placeholder={placeholder}
        value={fields[name]}
        onChange={(e) => handleChange(name, e.target.value)}
        onBlur={() => commitValidate(name, fields)}
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
          {renderField('firstName', 'Imię', 'text', 'np. Zuza')}
          {renderField('email', 'Email', 'email', 'twoj@email.com')}
          {renderField('password', 'Hasło', 'password', 'min. 6 znaków')}
          {renderField('confirmPassword', 'Powtórz hasło', 'password', 'powtórz hasło')}

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
