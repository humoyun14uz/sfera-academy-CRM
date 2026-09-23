import { Module } from '@nestjs/common'
import { AttendanceService } from './attendance.service'
import { AttendanceController } from './attendance.controller'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}

