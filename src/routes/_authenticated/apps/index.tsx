import z from 'zod'
import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'
import { requirePermission } from '@/lib/route-guard'

const Courses = lazyRouteComponent(
  () => import('@/features/courses'),
  'Courses'
)

const appsSearchSchema = z.object({
  type: z
    .enum(['all', 'connected', 'notConnected'])
    .optional()
    .catch(undefined),
  filter: z.string().optional().catch(''),
  sort: z.enum(['asc', 'desc']).optional().catch(undefined),
})

export const Route = createFileRoute('/_authenticated/apps/')({
  beforeLoad: () => requirePermission('courses.read'),
  validateSearch: appsSearchSchema,
  component: Courses,
})
