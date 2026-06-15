import { useState } from 'react'
import { useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useSession } from '../hooks/useSession'
import { joinSession } from '../services/sessionService'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const [params] = useSearchParams()
  const mode = params.get('mode') ?? 'host' // 'host' | 'join'
  const isJoin = mode === 'join'

  const [name, setName] = useState('')
  const [code, setCode] = useState((params.get('code') ?? '').toUpperCase())
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const location = useLocation()
  const { setHostSession, setJoinedSession } = useSession()
  const navigate = useNavigate()
  const returnPath = location.state?.returnPath || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return setError('Podaj swoje imię')
    if (isJoin && !code.trim()) return setError('Podaj kod sesji')

    setError('')
    setLoading(true)

    try {
      if (isJoin) {
        const result = await joinSession(code.trim().toUpperCase(), name.trim())
        setJoinedSession(result.session, result.participantId)
        navigate(`/lobby/${result.session.id}`)
      } else {
        setHostSession({ hostName: name.trim() })
        navigate('/setup', { state: { role: 'host' } })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`screen ${styles.login}`}>
      <header className={styles.header}>
        <Link to={returnPath} className={styles.back}>
          ← Powrót
        </Link>
        <span className={styles.logo}>🎬 Movie Matcher</span>
      </header>

      <div className={styles.content}>
        <h1 className={styles.title}>{isJoin ? 'Dołącz do sesji' : 'Utwórz sesję'}</h1>
        <p className={styles.subtitle}>
          {isJoin
            ? 'Wpisz imię i kod sesji od hosta'
            : 'Jak masz na imię? Inni zobaczą Cię w lobby'}
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Twoje imię</label>
            <input
              className={styles.input}
              type="text"
              placeholder="np. Zuza"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={30}
              autoFocus
            />
          </div>

          {isJoin && (
            <div className={styles.field}>
              <label className={styles.label}>Kod sesji</label>
              <input
                className={`${styles.input} ${styles.inputCode}`}
                type="text"
                placeholder="np. A3F7K2"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength={6}
              />
            </div>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.btnSubmit} type="submit" disabled={loading}>
            {loading ? 'Łączenie…' : isJoin ? 'Dołącz' : 'Dalej →'}
          </button>
        </form>

        <p className={styles.switchMode}>
          {isJoin ? 'Chcesz utworzyć sesję? ' : 'Masz kod sesji? '}
          <Link
            to={`/login?mode=${isJoin ? 'host' : 'join'}`}
            state={{ returnPath }}
          >
            {isJoin ? 'Utwórz nową' : 'Dołącz do istniejącej'}
          </Link>
        </p>
      </div>
    </div>
  )
}
