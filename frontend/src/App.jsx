import { useEffect } from 'react'
import Hotjar from '@hotjar/browser'
import ReactGA from 'react-ga4'
import { AuthProvider } from './context/AuthContext'
import { SessionProvider } from './context/SessionContext'
import AppRouter from './router/AppRouter'

const HOTJAR_SITE_ID = import.meta.env.VITE_HOTJAR_SITE_ID
const HOTJAR_VERSION = 6
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

export default function App() {
  useEffect(() => {
    if (HOTJAR_SITE_ID) {
      Hotjar.init(Number(HOTJAR_SITE_ID), HOTJAR_VERSION)
    }
    if (GA_MEASUREMENT_ID) {
      ReactGA.initialize(GA_MEASUREMENT_ID)
    }
  }, [])

  return (
    <AuthProvider>
      <SessionProvider>
        <AppRouter />
      </SessionProvider>
    </AuthProvider>
  )
}
