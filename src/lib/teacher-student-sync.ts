export const ASSIGNMENTS_STORAGE_KEY = 'sfera-teacher-assignments'

export type SharedAssignment = {
  id: string
  title: string
  module: string
  description: string
  deadline: string
  status: 'pending' | 'in_progress' | 'review' | 'completed'
}

export function readSharedAssignments(): SharedAssignment[] {
  if (typeof window === 'undefined') return []
  try {
    const value = window.localStorage.getItem(ASSIGNMENTS_STORAGE_KEY)
    const parsed: unknown = value ? JSON.parse(value) : []
    return Array.isArray(parsed) ? (parsed as SharedAssignment[]) : []
  } catch {
    return []
  }
}

export function writeSharedAssignments(assignments: SharedAssignment[]) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(assignments))
    window.dispatchEvent(new StorageEvent('storage', { key: ASSIGNMENTS_STORAGE_KEY }))
  }
}

export type SharedGrade = { student: string; score: number; updatedAt: string }
const GRADES_STORAGE_KEY = 'sfera-teacher-grades'

export function readSharedGrades(): SharedGrade[] {
  if (typeof window === 'undefined') return []
  try {
    const value = window.localStorage.getItem(GRADES_STORAGE_KEY)
    const parsed: unknown = value ? JSON.parse(value) : []
    return Array.isArray(parsed) ? (parsed as SharedGrade[]) : []
  } catch {
    return []
  }
}

export function writeSharedGrade(grade: SharedGrade) {
  if (typeof window === 'undefined') return
  const next = readSharedGrades().filter((item) => item.student !== grade.student)
  window.localStorage.setItem(GRADES_STORAGE_KEY, JSON.stringify([...next, grade]))
  window.dispatchEvent(new StorageEvent('storage', { key: GRADES_STORAGE_KEY }))
}
