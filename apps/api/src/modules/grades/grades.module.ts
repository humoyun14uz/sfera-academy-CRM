import { Module } from '@nestjs/common'
import { GradesService } from './grades.service'
import { GradesController } from './grades.controller'

@Module({
  controllers: [GradesController],
  providers: [GradesService],
  exports: [GradesService],
})
export class GradesModule {}

