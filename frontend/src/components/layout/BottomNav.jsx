import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Home' },
  { to: '/history', label: 'History' },
  { to: '/profile', label: 'Profile' },
]

export default function BottomNav() {
  return (
    <nav>
      {NAV_ITEMS.map(({ to, label }) => (
        <NavLink key={to} to={to}>
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
