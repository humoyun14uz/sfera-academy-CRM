import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

type Theme = 'dark' | 'light'
type ResolvedTheme = Theme

const DEFAULT_THEME: Theme = 'light'
const THEME_COOKIE_NAME = 'vite-ui-theme'
const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  defaultTheme: Theme
  resolvedTheme: ResolvedTheme
  theme: Theme
  setTheme: (theme: Theme) => void
  resetTheme: () => void
}

const initialState: ThemeProviderState = {
  defaultTheme: DEFAULT_THEME,
  resolvedTheme: 'light',
  theme: DEFAULT_THEME,
  setTheme: () => null,
  resetTheme: () => null,
}

const ThemeContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  storageKey = THEME_COOKIE_NAME,
  ...props
}: ThemeProviderProps) {
  const [theme, _setTheme] = useState<Theme>(
    () => (getCookie(storageKey) as Theme) || defaultTheme
  )
  const resolvedTheme = useMemo((): ResolvedTheme => theme, [theme])

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(resolvedTheme)
  }, [resolvedTheme])

  const setTheme = (nextTheme: Theme) => {
    if (nextTheme === theme) return

    const root = window.document.documentElement
    const applyTheme = () => {
      root.classList.remove('light', 'dark')
      root.classList.add(nextTheme)
      _setTheme(nextTheme)
    }

    setCookie(storageKey, nextTheme, THEME_COOKIE_MAX_AGE)

    // The native View Transition API animates a single composited snapshot,
    // avoiding hundreds of per-element color transitions during theme changes.
    const documentWithTransition = document as Document & {
      startViewTransition?: (update: () => void) => unknown
    }

    if (documentWithTransition.startViewTransition) {
      documentWithTransition.startViewTransition(applyTheme)
    } else {
      applyTheme()
    }
  }

  const resetTheme = () => {
    removeCookie(storageKey)
    setTheme(DEFAULT_THEME)
  }

  const contextValue = {
    defaultTheme,
    resolvedTheme,
    resetTheme,
    theme,
    setTheme,
  }

  return (
    <ThemeContext value={contextValue} {...props}>
      {children}
    </ThemeContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext)

  if (!context) throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
