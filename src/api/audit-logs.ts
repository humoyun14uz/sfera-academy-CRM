import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export function useAuditLogs() {
  return {
    list: (limit = 50) =>
      useQuery({
        queryKey: ['audit-logs', limit],
        queryFn: () =>
          apiClient
            .get('/audit-logs', { params: { limit } })
            .then((r) => r.data.data),
        staleTime: 30 * 1000,
      }),
  }
}
