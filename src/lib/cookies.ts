const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7

const isSecureContext = () =>
  typeof window !== 'undefined' && window.location.protocol === 'https:'

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined

  const cookies = document.cookie ? document.cookie.split('; ') : []
  const cookie = cookies.find((entry) => entry.startsWith(`${name}=`))

  if (!cookie) return undefined

  const value = cookie.slice(name.length + 1)
  return value ? decodeURIComponent(value) : undefined
}

/**
 * Set a cookie with name, value, and optional max age
 */
export function setCookie(
  name: string,
  value: string,
  maxAge: number = DEFAULT_MAX_AGE
): void {
  if (typeof document === 'undefined') return

  const secure = isSecureContext() ? '; secure' : ''
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax${secure}`
}

/**
 * Remove a cookie by setting its max age to 0
 */
export function removeCookie(name: string): void {
  if (typeof document === 'undefined') return

  const secure = isSecureContext() ? '; secure' : ''
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax${secure}`
}
