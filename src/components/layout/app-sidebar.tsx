import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN = 'thisisjustarandomstring'
const AUTH_USER = 'sfera-auth-user'

interface AuthUser {
  accountNo: string
  name?: string
  email: string
  role: string[]
  exp: number
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
  }
}

function parseJson<T>(value: string | undefined): T | null {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const tokenCookieValue = getCookie(ACCESS_TOKEN)
  const persistedUser = parseJson<AuthUser>(getCookie(AUTH_USER))
  const parsedToken = parseJson<string>(tokenCookieValue)
  const token = parsedToken ?? tokenCookieValue ?? ''
  const expired = persistedUser?.exp ? persistedUser.exp * 1000 <= Date.now() : false

  const user = expired
    ? null
    : persistedUser
      ? {
          ...persistedUser,
          name:
            persistedUser.name === 'Sfera Administrator'
              ? persistedUser.email.split('@')[0]
              : persistedUser.name,
        }
      : null

  if (expired || (tokenCookieValue && !persistedUser && !token)) {
    removeCookie(ACCESS_TOKEN)
    removeCookie(AUTH_USER)
  }

  return {
    auth: {
      user,
      accessToken: user ? token : '',
      setUser: (nextUser) =>
        set((state) => {
          if (nextUser) setCookie(AUTH_USER, JSON.stringify(nextUser))
          else removeCookie(AUTH_USER)
          return { ...state, auth: { ...state.auth, user: nextUser } }
        }),
      setAccessToken: (accessToken) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, JSON.stringify(accessToken))
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          removeCookie(AUTH_USER)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
          }
        }),
    },
  }
})
