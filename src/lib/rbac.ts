import {
  ALL_PERMISSIONS,
  DEFAULT_ROLE_PERMISSIONS,
  SYSTEM_ROLES,
  type SystemPermission,
  type SystemRole,
} from '@sfera/contracts'

export type Permission = SystemPermission

export const PERMISSIONS = ALL_PERMISSIONS as readonly Permission[]

export const ROLES = SYSTEM_ROLES as readonly Role[]

export type Role = SystemRole

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = DEFAULT_ROLE_PERMISSIONS as Record<Role, readonly Permission[]>

export function normalizeRole(role?: string): Role {
  const normalized = role?.trim().toLowerCase().replace(/[_-]/g, ' ')
  if (normalized === 'superadmin' || normalized === 'super admin')
    return 'Super Admin'
  if (normalized === 'admin' || normalized === 'administrator') return 'Admin'
  if (normalized === 'manager') return 'Manager'
  if (normalized === 'teacher') return 'Teacher'
  if (normalized === 'finance' || normalized === 'financial') return 'Finance'
  if (normalized === 'student') return 'Student'
  return 'Student'
}

export function isKnownRole(role?: string): boolean {
  const normalized = role?.trim().toLowerCase().replace(/[_-]/g, ' ')
  return SYSTEM_ROLES.map((r) => r.toLowerCase()).includes(normalized ?? '')
}

export function getPermissionsForRole(role?: string): readonly Permission[] {
  return isKnownRole(role) ? ROLE_PERMISSIONS[normalizeRole(role)] : []
}

export function can(
  role: string | string[] | undefined,
  permission: Permission
): boolean {
  const roles = Array.isArray(role) ? role : role ? [role] : []
  return roles.some((item) => getPermissionsForRole(item).includes(permission))
}

export function canAny(
  role: string | string[] | undefined,
  permissions: readonly Permission[]
): boolean {
  return permissions.some((permission) => can(role, permission))
}

export function canAll(
  role: string | string[] | undefined,
  permissions: readonly Permission[]
): boolean {
  return permissions.every((permission) => can(role, permission))
}

export function getPrimaryRole(role?: string | string[]): Role {
  const candidate = Array.isArray(role) ? role[0] : role
  return normalizeRole(candidate)
}
