import z from 'zod'
import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'
import { requirePermission } from '@/lib/route-guard'
import { roles } from '@/features/users/data/data'

const Users = lazyRouteComponent(() => import('@/features/users'), 'Users')

const usersSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  // Facet filters
  status: z
    .array(
      z.union([
        z.literal('active'),
        z.literal('inactive'),
        z.literal('invited'),
        z.literal('suspended'),
      ])
    )
    .optional()
    .catch([]),
  role: z
    .array(z.enum(roles.map((r) => r.value as (typeof roles)[number]['value'])))
    .optional()
    .catch([]),
  // Per-column text filter (example for username)
  username: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/users/')({
  beforeLoad: () => requirePermission('students.read'),
  validateSearch: usersSearchSchema,
  component: Users,
})
