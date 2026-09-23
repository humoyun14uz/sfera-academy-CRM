import { Module, Global } from '@nestjs/common'
import { AuditLogsService } from './audit-logs.service'
import { AuditLogsController } from './audit-logs.controller'
import { DatabaseModule } from '../database/database.module'

@Global()
@Module({
  imports: [DatabaseModule],
  controllers: [AuditLogsController],
  providers: [AuditLogsService],
  exports: [AuditLogsService],
})
export class AuditLogsModule {}

