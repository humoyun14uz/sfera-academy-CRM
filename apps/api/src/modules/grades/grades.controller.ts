import { Controller, Get, Post, Patch, Body, Param, UseGuards, UsePipes } from '@nestjs/common'
import { type GradesService } from './grades.service'
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard'
import { RbacGuard } from '../../common/guards/rbac.guard'
import { ScopeGuard } from '../../common/guards/scope.guard'
import { RequirePermission } from '../../common/decorators/require-permission.decorator'
import { CurrentUser, type AuthenticatedUser } from '../../common/decorators/current-user.decorator'
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe'
import { createGradeSchema, type CreateGradeDto, updateGradeSchema, type UpdateGradeDto } from '@sfera/contracts'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'

@ApiTags('Grades')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard, RbacGuard, ScopeGuard)
@Controller('api/v1/grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post()
  @RequirePermission('grades.create')
  @UsePipes(new ZodValidationPipe(createGradeSchema))
  @ApiOperation({ summary: 'Record student grade' })
  async create(
    @Body() dto: CreateGradeDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.gradesService.createGrade(user.academyId, dto, user.id, user.role)
  }

  @Patch(':gradeId')
  @RequirePermission('grades.update')
  @UsePipes(new ZodValidationPipe(updateGradeSchema))
  @ApiOperation({ summary: 'Update student grade (records mandatory grade_history)' })
  async update(
    @Param('gradeId') gradeId: string,
    @Body() dto: UpdateGradeDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.gradesService.updateGrade(user.academyId, gradeId, dto, user.id)
  }

  @Get('students/:studentId')
  @RequirePermission('grades.read')
  @ApiOperation({ summary: 'Get student grades (scoped to self if Student)' })
  async getStudentGrades(
    @Param('studentId') studentId: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.gradesService.getStudentGrades(user.academyId, studentId)
  }

  @Get(':gradeId/history')
  @RequirePermission('grades.read')
  @ApiOperation({ summary: 'Get grade audit history' })
  async getGradeHistory(@Param('gradeId') gradeId: string) {
    return this.gradesService.getGradeHistory(gradeId)
  }
}

