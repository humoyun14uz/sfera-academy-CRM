import { useQuery, useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export function useAttendance() {
  return {
    mark: () =>
      useMutation({
        mutationFn: (dto: {
          groupId: string
          lessonId?: string
          sessionDate: string
          records: Array<{ studentId: string; status: 'present' | 'absent' | 'late' | 'excused' }>
        }) =>
          apiClient.post('/attendance/sessions', dto).then((r) => r.data.data),
      }),
    getGroupAttendance: (groupId: string) =>
      useQuery({
        queryKey: ['attendance', groupId],
        queryFn: () =>
          apiClient
            .get(`/attendance/groups/${groupId}`)
            .then((r) => r.data.data),
      }),
  }
}
