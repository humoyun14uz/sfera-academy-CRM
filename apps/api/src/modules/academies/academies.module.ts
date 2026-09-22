import { Module } from '@nestjs/common'
import { AcademiesService } from './academies.service'
import { AcademiesController } from './academies.controller'

@Module({
  controllers: [AcademiesController],
  providers: [AcademiesService],
  exports: [AcademiesService],
})
export class AcademiesModule {}

