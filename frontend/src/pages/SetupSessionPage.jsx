import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../hooks/useSession'
import { createSession } from '../services/sessionService'
import { GENRES, PLATFORMS } from '../data/movies'
import RangeSlider from '../components/ui/RangeSlider'
import styles from './SetupSessionPage.module.css'

const PLATFORM_LIST = Object.values(PLATFORMS)
const GENRE_LIST = Object.values(GENRES)


export default function SetupSessionPage() {
  const { pendingHostName, setHostSession } = useSession()
  const navigate = useNavigate()

  const [sessionName, setSessionName] = useState('')
  const [contentType, setContentType] = useState('movie') // 'movie' | 'series'
  const [selectedGenres, setSelectedGenres] = useState([])
  const [selectedPlatforms, setSelectedPlatforms] = useState([])
  const CURRENT_YEAR = new Date().getFullYear()
  const [yearFrom, setYearFrom] = useState(1990)
  const [yearTo, setYearTo] = useState(CURRENT_YEAR)
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
      const { session: created, hostId } = await createSession({
        hostName: pendingHostName ?? 'Host',
        name: sessionName || 'Wieczór filmowy',
        filters,
      })
      setHostSession(created, hostId)
      navigate(`/lobby/${created.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`screen ${styles.setup}`}>
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
          <RangeSlider
            min={1970}
            max={CURRENT_YEAR}
            from={yearFrom}
            to={yearTo}
            onChange={(f, t) => { setYearFrom(f); setYearTo(t) }}
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
