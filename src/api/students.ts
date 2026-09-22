import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export function useStudents() {
  const queryClient = useQueryClient()
  return {
    list: () =>
      useQuery({
        queryKey: ['students'],
        queryFn: () => apiClient.get('/students').then((r) => r.data.data),
      }),
    get: (id: string) =>
      useQuery({
        queryKey: ['students', id],
        queryFn: () => apiClient.get(`/students/${id}`).then((r) => r.data.data),
      }),
    create: () =>
      useMutation({
        mutationFn: (dto: {
          firstName: string
          lastName: string
          phone: string
          email?: string
          parentName?: string
          parentPhone?: string
        }) => apiClient.post('/students', dto).then((r) => r.data.data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['students'] })
        },
      }),
  }
}
