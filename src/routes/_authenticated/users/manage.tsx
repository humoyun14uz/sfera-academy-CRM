import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'
import { requirePermission } from '@/lib/route-guard'

const UsersManagement = lazyRouteComponent(
  () => import('@/features/users-management'),
  'UsersManagement'
)

export const Route = createFileRoute('/_authenticated/users/manage')({
  beforeLoad: () => requirePermission('users.read'),
  component: UsersManagement,
})
