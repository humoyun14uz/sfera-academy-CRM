import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Reflector } from '@nestjs/core'
import { type ExecutionContext, ForbiddenException } from '@nestjs/common'
import { RbacGuard } from '../src/common/guards/rbac.guard'
import { DEFAULT_ROLE_PERMISSIONS } from '@sfera/contracts'

describe('RbacGuard (Deny-by-Default Authorization)', () => {
  let guard: RbacGuard
  let reflector: Reflector

  beforeEach(() => {
    reflector = new Reflector()
    guard = new RbacGuard(reflector)
  })

  function createMockContext(user: any): ExecutionContext {
    return {
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    } as unknown as ExecutionContext
  }

  it('allows Super Admin full access to any endpoint regardless of permissions', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockImplementation((key: string) => {
      if (key === 'permissions') return ['students.delete']
      return null
    })

    const context = createMockContext({
      role: 'Super Admin',
      permissions: DEFAULT_ROLE_PERMISSIONS['Super Admin'],
    })

    expect(guard.canActivate(context)).toBe(true)
  })

  it('allows Manager to access allowed permissions (e.g. leads.create)', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockImplementation((key: string) => {
      if (key === 'permissions') return ['leads.create']
      return null
    })

    const context = createMockContext({
      role: 'Manager',
      permissions: DEFAULT_ROLE_PERMISSIONS['Manager'],
    })

    expect(guard.canActivate(context)).toBe(true)
  })

  it('denies (403 Forbidden) when Teacher tries to access financial invoices', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockImplementation((key: string) => {
      if (key === 'permissions') return ['finance.invoices.create']
      return null
    })

    const context = createMockContext({
      role: 'Teacher',
      permissions: DEFAULT_ROLE_PERMISSIONS['Teacher'],
    })

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException)
  })

  it('denies (403 Forbidden) when Finance tries to modify grades or mark attendance', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockImplementation((key: string) => {
      if (key === 'permissions') return ['grades.create', 'attendance.mark']
      return null
    })

    const context = createMockContext({
      role: 'Finance',
      permissions: DEFAULT_ROLE_PERMISSIONS['Finance'],
    })

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException)
  })

  it('denies (403 Forbidden) when Student tries to delete a group', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockImplementation((key: string) => {
      if (key === 'permissions') return ['groups.delete']
      return null
    })

    const context = createMockContext({
      role: 'Student',
      permissions: DEFAULT_ROLE_PERMISSIONS['Student'],
    })

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException)
  })
})

