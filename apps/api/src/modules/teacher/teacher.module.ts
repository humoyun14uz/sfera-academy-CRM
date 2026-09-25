import { Module } from '@nestjs/common'
import { TeacherController } from './teacher.controller'
import { TeacherService } from './teacher.service'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [TeacherController],
  providers: [TeacherService],
  exports: [TeacherService],
})
export class TeacherModule {}