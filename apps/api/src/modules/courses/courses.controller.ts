import { Controller, Get, Post, Body, Param, UseGuards, UsePipes } from '@nestjs/common'
import { type CoursesService } from './courses.service'
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard'
import { RbacGuard } from '../../common/guards/rbac.guard'
import { RequirePermission } from '../../common/decorators/require-permission.decorator'
import { CurrentUser, type AuthenticatedUser } from '../../common/decorators/current-user.decorator'
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe'
import { createCourseSchema, type CreateCourseDto } from '@sfera/contracts'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'

@ApiTags('Courses')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard, RbacGuard)
@Controller('api/v1/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @RequirePermission('courses.read')
  @ApiOperation({ summary: 'List courses in current academy' })
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.coursesService.findAll(user.academyId)
  }

  @Get(':id')
  @RequirePermission('courses.read')
  @ApiOperation({ summary: 'Get course by ID' })
  async findById(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.coursesService.findById(user.academyId, id)
  }

  @Post()
  @RequirePermission('courses.create')
  @UsePipes(new ZodValidationPipe(createCourseSchema))
  @ApiOperation({ summary: 'Create new course in current academy' })
  async create(
    @Body() dto: CreateCourseDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.coursesService.create(user.academyId, dto, user.id)
  }
}

