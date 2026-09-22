import {
  Injectable,
  Inject,
  ForbiddenException,
} from '@nestjs/common'
import {
  createDb,
  attendanceSessions,
  attendanceRecords,
  groupTeachers,
} from '@sfera/db'
import { eq, and } from 'drizzle-orm'
import { MarkAttendanceSessionDto } from '@sfera/contracts'
import { AuditLogsService } from '../audit-logs/audit-logs.service'

@Injectable()
export class AttendanceService {
  constructor(
    @Inject('DATABASE') private db: ReturnType<typeof createDb>,
    private auditLogsService: AuditLogsService
  ) {}

  async markAttendance(
    academyId: string,
    dto: MarkAttendanceSessionDto,
    userId: string,
    userRole: string
  ) {
    // 1. If user is Teacher, verify assignment to this group
    if (userRole === 'Teacher') {
      const assigned = await this.db
        .select()
        .from(groupTeachers)
        .where(
          and(
            eq(groupTeachers.groupId, dto.groupId),
            eq(groupTeachers.teacherId, userId)
          )
        )
        .limit(1)

      if (assigned.length === 0) {
        throw new ForbiddenException(
          'Teachers can only record attendance for their assigned groups'
        )
      }
    }

    // 2. Execute Transaction: Session creation/lookup + Records upsert
    const result = await this.db.transaction(async (tx) => {
      // Find or create attendance session
      let sessionId: string
      const existingSession = await tx
        .select()
        .from(attendanceSessions)
        .where(
          and(
            eq(attendanceSessions.groupId, dto.groupId),
            eq(attendanceSessions.sessionDate, dto.sessionDate)
          )
        )
        .limit(1)

      if (existingSession.length > 0) {
        sessionId = existingSession[0].id
      } else {
        const [newSession] = await tx
          .insert(attendanceSessions)
          .values({
            academyId,
            groupId: dto.groupId,
            lessonId: dto.lessonId || null,
            teacherId: userId,
            sessionDate: dto.sessionDate,
          })
          .returning()
        sessionId = newSession.id
      }

      const recorded: (typeof attendanceRecords.$inferSelect)[] = []
      for (const rec of dto.records) {
        // Upsert record with server timestamp to prevent duplicates
        const existingRecord = await tx
          .select()
          .from(attendanceRecords)
          .where(
            and(
              eq(attendanceRecords.sessionId, sessionId),
              eq(attendanceRecords.studentId, rec.studentId)
            )
          )
          .limit(1)

        if (existingRecord.length > 0) {
          const [updated] = await tx
            .update(attendanceRecords)
            .set({
              status: rec.status,
              markedBy: userId,
              markedAt: new Date(),
            })
            .where(eq(attendanceRecords.id, existingRecord[0].id))
            .returning()
          recorded.push(updated)
        } else {
          const [inserted] = await tx
            .insert(attendanceRecords)
            .values({
              sessionId,
              studentId: rec.studentId,
              status: rec.status,
              markedBy: userId,
              markedAt: new Date(),
            })
            .returning()
          recorded.push(inserted)
        }
      }

      return {
        sessionId,
        records: recorded,
      }
    })

    await this.auditLogsService.log({
      academyId,
      userId,
      action: 'ATTENDANCE_RECORDED',
      entityType: 'attendance_sessions',
      entityId: result.sessionId,
      payloadAfter: {
        groupId: dto.groupId,
        sessionDate: dto.sessionDate,
        recordsCount: result.records.length,
      },
    })

    return result
  }

  async getGroupAttendance(academyId: string, groupId: string) {
    return this.db
      .select({
        sessionId: attendanceSessions.id,
        sessionDate: attendanceSessions.sessionDate,
        recordId: attendanceRecords.id,
        studentId: attendanceRecords.studentId,
        status: attendanceRecords.status,
        markedAt: attendanceRecords.markedAt,
      })
      .from(attendanceSessions)
      .innerJoin(
        attendanceRecords,
        eq(attendanceSessions.id, attendanceRecords.sessionId)
      )
      .where(
        and(
          eq(attendanceSessions.academyId, academyId),
          eq(attendanceSessions.groupId, groupId)
        )
      )
  }
}

