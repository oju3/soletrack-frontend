export const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

// If the API rejects the session (expired or invalid), clear it and go to login
const originalFetch = window.fetch.bind(window)
window.fetch = async (...args) => {
  const res = await originalFetch(...args)
  const url = typeof args[0] === 'string' ? args[0] : args[0]?.url
  if (res.status === 401 && url && url.startsWith(API_URL)) {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('sb-'))
      .forEach((k) => localStorage.removeItem(k))
    if (!window.location.pathname.startsWith('/login')) {
      window.location.href = '/login'
    }
  }
  return res
}
