import { createFileRoute } from '@tanstack/react-router'
import { requirePermission } from '@/lib/route-guard'
import { CourseDetails } from '@/features/courses/details'

export const Route = createFileRoute('/_authenticated/apps/$courseId')({
  beforeLoad: () => requirePermission('courses.read'),
  component: CourseDetails,
})
