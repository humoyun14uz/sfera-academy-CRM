import { redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { can, getPrimaryRole, type Permission, type Role } from '@/lib/rbac'

function getAuthSnapshot() {
  return useAuthStore.getState().auth
}

export function requireAuthenticated() {
  const auth = getAuthSnapshot()
  const expired = auth.user?.exp ? auth.user.exp * 1000 <= Date.now() : false

  if (!auth.accessToken || !auth.user || expired) {
    if (expired) auth.reset()
    throw redirect({
      to: '/sign-in',
      search: { redirect: window.location.pathname },
    })
  }
}

export function requirePermission(permission: Permission) {
  requireAuthenticated()
  const auth = getAuthSnapshot()

  if (!can(auth.user?.role, permission)) {
    throw redirect({ to: '/403' })
  }
}

export function requireRole(role: Role) {
  requireAuthenticated()
  const auth = getAuthSnapshot()
  const userRoles = auth.user?.role ?? []

  if (getPrimaryRole(userRoles) !== role) {
    throw redirect({ to: '/403' })
  }
}
