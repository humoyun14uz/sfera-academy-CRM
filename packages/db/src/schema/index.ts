import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  numeric,
  timestamp,
  date,
  jsonb,
  uniqueIndex,
  index,
  primaryKey,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ==========================================
// 1. ACADEMIES (MULTI-TENANCY)
// ==========================================

export const academies = pgTable(
  'academies',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    phone: varchar('phone', { length: 50 }),
    email: varchar('email', { length: 255 }),
    address: text('address'),
    settings: jsonb('settings').default({}),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('academies_slug_idx').on(table.slug),
    index('academies_active_idx').on(table.isActive),
  ]
)

// ==========================================
// 2. USERS & ROLES & PERMISSIONS
// ==========================================

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    clerkId: varchar('clerk_id', { length: 255 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }).notNull(),
    phone: varchar('phone', { length: 50 }),
    avatarUrl: text('avatar_url'),
    status: varchar('status', { length: 30 }).default('active').notNull(), // 'active' | 'suspended' | 'inactive'
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('users_email_idx').on(table.email),
    index('users_clerk_id_idx').on(table.clerkId),
  ]
)

export const roles = pgTable('roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(), // 'Super Admin', 'Admin', 'Manager', 'Teacher', 'Finance', 'Student'
  description: text('description'),
  isSystem: boolean('is_system').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const permissions = pgTable('permissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('code', { length: 100 }).notNull().unique(), // e.g. 'students.create'
  module: varchar('module', { length: 50 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const rolePermissions = pgTable(
  'role_permissions',
  {
    roleId: uuid('role_id')
      .references(() => roles.id, { onDelete: 'cascade' })
      .notNull(),
    permissionId: uuid('permission_id')
      .references(() => permissions.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.roleId, table.permissionId] }),
  ]
)

export const academyMemberships = pgTable(
  'academy_memberships',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    academyId: uuid('academy_id')
      .references(() => academies.id, { onDelete: 'cascade' })
      .notNull(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    roleId: uuid('role_id')
      .references(() => roles.id, { onDelete: 'restrict' })
      .notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('academy_user_unique').on(table.academyId, table.userId),
    index('memberships_user_idx').on(table.userId),
    index('memberships_academy_idx').on(table.academyId),
  ]
)

// ==========================================
// 3. COURSES & GROUPS
// ==========================================

export const courses = pgTable(
  'courses',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    academyId: uuid('academy_id')
      .references(() => academies.id, { onDelete: 'cascade' })
      .notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    code: varchar('code', { length: 50 }).notNull(),
    category: varchar('category', { length: 100 }).notNull(),
    description: text('description'),
    durationMonths: integer('duration_months').default(3).notNull(),
    price: integer('price').default(0).notNull(), // UZS or base currency integer
    status: varchar('status', { length: 30 }).default('active').notNull(), // 'active' | 'archived'
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('courses_academy_idx').on(table.academyId),
    index('courses_status_idx').on(table.status),
  ]
)

export const groups = pgTable(
  'groups',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    academyId: uuid('academy_id')
      .references(() => academies.id, { onDelete: 'cascade' })
      .notNull(),
    courseId: uuid('course_id')
      .references(() => courses.id, { onDelete: 'restrict' })
      .notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    room: varchar('room', { length: 100 }),
    capacity: integer('capacity').default(20).notNull(),
    scheduleDays: jsonb('schedule_days').$type<string[]>().default([]).notNull(),
    startTime: varchar('start_time', { length: 10 }), // 'HH:mm'
    endTime: varchar('end_time', { length: 10 }),
    status: varchar('status', { length: 30 }).default('active').notNull(), // 'active' | 'upcoming' | 'completed'
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('groups_academy_idx').on(table.academyId),
    index('groups_course_idx').on(table.courseId),
  ]
)

export const groupTeachers = pgTable(
  'group_teachers',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    groupId: uuid('group_id')
      .references(() => groups.id, { onDelete: 'cascade' })
      .notNull(),
    teacherId: uuid('teacher_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    isPrimary: boolean('is_primary').default(true).notNull(),
    assignedAt: timestamp('assigned_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('group_teacher_unique').on(table.groupId, table.teacherId),
    index('group_teachers_teacher_idx').on(table.teacherId),
  ]
)

// ==========================================
// 4. STUDENTS & ENROLLMENTS
// ==========================================

export const students = pgTable(
  'students',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    academyId: uuid('academy_id')
      .references(() => academies.id, { onDelete: 'cascade' })
      .notNull(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'set null' }),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }).notNull(),
    phone: varchar('phone', { length: 50 }).notNull(),
    email: varchar('email', { length: 255 }),
    parentName: varchar('parent_name', { length: 150 }),
    parentPhone: varchar('parent_phone', { length: 50 }),
    status: varchar('status', { length: 30 }).default('active').notNull(), // 'active' | 'paused' | 'graduated'
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('students_academy_idx').on(table.academyId),
    index('students_user_idx').on(table.userId),
    index('students_phone_idx').on(table.phone),
  ]
)

export const enrollments = pgTable(
  'enrollments',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    academyId: uuid('academy_id')
      .references(() => academies.id, { onDelete: 'cascade' })
      .notNull(),
    studentId: uuid('student_id')
      .references(() => students.id, { onDelete: 'cascade' })
      .notNull(),
    groupId: uuid('group_id')
      .references(() => groups.id, { onDelete: 'cascade' })
      .notNull(),
    status: varchar('status', { length: 30 }).default('active').notNull(), // 'active' | 'completed' | 'paused' | 'cancelled'
    enrolledAt: timestamp('enrolled_at', { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('student_group_enrollment_unique').on(table.studentId, table.groupId),
    index('enrollments_group_idx').on(table.groupId),
    index('enrollments_student_idx').on(table.studentId),
  ]
)

// ==========================================
// 5. LESSONS & ATTENDANCE
// ==========================================

export const lessons = pgTable(
  'lessons',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    groupId: uuid('group_id')
      .references(() => groups.id, { onDelete: 'cascade' })
      .notNull(),
    teacherId: uuid('teacher_id')
      .references(() => users.id, { onDelete: 'set null' }),
    title: varchar('title', { length: 255 }).notNull(),
    lessonDate: date('lesson_date').notNull(),
    startTime: varchar('start_time', { length: 10 }),
    endTime: varchar('end_time', { length: 10 }),
    room: varchar('room', { length: 100 }),
    status: varchar('status', { length: 30 }).default('scheduled').notNull(), // 'scheduled' | 'completed' | 'cancelled'
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('lessons_group_date_idx').on(table.groupId, table.lessonDate),
  ]
)

export const attendanceSessions = pgTable(
  'attendance_sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    academyId: uuid('academy_id')
      .references(() => academies.id, { onDelete: 'cascade' })
      .notNull(),
    groupId: uuid('group_id')
      .references(() => groups.id, { onDelete: 'cascade' })
      .notNull(),
    lessonId: uuid('lesson_id')
      .references(() => lessons.id, { onDelete: 'set null' }),
    teacherId: uuid('teacher_id')
      .references(() => users.id, { onDelete: 'set null' }),
    sessionDate: date('session_date').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('group_lesson_session_unique').on(table.groupId, table.sessionDate),
    index('attendance_sessions_group_idx').on(table.groupId),
  ]
)

export const attendanceRecords = pgTable(
  'attendance_records',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    sessionId: uuid('session_id')
      .references(() => attendanceSessions.id, { onDelete: 'cascade' })
      .notNull(),
    studentId: uuid('student_id')
      .references(() => students.id, { onDelete: 'cascade' })
      .notNull(),
    status: varchar('status', { length: 20 }).notNull(), // 'present' | 'absent' | 'late' | 'excused'
    markedBy: uuid('marked_by')
      .references(() => users.id, { onDelete: 'set null' }),
    markedAt: timestamp('marked_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('session_student_attendance_unique').on(table.sessionId, table.studentId),
    index('attendance_records_student_idx').on(table.studentId),
  ]
)

// ==========================================
// 6. ASSIGNMENTS, SUBMISSIONS, GRADES & HISTORY
// ==========================================

export const assignments = pgTable(
  'assignments',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    academyId: uuid('academy_id')
      .references(() => academies.id, { onDelete: 'cascade' })
      .notNull(),
    groupId: uuid('group_id')
      .references(() => groups.id, { onDelete: 'cascade' })
      .notNull(),
    teacherId: uuid('teacher_id')
      .references(() => users.id, { onDelete: 'set null' }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    dueDate: timestamp('due_date', { withTimezone: true }),
    maxScore: integer('max_score').default(100).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('assignments_group_idx').on(table.groupId),
  ]
)

export const submissions = pgTable(
  'submissions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    assignmentId: uuid('assignment_id')
      .references(() => assignments.id, { onDelete: 'cascade' })
      .notNull(),
    studentId: uuid('student_id')
      .references(() => students.id, { onDelete: 'cascade' })
      .notNull(),
    content: text('content'),
    attachmentUrl: text('attachment_url'),
    status: varchar('status', { length: 30 }).default('submitted').notNull(), // 'submitted' | 'graded' | 'late'
    submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('assignment_student_submission_unique').on(table.assignmentId, table.studentId),
  ]
)

export const grades = pgTable(
  'grades',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    academyId: uuid('academy_id')
      .references(() => academies.id, { onDelete: 'cascade' })
      .notNull(),
    assignmentId: uuid('assignment_id')
      .references(() => assignments.id, { onDelete: 'set null' }),
    studentId: uuid('student_id')
      .references(() => students.id, { onDelete: 'cascade' })
      .notNull(),
    groupId: uuid('group_id')
      .references(() => groups.id, { onDelete: 'cascade' })
      .notNull(),
    teacherId: uuid('teacher_id')
      .references(() => users.id, { onDelete: 'set null' }),
    score: numeric('score', { precision: 5, scale: 2 }).notNull(),
    feedback: text('feedback'),
    gradedAt: timestamp('graded_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('grades_student_idx').on(table.studentId),
    index('grades_group_idx').on(table.groupId),
  ]
)

export const gradeHistory = pgTable(
  'grade_history',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    gradeId: uuid('grade_id')
      .references(() => grades.id, { onDelete: 'cascade' })
      .notNull(),
    oldScore: numeric('old_score', { precision: 5, scale: 2 }),
    newScore: numeric('new_score', { precision: 5, scale: 2 }).notNull(),
    changedBy: uuid('changed_by')
      .references(() => users.id, { onDelete: 'set null' }),
    reason: text('reason').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('grade_history_grade_idx').on(table.gradeId),
  ]
)

// ==========================================
// 7. LEADS / APPLICATIONS
// ==========================================

export const leads = pgTable(
  'leads',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    academyId: uuid('academy_id')
      .references(() => academies.id, { onDelete: 'cascade' })
      .notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 50 }).notNull(),
    courseId: uuid('course_id')
      .references(() => courses.id, { onDelete: 'set null' }),
    status: varchar('status', { length: 30 }).default('NEW').notNull(), // 'NEW' | 'CONTACTED' | 'TRIAL LESSON' | 'APPROVED' | 'CONVERTED' | 'REJECTED'
    trialLessonAt: timestamp('trial_lesson_at', { withTimezone: true }),
    convertedStudentId: uuid('converted_student_id')
      .references(() => students.id, { onDelete: 'set null' }),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('leads_academy_idx').on(table.academyId),
    index('leads_status_idx').on(table.status),
  ]
)

// ==========================================
// 8. FINANCE: INVOICES, PAYMENTS, REFUNDS
// ==========================================

export const invoices = pgTable(
  'invoices',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    academyId: uuid('academy_id')
      .references(() => academies.id, { onDelete: 'cascade' })
      .notNull(),
    studentId: uuid('student_id')
      .references(() => students.id, { onDelete: 'cascade' })
      .notNull(),
    enrollmentId: uuid('enrollment_id')
      .references(() => enrollments.id, { onDelete: 'set null' }),
    // Unique per academy (see the composite unique index below), NOT globally:
    // two different academies must both be able to issue "INV-2026-000001".
    invoiceNumber: varchar('invoice_number', { length: 100 }).notNull(),
    amount: integer('amount').notNull(),
    paidAmount: integer('paid_amount').default(0).notNull(),
    debtAmount: integer('debt_amount').notNull(),
    status: varchar('status', { length: 30 }).default('pending').notNull(), // 'pending' | 'partially_paid' | 'paid' | 'overdue' | 'refunded' | 'cancelled'
    dueDate: date('due_date').notNull(),
    description: text('description'),
    createdBy: uuid('created_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('invoice_number_academy_unique').on(
      table.academyId,
      table.invoiceNumber
    ),
    index('invoices_student_idx').on(table.studentId),
    index('invoices_academy_idx').on(table.academyId),
    index('invoices_status_idx').on(table.status),
    index('invoices_due_date_idx').on(table.dueDate),
  ]
)

export const payments = pgTable(
  'payments',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    academyId: uuid('academy_id')
      .references(() => academies.id, { onDelete: 'cascade' })
      .notNull(),
    invoiceId: uuid('invoice_id')
      .references(() => invoices.id, { onDelete: 'cascade' })
      .notNull(),
    studentId: uuid('student_id')
      .references(() => students.id, { onDelete: 'cascade' })
      .notNull(),
    amount: integer('amount').notNull(),
    paymentMethod: varchar('payment_method', { length: 30 }).notNull(), // 'cash' | 'card' | 'click' | 'payme' | 'other'
    referenceNumber: varchar('reference_number', { length: 100 }),
    // Client-supplied Idempotency-Key. The composite unique index below makes a
    // retried or double-submitted payment a database-level no-op instead of a
    // duplicate row.
    idempotencyKey: varchar('idempotency_key', { length: 120 }),
    status: varchar('status', { length: 30 }).default('paid').notNull(), // 'pending' | 'paid' | 'partially_paid' | 'overdue' | 'refunded' | 'cancelled'
    source: varchar('source', { length: 50 }).default('manual').notNull(), // 'manual' | 'import' | 'gateway'
    verifiedBy: uuid('verified_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    verifiedAt: timestamp('verified_at', { withTimezone: true }),
    receivedBy: uuid('received_by')
      .references(() => users.id, { onDelete: 'set null' }),
    paidAt: timestamp('paid_at', { withTimezone: true }).defaultNow().notNull(),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('payment_idempotency_unique').on(
      table.academyId,
      table.idempotencyKey
    ),
    index('payments_invoice_idx').on(table.invoiceId),
    index('payments_student_idx').on(table.studentId),
    index('payments_academy_idx').on(table.academyId),
    index('payments_paid_at_idx').on(table.paidAt),
  ]
)

export const refunds = pgTable(
  'refunds',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    academyId: uuid('academy_id')
      .references(() => academies.id, { onDelete: 'cascade' })
      .notNull(),
    paymentId: uuid('payment_id')
      .references(() => payments.id, { onDelete: 'cascade' })
      .notNull(),
    amount: integer('amount').notNull(),
    reason: text('reason').notNull(),
    approvedBy: uuid('approved_by')
      .references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('refunds_payment_idx').on(table.paymentId),
    index('refunds_academy_idx').on(table.academyId),
  ]
)

// ==========================================
// 9. AUDIT LOGS
// ==========================================

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    academyId: uuid('academy_id')
      .references(() => academies.id, { onDelete: 'set null' }),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'set null' }),
    action: varchar('action', { length: 100 }).notNull(), // e.g. 'PAYMENT_RECORDED', 'GRADE_CHANGED', 'LEAD_CONVERTED'
    entityType: varchar('entity_type', { length: 50 }).notNull(), // e.g. 'payments', 'grades', 'users'
    entityId: varchar('entity_id', { length: 100 }).notNull(),
    ipAddress: varchar('ip_address', { length: 50 }),
    userAgent: text('user_agent'),
    payloadBefore: jsonb('payload_before'),
    payloadAfter: jsonb('payload_after'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('audit_logs_academy_idx').on(table.academyId),
    index('audit_logs_user_idx').on(table.userId),
    index('audit_logs_action_idx').on(table.action),
    index('audit_logs_created_idx').on(table.createdAt),
  ]
)

// ==========================================
// 9b. USER ROLES (SYSTEM-WIDE ROLE GRANTS)
// ==========================================

// Academy-scoped role is modelled by `academy_memberships`. `user_roles` models
// system-wide grants (for example the Super Admin who spans all academies).
export const userRoles = pgTable(
  'user_roles',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    roleId: uuid('role_id')
      .references(() => roles.id, { onDelete: 'cascade' })
      .notNull(),
    grantedBy: uuid('granted_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('user_role_unique').on(table.userId, table.roleId),
    index('user_roles_user_idx').on(table.userId),
  ]
)

// ==========================================
// 9c. TEACHER PROFILES, SCHEDULES, LEAD EVENTS
// ==========================================

export const teachers = pgTable(
  'teachers',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    academyId: uuid('academy_id')
      .references(() => academies.id, { onDelete: 'cascade' })
      .notNull(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    specialization: varchar('specialization', { length: 150 }),
    bio: text('bio'),
    hireDate: date('hire_date'),
    status: varchar('status', { length: 30 }).default('active').notNull(), // 'active' | 'on_leave' | 'inactive'
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('teacher_academy_user_unique').on(table.academyId, table.userId),
    index('teachers_academy_idx').on(table.academyId),
  ]
)

// Recurring weekly slot. Concrete dated lessons live in `lessons`.
export const schedules = pgTable(
  'schedules',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    academyId: uuid('academy_id')
      .references(() => academies.id, { onDelete: 'cascade' })
      .notNull(),
    groupId: uuid('group_id')
      .references(() => groups.id, { onDelete: 'cascade' })
      .notNull(),
    teacherId: uuid('teacher_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    dayOfWeek: integer('day_of_week').notNull(), // 1 = Monday ... 7 = Sunday (ISO-8601)
    startTime: varchar('start_time', { length: 10 }).notNull(), // 'HH:mm'
    endTime: varchar('end_time', { length: 10 }).notNull(),
    room: varchar('room', { length: 100 }),
    validFrom: date('valid_from'),
    validTo: date('valid_to'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('schedule_slot_unique').on(
      table.groupId,
      table.dayOfWeek,
      table.startTime
    ),
    index('schedules_academy_idx').on(table.academyId),
    index('schedules_teacher_idx').on(table.teacherId),
  ]
)

export const leadEvents = pgTable(
  'lead_events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    leadId: uuid('lead_id')
      .references(() => leads.id, { onDelete: 'cascade' })
      .notNull(),
    type: varchar('type', { length: 50 }).notNull(), // 'created' | 'status_changed' | 'note' | 'call' | 'trial_scheduled' | 'converted'
    fromStatus: varchar('from_status', { length: 30 }),
    toStatus: varchar('to_status', { length: 30 }),
    note: text('note'),
    followUpAt: timestamp('follow_up_at', { withTimezone: true }),
    createdBy: uuid('created_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('lead_events_lead_idx').on(table.leadId),
    index('lead_events_created_idx').on(table.createdAt),
  ]
)

// ==========================================
// 9d. FINANCE SUPPORTING TABLES
// ==========================================

export const invoiceItems = pgTable(
  'invoice_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    invoiceId: uuid('invoice_id')
      .references(() => invoices.id, { onDelete: 'cascade' })
      .notNull(),
    description: varchar('description', { length: 255 }).notNull(),
    quantity: integer('quantity').default(1).notNull(),
    unitPrice: integer('unit_price').notNull(),
    amount: integer('amount').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('invoice_items_invoice_idx').on(table.invoiceId)]
)

export const paymentAllocations = pgTable(
  'payment_allocations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    paymentId: uuid('payment_id')
      .references(() => payments.id, { onDelete: 'cascade' })
      .notNull(),
    invoiceId: uuid('invoice_id')
      .references(() => invoices.id, { onDelete: 'cascade' })
      .notNull(),
    amount: integer('amount').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('payment_allocations_payment_idx').on(table.paymentId),
    index('payment_allocations_invoice_idx').on(table.invoiceId),
  ]
)


export const debts = pgTable(
  'debts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    academyId: uuid('academy_id')
      .references(() => academies.id, { onDelete: 'cascade' })
      .notNull(),
    studentId: uuid('student_id')
      .references(() => students.id, { onDelete: 'cascade' })
      .notNull(),
    invoiceId: uuid('invoice_id').references(() => invoices.id, {
      onDelete: 'cascade',
    }),
    amount: integer('amount').notNull(),
    paidAmount: integer('paid_amount').default(0).notNull(),
    remainingAmount: integer('remaining_amount').notNull(),
    dueDate: date('due_date').notNull(),
    // Derived in queries from due_date/remaining_amount; stored so it can be
    // filtered and reported on without recomputation drift.
    status: varchar('status', { length: 30 }).default('open').notNull(), // 'open' | 'overdue' | 'settled' | 'written_off'
    settledAt: timestamp('settled_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('debts_academy_idx').on(table.academyId),
    index('debts_student_idx').on(table.studentId),
    index('debts_status_idx').on(table.status),
  ]
)

export const receipts = pgTable(
  'receipts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    academyId: uuid('academy_id')
      .references(() => academies.id, { onDelete: 'cascade' })
      .notNull(),
    paymentId: uuid('payment_id')
      .references(() => payments.id, { onDelete: 'cascade' })
      .notNull(),
    receiptNumber: varchar('receipt_number', { length: 100 }).notNull(),
    totalAmount: integer('total_amount').notNull(),
    currency: varchar('currency', { length: 10 }).default('UZS').notNull(),
    issuedBy: uuid('issued_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    issuedAt: timestamp('issued_at', { withTimezone: true }).defaultNow().notNull(),
    fileId: uuid('file_id'),
  },
  (table) => [
    uniqueIndex('receipt_number_unique').on(table.academyId, table.receiptNumber),
    index('receipts_payment_idx').on(table.paymentId),
  ]
)

// Atomic per-academy invoice/receipt numbering. Incremented with a single
// UPSERT ... RETURNING so concurrent requests can never reuse a number.
export const invoiceCounters = pgTable('invoice_counters', {
  academyId: uuid('academy_id')
    .references(() => academies.id, { onDelete: 'cascade' })
    .primaryKey(),
  lastValue: integer('last_value').default(0).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// ==========================================
// 9e. NOTIFICATIONS & FILES
// ==========================================

export const notifications = pgTable(
  'notifications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    academyId: uuid('academy_id').references(() => academies.id, {
      onDelete: 'cascade',
    }),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    body: text('body'),
    category: varchar('category', { length: 50 }).default('general').notNull(),
    targetPath: varchar('target_path', { length: 255 }),
    isRead: boolean('is_read').default(false).notNull(),
    readAt: timestamp('read_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('notifications_user_idx').on(table.userId),
    index('notifications_unread_idx').on(table.userId, table.isRead),
    index('notifications_created_idx').on(table.createdAt),
  ]
)

export const notificationPreferences = pgTable(
  'notification_preferences',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    category: varchar('category', { length: 50 }).notNull(),
    inApp: boolean('in_app').default(true).notNull(),
    email: boolean('email').default(false).notNull(),
    sms: boolean('sms').default(false).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('notification_pref_unique').on(table.userId, table.category),
  ]
)

export const files = pgTable(
  'files',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    academyId: uuid('academy_id').references(() => academies.id, {
      onDelete: 'cascade',
    }),
    uploadedBy: uuid('uploaded_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    storageKey: varchar('storage_key', { length: 500 }).notNull(),
    bucket: varchar('bucket', { length: 100 }),
    originalName: varchar('original_name', { length: 255 }).notNull(),
    mimeType: varchar('mime_type', { length: 150 }).notNull(),
    sizeBytes: integer('size_bytes').notNull(),
    checksum: varchar('checksum', { length: 128 }),
    entityType: varchar('entity_type', { length: 50 }),
    entityId: uuid('entity_id'),
    status: varchar('status', { length: 30 }).default('pending').notNull(), // 'pending' | 'ready' | 'deleted'
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('files_storage_key_unique').on(table.storageKey),
    index('files_academy_idx').on(table.academyId),
    index('files_entity_idx').on(table.entityType, table.entityId),
  ]
)

// ==========================================
// 10. RELATIONS
// ==========================================

export const academiesRelations = relations(academies, ({ many }) => ({
  memberships: many(academyMemberships),
  courses: many(courses),
  groups: many(groups),
  students: many(students),
  leads: many(leads),
  invoices: many(invoices),
  payments: many(payments),
  auditLogs: many(auditLogs),
}))

export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(academyMemberships),
  assignedGroups: many(groupTeachers),
  markedAttendances: many(attendanceRecords),
  givenGrades: many(grades),
  receivedPayments: many(payments),
  auditLogs: many(auditLogs),
}))

export const coursesRelations = relations(courses, ({ one, many }) => ({
  academy: one(academies, { fields: [courses.academyId], references: [academies.id] }),
  groups: many(groups),
}))

export const groupsRelations = relations(groups, ({ one, many }) => ({
  academy: one(academies, { fields: [groups.academyId], references: [academies.id] }),
  course: one(courses, { fields: [groups.courseId], references: [courses.id] }),
  teachers: many(groupTeachers),
  enrollments: many(enrollments),
  lessons: many(lessons),
  attendanceSessions: many(attendanceSessions),
  assignments: many(assignments),
  grades: many(grades),
}))

export const groupTeachersRelations = relations(groupTeachers, ({ one }) => ({
  group: one(groups, { fields: [groupTeachers.groupId], references: [groups.id] }),
  teacher: one(users, { fields: [groupTeachers.teacherId], references: [users.id] }),
}))

export const studentsRelations = relations(students, ({ one, many }) => ({
  academy: one(academies, { fields: [students.academyId], references: [academies.id] }),
  user: one(users, { fields: [students.userId], references: [users.id] }),
  enrollments: many(enrollments),
  attendanceRecords: many(attendanceRecords),
  grades: many(grades),
  invoices: many(invoices),
  payments: many(payments),
}))

export const enrollmentsRelations = relations(enrollments, ({ one, many }) => ({
  academy: one(academies, { fields: [enrollments.academyId], references: [academies.id] }),
  student: one(students, { fields: [enrollments.studentId], references: [students.id] }),
  group: one(groups, { fields: [enrollments.groupId], references: [groups.id] }),
  invoices: many(invoices),
}))

export const attendanceSessionsRelations = relations(attendanceSessions, ({ one, many }) => ({
  academy: one(academies, { fields: [attendanceSessions.academyId], references: [academies.id] }),
  group: one(groups, { fields: [attendanceSessions.groupId], references: [groups.id] }),
  teacher: one(users, { fields: [attendanceSessions.teacherId], references: [users.id] }),
  records: many(attendanceRecords),
}))

export const attendanceRecordsRelations = relations(attendanceRecords, ({ one }) => ({
  session: one(attendanceSessions, { fields: [attendanceRecords.sessionId], references: [attendanceSessions.id] }),
  student: one(students, { fields: [attendanceRecords.studentId], references: [students.id] }),
  marker: one(users, { fields: [attendanceRecords.markedBy], references: [users.id] }),
}))

export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
  group: one(groups, { fields: [assignments.groupId], references: [groups.id] }),
  teacher: one(users, { fields: [assignments.teacherId], references: [users.id] }),
  submissions: many(submissions),
  grades: many(grades),
}))

export const gradesRelations = relations(grades, ({ one, many }) => ({
  student: one(students, { fields: [grades.studentId], references: [students.id] }),
  group: one(groups, { fields: [grades.groupId], references: [groups.id] }),
  teacher: one(users, { fields: [grades.teacherId], references: [users.id] }),
  assignment: one(assignments, { fields: [grades.assignmentId], references: [assignments.id] }),
  history: many(gradeHistory),
}))

export const gradeHistoryRelations = relations(gradeHistory, ({ one }) => ({
  grade: one(grades, { fields: [gradeHistory.gradeId], references: [grades.id] }),
  user: one(users, { fields: [gradeHistory.changedBy], references: [users.id] }),
}))

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  academy: one(academies, { fields: [invoices.academyId], references: [academies.id] }),
  student: one(students, { fields: [invoices.studentId], references: [students.id] }),
  enrollment: one(enrollments, { fields: [invoices.enrollmentId], references: [enrollments.id] }),
  payments: many(payments),
}))

export const paymentsRelations = relations(payments, ({ one, many }) => ({
  invoice: one(invoices, { fields: [payments.invoiceId], references: [invoices.id] }),
  student: one(students, { fields: [payments.studentId], references: [students.id] }),
  receiver: one(users, { fields: [payments.receivedBy], references: [users.id] }),
  refunds: many(refunds),
}))

