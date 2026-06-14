import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Start', icon: '🏠' },
  { to: '/setup', label: 'Nowa', icon: '➕' },
  { to: '/history', label: 'Historia', icon: '🕒' },
  { to: '/profile', label: 'Profil', icon: '👤' },
]

export default function BottomNav() {
  return (
    <nav className="bottomNav">
      {NAV_ITEMS.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `bottomNav__link ${isActive ? 'bottomNav__link--active' : ''}`
          }
        >
          <span className="bottomNav__icon" aria-hidden="true">
            {icon}
          </span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
