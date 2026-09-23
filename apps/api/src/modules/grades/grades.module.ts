import { Module } from '@nestjs/common'
import { GradesService } from './grades.service'
import { GradesController } from './grades.controller'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [GradesController],
  providers: [GradesService],
  exports: [GradesService],
})
export class GradesModule {}

