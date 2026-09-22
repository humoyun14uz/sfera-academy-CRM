import { useQuery, useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export function useFinance() {
  return {
    listInvoices: (studentId?: string) =>
      useQuery({
        queryKey: ['finance', 'invoices', studentId ?? 'all'],
        queryFn: () =>
          apiClient
            .get('/finance/invoices', {
              params: studentId ? { studentId } : undefined,
            })
            .then((r) => r.data.data),
      }),
    createInvoice: () =>
      useMutation({
        mutationFn: (dto: {
          studentId: string
          enrollmentId?: string
          amount: number
          dueDate: string
          description?: string
          currency?: string
          items?: Array<{ description: string; quantity: number; unitPrice: number }>
        }) => apiClient.post('/finance/invoices', dto).then((r) => r.data.data),
      }),
    recordPayment: () =>
      useMutation({
        mutationFn: (dto: {
          invoiceId: string
          studentId: string
          amount: number
          paymentMethod: 'cash' | 'card' | 'click' | 'payme' | 'other'
          referenceNumber?: string
          idempotencyKey?: string
          description?: string
        }) => apiClient.post('/finance/payments', dto).then((r) => r.data.data),
      }),
    refundPayment: () =>
      useMutation({
        mutationFn: (dto: {
          paymentId: string
          amount: number
          reason: string
        }) => apiClient.post('/finance/refunds', dto).then((r) => r.data.data),
      }),
    getSummary: (startDate?: string, endDate?: string) =>
      useQuery({
        queryKey: ['finance', 'summary', startDate ?? '', endDate ?? ''],
        queryFn: () =>
          apiClient
            .get('/finance/summary', {
              params: {
                ...(startDate && { startDate }),
                ...(endDate && { endDate }),
              },
            })
            .then((r) => r.data.data),
      }),
    listPayments: () =>
      useQuery({
        queryKey: ['finance', 'payments'],
        queryFn: () =>
          apiClient.get('/finance/payments').then((r) => r.data.data),
      }),
  }
}
