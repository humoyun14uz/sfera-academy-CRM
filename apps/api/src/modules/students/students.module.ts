import { Module } from '@nestjs/common'
import { StudentsService } from './students.service'
import { StudentsController } from './students.controller'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}

