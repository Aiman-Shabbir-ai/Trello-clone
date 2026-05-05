const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000'
const BOARD_ENDPOINT = `${API_BASE_URL}/board`

function isValidBoardState(value) {
  return Boolean(
    value &&
      typeof value.boardTitle === 'string' &&
      Array.isArray(value.columns) &&
      (typeof value.backgroundColor === 'undefined' || typeof value.backgroundColor === 'string')
  )
}

export async function fetchBoardState() {
  const response = await fetch(BOARD_ENDPOINT)
  if (!response.ok) {
    throw new Error(`Failed to load board: ${response.status}`)
  }

  const payload = await response.json()
  if (!isValidBoardState(payload)) {
    throw new Error('Invalid board payload from API')
  }

  return payload
}

export async function updateBoardState(boardState) {
  const response = await fetch(BOARD_ENDPOINT, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(boardState),
  })

  if (!response.ok) {
    throw new Error(`Failed to save board: ${response.status}`)
  }
}
