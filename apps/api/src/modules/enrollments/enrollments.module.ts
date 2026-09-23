import { Module } from '@nestjs/common'
import { EnrollmentsService } from './enrollments.service'
import { EnrollmentsController } from './enrollments.controller'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}

