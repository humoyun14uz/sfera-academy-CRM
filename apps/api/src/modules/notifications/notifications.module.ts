import { Module } from '@nestjs/common'
import { NotificationsGateway } from './notifications.gateway'
import { NotificationsRealtimeService } from './notifications-realtime.service'
import { NotificationsSocketAuth } from './notifications-socket-auth.service'

@Module({
  providers: [
    NotificationsGateway,
    NotificationsRealtimeService,
    NotificationsSocketAuth,
  ],
  exports: [NotificationsRealtimeService],
})
export class NotificationsModule {}
