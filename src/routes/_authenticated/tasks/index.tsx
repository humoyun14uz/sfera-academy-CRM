import z from 'zod'
import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'
import { requirePermission } from '@/lib/route-guard'
import { priorities, statuses } from '@/features/tasks/data/data'

const Tasks = lazyRouteComponent(() => import('@/features/tasks'), 'Tasks')

const taskSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  status: z
    .array(z.enum(statuses.map((status) => status.value)))
    .optional()
    .catch([]),
  priority: z
    .array(z.enum(priorities.map((priority) => priority.value)))
    .optional()
    .catch([]),
  filter: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/tasks/')({
  beforeLoad: () => requirePermission('tasks.read'),
  validateSearch: taskSearchSchema,
  component: Tasks,
})
