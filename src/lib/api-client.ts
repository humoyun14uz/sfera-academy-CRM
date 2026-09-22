import axios from 'axios'
import { useAuthStore } from '@/stores/auth-store'
import { toast } from 'sonner'

export const apiClient = axios.create({
  baseURL: '/api/v1',
  timeout: 15000,
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().auth.accessToken
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        useAuthStore.getState().auth.reset()
        toast.error('Session expired!')
      }
      if (error.response?.status === 500) {
        toast.error('Internal Server Error!')
      }
      if (error.response?.status === 403) {
        toast.error('Access forbidden')
      }
    }
    return Promise.reject(error)
  },
)
