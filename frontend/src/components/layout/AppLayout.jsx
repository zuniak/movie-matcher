import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <main className="app-layout__content">
        {children ?? <Outlet />}
      </main>
      <BottomNav />
    </div>
  )
}
