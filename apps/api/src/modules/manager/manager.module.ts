import { Module } from '@nestjs/common'
import { ManagerController } from './manager.controller'
import { ManagerService } from './manager.service'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [ManagerController],
  providers: [ManagerService],
  exports: [ManagerService],
})
export class ManagerModule {}