import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Reflector } from '@nestjs/core'
import { ExecutionContext, ForbiddenException } from '@nestjs/common'
import { ScopeGuard } from '../src/common/guards/scope.guard'

describe('ScopeGuard (Multi-Tenant, Teacher & Student Scope Enforcement)', () => {
  let guard: ScopeGuard
  let reflector: Reflector
  let mockDb: any

  beforeEach(() => {
    reflector = new Reflector()
    mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn(),
    }
    guard = new ScopeGuard(reflector, mockDb)
  })

  function createMockContext(user: any, params: any = {}, body: any = {}, query: any = {}): ExecutionContext {
    return {
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({ user, params, body, query }),
      }),
    } as unknown as ExecutionContext
  }

  it('blocks cross-academy access if academyId in body differs from user academyId', async () => {
    const user = {
      id: 'usr-1',
      role: 'Manager',
      academyId: 'academy-1',
      permissions: ['students.create'],
    }
    const context = createMockContext(user, {}, { academyId: 'academy-2' })

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException)
  })

  it('blocks Teacher when accessing an unassigned group', async () => {
    const user = {
      id: 'teacher-1',
      role: 'Teacher',
      academyId: 'academy-1',
      permissions: ['attendance.mark'],
    }
    // Mock db returning empty array (not assigned)
    mockDb.limit.mockResolvedValue([])

    const context = createMockContext(user, { groupId: 'group-unassigned' })

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException)
  })

  it('allows Teacher when assigned to group', async () => {
    const user = {
      id: 'teacher-1',
      role: 'Teacher',
      academyId: 'academy-1',
      permissions: ['attendance.mark'],
    }
    // Mock db returning assigned record
    mockDb.limit.mockResolvedValue([{ id: 'gt-1' }])

    const context = createMockContext(user, { groupId: 'group-assigned' })

    const result = await guard.canActivate(context)
    expect(result).toBe(true)
  })

  it('blocks Student from accessing another student data', async () => {
    const user = {
      id: 'student-user-1',
      role: 'Student',
      academyId: 'academy-1',
      permissions: ['grades.read'],
    }
    // Mock student profile resolution: current user is student-record-1
    mockDb.limit.mockResolvedValue([{ id: 'student-record-1' }])

    // Student attempts to query 'student-record-999'
    const context = createMockContext(user, { studentId: 'student-record-999' })

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException)
  })
})

