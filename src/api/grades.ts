import { useQuery, useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export function useGrades() {
  return {
    create: () =>
      useMutation({
        mutationFn: (dto: {
          studentId: string
          groupId: string
          assignmentId?: string
          score: number
          feedback?: string
        }) => apiClient.post('/grades', dto).then((r) => r.data.data),
      }),
    update: (gradeId: string) =>
      useMutation({
        mutationFn: (dto: {
          score: number
          reason: string
        }) => apiClient.patch(`/grades/${gradeId}`, dto).then((r) => r.data.data),
      }),
    getStudentGrades: (studentId: string) =>
      useQuery({
        queryKey: ['grades', studentId],
        queryFn: () =>
          apiClient
            .get(`/grades/students/${studentId}`)
            .then((r) => r.data.data),
      }),
    getGradeHistory: (gradeId: string) =>
      useQuery({
        queryKey: ['grades', gradeId, 'history'],
        queryFn: () =>
          apiClient
            .get(`/grades/${gradeId}/history`)
            .then((r) => r.data.data),
      }),
  }
}
