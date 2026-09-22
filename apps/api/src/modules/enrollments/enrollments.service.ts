import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import {
  type createDb,
  enrollments,
  students,
  groups,
  courses,
  invoices,
} from '@sfera/db'
import { eq, and } from 'drizzle-orm'
import { type CreateEnrollmentDto } from '@sfera/contracts'
import { type AuditLogsService } from '../audit-logs/audit-logs.service'

@Injectable()
export class EnrollmentsService {
  constructor(
    @Inject('DATABASE') private db: ReturnType<typeof createDb>,
    private auditLogsService: AuditLogsService
  ) {}

  async enrollStudent(
    academyId: string,
    dto: CreateEnrollmentDto,
    userId?: string
  ) {
    // 1. Verify Student exists in academy
    const studentList = await this.db
      .select()
      .from(students)
      .where(
        and(eq(students.id, dto.studentId), eq(students.academyId, academyId))
      )
      .limit(1)

    if (studentList.length === 0) {
      throw new NotFoundException('Student not found in this academy')
    }

    // 2. Verify Group exists and get course price
    const groupList = await this.db
      .select({
        groupId: groups.id,
        groupName: groups.name,
        capacity: groups.capacity,
        courseId: courses.id,
        coursePrice: courses.price,
      })
      .from(groups)
      .innerJoin(courses, eq(groups.courseId, courses.id))
      .where(and(eq(groups.id, dto.groupId), eq(groups.academyId, academyId)))
      .limit(1)

    if (groupList.length === 0) {
      throw new NotFoundException('Group not found in this academy')
    }
    const groupInfo = groupList[0]

    // 3. Check for existing active enrollment
    const existing = await this.db
      .select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.studentId, dto.studentId),
          eq(enrollments.groupId, dto.groupId)
        )
      )
      .limit(1)

    if (existing.length > 0) {
      throw new ConflictException('Student is already enrolled in this group')
    }

    // 4. Execute Transaction: Enrollment + Initial Invoice
    const result = await this.db.transaction(async (tx) => {
      const [newEnrollment] = await tx
        .insert(enrollments)
        .values({
          academyId,
          studentId: dto.studentId,
          groupId: dto.groupId,
          status: 'active',
        })
        .returning()

      // Generate initial invoice if course price > 0
      const invoiceNumber = `INV-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 10)
      const dueDateStr = dueDate.toISOString().split('T')[0]

      const [newInvoice] = await tx
        .insert(invoices)
        .values({
          academyId,
          studentId: dto.studentId,
          enrollmentId: newEnrollment.id,
          invoiceNumber,
          amount: groupInfo.coursePrice,
          paidAmount: 0,
          debtAmount: groupInfo.coursePrice,
          status: 'pending',
          dueDate: dueDateStr,
          description: `Initial tuition fee for group ${groupInfo.groupName}`,
        })
        .returning()

      return {
        enrollment: newEnrollment,
        invoice: newInvoice,
      }
    })

    await this.auditLogsService.log({
      academyId,
      userId,
      action: 'STUDENT_ENROLLED',
      entityType: 'enrollments',
      entityId: result.enrollment.id,
      payloadAfter: result,
    })

    return result
  }
}

