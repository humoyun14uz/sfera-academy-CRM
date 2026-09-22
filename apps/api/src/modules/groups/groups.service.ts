import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common'
import { createDb, groups, groupTeachers, users, enrollments, students, courses } from '@sfera/db'
import { eq, and } from 'drizzle-orm'
import { CreateGroupDto, AssignTeacherDto } from '@sfera/contracts'
import { AuditLogsService } from '../audit-logs/audit-logs.service'

@Injectable()
export class GroupsService {
  constructor(
    @Inject('DATABASE') private db: ReturnType<typeof createDb>,
    private auditLogsService: AuditLogsService
  ) {}

  async findAll(academyId: string, teacherId?: string) {
    if (teacherId) {
      // Return only groups assigned to this teacher
      return this.db
        .select({
          id: groups.id,
          academyId: groups.academyId,
          courseId: groups.courseId,
          courseName: courses.name,
          name: groups.name,
          room: groups.room,
          capacity: groups.capacity,
          scheduleDays: groups.scheduleDays,
          startTime: groups.startTime,
          endTime: groups.endTime,
          status: groups.status,
          createdAt: groups.createdAt,
        })
        .from(groups)
        .innerJoin(courses, eq(groups.courseId, courses.id))
        .innerJoin(groupTeachers, eq(groups.id, groupTeachers.groupId))
        .where(
          and(
            eq(groups.academyId, academyId),
            eq(groupTeachers.teacherId, teacherId),
            eq(groups.status, 'active')
          )
        )
    }

    return this.db
      .select({
        id: groups.id,
        academyId: groups.academyId,
        courseId: groups.courseId,
        courseName: courses.name,
        name: groups.name,
        room: groups.room,
        capacity: groups.capacity,
        scheduleDays: groups.scheduleDays,
        startTime: groups.startTime,
        endTime: groups.endTime,
        status: groups.status,
        createdAt: groups.createdAt,
      })
      .from(groups)
      .innerJoin(courses, eq(groups.courseId, courses.id))
      .where(and(eq(groups.academyId, academyId), eq(groups.status, 'active')))
  }

  async findById(academyId: string, id: string) {
    const list = await this.db
      .select({
        id: groups.id,
        academyId: groups.academyId,
        courseId: groups.courseId,
        courseName: courses.name,
        name: groups.name,
        room: groups.room,
        capacity: groups.capacity,
        scheduleDays: groups.scheduleDays,
        startTime: groups.startTime,
        endTime: groups.endTime,
        status: groups.status,
        createdAt: groups.createdAt,
      })
      .from(groups)
      .innerJoin(courses, eq(groups.courseId, courses.id))
      .where(and(eq(groups.academyId, academyId), eq(groups.id, id)))
      .limit(1)

    if (list.length === 0) throw new NotFoundException('Group not found')
    const group = list[0]

    // Fetch teachers
    const teachers = await this.db
      .select({
        teacherId: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        isPrimary: groupTeachers.isPrimary,
      })
      .from(groupTeachers)
      .innerJoin(users, eq(groupTeachers.teacherId, users.id))
      .where(eq(groupTeachers.groupId, id))

    // Fetch enrolled students count
    const studentList = await this.getStudents(id)

    return {
      ...group,
      teachers,
      studentsCount: studentList.length,
    }
  }

  async create(academyId: string, dto: CreateGroupDto, userId?: string) {
    const [created] = await this.db
      .insert(groups)
      .values({
        academyId,
        courseId: dto.courseId,
        name: dto.name,
        room: dto.room,
        capacity: dto.capacity,
        scheduleDays: dto.scheduleDays,
        startTime: dto.startTime,
        endTime: dto.endTime,
        status: 'active',
      })
      .returning()

    await this.auditLogsService.log({
      academyId,
      userId,
      action: 'GROUP_CREATED',
      entityType: 'groups',
      entityId: created.id,
      payloadAfter: created,
    })

    return created
  }

  async assignTeacher(groupId: string, dto: AssignTeacherDto, userId?: string) {
    const existing = await this.db
      .select()
      .from(groupTeachers)
      .where(
        and(
          eq(groupTeachers.groupId, groupId),
          eq(groupTeachers.teacherId, dto.teacherId)
        )
      )
      .limit(1)

    if (existing.length > 0) {
      throw new ConflictException('Teacher is already assigned to this group')
    }

    const [assigned] = await this.db
      .insert(groupTeachers)
      .values({
        groupId,
        teacherId: dto.teacherId,
        isPrimary: dto.isPrimary,
      })
      .returning()

    await this.auditLogsService.log({
      userId,
      action: 'TEACHER_ASSIGNED_TO_GROUP',
      entityType: 'group_teachers',
      entityId: assigned.id,
      payloadAfter: assigned,
    })

    return assigned
  }

  async getStudents(groupId: string) {
    return this.db
      .select({
        enrollmentId: enrollments.id,
        studentId: students.id,
        firstName: students.firstName,
        lastName: students.lastName,
        phone: students.phone,
        email: students.email,
        status: enrollments.status,
        enrolledAt: enrollments.enrolledAt,
      })
      .from(enrollments)
      .innerJoin(students, eq(enrollments.studentId, students.id))
      .where(and(eq(enrollments.groupId, groupId), eq(enrollments.status, 'active')))
  }
}

