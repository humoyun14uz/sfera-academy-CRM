import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { useCrmStore, type CrmNotification } from '@/lib/crm-store'

type NotificationMessage = {
  type?: string
  event?: string
  notification?: Partial<CrmNotification>
  notifications?: Partial<CrmNotification>[]
  data?: Partial<CrmNotification>
  payload?: Partial<CrmNotification>
}

const wsUrl = import.meta.env.VITE_NOTIFICATION_WS_URL as string | undefined

export function useNotificationRealtime() {
  const accessToken = useAuthStore((state) => state.auth.accessToken)
  const addNotification = useCrmStore((state) => state.addNotification)
  const reconnectAttempt = useRef(0)

  useEffect(() => {
    if (!wsUrl || !accessToken) return

    let socket: WebSocket | null = null
    let reconnectTimer: number | undefined
    let disposed = false

    const connect = () => {
      if (disposed) return
      socket = new WebSocket(wsUrl)

      socket.onopen = () => {
        reconnectAttempt.current = 0
        socket?.send(
          JSON.stringify({ event: 'auth', data: { token: accessToken } })
        )
      }

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as NotificationMessage
          const candidates = message.notifications ?? [
            message.notification ?? message.payload ?? message.data,
          ]
          candidates.forEach((candidate) => {
            if (!candidate?.id || !candidate.title) return

            addNotification({
              id: candidate.id,
              title: candidate.title,
              category: candidate.category ?? 'system',
              read: candidate.read ?? false,
              createdAt: candidate.createdAt ?? new Date().toISOString(),
              target: candidate.target ?? '/settings/notifications',
            })
          })
        } catch {
          // Ignore malformed server messages and keep the connection alive.
        }
      }

      socket.onclose = () => {
        if (disposed) return
        const delay = Math.min(30_000, 1_000 * 2 ** reconnectAttempt.current)
        reconnectAttempt.current += 1
        reconnectTimer = window.setTimeout(connect, delay)
      }

      socket.onerror = () => socket?.close()
    }

    connect()

    return () => {
      disposed = true
      if (reconnectTimer) window.clearTimeout(reconnectTimer)
      socket?.close()
    }
  }, [accessToken, addNotification])
}
