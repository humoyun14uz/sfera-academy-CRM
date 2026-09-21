import { useAuthStore } from '@/stores/auth-store'
import { can, type Permission } from '@/lib/rbac'

type PermissionGateProps = {
  permission: Permission
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function PermissionGate({
  permission,
  children,
  fallback = null,
}: PermissionGateProps) {
  const { auth } = useAuthStore()

  return can(auth.user?.role, permission) ? children : fallback
}
