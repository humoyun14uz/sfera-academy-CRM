import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import { type SystemRole } from '@sfera/contracts'

export interface AuthenticatedUser {
  id: string
  clerkId: string
  email: string
  firstName: string
  lastName: string
  role: SystemRole
  academyId: string
  permissions: string[]
  /**
   * Resolved `students.id` for the Student role only. Populated by ScopeGuard.
   * When this is absent for a Student, endpoints must deny access rather than
   * fall back to academy-wide data.
   */
  studentId?: string
}

export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const user = request.user as AuthenticatedUser | undefined
    if (!user) return null
    return data ? user[data] : user
  }
)

