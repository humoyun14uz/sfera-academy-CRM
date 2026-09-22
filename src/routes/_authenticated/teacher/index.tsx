import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'
import { requirePermission } from '@/lib/route-guard'

const TeacherDashboard = lazyRouteComponent(
  () => import('@/features/teacher'),
  'TeacherDashboard'
)

export const Route = createFileRoute('/_authenticated/teacher/')({
  beforeLoad: () => requirePermission('teacher.workspace'),
  component: TeacherDashboard,
})
