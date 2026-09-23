import { Module } from '@nestjs/common'
import { FinanceService } from './finance.service'
import { FinanceController } from './finance.controller'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [FinanceController],
  providers: [FinanceService],
  exports: [FinanceService],
})
export class FinanceModule {}

