import { Injectable, Inject, UnauthorizedException } from '@nestjs/common'
import { createClerkClient, verifyToken } from '@clerk/backend'
import { and, eq } from 'drizzle-orm'
import {
  academyMemberships,
  roles,
  users,
  createDb,
} from '@sfera/db'

export type NotificationSocketIdentity = {
  userId: string
  academyId: string
}

@Injectable()
export class NotificationsSocketAuth {
  private readonly clerkSecretKey = process.env.CLERK_SECRET_KEY
  private readonly clerkClient = this.clerkSecretKey
    ? createClerkClient({ secretKey: this.clerkSecretKey })
    : null

  constructor(@Inject('DATABASE') private readonly db: ReturnType<typeof createDb>) {}

  async authenticate(token: string): Promise<NotificationSocketIdentity> {
    if (!token) throw new UnauthorizedException('WebSocket token is required')

    let clerkUserId: string | null = null
    let email: string | null = null
    if (this.clerkClient && !token.startsWith('test-token-')) {
      try {
        clerkUserId = (
          await verifyToken(token, { secretKey: this.clerkSecretKey as string })
        ).sub
      } catch {
        throw new UnauthorizedException('Invalid or expired WebSocket token')
      }
    } else if (token.startsWith('test-token-')) {
      if (process.env.NODE_ENV === 'production') {
        throw new UnauthorizedException('Test tokens are disabled in production')
      }
      const testEmails: Record<string, string> = {
        'test-token-superadmin': 'admin@gmail.com',
        'test-token-admin': 'admin@gmail.com',
        'test-token-manager': 'manager@gmail.com',
        'test-token-teacher': 'temurbek@sfera.uz',
        'test-token-finance': 'finance@gmail.com',
        'test-token-student': 'student@gmail.com',
      }
      email = testEmails[token] ?? null
      if (!email) throw new UnauthorizedException('Invalid test token')
    } else if (token.startsWith('user_')) {
      clerkUserId = token
    } else {
      throw new UnauthorizedException('Unsupported WebSocket token')
    }

    const userRows = clerkUserId
      ? await this.db.select().from(users).where(eq(users.clerkId, clerkUserId)).limit(1)
      : await this.db.select().from(users).where(eq(users.email, email as string)).limit(1)
    const user = userRows[0]
    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('Active user account was not found')
    }

    const memberships = await this.db
      .select({ academyId: academyMemberships.academyId })
      .from(academyMemberships)
      .innerJoin(roles, eq(academyMemberships.roleId, roles.id))
      .where(and(eq(academyMemberships.userId, user.id), eq(academyMemberships.isActive, true)))
      .limit(1)
    const membership = memberships[0]
    if (!membership) {
      throw new UnauthorizedException('User has no active academy membership')
    }

    return { userId: user.id, academyId: membership.academyId }
  }
}
