async function api(path, options) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Błąd serwera')
  return json.data
}

export async function createSession({ hostName, name, filters }) {
  return api('/sessions', {
    method: 'POST',
    body: JSON.stringify({ hostName, name, filters }),
  })
}

export async function getSession(sessionId) {
  return api(`/sessions/${sessionId}`)
}

export async function joinSession(sessionId, participantName) {
  return api(`/sessions/${sessionId}/join`, {
    method: 'POST',
    body: JSON.stringify({ participantName }),
  })
}

export async function startSession(sessionId, hostId) {
  return api(`/sessions/${sessionId}/start`, {
    method: 'POST',
    body: JSON.stringify({ hostId }),
  })
}

/**
 * @param {string} sessionId
 * @param {string} participantId
 * @param {string} movieId
 * @param {'like' | 'skip'} action
 */
export async function castVote(sessionId, participantId, movieId, action) {
  return api(`/sessions/${sessionId}/vote`, {
    method: 'POST',
    body: JSON.stringify({ participantId, movieId, action }),
  })
}

export async function getSessionResult(sessionId) {
  return api(`/sessions/${sessionId}/result`)
}

/** Static mock sessions for Session History page (no real persistence between reloads) */
export const MOCK_SESSIONS = [
  {
    id: 'DEMO01',
    name: 'Family Movie Night',
    status: 'finished',
    matchedMovieId: '8',
    participants: [
      { id: 'p1', name: 'Alex', role: 'host' },
      { id: 'p2', name: 'Jordan', role: 'participant' },
      { id: 'p3', name: 'Sam', role: 'participant' },
    ],
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'DEMO02',
    name: 'Friday Date Night',
    status: 'finished',
    matchedMovieId: '2',
    participants: [
      { id: 'p1', name: 'Alex', role: 'host' },
      { id: 'p2', name: 'Jordan', role: 'participant' },
    ],
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
]
