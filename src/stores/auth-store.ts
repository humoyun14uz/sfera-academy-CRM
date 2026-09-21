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
  const tokenValue = getCookie(ACCESS_TOKEN)
  const parsedUser = parseJson<AuthUser>(getCookie(AUTH_USER))
  const parsedToken = parseJson<string>(tokenValue)
  const token = parsedToken ?? tokenValue ?? ''
  const expired = parsedUser?.exp ? parsedUser.exp * 1000 <= Date.now() : false
  const user = expired
    ? null
    : parsedUser
      ? {
          ...parsedUser,
          name:
            parsedUser.name === 'Sfera Administrator'
              ? parsedUser.email.split('@')[0]
              : parsedUser.name,
        }
      : null

  if (expired || (tokenValue && !parsedUser && !token)) {
    removeCookie(ACCESS_TOKEN)
    removeCookie(AUTH_USER)
  }

  return {
    auth: {
      user,
      setUser: (nextUser) =>
        set((state) => {
          if (nextUser) setCookie(AUTH_USER, JSON.stringify(nextUser))
          else removeCookie(AUTH_USER)
          return { ...state, auth: { ...state.auth, user: nextUser } }
        }),
      accessToken: user ? token : '',
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
