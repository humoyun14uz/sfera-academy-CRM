import { SetMetadata } from '@nestjs/common'

export const ROLES_KEY = 'roles'
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles)

export const ROLES_ALLOWED_KEY = 'rolesAllowed'
export const RolesAllowed = (...roles: string[]) => SetMetadata(ROLES_ALLOWED_KEY, roles)