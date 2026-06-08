import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Home', icon: '🏠' },
  { to: '/setup', label: 'New Session', icon: '➕' },
  { to: '/history', label: 'History', icon: '🕒' },
  { to: '/profile', label: 'Profile', icon: '👤' },
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
