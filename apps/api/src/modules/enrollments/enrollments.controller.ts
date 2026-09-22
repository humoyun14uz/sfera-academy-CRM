import { Controller, Post, Body, UseGuards, UsePipes } from '@nestjs/common'
import { EnrollmentsService } from './enrollments.service'
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard'
import { RbacGuard } from '../../common/guards/rbac.guard'
import { RequirePermission } from '../../common/decorators/require-permission.decorator'
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator'
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe'
import { createEnrollmentSchema, CreateEnrollmentDto } from '@sfera/contracts'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'

@ApiTags('Enrollments')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard, RbacGuard)
@Controller('api/v1/enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @RequirePermission('enrollments.create')
  @UsePipes(new ZodValidationPipe(createEnrollmentSchema))
  @ApiOperation({ summary: 'Enroll student into a group (transactional with initial invoice)' })
  async enroll(
    @Body() dto: CreateEnrollmentDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.enrollmentsService.enrollStudent(user.academyId, dto, user.id)
  }
}

