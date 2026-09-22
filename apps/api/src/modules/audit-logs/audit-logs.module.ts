import { Module, Global } from '@nestjs/common'
import { AuditLogsService } from './audit-logs.service'
import { AuditLogsController } from './audit-logs.controller'

@Global()
@Module({
  controllers: [AuditLogsController],
  providers: [AuditLogsService],
  exports: [AuditLogsService],
})
export class AuditLogsModule {}

