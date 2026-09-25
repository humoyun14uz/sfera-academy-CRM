import { createFileRoute, redirect } from '@tanstack/react-router'
import { Dashboard } from '@/features/dashboard'
import { StudentDashboard } from '@/features/student/student-dashboard'
import { getPrimaryRole } from '@/lib/rbac'
import { requireAuthenticated } from '@/lib/route-guard'
import { useAuthStore } from '@/stores/auth-store'

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
  return role === 'Student' ? <StudentDashboard /> : <Dashboard />
}
