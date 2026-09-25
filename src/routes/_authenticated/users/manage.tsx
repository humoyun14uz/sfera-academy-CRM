import { createFileRoute } from '@tanstack/react-router'
import { UsersManagement } from '@/features/users-management'
import { requirePermission } from '@/lib/route-guard'

export const Route = createFileRoute('/_authenticated/users/manage')({
  beforeLoad: () => requirePermission('users.read'),
  component: UsersManagement,
})
