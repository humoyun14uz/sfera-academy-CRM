import { createFileRoute } from '@tanstack/react-router'
import { requirePermission } from '@/lib/route-guard'
import { Chats } from '@/features/chats'

export const Route = createFileRoute('/_authenticated/chats/')({
  beforeLoad: () => requirePermission('messages.read'),
  component: Chats,
})
