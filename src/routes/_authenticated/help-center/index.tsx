import { createFileRoute } from '@tanstack/react-router'
import { requirePermission } from '@/lib/route-guard'
import { ComingSoon } from '@/components/coming-soon'

export const Route = createFileRoute('/_authenticated/help-center/')({
  beforeLoad: () => requirePermission('dashboard.read'),
  component: ComingSoon,
})
