import { z } from 'zod'

// ==========================================
// 1. ROLES & PERMISSIONS
// ==========================================

export const SYSTEM_ROLES = [
  'Super Admin',
  'Admin',
  'Manager',
  'Teacher',
  'Finance',
  'Student',
] as const

export type SystemRole = (typeof SYSTEM_ROLES)[number]

export const ALL_PERMISSIONS = [
  // Dashboard & UI
  'dashboard.read',
  'tasks.read',
  'messages.read',
  'reports.read',

  // Academies & Settings
  'academies.read',
  'academies.create',
  'academies.update',
  'academies.delete',
  'settings.read',
  'settings.manage',
  'settings.manage_academy',
  'settings.manage_courses',
  'settings.manage_groups',
  'settings.manage_notifications',
  'settings.manage_crm',

  // Users & Roles
  'users.read',
  'users.create',
  'users.update',
  'users.delete',
  'users.assign_role',

  // Courses
  'courses.read',
  'courses.create',
  'courses.update',
  'courses.delete',
  'courses.manage_price',
  'courses.manage_duration',
  'courses.deactivate',

  // Teachers
  'teachers.read',
  'teachers.create',
  'teachers.update',
  'teachers.assign_group',
  'teachers.deactivate',

  // Groups
  'groups.read',
  'groups.create',
  'groups.update',
  'groups.delete',
  'groups.assign_teacher',
  'groups.manage_students',
  'groups.manage_schedule',

  // Students
  'students.read',
  'students.create',
  'students.update',
  'students.delete',
  'students.assign_group',
  'students.change_course',
  'students.change_status',
  'students.deactivate',

  // Enrollments
  'enrollments.read',
  'enrollments.create',
  'enrollments.update',
  'enrollments.delete',

  // Lessons & Attendance
  'lessons.read',
  'lessons.create',
  'lessons.update',
  'attendance.read',
  'attendance.mark',

  // Assignments & Grades
  'assignments.read',
  'assignments.create',
  'assignments.submit',
  'grades.read',
  'grades.create',
  'grades.update',

  // Leads
  'leads.read',
  'leads.create',
  'leads.update',
  'leads.change_status',
  'leads.assign_manager',
  'leads.manage_trial',
  'leads.convert',

  // Finance
  'finance.invoices.read',
  'finance.invoices.create',
  'finance.payments.read',
  'finance.payments.create',
  'finance.payments.verify',
  'finance.payments.view_debt',
  'finance.payments.view_reports',
  'finance.refunds.create',
  'finance.reports.read',
  'finance.workspace',

  // Teacher workspace
  'teacher.workspace',

  // Audit Logs
  'audit_logs.read',
] as const

export type SystemPermission = (typeof ALL_PERMISSIONS)[number]

export const DEFAULT_ROLE_PERMISSIONS: Record<SystemRole, readonly SystemPermission[]> = {
  'Super Admin': ALL_PERMISSIONS,
  Admin: [
    'dashboard.read',
    'tasks.read',
    'messages.read',
    'reports.read',
    'academies.read',
    'academies.update',
    'settings.read',
    'settings.manage',
    'settings.manage_academy',
    'settings.manage_courses',
    'settings.manage_groups',
    'settings.manage_notifications',
    'settings.manage_crm',
    'users.read',
    'users.create',
    'users.update',
    'users.assign_role',
    'courses.read',
    'courses.create',
    'courses.update',
    'courses.delete',
    'courses.manage_price',
    'courses.manage_duration',
    'groups.read',
    'groups.create',
    'groups.update',
    'groups.delete',
    'groups.assign_teacher',
    'groups.manage_students',
    'groups.manage_schedule',
    'students.read',
    'students.create',
    'students.update',
    'students.delete',
    'students.assign_group',
    'students.change_course',
    'students.change_status',
    'enrollments.read',
    'enrollments.create',
    'enrollments.update',
    'enrollments.delete',
    'lessons.read',
    'lessons.create',
    'lessons.update',
    'attendance.read',
    'attendance.mark',
    'grades.read',
    'grades.create',
    'grades.update',
    'leads.read',
    'leads.create',
    'leads.update',
    'leads.change_status',
    'leads.assign_manager',
    'leads.manage_trial',
    'leads.convert',
    'teachers.read',
    'teachers.create',
    'teachers.update',
    'teachers.assign_group',
    'teachers.deactivate',
    'finance.invoices.read',
    'finance.invoices.create',
    'finance.payments.read',
    'finance.payments.create',
    'finance.payments.verify',
    'finance.payments.view_debt',
    'finance.payments.view_reports',
    'finance.refunds.create',
    'finance.reports.read',
    'finance.workspace',
    'audit_logs.read',
  ],
  Manager: [
    'dashboard.read',
    'tasks.read',
    'messages.read',
    'reports.read',
    'students.read',
    'students.create',
    'students.update',
    'students.assign_group',
    'students.change_course',
    'students.change_status',
    'leads.read',
    'leads.create',
    'leads.update',
    'leads.change_status',
    'leads.assign_manager',
    'leads.manage_trial',
    'leads.convert',
    'groups.read',
    'groups.create',
    'groups.update',
    'groups.assign_teacher',
    'groups.manage_students',
    'groups.manage_schedule',
    'courses.read',
    'courses.manage_price',
    'courses.manage_duration',
    'teachers.read',
    'finance.invoices.read',
    'finance.reports.read',
  ],
  Teacher: [
    'dashboard.read',
    'tasks.read',
    'teacher.workspace',
    'students.read',
    'groups.read',
    'groups.manage_students',
    'groups.manage_schedule',
    'courses.read',
    'teachers.read',
    'lessons.read',
    'lessons.create',
    'lessons.update',
    'attendance.read',
    'attendance.mark',
    'assignments.read',
    'assignments.create',
    'grades.read',
    'grades.create',
    'grades.update',
  ],
  Finance: [
    'dashboard.read',
    'tasks.read',
    'messages.read',
    'students.read',
    'courses.read',
    'groups.read',
    'finance.invoices.read',
    'finance.invoices.create',
    'finance.payments.read',
    'finance.payments.create',
    'finance.payments.verify',
    'finance.payments.view_debt',
    'finance.payments.view_reports',
    'finance.refunds.create',
    'finance.reports.read',
    'finance.workspace',
  ],
  Student: [
    'dashboard.read',
    'students.read',
    'courses.read',
    'groups.read',
    'lessons.read',
    'attendance.read',
    'assignments.read',
    'assignments.submit',
    'grades.read',
    'settings.read',
  ],
}

// ==========================================
// 2. COMMON API RESPONSE & ERROR CONTRACTS
// ==========================================

export interface ApiPaginationMeta {
  page: number
  pageSize: number
  total: number
}

export interface ApiResponseSuccess<T> {
  data: T
  meta?: ApiPaginationMeta
}

export interface ApiErrorDetail {
  code:
    | 'BAD_REQUEST'
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'NOT_FOUND'
    | 'CONFLICT'
    | 'VALIDATION_ERROR'
    | 'TOO_MANY_REQUESTS'
    | 'INTERNAL_SERVER_ERROR'
  message: string
  details?: Record<string, string[]>
}

export interface ApiResponseError {
  error: ApiErrorDetail
}

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  sortBy: z.string().trim().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type PaginationQuery = z.infer<typeof paginationQuerySchema>

// ==========================================
// 3. ENTITY ZOD SCHEMAS
// ==========================================

// --- Academies ---
export const createAcademySchema = z.object({
  name: z.string().trim().min(2, 'Academy name is required'),
  slug: z.string().trim().min(2).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  phone: z.string().trim().optional(),
  email: z.string().trim().email().optional(),
  address: z.string().trim().optional(),
})
export type CreateAcademyDto = z.infer<typeof createAcademySchema>

// --- Courses ---
export const createCourseSchema = z.object({
  name: z.string().trim().min(2, 'Course name is required'),
  code: z.string().trim().min(1, 'Course code is required'),
  category: z.string().trim().min(1, 'Category is required'),
  description: z.string().trim().optional(),
  durationMonths: z.coerce.number().int().min(1),
  price: z.coerce.number().min(0, 'Price must be 0 or greater'),
})
export type CreateCourseDto = z.infer<typeof createCourseSchema>

// --- Groups ---
export const createGroupSchema = z.object({
  courseId: z.string().uuid('Valid course ID is required'),
  name: z.string().trim().min(1, 'Group name is required'),
  room: z.string().trim().optional(),
  capacity: z.coerce.number().int().min(1).default(20),
  scheduleDays: z.array(z.string()).default([]),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format must be HH:mm').optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format must be HH:mm').optional(),
})
export type CreateGroupDto = z.infer<typeof createGroupSchema>

export const assignTeacherSchema = z.object({
  teacherId: z.string().uuid('Valid teacher user ID is required'),
  isPrimary: z.boolean().default(true),
})
export type AssignTeacherDto = z.infer<typeof assignTeacherSchema>

// --- Students ---
export const createStudentSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  phone: z.string().trim().min(9, 'Valid phone number is required'),
  email: z.string().trim().email().optional().or(z.literal('')),
  parentName: z.string().trim().optional(),
  parentPhone: z.string().trim().optional(),
})
export type CreateStudentDto = z.infer<typeof createStudentSchema>

// --- Enrollments ---
export const createEnrollmentSchema = z.object({
  studentId: z.string().uuid('Valid student ID is required'),
  groupId: z.string().uuid('Valid group ID is required'),
})
export type CreateEnrollmentDto = z.infer<typeof createEnrollmentSchema>

// --- Leads ---
export const createLeadSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  phone: z.string().trim().min(9, 'Phone is required'),
  courseId: z.string().uuid().optional(),
  notes: z.string().trim().optional(),
})
export type CreateLeadDto = z.infer<typeof createLeadSchema>

export const convertLeadSchema = z.object({
  groupId: z.string().uuid('Group ID is required to enroll converted student'),
})
export type ConvertLeadDto = z.infer<typeof convertLeadSchema>

// --- Attendance ---
export const attendanceStatusEnum = z.enum(['present', 'absent', 'late', 'excused'])
export type AttendanceStatus = z.infer<typeof attendanceStatusEnum>

export const recordAttendanceItemSchema = z.object({
  studentId: z.string().uuid(),
  status: attendanceStatusEnum,
})

export const markAttendanceSessionSchema = z.object({
  groupId: z.string().uuid(),
  lessonId: z.string().uuid().optional(),
  sessionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD'),
  records: z.array(recordAttendanceItemSchema).min(1, 'At least one attendance record is required'),
})
export type MarkAttendanceSessionDto = z.infer<typeof markAttendanceSessionSchema>

// --- Grades ---
export const createGradeSchema = z.object({
  studentId: z.string().uuid(),
  groupId: z.string().uuid(),
  assignmentId: z.string().uuid().optional(),
  score: z.coerce.number().min(0).max(100),
  feedback: z.string().trim().optional(),
})
export type CreateGradeDto = z.infer<typeof createGradeSchema>

export const updateGradeSchema = z.object({
  score: z.coerce.number().min(0).max(100),
  reason: z.string().trim().min(3, 'Reason for grade update is mandatory'),
})
export type UpdateGradeDto = z.infer<typeof updateGradeSchema>

// --- Finance ---
export const paymentMethodEnum = z.enum(['cash', 'card', 'click', 'payme', 'other'])
export type PaymentMethod = z.infer<typeof paymentMethodEnum>

// Only UZS is supported by the ledger today. Anything else is rejected instead
// of being silently stored as a different currency's number.
export const currencyEnum = z.literal('UZS')
export type Currency = z.infer<typeof currencyEnum>

export const invoiceItemSchema = z.object({
  description: z.string().trim().min(1, 'Item description is required').max(255),
  quantity: z.coerce.number().int().positive().default(1),
  unitPrice: z.coerce.number().nonnegative('Unit price cannot be negative'),
})

export const createInvoiceSchema = z.object({
  studentId: z.string().uuid(),
  enrollmentId: z.string().uuid().optional(),
  amount: z.coerce.number().positive('Invoice amount must be greater than 0'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be YYYY-MM-DD'),
  description: z.string().trim().optional(),
  currency: currencyEnum.default('UZS'),
  items: z.array(invoiceItemSchema).max(50).optional(),
})
export type CreateInvoiceDto = z.infer<typeof createInvoiceSchema>

export const recordPaymentSchema = z.object({
  invoiceId: z.string().uuid(),
  studentId: z.string().uuid(),
  amount: z.coerce.number().positive('Payment amount must be greater than 0'),
  paymentMethod: paymentMethodEnum,
  referenceNumber: z.string().trim().max(100).optional(),
  // Supplied by the client (or generated once per submit attempt). Replaying the
  // same key returns the original payment instead of recording a second one.
  idempotencyKey: z.string().trim().min(8).max(120).optional(),
  description: z.string().trim().optional(),
})
export type RecordPaymentDto = z.infer<typeof recordPaymentSchema>

export const refundPaymentSchema = z.object({
  paymentId: z.string().uuid(),
  amount: z.coerce.number().positive(),
  reason: z.string().trim().min(5, 'Reason for refund is required'),
})
export type RefundPaymentDto = z.infer<typeof refundPaymentSchema>

