import { createFileRoute } from '@tanstack/react-router'
import { TeacherDashboard } from '@/features/teacher'
import { requirePermission } from '@/lib/route-guard'

export const Route = createFileRoute('/_authenticated/teacher/$section')({
  beforeLoad: () => requirePermission('teacher.workspace'),
  component: TeacherSection,
})

function TeacherSection() {
  const { section } = Route.useParams()
  return <TeacherDashboard section={section} />
}
