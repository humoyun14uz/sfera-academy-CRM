import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'
import { requirePermission } from '@/lib/route-guard'

const Chats = lazyRouteComponent(() => import('@/features/chats'), 'Chats')

export const Route = createFileRoute('/_authenticated/chats/')({
  beforeLoad: () => requirePermission('messages.read'),
  component: Chats,
})
