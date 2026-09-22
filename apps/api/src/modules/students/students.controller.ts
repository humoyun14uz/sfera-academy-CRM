import { Controller, Get, Post, Body, Param, UseGuards, UsePipes } from '@nestjs/common'
import { type StudentsService } from './students.service'
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard'
import { RbacGuard } from '../../common/guards/rbac.guard'
import { ScopeGuard } from '../../common/guards/scope.guard'
import { RequirePermission } from '../../common/decorators/require-permission.decorator'
import { CurrentUser, type AuthenticatedUser } from '../../common/decorators/current-user.decorator'
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe'
import { createStudentSchema, type CreateStudentDto } from '@sfera/contracts'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'

@ApiTags('Students')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard, RbacGuard, ScopeGuard)
@Controller('api/v1/students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @RequirePermission('students.read')
  @ApiOperation({ summary: 'List students in academy' })
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.studentsService.findAll(user.academyId)
  }

  @Get(':studentId')
  @RequirePermission('students.read')
  @ApiOperation({ summary: 'Get student details (scoped to student self-access if role is Student)' })
  async findById(
    @Param('studentId') studentId: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.studentsService.findById(user.academyId, studentId)
  }

  @Post()
  @RequirePermission('students.create')
  @UsePipes(new ZodValidationPipe(createStudentSchema))
  @ApiOperation({ summary: 'Create new student' })
  async create(
    @Body() dto: CreateStudentDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.studentsService.create(user.academyId, dto, user.id)
  }
}

