import { createDb, getDbPool } from './index.js'
import * as dotenv from 'dotenv'
import * as schema from './schema/index.js'
import {
  SYSTEM_ROLES,
  ALL_PERMISSIONS,
  DEFAULT_ROLE_PERMISSIONS,
  SystemRole,
} from '@sfera/contracts'
import { eq } from 'drizzle-orm'

dotenv.config({ path: process.env.ENV_FILE || '../../.env' })

export async function seedDatabase() {
  const db = createDb()
  console.log('🌱 Starting Sfera CRM database seeding...')

  // 1. Roles
  console.log('1/8 Seeding roles...')
  const roleMap = new Map<string, string>()
  for (const roleName of SYSTEM_ROLES) {
    const existing = await db
      .select()
      .from(schema.roles)
      .where(eq(schema.roles.name, roleName))
      .limit(1)

    if (existing.length > 0) {
      roleMap.set(roleName, existing[0].id)
    } else {
      const [inserted] = await db
        .insert(schema.roles)
        .values({
          name: roleName,
          description: `System role for ${roleName}`,
          isSystem: true,
        })
        .returning()
      roleMap.set(roleName, inserted.id)
    }
  }

  // 2. Permissions
  console.log('2/8 Seeding permissions...')
  const permissionMap = new Map<string, string>()
  for (const code of ALL_PERMISSIONS) {
    const moduleName = code.split('.')[0]
    const existing = await db
      .select()
      .from(schema.permissions)
      .where(eq(schema.permissions.code, code))
      .limit(1)

    if (existing.length > 0) {
      permissionMap.set(code, existing[0].id)
    } else {
      const [inserted] = await db
        .insert(schema.permissions)
        .values({
          code,
          module: moduleName,
          description: `Permission to ${code.replace('.', ' ')}`,
        })
        .returning()
      permissionMap.set(code, inserted.id)
    }
  }

  // 3. Role Permissions
  console.log('3/8 Seeding role permissions...')
  for (const [roleName, permissions] of Object.entries(DEFAULT_ROLE_PERMISSIONS)) {
    const roleId = roleMap.get(roleName as SystemRole)
    if (!roleId) continue

    for (const permCode of permissions) {
      const permId = permissionMap.get(permCode)
      if (!permId) continue

      await db
        .insert(schema.rolePermissions)
        .values({ roleId, permissionId: permId })
        .onConflictDoNothing()
    }
  }

  // 4. Default Academy
  console.log('4/8 Seeding default Academy...')
  let academyId: string
  const existingAcademy = await db
    .select()
    .from(schema.academies)
    .where(eq(schema.academies.slug, 'sfera-it-academy'))
    .limit(1)

  if (existingAcademy.length > 0) {
    academyId = existingAcademy[0].id
  } else {
    const [insertedAcademy] = await db
      .insert(schema.academies)
      .values({
        name: 'Sfera IT Academy',
        slug: 'sfera-it-academy',
        phone: '+998 71 200 00 00',
        email: 'info@sfera.uz',
        address: 'Toshkent sh., Yunusobod tumani, Amir Temur shox ko‘chasi 107B',
        settings: { currency: 'UZS', timezone: 'Asia/Tashkent' },
        isActive: true,
      })
      .returning()
    academyId = insertedAcademy.id
  }

  // 5. Seed Users
  console.log('5/8 Seeding users...')
  const usersToSeed = [
    {
      clerkId: 'user_super_admin_seed',
      email: 'admin@gmail.com',
      firstName: 'Sfera',
      lastName: 'SuperAdmin',
      phone: '+998 90 000 00 01',
      role: 'Super Admin' as const,
    },
    {
      clerkId: 'user_admin_seed',
      email: 'academy_admin@gmail.com',
      firstName: 'Bekzod',
      lastName: 'Rahmonov',
      phone: '+998 90 000 00 02',
      role: 'Admin' as const,
    },
    {
      clerkId: 'user_manager_seed',
      email: 'manager@gmail.com',
      firstName: 'Nodira',
      lastName: 'Manager',
      phone: '+998 90 000 00 03',
      role: 'Manager' as const,
    },
    {
      clerkId: 'user_teacher_temurbek_seed',
      email: 'temurbek@sfera.uz',
      firstName: 'Temurbek',
      lastName: 'Ergashev',
      phone: '+998 90 000 00 04',
      role: 'Teacher' as const,
    },
    {
      clerkId: 'user_teacher_golib_seed',
      email: 'golib@sfera.uz',
      firstName: 'Golib',
      lastName: 'Abduhalil',
      phone: '+998 90 000 00 05',
      role: 'Teacher' as const,
    },
    {
      clerkId: 'user_finance_seed',
      email: 'finance@gmail.com',
      firstName: 'Dilnoza',
      lastName: 'Finance',
      phone: '+998 90 000 00 06',
      role: 'Finance' as const,
    },
  ]

  const userMap = new Map<string, string>()
  for (const u of usersToSeed) {
    let uId: string
    const existingUser = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, u.email))
      .limit(1)

    if (existingUser.length > 0) {
      uId = existingUser[0].id
    } else {
      const [insertedUser] = await db
        .insert(schema.users)
        .values({
          clerkId: u.clerkId,
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName,
          phone: u.phone,
          status: 'active',
        })
        .returning()
      uId = insertedUser.id
    }
    userMap.set(u.email, uId)

    // Assign Academy Membership
    const roleId = roleMap.get(u.role)
    if (roleId) {
      await db
        .insert(schema.academyMemberships)
        .values({
          academyId,
          userId: uId,
          roleId,
          isActive: true,
        })
        .onConflictDoNothing()
    }
  }

  // 6. Courses
  console.log('6/8 Seeding courses...')
  const coursesToSeed = [
    {
      name: 'Frontend Development',
      code: 'FED-01',
      category: 'Dasturlash',
      durationMonths: 6,
      price: 1200000,
    },
    {
      name: 'Python Backend',
      code: 'PYB-01',
      category: 'Dasturlash',
      durationMonths: 6,
      price: 1300000,
    },
    {
      name: 'React.js Intensive',
      code: 'RCT-01',
      category: 'Dasturlash',
      durationMonths: 3,
      price: 1000000,
    },
  ]

  const courseMap = new Map<string, string>()
  for (const c of coursesToSeed) {
    let cId: string
    const existing = await db
      .select()
      .from(schema.courses)
      .where(eq(schema.courses.code, c.code))
      .limit(1)

    if (existing.length > 0) {
      cId = existing[0].id
    } else {
      const [inserted] = await db
        .insert(schema.courses)
        .values({
          academyId,
          name: c.name,
          code: c.code,
          category: c.category,
          durationMonths: c.durationMonths,
          price: c.price,
          status: 'active',
        })
        .returning()
      cId = inserted.id
    }
    courseMap.set(c.code, cId)
  }

  // 7. Groups & Teacher assignments
  console.log('7/8 Seeding groups...')
  const fedCourseId = courseMap.get('FED-01')
  const temurbekId = userMap.get('temurbek@sfera.uz')
  let groupFr02Id: string

  if (fedCourseId && temurbekId) {
    const existingGroup = await db
      .select()
      .from(schema.groups)
      .where(eq(schema.groups.name, 'FR-02'))
      .limit(1)

    if (existingGroup.length > 0) {
      groupFr02Id = existingGroup[0].id
    } else {
      const [insertedGroup] = await db
        .insert(schema.groups)
        .values({
          academyId,
          courseId: fedCourseId,
          name: 'FR-02',
          room: '204-xona',
          capacity: 20,
          scheduleDays: ['Du', 'Chor', 'Ju'],
          startTime: '18:00',
          endTime: '20:00',
          status: 'active',
        })
        .returning()
      groupFr02Id = insertedGroup.id
    }

    await db
      .insert(schema.groupTeachers)
      .values({
        groupId: groupFr02Id,
        teacherId: temurbekId,
        isPrimary: true,
      })
      .onConflictDoNothing()
  }

  // 8. Students & Enrollments
  console.log('8/8 Seeding students and enrollments...')
  const studentsToSeed = [
    {
      firstName: 'Azizbek',
      lastName: 'Karimov',
      phone: '+998 90 123 45 67',
      email: 'azizbek@example.com',
    },
    {
      firstName: 'Madina',
      lastName: 'Aliyeva',
      phone: '+998 91 222 33 44',
      email: 'madina@example.com',
    },
    {
      firstName: 'Javohir',
      lastName: 'Rasulov',
      phone: '+998 93 333 44 55',
      email: 'javohir@example.com',
    },
  ]

  for (const s of studentsToSeed) {
    let sId: string
    const existing = await db
      .select()
      .from(schema.students)
      .where(eq(schema.students.phone, s.phone))
      .limit(1)

    if (existing.length > 0) {
      sId = existing[0].id
    } else {
      const [inserted] = await db
        .insert(schema.students)
        .values({
          academyId,
          firstName: s.firstName,
          lastName: s.lastName,
          phone: s.phone,
          email: s.email,
          status: 'active',
        })
        .returning()
      sId = inserted.id
    }

    if (groupFr02Id!) {
      await db
        .insert(schema.enrollments)
        .values({
          academyId,
          studentId: sId,
          groupId: groupFr02Id,
          status: 'active',
        })
        .onConflictDoNothing()
    }
  }

  console.log('✅ Sfera CRM database seeding finished successfully.')
}

// Auto-run if called directly
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  seedDatabase()
    .catch((err) => {
      console.error('❌ Seeding failed:', err)
      process.exit(1)
    })
    .finally(async () => {
      await getDbPool().end()
    })
}
