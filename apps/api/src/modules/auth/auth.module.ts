import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService, ClerkAuthGuard],
  exports: [AuthService, ClerkAuthGuard],
})
export class AuthModule {}

