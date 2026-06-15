import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../hooks/useSession'
import { useAuth } from '../hooks/useAuth'
import { createSession } from '../services/sessionService'
import { addSessionHistory, pickMovieForFilters } from '../services/sessionHistoryService'
import { GENRES, PLATFORMS } from '../data/movies'
import styles from './SetupSessionPage.module.css'

const PLATFORM_LIST = Object.values(PLATFORMS)
const GENRE_LIST = Object.values(GENRES)

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
  const [yearTo] = useState(new Date().getFullYear())
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
        hostName: sessionState?.hostName ?? 'Host',
        name: sessionName || 'Wieczór filmowy',
        filters,
      })
      setHostSession(created)

      const predictedMovie = pickMovieForFilters(filters)
      addSessionHistory(user, {
        id: created.id,
        name: created.name,
        code: created.id,
        status: 'pending',
        matchedMovieId: predictedMovie?.id ?? null,
        participants: 1,
        createdAt: Date.now(),
        tags: [...selectedGenres, ...selectedPlatforms],
      })

      navigate(`/session/${created.id}`)
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
            <span className={styles.sliderValue}>
              {yearFrom} — {yearTo}
            </span>
          </div>
          <input
            className={styles.slider}
            type="range"
            min={1970}
            max={yearTo}
            value={yearFrom}
            onChange={(e) => setYearFrom(Number(e.target.value))}
          />
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
