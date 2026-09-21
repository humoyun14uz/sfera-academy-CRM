import { redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { can, normalizeRole, type Permission, type Role } from '@/lib/rbac'

function getAuthSnapshot() {
  return useAuthStore.getState().auth
}

export function requireAuthenticated() {
  const auth = getAuthSnapshot()

  if (!auth.accessToken || !auth.user) {
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
  if (normalizeRole(auth.user?.role?.[0]) !== role) {
    throw redirect({ to: '/403' })
  }
}
