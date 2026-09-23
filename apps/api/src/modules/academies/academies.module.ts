import { Module } from '@nestjs/common'
import { AcademiesService } from './academies.service'
import { AcademiesController } from './academies.controller'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [AcademiesController],
  providers: [AcademiesService],
  exports: [AcademiesService],
})
export class AcademiesModule {}

