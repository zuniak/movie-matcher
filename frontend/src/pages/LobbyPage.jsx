import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSession } from '../hooks/useSession'
import { getSession, startSession } from '../services/sessionService'
import styles from './LobbyPage.module.css'

const POLL_INTERVAL = 2000

export default function LobbyPage() {
  const { sessionId } = useParams()
  const { role, setHostSession, participantId } = useSession()
  const navigate = useNavigate()

  const [session, setSession] = useState(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [starting, setStarting] = useState(false)

  const fetchSession = useCallback(async () => {
    try {
      const data = await getSession(sessionId)
      setSession(data)
      if (data.status === 'active') {
        navigate(`/session/${sessionId}`)
      }
    } catch {
      setError('Nie można połączyć z sesją')
    }
  }, [sessionId, navigate])

  useEffect(() => {
    fetchSession()
    const interval = setInterval(fetchSession, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchSession])

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sessionId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleStart = async () => {
    setStarting(true)
    try {
      const updated = await startSession(sessionId)
      setHostSession(updated)
      navigate(`/session/${sessionId}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setStarting(false)
    }
  }

  const isHost = role === 'host'

  if (error) {
    return (
      <div className={`screen ${styles.lobby}`}>
        <p className={styles.errorState}>{error}</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className={`screen ${styles.lobby}`}>
        <p className={styles.loading}>Łączenie z sesją…</p>
      </div>
    )
  }

  return (
    <div className={`screen ${styles.lobby}`}>
      <header className={styles.header}>
        <h1 className={styles.sessionName}>{session.name}</h1>
        <span className={styles.status}>
          {session.participants.length}{' '}
          {session.participants.length === 1 ? 'uczestnik' : 'uczestników'}
        </span>
      </header>

      <div className={styles.codeBox}>
        <p className={styles.codeLabel}>Kod sesji</p>
        <p className={styles.code}>{sessionId}</p>
        <button className={styles.copyBtn} onClick={handleCopyCode}>
          {copied ? '✓ Skopiowano' : 'Kopiuj kod'}
        </button>
      </div>

      <div className={styles.participantsList}>
        <p className={styles.listLabel}>Uczestnicy</p>
        {session.participants.map((p) => (
          <div key={p.id} className={styles.participant}>
            <div className={styles.avatar}>{p.name[0].toUpperCase()}</div>
            <span className={styles.participantName}>{p.name}</span>
            {p.role === 'host' && <span className={styles.hostBadge}>host</span>}
            {p.id === participantId && <span className={styles.youBadge}>ty</span>}
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        {isHost ? (
          <>
            <p className={styles.hint}>
              Poczekaj aż wszyscy dołączą, a następnie rozpocznij sesję
            </p>
            <button
              className={styles.btnStart}
              onClick={handleStart}
              disabled={starting || session.participants.length < 2}
            >
              {starting ? 'Startowanie…' : 'Rozpocznij sesję →'}
            </button>
          </>
        ) : (
          <p className={styles.hint}>Czekaj na hosta, który rozpocznie sesję…</p>
        )}
      </div>
    </div>
  )
}
