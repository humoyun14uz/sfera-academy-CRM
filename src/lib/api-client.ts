import axios from 'axios'
import { useAuthStore } from '@/stores/auth-store'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/',
  timeout: 12_000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().auth.accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export async function getApiData<T>(path: string, params?: Record<string, string>) {
  const response = await apiClient.get<T | { data: T }>(path, { params })
  const payload = response.data
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data
  }
  return payload as T
}

export const isBackendEnabled = () => import.meta.env.VITE_API_ENABLED === 'true'

export type ManagerDashboardApi = {
  totalStudents: number
  totalGroups: number
  totalTeachers: number
  pendingApplications: number
  monthlyRevenue: number
  pendingDebts: number
  averageAttendance: number
}

export type TeacherDashboardApi = {
  totalGroups: number
  totalStudents: number
  averageGrade: number
  assignmentCompletionRate: number
  attendanceRate: number
}

export type FinanceSummaryApi = {
  currency: string
  invoicesIssued: number
  collectedRevenue: number
  outstandingBalance: number
  overdueBalance: number
  totalRefunded: number
  netRevenue: number
  collectionRate: number
  counts: {
    invoices: number
    pendingInvoices: number
    partiallyPaidInvoices: number
    overdueInvoices: number
    payments: number
    refunds: number
  }
}

export const formatApiCurrency = (value: number, locale = 'uz-UZ') =>
  `${new Intl.NumberFormat(locale).format(value)} UZS`

export const apiErrorMessage = (error: unknown) =>
  axios.isAxiosError(error)
    ? error.response?.status === 401
      ? 'Tizimga qayta kiring. API uchun token qabul qilinmadi.'
      : error.response?.status === 403
        ? 'Bu rol uchun API ruxsati yo‘q.'
        : error.response?.status
          ? `API xatosi: ${error.response.status}`
          : 'API serveriga ulanib bo‘lmadi.'
    : 'API serveriga ulanib bo‘lmadi.'
