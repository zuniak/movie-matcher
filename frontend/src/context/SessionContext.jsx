import { createContext, useState } from 'react'
import PropTypes from 'prop-types'

export const SessionContext = createContext(null) // eslint-disable-line react-refresh/only-export-components

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null)
  const [participantId, setParticipantId] = useState(null)
  const [role, setRole] = useState(null) // 'host' | 'participant'

  const setHostSession = (sessionData) => {
    setSession(sessionData)
    setParticipantId('host')
    setRole('host')
  }

  const setJoinedSession = (sessionData, pId) => {
    setSession(sessionData)
    setParticipantId(pId)
    setRole('participant')
  }

  const clearSession = () => {
    setSession(null)
    setParticipantId(null)
    setRole(null)
  }

  return (
    <SessionContext.Provider
      value={{ session, participantId, role, setHostSession, setJoinedSession, clearSession }}
    >
      {children}
    </SessionContext.Provider>
  )
}

SessionProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
