import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import {
  createDb,
  leads,
  students,
  enrollments,
  groups,
  courses,
  invoices,
} from '@sfera/db'
import { eq, and } from 'drizzle-orm'
import { CreateLeadDto, ConvertLeadDto } from '@sfera/contracts'
import { AuditLogsService } from '../audit-logs/audit-logs.service'

@Injectable()
export class LeadsService {
  constructor(
    @Inject('DATABASE') private db: ReturnType<typeof createDb>,
    private auditLogsService: AuditLogsService
  ) {}

  async findAll(academyId: string) {
    return this.db
      .select()
      .from(leads)
      .where(eq(leads.academyId, academyId))
  }

  async create(academyId: string, dto: CreateLeadDto, userId?: string) {
    const [created] = await this.db
      .insert(leads)
      .values({
        academyId,
        name: dto.name,
        phone: dto.phone,
        courseId: dto.courseId || null,
        notes: dto.notes || null,
        status: 'NEW',
      })
      .returning()

    await this.auditLogsService.log({
      academyId,
      userId,
      action: 'LEAD_CREATED',
      entityType: 'leads',
      entityId: created.id,
      payloadAfter: created,
    })

    return created
  }

  async convertToStudent(
    academyId: string,
    leadId: string,
    dto: ConvertLeadDto,
    userId?: string
  ) {
    const leadList = await this.db
      .select()
      .from(leads)
      .where(and(eq(leads.id, leadId), eq(leads.academyId, academyId)))
      .limit(1)

    if (leadList.length === 0) throw new NotFoundException('Lead not found')
    const lead = leadList[0]

    if (lead.status === 'CONVERTED') {
      throw new BadRequestException('Lead has already been converted')
    }

    // Verify target group exists and get course details
    const groupList = await this.db
      .select({
        groupId: groups.id,
        groupName: groups.name,
        coursePrice: courses.price,
      })
      .from(groups)
      .innerJoin(courses, eq(groups.courseId, courses.id))
      .where(and(eq(groups.id, dto.groupId), eq(groups.academyId, academyId)))
      .limit(1)

    if (groupList.length === 0) {
      throw new NotFoundException('Target group not found')
    }
    const group = groupList[0]

    // Execute atomic transaction: Student + Lead Update + Enrollment + Invoice
    const result = await this.db.transaction(async (tx) => {
      // Split name into first and last
      const nameParts = lead.name.trim().split(' ')
      const firstName = nameParts[0] || 'Student'
      const lastName = nameParts.slice(1).join(' ') || 'Sfera'

      // 1. Create Student
      const [newStudent] = await tx
        .insert(students)
        .values({
          academyId,
          firstName,
          lastName,
          phone: lead.phone,
          status: 'active',
        })
        .returning()

      // 2. Mark Lead as Converted
      const [updatedLead] = await tx
        .update(leads)
        .set({
          status: 'CONVERTED',
          convertedStudentId: newStudent.id,
          updatedAt: new Date(),
        })
        .where(eq(leads.id, leadId))
        .returning()

      // 3. Create Enrollment
      const [newEnrollment] = await tx
        .insert(enrollments)
        .values({
          academyId,
          studentId: newStudent.id,
          groupId: dto.groupId,
          status: 'active',
        })
        .returning()

      // 4. Create Initial Invoice
      const invoiceNumber = `INV-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 7)
      const dueDateStr = dueDate.toISOString().split('T')[0]

      const [newInvoice] = await tx
        .insert(invoices)
        .values({
          academyId,
          studentId: newStudent.id,
          enrollmentId: newEnrollment.id,
          invoiceNumber,
          amount: group.coursePrice,
          paidAmount: 0,
          debtAmount: group.coursePrice,
          status: 'pending',
          dueDate: dueDateStr,
          description: `Tuition fee for group ${group.groupName} (Converted from Lead)`,
        })
        .returning()

      return {
        student: newStudent,
        lead: updatedLead,
        enrollment: newEnrollment,
        invoice: newInvoice,
      }
    })

    await this.auditLogsService.log({
      academyId,
      userId,
      action: 'LEAD_CONVERTED_TO_STUDENT',
      entityType: 'leads',
      entityId: leadId,
      payloadAfter: {
        studentId: result.student.id,
        enrollmentId: result.enrollment.id,
      },
    })

    return result
  }
}

