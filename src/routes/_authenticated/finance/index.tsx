import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'
import { requirePermission } from '@/lib/route-guard'

const FinanceDashboard = lazyRouteComponent(
  () => import('@/features/finance'),
  'FinanceDashboard'
)

export const Route = createFileRoute('/_authenticated/finance/')({
  beforeLoad: () => requirePermission('finance.workspace'),
  component: FinanceDashboard,
})
