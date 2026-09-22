import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { type createDb, students, enrollments, groups, courses } from '@sfera/db'
import { eq, and } from 'drizzle-orm'
import { type CreateStudentDto } from '@sfera/contracts'
import { type AuditLogsService } from '../audit-logs/audit-logs.service'

@Injectable()
export class StudentsService {
  constructor(
    @Inject('DATABASE') private db: ReturnType<typeof createDb>,
    private auditLogsService: AuditLogsService
  ) {}

  async findAll(academyId: string) {
    return this.db
      .select()
      .from(students)
      .where(and(eq(students.academyId, academyId), eq(students.status, 'active')))
  }

  async findById(academyId: string, id: string) {
    const list = await this.db
      .select()
      .from(students)
      .where(and(eq(students.academyId, academyId), eq(students.id, id)))
      .limit(1)

    if (list.length === 0) throw new NotFoundException('Student not found')
    const student = list[0]

    // Fetch student's enrollments with group and course details
    const studentEnrollments = await this.db
      .select({
        enrollmentId: enrollments.id,
        status: enrollments.status,
        enrolledAt: enrollments.enrolledAt,
        groupId: groups.id,
        groupName: groups.name,
        courseName: courses.name,
      })
      .from(enrollments)
      .innerJoin(groups, eq(enrollments.groupId, groups.id))
      .innerJoin(courses, eq(groups.courseId, courses.id))
      .where(eq(enrollments.studentId, id))

    return {
      ...student,
      enrollments: studentEnrollments,
    }
  }

  async create(academyId: string, dto: CreateStudentDto, userId?: string) {
    const [created] = await this.db
      .insert(students)
      .values({
        academyId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        email: dto.email || null,
        parentName: dto.parentName,
        parentPhone: dto.parentPhone,
        status: 'active',
      })
      .returning()

    await this.auditLogsService.log({
      academyId,
      userId,
      action: 'STUDENT_CREATED',
      entityType: 'students',
      entityId: created.id,
      payloadAfter: created,
    })

    return created
  }
}

