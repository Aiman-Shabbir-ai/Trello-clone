import { clearStoredToken, getStoredToken } from './authApi'
import { API_BASE_URL } from './apiConfig'

const BOARDS_ENDPOINT = `${API_BASE_URL}/api/boards`

function buildAuthHeaders(extraHeaders = {}) {
  const token = getStoredToken()
  return {
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`)
    error.status = response.status
    if (response.status === 401) {
      clearStoredToken()
      localStorage.removeItem('trello-clone-session-user')
    }
    throw error
  }
  return data
}

export async function getBoards() {
  const response = await fetch(BOARDS_ENDPOINT, {
    headers: buildAuthHeaders(),
  })
  return parseResponse(response)
}

export async function getBoard(boardId) {
  const response = await fetch(`${BOARDS_ENDPOINT}/${boardId}`, {
    headers: buildAuthHeaders(),
  })
  return parseResponse(response)
}

export async function createBoard(payload) {
  const response = await fetch(BOARDS_ENDPOINT, {
    method: 'POST',
    headers: buildAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  })
  return parseResponse(response)
}

export async function updateBoard(boardId, payload) {
  const response = await fetch(`${BOARDS_ENDPOINT}/${boardId}`, {
    method: 'PUT',
    headers: buildAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  })
  return parseResponse(response)
}

export async function deleteBoard(boardId) {
  const response = await fetch(`${BOARDS_ENDPOINT}/${boardId}`, {
    method: 'DELETE',
    headers: buildAuthHeaders(),
  })
  return parseResponse(response)
}
