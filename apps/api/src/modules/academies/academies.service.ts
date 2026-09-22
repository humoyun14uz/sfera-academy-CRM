import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common'
import { type createDb, academies } from '@sfera/db'
import { eq } from 'drizzle-orm'
import { type CreateAcademyDto } from '@sfera/contracts'
import { type AuditLogsService } from '../audit-logs/audit-logs.service'

@Injectable()
export class AcademiesService {
  constructor(
    @Inject('DATABASE') private db: ReturnType<typeof createDb>,
    private auditLogsService: AuditLogsService
  ) {}

  async findAll() {
    return this.db.select().from(academies)
  }

  async findById(id: string) {
    const list = await this.db.select().from(academies).where(eq(academies.id, id)).limit(1)
    if (list.length === 0) throw new NotFoundException('Academy not found')
    return list[0]
  }

  async create(dto: CreateAcademyDto, userId?: string) {
    const existing = await this.db.select().from(academies).where(eq(academies.slug, dto.slug)).limit(1)
    if (existing.length > 0) throw new ConflictException(`Academy with slug '${dto.slug}' already exists`)

    const [created] = await this.db
      .insert(academies)
      .values({
        name: dto.name,
        slug: dto.slug,
        phone: dto.phone,
        email: dto.email,
        address: dto.address,
        isActive: true,
      })
      .returning()

    await this.auditLogsService.log({
      academyId: created.id,
      userId,
      action: 'ACADEMY_CREATED',
      entityType: 'academies',
      entityId: created.id,
      payloadAfter: created,
    })

    return created
  }
}

