import { Module } from '@nestjs/common'
import { NotificationsGateway } from './notifications.gateway'
import { NotificationsRealtimeService } from './notifications-realtime.service'
import { NotificationsSocketAuth } from './notifications-socket-auth.service'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [
    NotificationsGateway,
    NotificationsRealtimeService,
    NotificationsSocketAuth,
  ],
  exports: [NotificationsRealtimeService],
})
export class NotificationsModule {}
