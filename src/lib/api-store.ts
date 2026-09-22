import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import {
  adaptStudents,
  adaptGroups,
  adaptPayments,
  adaptActivities,
  adaptNotifications,
  adaptApplications,
} from '@/api/adapters'
import type { CrmStudent, CrmGroup, CrmPayment, CrmActivity, CrmNotification, CrmApplication } from '@/lib/crm-store'

interface DashboardApiData {
  students: CrmStudent[]
  groups: CrmGroup[]
  payments: CrmPayment[]
  activities: CrmActivity[]
  notifications: CrmNotification[]
  applications: CrmApplication[]
  financeSummary: Record<string, unknown> | null
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

export function useApiStore(): DashboardApiData {
  const studentsQuery = useQuery({
    queryKey: ['dashboard', 'students'],
    queryFn: () => apiClient.get('/students').then((r) => r.data.data),
  })

  const groupsQuery = useQuery({
    queryKey: ['dashboard', 'groups'],
    queryFn: () => apiClient.get('/groups').then((r) => r.data.data),
  })

  const paymentsQuery = useQuery({
    queryKey: ['dashboard', 'payments'],
    queryFn: () => apiClient.get('/finance/payments').then((r) => r.data.data),
  })

  const leadsQuery = useQuery({
    queryKey: ['dashboard', 'leads'],
    queryFn: () => apiClient.get('/leads').then((r) => r.data.data),
  })

  const auditQuery = useQuery({
    queryKey: ['dashboard', 'audit-logs'],
    queryFn: () => apiClient.get('/audit-logs').then((r) => r.data.data),
    staleTime: 30 * 1000,
  })

  const financeQuery = useQuery({
    queryKey: ['dashboard', 'finance'],
    queryFn: () => apiClient.get('/finance/summary').then((r) => r.data.data),
    enabled: false,
  })

  const students = adaptStudents(studentsQuery.data ?? [])
  const groups = adaptGroups(groupsQuery.data ?? [])
  const payments = adaptPayments(paymentsQuery.data ?? [])
  const activities = adaptActivities(auditQuery.data ?? [])
  const notifications = adaptNotifications([])
  const applications = adaptApplications(leadsQuery.data ?? [])

  const isLoading = studentsQuery.isLoading || groupsQuery.isLoading
  const isError = studentsQuery.isError || groupsQuery.isError
  const error = studentsQuery.error ?? groupsQuery.error

  return {
    students,
    groups,
    payments,
    activities,
    notifications,
    applications,
    financeSummary: financeQuery.data ?? null,
    isLoading,
    isError,
    error,
    refetch: () => {
      studentsQuery.refetch()
      groupsQuery.refetch()
      paymentsQuery.refetch()
      leadsQuery.refetch()
      auditQuery.refetch()
    },
  }
}
