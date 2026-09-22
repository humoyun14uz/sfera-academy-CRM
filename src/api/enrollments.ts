import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export function useEnrollments() {
  const queryClient = useQueryClient()
  return {
    create: () =>
      useMutation({
        mutationFn: (dto: { studentId: string; groupId: string }) =>
          apiClient.post('/enrollments', dto).then((r) => r.data.data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['enrollments'] })
        },
      }),
  }
}
