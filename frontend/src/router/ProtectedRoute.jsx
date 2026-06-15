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
  const { session } = useSession()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="screen" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
        <p>Ładowanie...</p>
      </div>
    )
  }

  const sessionIdMatch = getSessionRouteId(location.pathname)
  const hasJoinedSession = Boolean(session?.id && sessionIdMatch && session.id === sessionIdMatch)

  if (!user && !hasJoinedSession) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
}
