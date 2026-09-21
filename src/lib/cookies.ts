/**
 * Small client-side cookie helpers used by the demo auth store.
 * Production authentication must move the session to an HttpOnly server cookie.
 */

const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7

export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined

  const prefix = `${name}=`
  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(prefix))

  if (!cookie) return undefined

  try {
    return decodeURIComponent(cookie.slice(prefix.length)) || undefined
  } catch {
    return undefined
  }
}

export function setCookie(
  name: string,
  value: string,
  maxAge: number = DEFAULT_MAX_AGE
): void {
  if (typeof document === 'undefined') return

  const secure = window.location.protocol === 'https:' ? '; secure' : ''
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax${secure}`
}

export function removeCookie(name: string): void {
  if (typeof document === 'undefined') return

  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`
}
