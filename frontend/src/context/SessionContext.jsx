import { createContext, useState } from 'react'
import PropTypes from 'prop-types'

export const SessionContext = createContext(null) // eslint-disable-line react-refresh/only-export-components

const STORAGE_KEY = 'mm_session'

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
  } catch {
    return null
  }
}

function save(data) {
  if (data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export function SessionProvider({ children }) {
  const [state, setState] = useState(() => load())

  const update = (next) => {
    setState(next)
    save(next)
  }

  // Step 1 (LoginPage host flow): just store the name before a session exists yet
  const setPendingHost = (hostName) => {
    update({ pendingHostName: hostName, role: 'host' })
  }

  // Step 2 (SetupSessionPage): real session returned from POST /api/sessions
  const setHostSession = (session, hostId) => {
    update({
      session,
      participantId: session.participants[0].id,
      hostId,
      role: 'host',
    })
  }

  const setJoinedSession = (session, participantId) => {
    update({ session, participantId, hostId: null, role: 'participant' })
  }

  const clearSession = () => update(null)

  return (
    <SessionContext.Provider
      value={{
        session: state?.session ?? null,
        participantId: state?.participantId ?? null,
        hostId: state?.hostId ?? null,
        role: state?.role ?? null,
        pendingHostName: state?.pendingHostName ?? null,
        setPendingHost,
        setHostSession,
        setJoinedSession,
        clearSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

SessionProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
