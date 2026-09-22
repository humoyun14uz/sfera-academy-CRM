import { Injectable, Inject, Logger } from '@nestjs/common'
import { type createDb, auditLogs } from '@sfera/db'
import { desc, eq } from 'drizzle-orm'

export interface LogAuditParams {
  academyId?: string
  userId?: string
  action: string
  entityType: string
  entityId: string
  ipAddress?: string
  userAgent?: string
  payloadBefore?: unknown
  payloadAfter?: unknown
}

@Injectable()
export class AuditLogsService {
  private readonly logger = new Logger(AuditLogsService.name)

  constructor(@Inject('DATABASE') private db: ReturnType<typeof createDb>) {}

  async log(params: LogAuditParams) {
    try {
      const [entry] = await this.db
        .insert(auditLogs)
        .values({
          academyId: params.academyId,
          userId: params.userId,
          action: params.action,
          entityType: params.entityType,
          entityId: params.entityId,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
          payloadBefore: params.payloadBefore,
          payloadAfter: params.payloadAfter,
        })
        .returning()
      return entry
    } catch (err: unknown) {
      this.logger.error(
        `Failed to write audit log for ${params.entityType}:${params.entityId}`,
        err instanceof Error ? err.stack : String(err)
      )
      return undefined
    }
  }

  async getAcademyLogs(academyId: string, limit = 50) {
    return this.db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.academyId, academyId))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit)
  }
}

