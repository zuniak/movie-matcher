import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useSession } from '../hooks/useSession'
import PropTypes from 'prop-types'

function getSessionRouteId(pathname) {
  const match = pathname.match(/^\/(?:lobby|session)\/([^/]+)(?:\/result)?$/)
  return match ? match[1] : null
}

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth()
  const { session, role } = useSession()
  const location = useLocation()

  if (isLoading) {
    return null
  }

  const sessionIdMatch = getSessionRouteId(location.pathname)
  const hasJoinedSession = Boolean(session?.id && sessionIdMatch && session.id === sessionIdMatch)
  const isGuestHostSetup = Boolean(
    (role === 'host' || location.state?.role === 'host') &&
    location.pathname === '/setup'
  )

  if (!user && !hasJoinedSession && !isGuestHostSetup) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
}
