const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'
const AUTH_ENDPOINT = `${API_BASE_URL}/api/auth`
const TOKEN_STORAGE_KEY = 'trello-clone-token'

async function request(path, payload) {
  const response = await fetch(`${AUTH_ENDPOINT}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.message || 'Authentication request failed')
  }

  if (data.token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token)
  }

  return data
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY) ?? ''
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

export function registerUser({ name, email, password }) {
  return request('/register', { name, email, password })
}

export function loginUser({ email, password }) {
  return request('/login', { email, password })
}
