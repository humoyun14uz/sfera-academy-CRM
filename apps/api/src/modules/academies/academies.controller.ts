import { Controller, Get, Post, Body, Param, UseGuards, UsePipes } from '@nestjs/common'
import { AcademiesService } from './academies.service'
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard'
import { RbacGuard } from '../../common/guards/rbac.guard'
import { RequirePermission } from '../../common/decorators/require-permission.decorator'
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator'
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe'
import { createAcademySchema, CreateAcademyDto } from '@sfera/contracts'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'

@ApiTags('Academies')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard, RbacGuard)
@Controller('api/v1/academies')
export class AcademiesController {
  constructor(private readonly academiesService: AcademiesService) {}

  @Get()
  @RequirePermission('academies.read')
  @ApiOperation({ summary: 'List academies' })
  async findAll() {
    return this.academiesService.findAll()
  }

  @Get(':id')
  @RequirePermission('academies.read')
  @ApiOperation({ summary: 'Get academy by ID' })
  async findById(@Param('id') id: string) {
    return this.academiesService.findById(id)
  }

  @Post()
  @RequirePermission('academies.create')
  @UsePipes(new ZodValidationPipe(createAcademySchema))
  @ApiOperation({ summary: 'Create new academy (Super Admin)' })
  async create(
    @Body() dto: CreateAcademyDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.academiesService.create(dto, user.id)
  }
}

