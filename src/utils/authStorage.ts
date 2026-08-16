import type { AuthSessionDto } from '@/types/auth'

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

export const getAccessToken = (): string | null =>
  import.meta.env.VITE_ACCESS_TOKEN ?? localStorage.getItem(ACCESS_TOKEN_KEY)

export const getRefreshToken = (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY)

export const hasStoredSession = (): boolean => Boolean(getAccessToken())

export const saveSession = (session: AuthSessionDto): void => {
  if (session.accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken)
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
  }

  if (session.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken)
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }
}

export const clearSession = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}
