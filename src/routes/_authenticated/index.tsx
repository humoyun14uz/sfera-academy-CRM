import {
  createFileRoute,
  lazyRouteComponent,
  redirect,
} from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { getPrimaryRole } from '@/lib/rbac'
import { requireAuthenticated } from '@/lib/route-guard'

const Dashboard = lazyRouteComponent(
  () => import('@/features/dashboard'),
  'Dashboard'
)
const ManagerDashboard = lazyRouteComponent(
  () => import('@/features/dashboard/manager-dashboard'),
  'ManagerDashboard'
)
const StudentDashboard = lazyRouteComponent(
  () => import('@/features/student/student-dashboard'),
  'StudentDashboard'
)

export const Route = createFileRoute('/_authenticated/')({
  beforeLoad: () => {
    requireAuthenticated()
    const role = getPrimaryRole(useAuthStore.getState().auth.user?.role)
    if (role === 'Teacher') throw redirect({ to: '/teacher' })
    if (role === 'Finance') throw redirect({ to: '/finance' })
  },
  component: RoleDashboard,
})

function RoleDashboard() {
  const role = getPrimaryRole(useAuthStore((state) => state.auth.user?.role))
  if (role === 'Student') return <StudentDashboard />
  if (role === 'Manager') return <ManagerDashboard />
  return <Dashboard />
}
