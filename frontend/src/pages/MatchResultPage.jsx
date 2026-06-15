import { useEffect } from 'react'

export default function MatchResultPage() {
  useEffect(() => {
    window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  }, [])

  return (
    <div style={{ padding: '40px 24px', textAlign: 'center' }}>
      <p style={{ fontSize: '32px', marginBottom: '16px' }}>🎬</p>
      <p style={{ fontWeight: 700 }}>Przekierowuję do serwisu...</p>
    </div>
  )
}
