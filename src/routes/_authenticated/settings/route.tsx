import { createFileRoute } from '@tanstack/react-router'
import { requirePermission } from '@/lib/route-guard'
import { Settings } from '@/features/settings'

export const Route = createFileRoute('/_authenticated/settings')({
  beforeLoad: () => requirePermission('settings.read'),
  component: Settings,
})
