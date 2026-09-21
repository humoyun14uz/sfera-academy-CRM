import { createFileRoute } from '@tanstack/react-router'
import { FinanceDashboard } from '@/features/finance'
import { requirePermission } from '@/lib/route-guard'

export const Route = createFileRoute('/_authenticated/finance/$section')({
  beforeLoad: () => requirePermission('finance.workspace'),
  component: FinanceSection,
})

function FinanceSection() {
  const { section } = Route.useParams()
  return <FinanceDashboard section={section} />
}
