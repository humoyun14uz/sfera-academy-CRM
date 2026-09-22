import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { createDb, users, academyMemberships, academies, roles, rolePermissions, permissions } from '@sfera/db'
import { eq, and } from 'drizzle-orm'
import { AuditLogsService } from '../audit-logs/audit-logs.service'

@Injectable()
export class AuthService {
  constructor(
    @Inject('DATABASE') private db: ReturnType<typeof createDb>,
    private auditLogsService: AuditLogsService
  ) {}

  async getMe(userId: string, currentAcademyId: string) {
    const userList = await this.db.select().from(users).where(eq(users.id, userId)).limit(1)
    if (userList.length === 0) {
      throw new NotFoundException('User profile not found')
    }
    const user = userList[0]

    // Fetch all academy memberships for user
    const memberships = await this.db
      .select({
        academyId: academies.id,
        academyName: academies.name,
        academySlug: academies.slug,
        roleName: roles.name,
        isActive: academyMemberships.isActive,
      })
      .from(academyMemberships)
      .innerJoin(academies, eq(academyMemberships.academyId, academies.id))
      .innerJoin(roles, eq(academyMemberships.roleId, roles.id))
      .where(and(eq(academyMemberships.userId, userId), eq(academyMemberships.isActive, true)))

    const currentMembership =
      memberships.find((m) => m.academyId === currentAcademyId) || memberships[0]

    // Get permissions for current role
    let userPermissions: string[] = []
    if (currentMembership) {
      const perms = await this.db
        .select({ code: permissions.code })
        .from(roles)
        .innerJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
        .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
        .where(eq(roles.name, currentMembership.roleName))
      userPermissions = perms.map((p) => p.code)
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        status: user.status,
      },
      currentAcademy: currentMembership
        ? {
            id: currentMembership.academyId,
            name: currentMembership.academyName,
            slug: currentMembership.academySlug,
            role: currentMembership.roleName,
          }
        : null,
      permissions: userPermissions,
      memberships,
    }
  }

  async syncClerkUser(data: {
    clerkId: string
    email: string
    firstName: string
    lastName: string
    phone?: string
    avatarUrl?: string
    defaultAcademySlug?: string
  }) {
    const existing = await this.db
      .select()
      .from(users)
      .where(eq(users.clerkId, data.clerkId))
      .limit(1)

    let userId: string
    if (existing.length > 0) {
      const [updated] = await this.db
        .update(users)
        .set({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone ?? existing[0].phone,
          avatarUrl: data.avatarUrl ?? existing[0].avatarUrl,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existing[0].id))
        .returning()
      userId = updated.id
    } else {
      const [inserted] = await this.db
        .insert(users)
        .values({
          clerkId: data.clerkId,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          avatarUrl: data.avatarUrl,
          status: 'active',
        })
        .returning()
      userId = inserted.id

      // Assign to default academy if specified or found
      const defaultAcademy = await this.db
        .select()
        .from(academies)
        .where(eq(academies.slug, data.defaultAcademySlug || 'sfera-it-academy'))
        .limit(1)

      const studentRole = await this.db
        .select()
        .from(roles)
        .where(eq(roles.name, 'Student'))
        .limit(1)

      if (defaultAcademy.length > 0 && studentRole.length > 0) {
        await this.db.insert(academyMemberships).values({
          academyId: defaultAcademy[0].id,
          userId,
          roleId: studentRole[0].id,
          isActive: true,
        })
      }

      await this.auditLogsService.log({
        userId,
        action: 'USER_SYNCED_FROM_CLERK',
        entityType: 'users',
        entityId: userId,
        payloadAfter: { email: data.email, clerkId: data.clerkId },
      })
    }

    return { userId, success: true }
  }
}

