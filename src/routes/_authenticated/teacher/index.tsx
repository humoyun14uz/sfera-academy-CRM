import { createFileRoute } from '@tanstack/react-router'
import { TeacherDashboard } from '@/features/teacher'
import { requirePermission } from '@/lib/route-guard'

export const Route = createFileRoute('/_authenticated/teacher/')({
  beforeLoad: () => requirePermission('teacher.workspace'),
  component: () => <TeacherDashboard />,
})
