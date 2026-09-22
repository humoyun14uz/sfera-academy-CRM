import { useQuery, useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export function useAuth() {
  return {
    getMe: () =>
      useQuery({
        queryKey: ['auth', 'me'],
        queryFn: () => apiClient.get('/auth/me').then((r) => r.data.data),
        retry: false,
      }),
    syncClerk: () =>
      useMutation({
        mutationFn: (data: {
          clerkId: string
          email: string
          firstName: string
          lastName: string
          phone?: string
          avatarUrl?: string
          defaultAcademySlug?: string
        }) =>
          apiClient.post('/auth/sync-clerk', data).then((r) => r.data.data),
      }),
  }
}
