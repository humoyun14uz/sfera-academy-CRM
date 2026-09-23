import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { createDb, courses } from '@sfera/db'
import { eq, and } from 'drizzle-orm'
import { CreateCourseDto } from './dto/create-course.dto'
import { AuditLogsService } from '../audit-logs/audit-logs.service'

@Injectable()
export class CoursesService {
  constructor(
    @Inject('DATABASE') private db: ReturnType<typeof createDb>,
    private auditLogsService: AuditLogsService
  ) {}

  async findAll(academyId: string) {
    return this.db
      .select()
      .from(courses)
      .where(and(eq(courses.academyId, academyId), eq(courses.status, 'active')))
  }

  async findById(academyId: string, id: string) {
    const list = await this.db
      .select()
      .from(courses)
      .where(and(eq(courses.academyId, academyId), eq(courses.id, id)))
      .limit(1)

    if (list.length === 0) throw new NotFoundException('Course not found')
    return list[0]
  }

  async create(academyId: string, dto: CreateCourseDto, userId?: string) {
    const [created] = await this.db
      .insert(courses)
      .values({
        academyId,
        name: dto.name,
        code: dto.code,
        category: dto.category,
        description: dto.description,
        durationMonths: dto.durationMonths,
        price: dto.price,
        status: 'active',
      })
      .returning()

    await this.auditLogsService.log({
      academyId,
      userId,
      action: 'COURSE_CREATED',
      entityType: 'courses',
      entityId: created.id,
      payloadAfter: created,
    })

    return created
  }
}

