import { Module } from '@nestjs/common'
import { LeadsService } from './leads.service'
import { LeadsController } from './leads.controller'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [LeadsController],
  providers: [LeadsService],
  exports: [LeadsService],
})
export class LeadsModule {}

