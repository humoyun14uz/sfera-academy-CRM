/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CrmStudent, CrmGroup, CrmPayment, CrmActivity, CrmNotification, CrmApplication } from '@/lib/crm-store'

export function adaptStudents(raw: unknown[]): CrmStudent[] {
  return raw.map((s: any) => ({
    id: s.id ?? s.studentId ?? '',
    name: `${s.firstName ?? ''} ${s.lastName ?? ''}`.trim() || 'Unknown',
    phone: s.phone ?? '',
    email: s.email ?? '',
    course: s.courseName ?? s.course ?? '',
    groupId: s.groupId ?? s.groupId ?? '',
    teacher: s.teacherName ?? s.teacher ?? '',
    status: (s.status === 'active' || s.status === 'paused' || s.status === 'graduated') ? s.status : 'active',
    progress: s.progress ?? 0,
    attendance: s.attendance ?? 0,
    averageGrade: s.averageGrade ?? 0,
    totalPaid: s.totalPaid ?? 0,
    debt: s.debt ?? 0,
  }))
}

export function adaptGroups(raw: unknown[]): CrmGroup[] {
  return raw.map((g: any) => ({
    id: g.id ?? '',
    name: g.name ?? '',
    course: g.courseName ?? g.course ?? '',
    teacher: g.teacherName ?? g.teacher ?? '',
    room: g.room ?? '',
    capacity: g.capacity ?? 20,
    studentIds: g.studentIds ?? [],
    schedule: g.schedule ?? g.scheduleDays?.join('-') ?? '',
    attendance: g.attendance ?? 0,
  }))
}

export function adaptPayments(raw: unknown[]): CrmPayment[] {
  return raw.map((p: any) => ({
    id: p.id ?? '',
    studentId: p.studentId ?? '',
    amount: p.amount ?? 0,
    method: p.paymentMethod ?? 'cash',
    date: p.paidAt ? p.paidAt.slice(0, 10) : (p.createdAt ?? p.date ?? '').slice(0, 10),
    description: p.description ?? '',
  }))
}

export function adaptActivities(raw: unknown[]): CrmActivity[] {
  return raw.map((a: any) => ({
    id: a.id ?? a.auditLogId ?? '',
    user: a.userName ?? a.actorName ?? 'System',
    role: a.userRole ?? a.role ?? 'Manager',
    action: a.action ?? '',
    entity: a.entity ?? '',
    createdAt: a.createdAt ?? a.timestamp ?? new Date().toISOString(),
  }))
}

export function adaptNotifications(raw: unknown[]): CrmNotification[] {
  return raw.map((n: any) => ({
    id: n.id ?? '',
    title: n.title ?? '',
    category: n.category ?? 'general',
    read: n.read ?? false,
    createdAt: n.createdAt ?? new Date().toISOString(),
    target: n.target ?? undefined,
  }))
}

export function adaptApplications(raw: unknown[]): CrmApplication[] {
  return raw.map((l: any) => ({
    id: l.id ?? '',
    name: l.name ?? '',
    phone: l.phone ?? '',
    course: l.courseName ?? l.course ?? '',
    status: (l.status as CrmApplication['status']) ?? 'NEW',
    createdAt: l.createdAt ? l.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
    followUpAt: l.followUpAt ? l.followUpAt.slice(0, 10) : undefined,
    studentId: l.studentId ?? undefined,
  }))
}
