import { useQuery, useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export function useCourses() {
  return {
    list: () =>
      useQuery({
        queryKey: ['courses'],
        queryFn: () => apiClient.get('/courses').then((r) => r.data.data),
      }),
    get: (id: string) =>
      useQuery({
        queryKey: ['courses', id],
        queryFn: () => apiClient.get(`/courses/${id}`).then((r) => r.data.data),
      }),
    create: () =>
      useMutation({
        mutationFn: (dto: {
          name: string
          code: string
          category: string
          description?: string
          durationMonths: number
          price: number
        }) => apiClient.post('/courses', dto).then((r) => r.data.data),
      }),
  }
}
