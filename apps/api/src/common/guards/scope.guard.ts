import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthenticatedUser } from '../decorators/current-user.decorator'
import { createDb, groupTeachers, students } from '@sfera/db'
import { eq, and } from 'drizzle-orm'

@Injectable()
export class ScopeGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('DATABASE') private db: ReturnType<typeof createDb>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request.user as AuthenticatedUser | undefined
    if (!user) return true // Handled by auth guard

    // Super Admin bypasses scope restrictions
    if (user.role === 'Super Admin') return true

    // 1. Academy Scope Check
    const paramAcademyId = request.params?.academyId || request.body?.academyId
    if (paramAcademyId && paramAcademyId !== user.academyId) {
      throw new ForbiddenException(
        'Access denied: You cannot access or modify resources in a different academy'
      )
    }

    // 2. Teacher Group Scope Check
    if (user.role === 'Teacher') {
      const groupId = request.params?.groupId || request.body?.groupId
      if (groupId) {
        const assigned = await this.db
          .select()
          .from(groupTeachers)
          .where(
            and(
              eq(groupTeachers.groupId, groupId),
              eq(groupTeachers.teacherId, user.id)
            )
          )
          .limit(1)

        if (assigned.length === 0) {
          throw new ForbiddenException(
            'Access denied: You are not assigned as a teacher for this group'
          )
        }
      }
    }

    // 3. Student Self-Access Scope Check
    if (user.role === 'Student') {
      const paramStudentId = request.params?.studentId || request.query?.studentId

      // Resolve student record for this user
      const studentRecord = await this.db
        .select()
        .from(students)
        .where(
          and(
            eq(students.userId, user.id),
            eq(students.academyId, user.academyId)
          )
        )
        .limit(1)

      if (studentRecord.length === 0) {
        throw new ForbiddenException('Student profile not found for this user')
      }

      const currentStudentId = studentRecord[0].id
      request.studentId = currentStudentId
      // Also expose it on the authenticated user so controllers can scope
      // queries without the `(user as any).studentId` anti-pattern, which
      // silently produced `undefined` and widened access to the whole academy.
      user.studentId = currentStudentId

      if (paramStudentId && paramStudentId !== currentStudentId) {
        throw new ForbiddenException(
          'Access denied: Students may only access their own records'
        )
      }
    }

    return true
  }
}

