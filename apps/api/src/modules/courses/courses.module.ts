import { Module } from '@nestjs/common'
import { CoursesService } from './courses.service'
import { CoursesController } from './courses.controller'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}

