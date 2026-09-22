import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export function useNotifications() {
  const queryClient = useQueryClient()
  return {
    list: () =>
      useQuery({
        queryKey: ['notifications'],
        queryFn: () =>
          apiClient.get('/notifications').then((r) => r.data.data),
      }),
    markRead: (id: string) =>
      useMutation({
        mutationFn: () =>
          apiClient.patch(`/notifications/${id}/read`).then((r) => r.data.data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['notifications'] })
        },
      }),
  }
}
