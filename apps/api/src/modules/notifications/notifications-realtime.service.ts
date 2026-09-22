import { Inject, Injectable, Logger } from '@nestjs/common'
import type { WebSocket } from 'ws'
import { notifications, type createDb } from '@sfera/db'
import { desc, eq, and } from 'drizzle-orm'
import type { NotificationSocketIdentity } from './notifications-socket-auth.service'

export type RealtimeNotification = {
  id: string
  title: string
  category: string
  read: boolean
  createdAt: string
  target: string
}

@Injectable()
export class NotificationsRealtimeService {
  private readonly logger = new Logger(NotificationsRealtimeService.name)
  private readonly clients = new Map<WebSocket, NotificationSocketIdentity>()

  constructor(@Inject('DATABASE') private readonly db: ReturnType<typeof createDb>) {}

  register(client: WebSocket, identity: NotificationSocketIdentity) {
    this.clients.set(client, identity)
  }

  unregister(client: WebSocket) {
    this.clients.delete(client)
  }

  async snapshot(identity: NotificationSocketIdentity) {
    const rows = await this.db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, identity.userId),
          eq(notifications.academyId, identity.academyId)
        )
      )
      .orderBy(desc(notifications.createdAt))
      .limit(20)

    return rows.map((row) => this.toPayload(row))
  }

  publish(notification: RealtimeNotification, identity: NotificationSocketIdentity) {
    for (const [client, connectedIdentity] of this.clients) {
      if (
        connectedIdentity.userId !== identity.userId ||
        connectedIdentity.academyId !== identity.academyId ||
        client.readyState !== 1
      ) {
        continue
      }
      client.send(JSON.stringify({ type: 'notification', notification }))
    }
  }

  private toPayload(row: typeof notifications.$inferSelect): RealtimeNotification {
    return {
      id: row.id,
      title: row.title,
      category: row.category,
      read: row.isRead,
      createdAt: row.createdAt.toISOString(),
      target: row.targetPath ?? '/settings/notifications',
    }
  }
}
