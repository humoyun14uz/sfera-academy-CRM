import type { Language, TranslationKey } from '@/context/language-provider'

export type StatusDomain = 'application' | 'payment' | 'attendance' | 'task'

const STATUS_KEYS: Record<StatusDomain, Record<string, TranslationKey>> = {
  application: {
    NEW: 'newApplications',
    CONTACTED: 'contacted',
    'TRIAL LESSON': 'trialLessons',
    APPROVED: 'admitted',
    ENROLLED: 'admitted',
  },
  payment: {
    PAID: 'paid',
    'PARTIALLY PAID': 'partiallyPaid',
    UNPAID: 'unpaid',
    OVERDUE: 'overdue',
    REFUNDED: 'refunded',
    PENDING: 'pending',
  },
  attendance: {
    PRESENT: 'present',
    ABSENT: 'absent',
    LATE: 'late',
    EXCUSED: 'excused',
  },
  task: {
    BACKLOG: 'backlog',
    TODO: 'todo',
    'IN PROGRESS': 'inProgress',
    DONE: 'done',
    CANCELED: 'canceled',
  },
}

export function statusKey(domain: StatusDomain, status: string): TranslationKey | undefined {
  return STATUS_KEYS[domain][status.toUpperCase()]
}

export function formatCurrency(value: number, language: Language) {
  return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'uz-UZ', {
    maximumFractionDigits: 0,
  }).format(value) + (language === 'en' ? ' UZS' : ' so‘m')
}

export function formatDate(value: string | Date, language: Language) {
  return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'uz-UZ', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}
