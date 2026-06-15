import { NavLink } from 'react-router-dom'
import styles from './BottomNav.module.css'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Start', icon: '🏠' },
  { to: '/setup', label: 'Nowa', icon: '➕' },
  { to: '/history', label: 'Historia', icon: '🕒' },
  { to: '/profile', label: 'Profil', icon: '👤' },
]

export default function BottomNav() {
  return (
    <nav className={styles.bottomNav}>
      {NAV_ITEMS.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `${styles['bottomNav__link']} ${isActive ? styles['bottomNav__link--active'] : ''}`
          }
        >
          <span className={styles['bottomNav__icon']} aria-hidden="true">
            {icon}
          </span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
