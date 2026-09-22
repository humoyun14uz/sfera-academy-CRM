import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export function useAcademies() {
  return {
    list: () =>
      useQuery({
        queryKey: ['academies'],
        queryFn: () => apiClient.get('/academies').then((r) => r.data.data),
      }),
    create: () =>
      useMutation({
        mutationFn: (dto: { name: string; slug: string; phone?: string; email?: string; address?: string }) =>
          apiClient.post('/academies', dto).then((r) => r.data.data),
      }),
  }
}

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
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['groups'] })
        },
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
