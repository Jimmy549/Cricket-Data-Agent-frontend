export type AuthUser = {
  id: string
  email: string
  name?: string | null
}

export type AuthState = {
  accessToken: string
  user: AuthUser
}

const STORAGE_KEY = 'cricket-auth'

export function getAuth(): AuthState | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthState
  } catch {
    return null
  }
}

export function setAuth(auth: AuthState) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
}

export function clearAuth() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

export function getBearerToken(): string | null {
  const auth = getAuth()
  return auth?.accessToken || null
}

