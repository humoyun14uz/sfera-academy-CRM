import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Inject, Logger } from '@nestjs/common'
import type { Server, WebSocket } from 'ws'
import { NotificationsRealtimeService } from './notifications-realtime.service'
import { NotificationsSocketAuth } from './notifications-socket-auth.service'

const AUTH_TIMEOUT_MS = 10_000

type AuthMessage = { token?: string }
type NotificationSocketIdentity = { userId: string; academyId: string }

@WebSocketGateway({ path: '/notifications' })
export class NotificationsGateway {
  private readonly logger = new Logger(NotificationsGateway.name)
  private readonly identities = new WeakMap<WebSocket, NotificationSocketIdentity>()
  private readonly authTimers = new WeakMap<WebSocket, NodeJS.Timeout>()

  @WebSocketServer()
  server!: Server

  constructor(
    @Inject(NotificationsRealtimeService)
    private readonly realtime: NotificationsRealtimeService,
    @Inject(NotificationsSocketAuth)
    private readonly socketAuth: NotificationsSocketAuth
  ) {}

  handleConnection(client: WebSocket) {
    this.authTimers.set(
      client,
      setTimeout(() => client.close(1008, 'Authentication timeout'), AUTH_TIMEOUT_MS)
    )
  }

  handleDisconnect(client: WebSocket) {
    const timer = this.authTimers.get(client)
    if (timer) clearTimeout(timer)
    this.authTimers.delete(client)
    this.identities.delete(client)
    this.realtime.unregister(client)
  }

  @SubscribeMessage('auth')
  async authenticate(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() message: AuthMessage
  ) {
    try {
      const identity = await this.socketAuth.authenticate(message?.token ?? '')
      const timer = this.authTimers.get(client)
      if (timer) clearTimeout(timer)
      this.authTimers.delete(client)
      this.identities.set(client, identity)
      this.realtime.register(client, identity)

      const snapshot = await this.realtime.snapshot(identity)
      client.send(JSON.stringify({ type: 'notification.snapshot', notifications: snapshot }))
      return { type: 'auth.ok', userId: identity.userId }
    } catch (error) {
      this.logger.warn(`WebSocket authentication failed: ${String(error)}`)
      client.close(1008, 'Unauthorized')
      return { type: 'auth.error', message: 'Unauthorized' }
    }
  }
}
