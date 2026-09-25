import { createFileRoute } from '@tanstack/react-router'
import { FinanceDashboard } from '@/features/finance'
import { requirePermission } from '@/lib/route-guard'

export const Route = createFileRoute('/_authenticated/finance/')({
  beforeLoad: () => requirePermission('finance.workspace'),
  component: () => <FinanceDashboard />,
})
