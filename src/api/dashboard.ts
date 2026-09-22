import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth-store'
import { getPrimaryRole } from '@/lib/rbac'

export function useDashboardData() {
  const user = useAuthStore((state) => state.auth.user)
  const role = getPrimaryRole(user?.role)

  const students = useQuery({
    queryKey: ['dashboard', 'students'],
    queryFn: () => apiClient.get('/students').then((r) => r.data.data),
    enabled: role !== 'Teacher',
  })

  const groups = useQuery({
    queryKey: ['dashboard', 'groups'],
    queryFn: () => apiClient.get('/groups').then((r) => r.data.data),
    enabled: role !== 'Teacher',
  })

  const financeSummary = useQuery({
    queryKey: ['dashboard', 'finance', 'summary'],
    queryFn: () => apiClient.get('/finance/summary').then((r) => r.data.data),
    enabled: role !== 'Teacher',
  })

  const payments = useQuery({
    queryKey: ['dashboard', 'payments'],
    queryFn: () => apiClient.get('/finance/payments').then((r) => r.data.data),
    enabled: role !== 'Teacher',
  })

  const leads = useQuery({
    queryKey: ['dashboard', 'leads'],
    queryFn: () => apiClient.get('/leads').then((r) => r.data.data),
    enabled: role !== 'Teacher',
  })

  const auditLogs = useQuery({
    queryKey: ['dashboard', 'audit-logs'],
    queryFn: () => apiClient.get('/audit-logs').then((r) => r.data.data),
    enabled: role !== 'Teacher',
    staleTime: 30 * 1000,
  })

  return {
    students: students.data ?? [],
    groups: groups.data ?? [],
    payments: payments.data ?? [],
    leads: leads.data ?? [],
    auditLogs: auditLogs.data ?? [],
    financeSummary: financeSummary.data ?? null,
    isLoading: students.isLoading || groups.isLoading,
    isError: students.isError || groups.isError,
    error: students.error || groups.error,
    refetch: () => {
      students.refetch()
      groups.refetch()
      payments.refetch()
      leads.refetch()
      auditLogs.refetch()
    },
  }
}
