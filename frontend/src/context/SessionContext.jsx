import { createContext, useState } from 'react'
import PropTypes from 'prop-types'

export const SessionContext = createContext(null) // eslint-disable-line react-refresh/only-export-components

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null)
  const [participantId, setParticipantId] = useState(null)
  const [hostId, setHostId] = useState(null)
  const [role, setRole] = useState(null) // 'host' | 'participant'

  // Called after POST /api/sessions — backend returns { session, hostId }
  const setHostSession = (sessionData, hId) => {
    setSession(sessionData)
    setParticipantId(sessionData.participants[0].id) // host's real UUID
    setHostId(hId)
    setRole('host')
  }

  const setJoinedSession = (sessionData, pId) => {
    setSession(sessionData)
    setParticipantId(pId)
    setHostId(null)
    setRole('participant')
  }

  const clearSession = () => {
    setSession(null)
    setParticipantId(null)
    setHostId(null)
    setRole(null)
  }

  return (
    <SessionContext.Provider
      value={{ session, participantId, hostId, role, setHostSession, setJoinedSession, clearSession }}
    >
      {children}
    </SessionContext.Provider>
  )
}

SessionProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
