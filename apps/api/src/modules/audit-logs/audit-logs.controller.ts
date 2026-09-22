import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { type AuditLogsService } from './audit-logs.service'
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard'
import { RbacGuard } from '../../common/guards/rbac.guard'
import { RequirePermission } from '../../common/decorators/require-permission.decorator'
import { CurrentUser, type AuthenticatedUser } from '../../common/decorators/current-user.decorator'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'

@ApiTags('Audit Logs')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard, RbacGuard)
@Controller('api/v1/audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @RequirePermission('audit_logs.read')
  async getLogs(
    @CurrentUser() user: AuthenticatedUser,
    @Query('limit') limit?: number
  ) {
    return this.auditLogsService.getAcademyLogs(user.academyId, limit || 50)
  }
}

