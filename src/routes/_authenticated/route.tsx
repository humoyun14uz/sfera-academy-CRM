import { createFileRoute } from '@tanstack/react-router'
import { requirePermission } from '@/lib/route-guard'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => requirePermission('dashboard.read'),
  component: AuthenticatedLayout,
})
