import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY, ROLES_ALLOWED_KEY } from '../decorators/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    const allowedRoles = this.reflector.getAllAndOverride<string[]>(ROLES_ALLOWED_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    const rolesToCheck = [...(requiredRoles || []), ...(allowedRoles || [])]

    if (rolesToCheck.length === 0) {
      return true // No role restrictions
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user || !user.role) {
      throw new ForbiddenException('User role not found')
    }

    if (!rolesToCheck.includes(user.role)) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${rolesToCheck.join(', ')}`
      )
    }

    return true
  }
}