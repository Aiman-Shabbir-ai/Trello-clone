const DEFAULT_API_BASE_URL = import.meta.env.PROD
  ? 'https://trello-clone-backend-six.vercel.app'
  : 'http://localhost:5000'

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL
).replace(/\/$/, '')
