import { SetMetadata } from '@nestjs/common'
import { SystemPermission, SystemRole } from '@sfera/contracts'

export const PERMISSIONS_KEY = 'permissions'
export const RequirePermission = (...permissions: SystemPermission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions)

export const ROLES_KEY = 'roles'
export const RequireRole = (...roles: SystemRole[]) =>
  SetMetadata(ROLES_KEY, roles)

export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

