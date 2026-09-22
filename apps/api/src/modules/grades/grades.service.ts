import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { type createDb, grades, gradeHistory, groupTeachers } from '@sfera/db'
import { eq, and } from 'drizzle-orm'
import { type CreateGradeDto, type UpdateGradeDto } from '@sfera/contracts'
import { type AuditLogsService } from '../audit-logs/audit-logs.service'

@Injectable()
export class GradesService {
  constructor(
    @Inject('DATABASE') private db: ReturnType<typeof createDb>,
    private auditLogsService: AuditLogsService
  ) {}

  async createGrade(
    academyId: string,
    dto: CreateGradeDto,
    userId: string,
    userRole: string
  ) {
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
          'Teachers can only assign grades to their assigned groups'
        )
      }
    }

    const [created] = await this.db
      .insert(grades)
      .values({
        academyId,
        studentId: dto.studentId,
        groupId: dto.groupId,
        assignmentId: dto.assignmentId || null,
        teacherId: userId,
        score: dto.score.toString(),
        feedback: dto.feedback || null,
      })
      .returning()

    await this.auditLogsService.log({
      academyId,
      userId,
      action: 'GRADE_RECORDED',
      entityType: 'grades',
      entityId: created.id,
      payloadAfter: created,
    })

    return created
  }

  async updateGrade(
    academyId: string,
    gradeId: string,
    dto: UpdateGradeDto,
    userId: string
  ) {
    const list = await this.db
      .select()
      .from(grades)
      .where(and(eq(grades.id, gradeId), eq(grades.academyId, academyId)))
      .limit(1)

    if (list.length === 0) throw new NotFoundException('Grade record not found')
    const currentGrade = list[0]
    const oldScore = currentGrade.score

    // Transaction: update grade + insert grade_history
    const result = await this.db.transaction(async (tx) => {
      const [updated] = await tx
        .update(grades)
        .set({
          score: dto.score.toString(),
          updatedAt: new Date(),
        })
        .where(eq(grades.id, gradeId))
        .returning()

      const [historyEntry] = await tx
        .insert(gradeHistory)
        .values({
          gradeId,
          oldScore,
          newScore: dto.score.toString(),
          changedBy: userId,
          reason: dto.reason,
        })
        .returning()

      return {
        grade: updated,
        history: historyEntry,
      }
    })

    await this.auditLogsService.log({
      academyId,
      userId,
      action: 'GRADE_UPDATED',
      entityType: 'grades',
      entityId: gradeId,
      payloadBefore: { score: oldScore },
      payloadAfter: { score: dto.score, reason: dto.reason },
    })

    return result
  }

  async getStudentGrades(academyId: string, studentId: string) {
    return this.db
      .select()
      .from(grades)
      .where(and(eq(grades.academyId, academyId), eq(grades.studentId, studentId)))
  }

  async getGradeHistory(gradeId: string) {
    return this.db
      .select()
      .from(gradeHistory)
      .where(eq(gradeHistory.gradeId, gradeId))
  }
}

