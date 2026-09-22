import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import {
  PERMISSIONS_KEY,
  ROLES_KEY,
  IS_PUBLIC_KEY,
} from '../decorators/require-permission.decorator'
import { SystemPermission, SystemRole } from '@sfera/contracts'
import { AuthenticatedUser } from '../decorators/current-user.decorator'

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true

    const requiredPermissions = this.reflector.getAllAndOverride<
      SystemPermission[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()])

    const requiredRoles = this.reflector.getAllAndOverride<SystemRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    )

    const request = context.switchToHttp().getRequest()
    const user = request.user as AuthenticatedUser | undefined

    if (!user) {
      throw new ForbiddenException('User context is not established')
    }

    // Super Admin has unrestricted access
    if (user.role === 'Super Admin') {
      return true
    }

    // Check required roles if specified
    if (requiredRoles && requiredRoles.length > 0) {
      if (!requiredRoles.includes(user.role)) {
        throw new ForbiddenException(
          `Action requires one of the following roles: [${requiredRoles.join(', ')}]`
        )
      }
    }

    // Check required permissions (Deny by default)
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasAllPermissions = requiredPermissions.every((perm) =>
        user.permissions.includes(perm)
      )

      if (!hasAllPermissions) {
        const missing = requiredPermissions.filter(
          (p) => !user.permissions.includes(p)
        )
        throw new ForbiddenException(
          `Forbidden: You lack the required permission(s): [${missing.join(', ')}]`
        )
      }
    }

    return true
  }
}

