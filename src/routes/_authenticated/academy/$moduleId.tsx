import { createFileRoute } from '@tanstack/react-router'
import { AcademyModule, academyModulePermission } from '@/features/academy-module'
import { requirePermission } from '@/lib/route-guard'

export const Route = createFileRoute('/_authenticated/academy/$moduleId')({
  beforeLoad: ({ params }) => requirePermission(academyModulePermission(params.moduleId)),
  component: RouteComponent,
})

function RouteComponent() {
  const { moduleId } = Route.useParams()
  return <AcademyModule moduleId={moduleId} />
}
