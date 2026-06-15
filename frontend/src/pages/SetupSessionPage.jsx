import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../hooks/useSession'
import { useAuth } from '../hooks/useAuth'
import { createSession } from '../services/sessionService'
import { addSessionHistory } from '../services/sessionHistoryService'
import { GENRES, PLATFORMS } from '../data/constants'
import styles from './SetupSessionPage.module.css'

const PLATFORM_LIST = Object.values(PLATFORMS)
const GENRE_LIST = Object.values(GENRES)
const MIN_YEAR = 1970
const MAX_YEAR = new Date().getFullYear()

const PLATFORM_COLORS = {
  Netflix: '#E60914',
  'HBO Max': '#8A2BE2',
  'Disney+': '#0072D7',
  'Prime Video': '#00A8E1',
}

export default function SetupSessionPage() {
  const { session: sessionState, setHostSession } = useSession()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [sessionName, setSessionName] = useState('')
  const [contentType, setContentType] = useState('movie') // 'movie' | 'series'
  const [selectedGenres, setSelectedGenres] = useState([])
  const [selectedPlatforms, setSelectedPlatforms] = useState([])
  const [yearFrom, setYearFrom] = useState(1990)
  const [yearTo, setYearTo] = useState(new Date().getFullYear())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toggleGenre = (g) =>
    setSelectedGenres((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]))

  const togglePlatform = (p) =>
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    )

  const handleCreate = async () => {
    setError('')
    setLoading(true)
    try {
      const filters = {
        platforms: selectedPlatforms,
        genres: selectedGenres,
        yearFrom,
        yearTo,
        type: contentType,
      }
      const created = await createSession({
        hostName: user?.displayName ?? 'Host',
        name: sessionName || 'Wieczór filmowy',
        filters,
      })
      setHostSession(created)

      addSessionHistory(user, {
        id: created.id,
        name: created.name,
        code: created.id,
        status: 'pending',
        matchedMovieId: null,
        participants: 1,
        createdAt: Date.now(),
        tags: [...selectedGenres, ...selectedPlatforms],
      })

      navigate(`/lobby/${created.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.setup}>
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate(-1)}>
          ← Powrót
        </button>
        <span className={styles.logo}>🎬</span>
      </header>

      <div className={styles.content}>
        <h1 className={styles.title}>Konfiguracja sesji</h1>

        <section className={styles.section}>
          <label className={styles.sectionLabel}>Nazwa sesji</label>
          <input
            className={styles.input}
            type="text"
            placeholder="np. Sobotni wieczór filmowy"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            maxLength={50}
          />
        </section>

        <section className={styles.section}>
          <label className={styles.sectionLabel}>Typ treści</label>
          <div className={styles.toggle}>
            <button
              className={`${styles.toggleBtn} ${contentType === 'movie' ? styles.active : ''}`}
              onClick={() => setContentType('movie')}
            >
              Filmy
            </button>
            <button
              className={`${styles.toggleBtn} ${contentType === 'series' ? styles.active : ''}`}
              onClick={() => setContentType('series')}
            >
              Seriale
            </button>
          </div>
        </section>

        <section className={styles.section}>
          <label className={styles.sectionLabel}>Gatunek (opcjonalnie)</label>
          <div className={styles.chips}>
            {GENRE_LIST.map((g) => (
              <button
                key={g}
                className={`${styles.chip} ${selectedGenres.includes(g) ? styles.chipActive : ''}`}
                onClick={() => toggleGenre(g)}
              >
                {g}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sliderHeader}>
            <label className={styles.sectionLabel}>Rok produkcji</label>
            <span className={styles.sliderValue}>{yearFrom} — {yearTo}</span>
          </div>
          <div className={styles.rangeWrapper}>
            <div
              className={styles.rangeTrack}
              style={{
                background: `linear-gradient(to right,
                  #ddd 0%,
                  #ddd ${((yearFrom - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%,
                  var(--color-purple) ${((yearFrom - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%,
                  var(--color-purple) ${((yearTo - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%,
                  #ddd ${((yearTo - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%,
                  #ddd 100%)`
              }}
            />
            <input
              type="range"
              className={styles.rangeInput}
              style={{ zIndex: yearFrom >= yearTo - 1 ? 5 : 3 }}
              min={MIN_YEAR}
              max={MAX_YEAR}
              value={yearFrom}
              onChange={(e) => setYearFrom(Math.min(Number(e.target.value), yearTo - 1))}
            />
            <input
              type="range"
              className={styles.rangeInput}
              style={{ zIndex: 4 }}
              min={MIN_YEAR}
              max={MAX_YEAR}
              value={yearTo}
              onChange={(e) => setYearTo(Math.max(Number(e.target.value), yearFrom + 1))}
            />
          </div>
        </section>

        <section className={styles.section}>
          <label className={styles.sectionLabel}>Platformy streamingowe</label>
          <div className={styles.platforms}>
            {PLATFORM_LIST.map((p) => {
              const active = selectedPlatforms.includes(p)
              return (
                <button
                  key={p}
                  className={`${styles.platformBtn} ${active ? styles.platformActive : ''}`}
                  style={active ? { borderColor: PLATFORM_COLORS[p], color: PLATFORM_COLORS[p] } : {}}
                  onClick={() => togglePlatform(p)}
                >
                  {p}
                </button>
              )
            })}
          </div>
        </section>

        {error && <p className={styles.error}>{error}</p>}
      </div>

      <div className={styles.footer}>
        <button className={styles.btnCreate} onClick={handleCreate} disabled={loading}>
          {loading ? 'Tworzenie…' : 'Utwórz sesję →'}
        </button>
      </div>
    </div>
  )
}
