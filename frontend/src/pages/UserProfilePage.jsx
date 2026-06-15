import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import styles from './UserProfilePage.module.css'

function useSetting(key, defaultValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key)
    return stored !== null ? JSON.parse(stored) : defaultValue
  })
  const toggle = () => {
    setValue((prev) => {
      const next = !prev
      localStorage.setItem(key, JSON.stringify(next))
      return next
    })
  }
  return [value, toggle]
}

export default function UserProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [notifications, toggleNotifications] = useSetting('mm_notifications', true)
  const [autoSave, toggleAutoSave] = useSetting('mm_autosave', false)

  const displayName = user?.displayName ?? 'John Doe'
  const email = user?.email ?? 'john.doe@cinema.io'
  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className={styles.profile}>
      <div className={styles.card}>
        <div className={styles.topRow}>
          <span className={styles.brand}>MOVIEMATCH</span>
          <div className={styles.profileIcon}>{initials}</div>
        </div>

        <div className={styles.avatarSection}>
          <div className={styles.avatarCircle}>{initials}</div>
          </div>

        <div className={styles.profileDetails}>
          <p className={styles.profileHeading}>Twój profil</p>
          <p className={styles.profileMeta}>{displayName} • {email}</p>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <p className={styles.statNumber}>42</p>
            <p className={styles.statLabel}>SESJE</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statNumber}>128</p>
            <p className={styles.statLabel}>DOPASOWANIA</p>
          </div>
        </div>

        <div className={styles.settingsCard}>
          <label className={styles.settingRow}>
            <span>Powiadomienia</span>
            <span className={styles.switch}>
              <input type="checkbox" checked={notifications} onChange={toggleNotifications} />
              <span className={styles.slider} />
            </span>
          </label>

          <label className={styles.settingRow}>
            <span>Automatyczne zapisywanie</span>
            <span className={styles.switch}>
              <input type="checkbox" checked={autoSave} onChange={toggleAutoSave} />
              <span className={styles.slider} />
            </span>
          </label>
        </div>

        <button
          type="button"
          className={styles.menuButton}
          onClick={() => navigate('/history')}
        >
          <span>Historia sesji</span>
          <span className={styles.menuArrow}>&#8250;</span>
        </button>

        <button type="button" className={styles.logoutButton} onClick={logout}>
          Wyloguj
        </button>
      </div>
    </div>
  )
}
