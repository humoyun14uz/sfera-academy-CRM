export const PERMISSIONS = [
  'dashboard.read',
  'tasks.read',
  'messages.read',
  'students.read',
  'students.create',
  'students.update',
  'students.assign_group',
  'students.change_course',
  'students.change_status',
  'students.deactivate',
  'leads.read',
  'leads.create',
  'leads.update',
  'leads.change_status',
  'leads.assign_manager',
  'leads.manage_trial',
  'leads.convert',
  'groups.read',
  'groups.create',
  'groups.update',
  'groups.deactivate',
  'groups.assign_teacher',
  'groups.manage_students',
  'groups.manage_schedule',
  'courses.read',
  'courses.create',
  'courses.update',
  'courses.deactivate',
  'courses.manage_price',
  'courses.manage_duration',
  'teachers.read',
  'teachers.create',
  'teachers.update',
  'teachers.assign_group',
  'teachers.deactivate',
  'payments.read',
  'payments.create',
  'payments.verify',
  'payments.view_debt',
  'payments.view_reports',
  'reports.read',
  'users.read',
  'users.create',
  'users.assign_role',
  'users.change_role',
  'users.deactivate',
  'settings.read',
  'settings.manage_academy',
  'settings.manage_courses',
  'settings.manage_groups',
  'settings.manage_notifications',
  'settings.manage_crm',
  'teacher.workspace',
  'finance.workspace',
] as const

export type Permission = (typeof PERMISSIONS)[number]

export const ROLES = [
  'Super Admin',
  'Manager',
  'Teacher',
  'Finance',
  'Student',
] as const

export type Role = (typeof ROLES)[number]

const ADMINISTRATOR_PERMISSIONS: readonly Permission[] = PERMISSIONS

const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  'Super Admin': ADMINISTRATOR_PERMISSIONS,
  Manager: [
    'dashboard.read',
    'tasks.read',
    'messages.read',
    'students.read',
    'students.create',
    'students.update',
    'students.assign_group',
    'students.change_course',
    'students.change_status',
    'leads.read',
    'leads.create',
    'leads.update',
    'leads.change_status',
    'leads.assign_manager',
    'leads.manage_trial',
    'leads.convert',
    'groups.read',
    'groups.manage_students',
    'groups.manage_schedule',
    'courses.read',
    'teachers.read',
    'reports.read',
  ],
  Teacher: [
    'dashboard.read',
    'teacher.workspace',
    'tasks.read',
    'students.read',
    'groups.read',
    'groups.manage_students',
    'groups.manage_schedule',
    'courses.read',
    'teachers.read',
  ],
  Finance: [
    'dashboard.read',
    'finance.workspace',
    'tasks.read',
    'messages.read',
    'students.read',
    'payments.read',
    'payments.create',
    'payments.verify',
    'payments.view_debt',
    'payments.view_reports',
  ],
  Student: [
    'dashboard.read',
    'students.read',
    'courses.read',
    'tasks.read',
    'settings.read',
  ],
}

export function normalizeRole(role?: string): Role {
  const normalized = role?.trim().toLowerCase().replace(/[_-]/g, ' ')
  if (normalized === 'superadmin' || normalized === 'super admin')
    return 'Super Admin'
  if (normalized === 'admin' || normalized === 'administrator') return 'Super Admin'
  if (normalized === 'manager') return 'Manager'
  if (normalized === 'teacher') return 'Teacher'
  if (normalized === 'finance' || normalized === 'financial') return 'Finance'
  if (normalized === 'student') return 'Student'
  return 'Student'
}

export function isKnownRole(role?: string): boolean {
  const normalized = role?.trim().toLowerCase().replace(/[_-]/g, ' ')
  return [
    'superadmin',
    'super admin',
    'admin',
    'administrator',
    'manager',
    'teacher',
    'finance',
    'financial',
    'student',
  ].includes(normalized ?? '')
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
