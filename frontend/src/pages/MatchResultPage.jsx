import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getSession } from '../services/sessionService'
import { MOVIES } from '../data/movies'

export default function MatchResultPage() {
  const { sessionId } = useParams()
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    getSession(sessionId)
      .then((session) => {
        if (cancelled) return
        const movie = MOVIES.find((m) => m.id === session.matchedMovieId)
        const url = movie ? Object.values(movie.watchUrls)[0] : null
        if (url) {
          window.location.href = url
        } else {
          setError('Nie znaleziono linku do oglądania.')
        }
      })
      .catch(() => {
        if (!cancelled) setError('Nie udało się załadować sesji.')
      })
    return () => { cancelled = true }
  }, [sessionId])

  if (error) {
    return (
      <div style={{ padding: '40px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: '32px', marginBottom: '16px' }}>😕</p>
        <p style={{ fontWeight: 700, marginBottom: '8px' }}>Ups!</p>
        <p style={{ color: '#666' }}>{error}</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '40px 24px', textAlign: 'center' }}>
      <p style={{ fontSize: '32px', marginBottom: '16px' }}>🎬</p>
      <p style={{ fontWeight: 700 }}>Przekierowuję do serwisu...</p>
    </div>
  )
}
