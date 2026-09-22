import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export function useGroups() {
  const queryClient = useQueryClient()
  return {
    list: (teacherId?: string) =>
      useQuery({
        queryKey: ['groups', teacherId ?? 'all'],
        queryFn: () =>
          apiClient
            .get('/groups', { params: teacherId ? { teacherId } : undefined })
            .then((r) => r.data.data),
      }),
    get: (id: string) =>
      useQuery({
        queryKey: ['groups', id],
        queryFn: () => apiClient.get(`/groups/${id}`).then((r) => r.data.data),
      }),
    create: () =>
      useMutation({
        mutationFn: (dto: {
          courseId: string
          name: string
          room?: string
          capacity?: number
          scheduleDays?: string[]
          startTime?: string
          endTime?: string
        }) => apiClient.post('/groups', dto).then((r) => r.data.data),
      }),
    assignTeacher: (groupId: string) =>
      useMutation({
        mutationFn: (dto: { teacherId: string; isPrimary?: boolean }) =>
          apiClient
            .post(`/groups/${groupId}/teachers`, dto)
            .then((r) => r.data.data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['groups'] })
        },
      }),
    getStudents: (groupId: string) =>
      useQuery({
        queryKey: ['groups', groupId, 'students'],
        queryFn: () =>
          apiClient
            .get(`/groups/${groupId}/students`)
            .then((r) => r.data.data),
      }),
  }
}
