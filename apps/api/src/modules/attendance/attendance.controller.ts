import { Controller, Get, Post, Body, Param, UseGuards, UsePipes } from '@nestjs/common'
import { AttendanceService } from './attendance.service'
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard'
import { RbacGuard } from '../../common/guards/rbac.guard'
import { ScopeGuard } from '../../common/guards/scope.guard'
import { RequirePermission } from '../../common/decorators/require-permission.decorator'
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator'
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe'
import { markAttendanceSessionSchema, MarkAttendanceSessionDto } from '@sfera/contracts'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'

@ApiTags('Attendance')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard, RbacGuard, ScopeGuard)
@Controller('api/v1/attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('sessions')
  @RequirePermission('attendance.mark')
  @UsePipes(new ZodValidationPipe(markAttendanceSessionSchema))
  @ApiOperation({ summary: 'Record/update attendance session (duplicate-prevented)' })
  async mark(
    @Body() dto: MarkAttendanceSessionDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.attendanceService.markAttendance(
      user.academyId,
      dto,
      user.id,
      user.role
    )
  }

  @Get('groups/:groupId')
  @RequirePermission('attendance.read')
  @ApiOperation({ summary: 'Get attendance history for group' })
  async getGroupAttendance(
    @Param('groupId') groupId: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.attendanceService.getGroupAttendance(user.academyId, groupId)
  }
}

