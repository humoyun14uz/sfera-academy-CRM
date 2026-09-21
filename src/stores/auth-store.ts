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

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = getCookie(ACCESS_TOKEN)
  const cookieUser = getCookie(AUTH_USER)
  let initToken = ''
  let parsedUser: AuthUser | null = null
  try {
    initToken = cookieState ? JSON.parse(cookieState) : ''
    parsedUser = cookieUser ? JSON.parse(cookieUser) : null
  } catch {
    removeCookie(ACCESS_TOKEN)
    removeCookie(AUTH_USER)
  }
  const initUser = parsedUser
    ? {
        ...parsedUser,
        name:
          parsedUser.name === 'Sfera Administrator'
            ? parsedUser.email.split('@')[0]
            : parsedUser.name,
      }
    : null
  return {
    auth: {
      user: initUser,
      setUser: (user) =>
        set((state) => {
          if (user) setCookie(AUTH_USER, JSON.stringify(user))
          else removeCookie(AUTH_USER)
          return { ...state, auth: { ...state.auth, user } }
        }),
      accessToken: initToken,
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
