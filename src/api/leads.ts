import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export function useLeads() {
  const queryClient = useQueryClient()
  return {
    list: () =>
      useQuery({
        queryKey: ['leads'],
        queryFn: () => apiClient.get('/leads').then((r) => r.data.data),
      }),
    create: () =>
      useMutation({
        mutationFn: (dto: {
          name: string
          phone: string
          courseId?: string
          notes?: string
        }) => apiClient.post('/leads', dto).then((r) => r.data.data),
      }),
    convert: (leadId: string) =>
      useMutation({
        mutationFn: (dto: { groupId: string }) =>
          apiClient
            .post(`/leads/${leadId}/convert`, dto)
            .then((r) => r.data.data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['leads'] })
          queryClient.invalidateQueries({ queryKey: ['students'] })
          queryClient.invalidateQueries({ queryKey: ['groups'] })
        },
      }),
  }
}
