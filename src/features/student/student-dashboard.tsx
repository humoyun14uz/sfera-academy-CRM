import { create } from 'zustand'

export type ApplicationStatus = 'NEW' | 'CONTACTED' | 'TRIAL LESSON' | 'APPROVED' | 'GROUP ASSIGNED' | 'ENROLLED' | 'STUDENT'
export type AttendanceStatus = 'present' | 'absent' | 'late'
export type PaymentMethod = 'cash' | 'card' | 'click' | 'payme' | 'other'

export type CrmStudent = {
  id: string
  name: string
  phone: string
  email: string
  course: string
  groupId: string
  teacher: string
  status: 'active' | 'paused' | 'graduated'
  progress: number
  attendance: number
  averageGrade: number
  totalPaid: number
  debt: number
}
export type CrmGroup = { id: string; name: string; course: string; teacher: string; room: string; capacity: number; studentIds: string[]; schedule: string; attendance: number }
export type CrmApplication = { id: string; name: string; phone: string; course: string; status: ApplicationStatus; createdAt: string; followUpAt?: string; studentId?: string }
export type CrmPayment = { id: string; studentId: string; amount: number; method: PaymentMethod; date: string; description: string }
export type CrmActivity = { id: string; user: string; role: string; action: string; entity: string; createdAt: string }
export type CrmNotification = { id: string; title: string; category: string; read: boolean; createdAt: string; target?: string }

const seed = {
  students: [
    { id: 'stu-001', name: 'Azizbek Karimov', phone: '+998 90 123 45 67', email: 'azizbek@example.com', course: 'Frontend Development', groupId: 'grp-fr02', teacher: 'Temurbek', status: 'active' as const, progress: 72, attendance: 89, averageGrade: 86, totalPaid: 2350000, debt: 350000 },
    { id: 'stu-002', name: 'Madina Aliyeva', phone: '+998 91 222 33 44', email: 'madina@example.com', course: 'Python Backend', groupId: 'grp-py01', teacher: 'Golib Abduhalil', status: 'active' as const, progress: 81, attendance: 94, averageGrade: 92, totalPaid: 1900000, debt: 120000 },
    { id: 'stu-003', name: 'Javohir Rasulov', phone: '+998 93 333 44 55', email: 'javohir@example.com', course: 'Frontend Development', groupId: 'grp-fr02', teacher: 'Temurbek', status: 'active' as const, progress: 77, attendance: 90, averageGrade: 88, totalPaid: 2100000, debt: 250000 },
    { id: 'stu-004', name: 'Shahnoza Ergasheva', phone: '+998 95 444 55 66', email: 'shahnoza@example.com', course: 'Frontend Development', groupId: 'grp-fr02', teacher: 'Temurbek', status: 'active' as const, progress: 70, attendance: 87, averageGrade: 85, totalPaid: 1800000, debt: 420000 },
  ],
  groups: [
    { id: 'grp-fr02', name: 'FR-02', course: 'Frontend Development', teacher: 'Temurbek', room: '204', capacity: 20, studentIds: ['stu-001', 'stu-003', 'stu-004'], schedule: 'Du-Chor-Ju · 18:00', attendance: 89 },
    { id: 'grp-py01', name: 'PY-01', course: 'Python Backend', teacher: 'Golib Abduhalil', room: '201', capacity: 18, studentIds: ['stu-002'], schedule: 'Se-Pay-Sha · 19:00', attendance: 91 },
  ],
  applications: [
    { id: 'app-001', name: 'Dilshod Rahimov', phone: '+998 97 555 66 77', course: 'Frontend Development', status: 'CONTACTED' as ApplicationStatus, createdAt: '2026-09-12', followUpAt: '2026-09-16' },
    { id: 'app-002', name: 'Nodira Islomova', phone: '+998 99 666 77 88', course: 'Data Analytics', status: 'NEW' as ApplicationStatus, createdAt: '2026-09-14', followUpAt: '2026-09-15' },
    { id: 'app-003', name: 'Sardor Qodirov', phone: '+998 90 777 88 99', course: 'Python Backend', status: 'TRIAL LESSON' as ApplicationStatus, createdAt: '2026-09-10' },
  ],
  payments: [
    { id: 'pay-001', studentId: 'stu-001', amount: 850000, method: 'click' as PaymentMethod, date: '2026-09-14', description: 'September tuition' },
    { id: 'pay-002', studentId: 'stu-002', amount: 650000, method: 'card' as PaymentMethod, date: '2026-09-13', description: 'September tuition' },
    { id: 'pay-003', studentId: 'stu-004', amount: 500000, method: 'cash' as PaymentMethod, date: '2026-09-11', description: 'Partial payment' },
  ],
  activities: [
    { id: 'act-001', user: 'Temurbek', role: 'Teacher', action: 'Attendance saved', entity: 'FR-02 · 14 Sep lesson', createdAt: '2026-09-14T18:45:00' },
    { id: 'act-002', user: 'Finance', role: 'Finance', action: 'Payment recorded', entity: 'Azizbek Karimov · 850,000 UZS', createdAt: '2026-09-14T12:20:00' },
    { id: 'act-003', user: 'Manager', role: 'Manager', action: 'Application moved to CONTACTED', entity: 'Dilshod Rahimov', createdAt: '2026-09-13T16:10:00' },
  ],
  notifications: [
    { id: 'not-001', title: '3 students need follow-up', category: 'applications', read: false, createdAt: '2026-09-14T09:00:00', target: '/academy/leads' },
    { id: 'not-002', title: 'FR-02 is near capacity', category: 'groups', read: false, createdAt: '2026-09-13T13:00:00', target: '/academy/groups' },
  ],
}

type CrmState = typeof seed & {
  recordPayment: (payment: Omit<CrmPayment, 'id'>) => void
  setApplicationStatus: (id: string, status: ApplicationStatus) => void
  markNotificationRead: (id: string) => void
}

const STORAGE_KEY = 'sfera-crm-state-v1'

const initial = (): typeof seed => {
  if (typeof window === 'undefined') return seed

  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') as Partial<typeof seed> | null
    if (!raw || typeof raw !== 'object') return seed

    return {
      ...seed,
      ...raw,
      students: Array.isArray(raw.students) ? raw.students : seed.students,
      groups: Array.isArray(raw.groups) ? raw.groups : seed.groups,
      applications: Array.isArray(raw.applications) ? raw.applications : seed.applications,
      payments: Array.isArray(raw.payments) ? raw.payments : seed.payments,
      activities: Array.isArray(raw.activities) ? raw.activities : seed.activities,
      notifications: Array.isArray(raw.notifications) ? raw.notifications : seed.notifications,
    } as typeof seed
  } catch {
    return seed
  }
}

const persist = (state: typeof seed) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }
}

export const useCrmStore = create<CrmState>((set) => ({
  ...initial(),
  recordPayment: (payment) =>
    set((state) => {
      const next = {
        ...state,
        payments: [...state.payments, { ...payment, id: `pay-${Date.now()}` }],
      }
      persist(next)
      return next
    }),
  setApplicationStatus: (id, status) =>
    set((state) => {
      const next = {
        ...state,
        applications: state.applications.map((application) => (application.id === id ? { ...application, status } : application)),
      }
      persist(next)
      return next
    }),
  markNotificationRead: (id) =>
    set((state) => {
      const next = {
        ...state,
        notifications: state.notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
      }
      persist(next)
      return next
    }),
}))

export const formatUzs = (value: number) => `${new Intl.NumberFormat('uz-UZ').format(value)} so‘m`
export const getStudentName = (students: CrmStudent[], id: string) => students.find((student) => student.id === id)?.name ?? 'Unknown student'

export const getStudentSummary = (students: CrmStudent[]) => {
  const averageGrade = students.length
    ? Math.round(students.reduce((sum, student) => sum + student.averageGrade, 0) / students.length)
    : 0
  const averageAttendance = students.length
    ? Math.round(students.reduce((sum, student) => sum + student.attendance, 0) / students.length)
    : 0
  const totalPaid = students.reduce((sum, student) => sum + student.totalPaid, 0)

  return { averageGrade, averageAttendance, totalPaid }
}
