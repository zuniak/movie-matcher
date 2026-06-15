import { useState } from 'react'

const fallbackStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  background: 'linear-gradient(160deg, #2e2e2e, #1a1a1a)',
}

const iconStyle = { fontSize: '32px', opacity: 0.75 }

const labelStyle = {
  color: 'rgba(255,255,255,0.5)',
  fontSize: '11px',
  fontWeight: 600,
  textAlign: 'center',
  lineHeight: 1.4,
  padding: '0 8px',
}

export default function MoviePoster({ src, alt, className }) {
  const [error, setError] = useState(false)
  if (error) {
    return (
      <div className={className} style={fallbackStyle}>
        <span style={iconStyle}>🎬</span>
        <span style={labelStyle}>{alt}</span>
      </div>
    )
  }
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} loading="lazy" />
}
