import { useState } from 'react'
import {
  CheckCircle2,
  Lock,
  Plus,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Users,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { useLanguage } from '@/context/language-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

type RoleItem = {
  id: string
  name: string
  nameEn: string
  description: string
  descriptionEn: string
  usersCount: number
  color: string
  permissions: string[]
}

const roleList: RoleItem[] = [
  {
    id: 'superadmin',
    name: 'Bosh Administrator (Super Admin)',
    nameEn: 'Super Administrator',
    description: 'Tizimning barcha bo‘limlari va xavfsizlik sozlamalariga to‘liq cheklovsiz ruxsat.',
    descriptionEn: 'Full unrestricted access to all academy modules and security settings.',
    usersCount: 1,
    color: 'border-rose-500/30 bg-rose-500/5 text-rose-600 dark:text-rose-400',
    permissions: ['all'],
  },
  {
    id: 'admin',
    name: 'Administrator',
    nameEn: 'Administrator',
    description: 'Boshqaruv, o‘qituvchilar, guruhlar, to‘lovlar va umumiy akademiyani boshqarish.',
    descriptionEn: 'Academic management, teachers, groups, payments, and operational control.',
    usersCount: 2,
    color: 'border-blue-500/30 bg-blue-500/5 text-blue-600 dark:text-blue-400',
    permissions: ['dashboard', 'leads', 'students', 'groups', 'courses', 'teachers', 'payments', 'reports', 'tasks'],
  },
  {
    id: 'manager',
    name: 'Menejer (Sales / Operations)',
    nameEn: 'Manager',
    description: 'Arizalarni qabul qilish, o‘quvchilarni ro‘yxatga olish va guruhlarga taqsimlash.',
    descriptionEn: 'Lead intake, student onboarding, group assignment, and basic reporting.',
    usersCount: 4,
    color: 'border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400',
    permissions: ['dashboard', 'leads', 'students', 'groups', 'courses', 'teachers', 'reports', 'tasks'],
  },
  {
    id: 'teacher',
    name: 'O‘qituvchi (Instructor)',
    nameEn: 'Teacher',
    description: 'O‘z dars jadvali, talabalar davomati, baholash va vazifalarni tekshirish.',
    descriptionEn: 'Assigned schedules, attendance tracking, grading, and homework evaluation.',
    usersCount: 12,
    color: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400',
    permissions: ['dashboard', 'groups', 'students', 'tasks'],
  },
  {
    id: 'finance',
    name: 'Moliya bo‘limi (Finance)',
    nameEn: 'Finance Officer',
    description: 'O‘qish to‘lovlari, qarzdorlik nazorati, kvitansiyalar va moliyaviy tahlil.',
    descriptionEn: 'Tuition tracking, debt collection, invoices, and financial performance reports.',
    usersCount: 2,
    color: 'border-purple-500/30 bg-purple-500/5 text-purple-600 dark:text-purple-400',
    permissions: ['dashboard', 'payments', 'reports', 'tasks'],
  },
  {
    id: 'student',
    name: 'O‘quvchi / Talaba (Student)',
    nameEn: 'Student',
    description: 'Shaxsiy dars jadvali, topshiriqlar, baholar jurnali va shaxsiy to‘lovlar.',
    descriptionEn: 'Personal class timetable, homework submissions, grade sheet, and payment history.',
    usersCount: 140,
    color: 'border-sky-500/30 bg-sky-500/5 text-sky-600 dark:text-sky-400',
    permissions: ['tasks'],
  },
]

const moduleMatrix = [
  { id: 'dashboard', nameUz: 'Boshqaruv paneli', nameEn: 'Dashboard' },
  { id: 'leads', nameUz: 'Arizalar (CRM)', nameEn: 'Applications (CRM)' },
  { id: 'students', nameUz: 'O‘quvchilar', nameEn: 'Students' },
  { id: 'groups', nameUz: 'Guruhlar', nameEn: 'Groups' },
  { id: 'courses', nameUz: 'Kurslar', nameEn: 'Courses' },
  { id: 'teachers', nameUz: 'O‘qituvchilar', nameEn: 'Teachers' },
  { id: 'payments', nameUz: 'To‘lovlar & Moliya', nameEn: 'Payments & Finance' },
  { id: 'reports', nameUz: 'Hisobotlar', nameEn: 'Reports & Analytics' },
  { id: 'tasks', nameUz: 'Vazifalar', nameEn: 'Tasks' },
  { id: 'settings', nameUz: 'Tizim sozlamalari', nameEn: 'System Settings' },
]

export function UsersManagement() {
  const { language } = useLanguage()
  const english = language === 'en'
  const [selectedRole, setSelectedRole] = useState<RoleItem | null>(null)

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-6'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              {english ? 'Roles & Permissions' : 'Rollar va huquqlar'}
            </h1>
            <p className='text-sm text-muted-foreground'>
              {english
                ? 'Manage system access levels, role boundaries, and security rules.'
                : 'Tizimga kirish darajalari, rollar chegarasi va xavfsizlik huquqlarini boshqaring.'}
            </p>
          </div>
          <Button
            className='gap-2 w-fit'
            onClick={() =>
              toast.info(
                english
                  ? 'Role creation is managed by Super Admin policy.'
                  : 'Yangi rollar faqat Super Admin siyosati asosida kiritiladi.'
              )
            }
          >
            <Plus className='size-4' />
            {english ? 'Create custom role' : 'Yangi rol yaratish'}
          </Button>
        </div>

        {/* 6 ta asosiy Rol Kartochkalari */}
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {roleList.map((role) => (
            <Card
              key={role.id}
              className='relative flex flex-col justify-between overflow-hidden border transition-all hover:shadow-md'
            >
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between gap-2'>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold ${role.color}`}
                  >
                    <ShieldCheck className='size-3.5' />
                    {english ? role.nameEn : role.name}
                  </span>
                  <Badge variant='outline' className='gap-1 text-xs font-medium'>
                    <Users className='size-3' />
                    {role.usersCount} {english ? 'users' : 'ta hisob'}
                  </Badge>
                </div>
                <CardDescription className='mt-2 text-xs leading-relaxed'>
                  {english ? role.descriptionEn : role.description}
                </CardDescription>
              </CardHeader>
              <CardContent className='pt-0 pb-4'>
                <div className='flex items-center justify-between border-t pt-3 text-xs'>
                  <span className='text-muted-foreground flex items-center gap-1'>
                    <Lock className='size-3' />
                    {role.permissions[0] === 'all'
                      ? english
                        ? 'Full Access'
                        : 'To‘liq ruxsat'
                      : `${role.permissions.length} ${english ? 'modules active' : 'ta modul ruxsati'}`}
                  </span>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-7 text-xs font-medium text-primary hover:bg-primary/10'
                    onClick={() => setSelectedRole(role)}
                  >
                    {english ? 'Configure access' : 'Huquqlarni ko‘rish'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Huquqlar Matritsasi (Permissions Matrix) */}
        <Card>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <Shield className='size-5 text-primary' />
              <CardTitle>
                {english ? 'Access Permissions Matrix' : 'Rollar va huquqlar matritsasi'}
              </CardTitle>
            </div>
            <CardDescription>
              {english
                ? 'Cross-functional view of system capabilities assigned to each role.'
                : 'Har bir rolga qaysi modullar va amallar ruxsat etilganligining taqsimot jadvali.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto rounded-lg border'>
              <table className='w-full min-w-[760px] border-collapse text-left text-sm'>
                <thead>
                  <tr className='border-b bg-muted/40 text-xs font-medium text-muted-foreground'>
                    <th className='py-3.5 px-4 min-w-[180px]'>{english ? 'Module / Area' : 'Modul / Bo‘lim'}</th>
                    <th className='py-3.5 px-3 text-center'>Super Admin</th>
                    <th className='py-3.5 px-3 text-center'>Admin</th>
                    <th className='py-3.5 px-3 text-center'>{english ? 'Manager' : 'Menejer'}</th>
                    <th className='py-3.5 px-3 text-center'>{english ? 'Teacher' : 'O‘qituvchi'}</th>
                    <th className='py-3.5 px-3 text-center'>{english ? 'Finance' : 'Moliya'}</th>
                    <th className='py-3.5 px-3 text-center'>{english ? 'Student' : 'Talaba'}</th>
                  </tr>
                </thead>
                <tbody className='divide-y'>
                  {moduleMatrix.map((mod) => (
                    <tr key={mod.id} className='transition-colors hover:bg-muted/20'>
                      <td className='py-3 px-4 font-semibold text-xs text-foreground'>
                        {english ? mod.nameEn : mod.nameUz}
                      </td>
                      {roleList.map((role) => {
                        const hasAccess =
                          role.permissions[0] === 'all' ||
                          role.permissions.includes(mod.id)
                        return (
                          <td key={role.id} className='py-3 px-3 text-center'>
                            {hasAccess ? (
                              <div className='inline-flex items-center justify-center size-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'>
                                <CheckCircle2 className='size-4' />
                              </div>
                            ) : (
                              <div className='inline-flex items-center justify-center size-6 rounded-full bg-muted text-muted-foreground/40'>
                                <XCircle className='size-4' />
                              </div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Xavfsizlik qoidasi */}
        <Card className='border-amber-500/30 bg-amber-500/5'>
          <CardHeader className='pb-2'>
            <div className='flex items-center gap-2 text-amber-600 dark:text-amber-400'>
              <ShieldAlert className='size-5' />
              <CardTitle className='text-sm font-semibold'>
                {english ? 'Access Control Policy' : 'Xavfsizlik va ruxsatlar siyosati'}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className='text-xs text-muted-foreground leading-relaxed'>
            {english
              ? 'Permissions are enforced cryptographically via server-side session tokens and RouteGuards. A user cannot bypass role boundaries without Super Administrator authorization.'
              : 'Foydalanuvchi huquqlari server tomoni va RouteGuard himoyasi orqali tekshiriladi. Bosh Administrator ruxsatisiz boshqa hech bir rol o‘ziga huquq qo‘sha olmaydi.'}
          </CardContent>
        </Card>
      </Main>

      {/* Rolni ko'rish / sozlash modali */}
      <Dialog open={!!selectedRole} onOpenChange={(open) => !open && setSelectedRole(null)}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <UserCheck className='size-5 text-primary' />
              {selectedRole ? (english ? selectedRole.nameEn : selectedRole.name) : ''}
            </DialogTitle>
            <DialogDescription>
              {selectedRole ? (english ? selectedRole.descriptionEn : selectedRole.description) : ''}
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-3 py-2'>
            <p className='text-xs font-semibold text-muted-foreground'>
              {english ? 'Assigned module permissions:' : 'Biriktirilgan modul huquqlari:'}
            </p>
            <div className='flex flex-wrap gap-1.5'>
              {selectedRole?.permissions[0] === 'all' ? (
                <Badge className='bg-emerald-500/15 text-emerald-600 border-emerald-300'>
                  {english ? 'All modules unlocked (100%)' : 'Barcha modullar ochiq (100%)'}
                </Badge>
              ) : (
                moduleMatrix
                  .filter((m) => selectedRole?.permissions.includes(m.id))
                  .map((m) => (
                    <Badge key={m.id} variant='secondary' className='gap-1 text-xs'>
                      <CheckCircle2 className='size-3 text-emerald-500' />
                      {english ? m.nameEn : m.nameUz}
                    </Badge>
                  ))
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setSelectedRole(null)}>
              {english ? 'Close' : 'Yopish'}
            </Button>
            <Button
              onClick={() => {
                toast.success(
                  english
                    ? 'Role permissions are in sync with database.'
                    : 'Rol ruxsatlari ma’lumotlar bazasi bilan sinxronlangan.'
                )
                setSelectedRole(null)
              }}
            >
              {english ? 'Save Changes' : 'Saqlash'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
