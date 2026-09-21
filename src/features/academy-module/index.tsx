import { useState } from 'react'
import {
  ArrowUpRight,
  BarChart3,
  LineChartIcon,
  Check,
  CheckCheck,
  CheckCircle2,
  CircleHelp,
  Clock3,
  CreditCard,
  Download,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  Plus,
  Printer,
  TrendingUp,
  Users,
  UsersRound,
  Wallet,
  X,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { toast } from 'sonner'
import { useCrmStore } from '@/lib/crm-store'
import { useAuthStore } from '@/stores/auth-store'
import { getPrimaryRole } from '@/lib/rbac'
import { useLanguage } from '@/context/language-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AttendanceStatusCheckbox } from '@/components/attendance-checkbox'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { NotFoundError } from '@/features/errors/not-found-error'
import { LeadsPanel } from './leads-panel'

const modules = {
  leads: {
    uz: 'Arizalar',
    en: 'Applications',
    descriptionUz: 'Yangi arizalarni qabul qilish va kuzatish.',
    descriptionEn: 'Receive and track new applications.',
  },
  groups: {
    uz: 'Guruhlar',
    en: 'Groups',
    descriptionUz: 'Guruhlar, o‘quvchilar va dars jadvallarini boshqarish.',
    descriptionEn: 'Manage groups, students, and lesson schedules.',
  },
  teachers: {
    uz: 'O‘qituvchilar',
    en: 'Teachers',
    descriptionUz: 'O‘qituvchilar va ularning guruhlarini boshqarish.',
    descriptionEn: 'Manage teachers and their assigned groups.',
  },
  schedule: {
    uz: 'Jadval',
    en: 'Schedule',
    descriptionUz: 'Darslar jadvali va xonalarni rejalashtirish.',
    descriptionEn: 'Plan lessons, schedules, and classrooms.',
  },
  attendance: {
    uz: 'Davomat',
    en: 'Attendance',
    descriptionUz: 'O‘quvchilar davomatini qayd etish va tahlil qilish.',
    descriptionEn: 'Record and analyze student attendance.',
  },
  finance: {
    uz: 'Moliya',
    en: 'Finance',
    descriptionUz: 'To‘lovlar, qarzdorlik va moliyaviy operatsiyalar.',
    descriptionEn: 'Payments, debt, and financial operations.',
  },
  reports: {
    uz: 'Hisobotlar',
    en: 'Reports',
    descriptionUz: 'Academy faoliyati bo‘yicha umumiy hisobotlar.',
    descriptionEn: 'Summary reports for academy operations.',
  },
} as const

export type AcademyModuleId = keyof typeof modules

const teacherProfiles = [
  {
    name: 'Temurbek',
    email: 'temurbek@sfera.uz',
    phone: '+998 90 111 22 33',
    courses: 'Frontend Development',
    groups: 'FR-02',
    students: 18,
    schedule: 'Du-Chor-Ju 18:00',
  },
  {
    name: 'Golib Abduhalil',
    email: 'golib@sfera.uz',
    phone: '+998 91 222 33 44',
    courses: 'Java Backend, Python Backend',
    groups: 'JAVA-01, PY-01',
    students: 24,
    schedule: 'Se-Pay-Sha 19:00',
  },
  {
    name: 'Otabek Naviyev',
    email: 'otabek@sfera.uz',
    phone: '+998 93 333 44 55',
    courses: 'AI Automation',
    groups: 'AI-01',
    students: 10,
    schedule: 'Du-Chor-Ju 19:30',
  },
  {
    name: 'Ismat',
    email: 'ismat@sfera.uz',
    phone: '+998 95 444 55 66',
    courses: 'AI Automation Advanced',
    groups: 'AI-02',
    students: 8,
    schedule: 'Se-Pay-Sha 18:30',
  },
  {
    name: 'Quvonchbek',
    email: 'quvonchbek@sfera.uz',
    phone: '+998 97 555 66 77',
    courses: 'Academy Manager',
    groups: 'Barcha guruhlar',
    students: 60,
    schedule: 'Har kuni 09:00',
  },
]

const scheduleRows = [
  [
    'Frontend Development',
    'FR-02',
    'Temurbek',
    '204',
    '2026-09-07',
    '18:00',
    '19:30',
  ],
  [
    'Java Backend',
    'JAVA-01',
    'Golib Abduhalil',
    '201',
    '2026-09-08',
    '19:00',
    '20:30',
  ],
  [
    'AI Automation',
    'AI-01',
    'Otabek Naviyev',
    '305',
    '2026-09-09',
    '19:30',
    '21:00',
  ],
  [
    'AI Automation Advanced',
    'AI-02',
    'Ismat',
    '306',
    '2026-09-16',
    '18:30',
    '20:00',
  ],
]

const paymentRows = [
  [
    'Madina Karimova',
    'Frontend Development',
    '1,500,000 so‘m',
    '1,500,000 so‘m',
    'Paid',
  ],
  [
    'Dilshod Rahimov',
    'Python Backend',
    '1,700,000 so‘m',
    '850,000 so‘m',
    'Partially paid',
  ],
  ['Jasur Ergashev', 'Java Backend', '1,800,000 so‘m', '0 so‘m', 'Unpaid'],
]

const groups = [
  {
    name: 'FR-02',
    course: 'Frontend Development',
    teacher: 'Temurbek',
    students: 18,
    room: '204',
    schedule: 'Du-Chor-Ju 18:00',
    status: 'Active',
  },
  {
    name: 'JAVA-01',
    course: 'Java Backend',
    teacher: 'Golib Abduhalil',
    students: 12,
    room: '201',
    schedule: 'Se-Pay-Sha 19:00',
    status: 'Upcoming',
  },
  {
    name: 'AI-01',
    course: 'AI Automation',
    teacher: 'Otabek Naviyev',
    students: 10,
    room: '305',
    schedule: 'Du-Chor-Ju 19:30',
    status: 'Active',
  },
]

export function AcademyModule({ moduleId }: { moduleId: string }) {
  const { language, t } = useLanguage()
  const crm = useCrmStore()
  const user = useAuthStore((state) => state.auth.user)
  const role = getPrimaryRole(user?.role)
  const [scheduleMode, setScheduleMode] = useState<'day' | 'week' | 'month'>(
    'week'
  )
  const [reportRange, setReportRange] = useState('30')
  const [teacherDialogOpen, setTeacherDialogOpen] = useState(false)
  const [teacherRows, setTeacherRows] = useState(teacherProfiles)
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
  })
  const [selectedGroupName, setSelectedGroupName] = useState<string | null>(
    null
  )
  const [selectedAttendanceGroupId, setSelectedAttendanceGroupId] =
    useState<string>('all')
  const [attendanceChartTab, setAttendanceChartTab] = useState<
    'attendance' | 'revenue'
  >('attendance')
  const [attendanceStatuses, setAttendanceStatuses] = useState<
    Record<string, 'present' | 'late' | 'absent' | 'excused'>
  >({
    'stu-001': 'present',
    'stu-002': 'late',
    'stu-003': 'absent',
    'stu-004': 'present',
  })
  const moduleInfo = modules[moduleId as AcademyModuleId]
  if (!moduleInfo) return <NotFoundError />
  const english = language === 'en'
  const title = english ? moduleInfo.en : moduleInfo.uz
  const description = english
    ? moduleInfo.descriptionEn
    : moduleInfo.descriptionUz
  const roleDescription = role === 'Super Admin'
    ? (english ? 'Strategic academy-wide view for Super Admin.' : 'Super Admin uchun akademiya bo‘yicha strategik ko‘rinish.')
    : role === 'Manager'
      ? (english ? 'Operational academy view for Manager.' : 'Manager uchun operatsion akademiya ko‘rinishi.')
      : description
  const staticStats: Record<string, [string, string, string]> = {
    finance: [
      english ? 'Today’s payments' : 'Bugungi to‘lovlar',
      '12',
      english ? 'Pending payments' : 'Kutilayotgan to‘lovlar',
    ],
    attendance: [
      english ? 'Today’s attendance' : 'Bugungi davomat',
      '91%',
      english ? 'Absent students' : 'Kelmagan o‘quvchilar',
    ],
  }
  const stats = staticStats[moduleId] ??
    {
      leads: [
        english ? 'Active applications' : 'Faol arizalar',
        '3',
        english ? 'Follow-ups today' : 'Bugungi aloqalar',
      ],
      groups: [
        english ? 'Active groups' : 'Faol guruhlar',
        '2',
        english ? 'Near capacity' : 'Sig‘imga yaqin',
      ],
      teachers: [
        english ? 'Active teachers' : 'Faol o‘qituvchilar',
        '5',
        english ? 'Teaching this week' : 'Shu hafta darsda',
      ],
      schedule: [
        english ? 'Scheduled lessons' : 'Rejalashtirilgan darslar',
        '4',
        english ? 'This week' : 'Shu hafta',
      ],
      reports: [
        english ? 'Ready reports' : 'Tayyor hisobotlar',
        '8',
        english ? 'Updated today' : 'Bugun yangilangan',
      ],
    }[moduleId] ?? [
      english ? 'Active records' : 'Faol yozuvlar',
      '1',
      english ? 'Updated today' : 'Bugun yangilangan',
    ]
  const secondaryStat =
    moduleId === 'attendance'
      ? '9%'
      : moduleId === 'finance'
        ? '3'
        : moduleId === 'groups'
          ? '88%'
          : moduleId === 'teachers'
            ? '94%'
            : moduleId === 'schedule'
              ? '4'
              : moduleId === 'reports'
                ? '91%'
                : '1'
  const localizedPaymentRows = english
    ? paymentRows
    : paymentRows.map((row) =>
        row.map((value) =>
          value === 'Paid'
            ? t('paid')
            : value === 'Partially paid'
              ? t('partiallyPaid')
              : value === 'Unpaid'
                ? t('unpaid')
                : value
        )
      )
  const exportReport = () => {
    const reportRows = [
      [english ? 'Report' : 'Hisobot', english ? 'Value' : 'Qiymat'],
      [english ? 'Student growth' : 'O‘quvchilar o‘sishi', '+12.4%'],
      [english ? 'Enrollment report' : 'Qabul hisoboti', '54'],
      [t('coursePerformance'), '86%'],
      [english ? 'Group performance' : 'Guruhlar ko‘rsatkichi', '91%'],
      [t('teacherPerformance'), '94%'],
      [english ? 'Attendance report' : 'Davomat hisoboti', '91%'],
      [english ? 'Revenue report' : 'Tushum hisoboti', '58.4M'],
      [english ? 'Debt report' : 'Qarzdorlik hisoboti', '500K'],
    ]
    const csv = reportRows
      .map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')
      )
      .join('\n')
    const url = URL.createObjectURL(
      new Blob([csv], { type: 'text/csv;charset=utf-8' })
    )
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `academy-report-${reportRange}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
    toast.success(english ? 'Report downloaded.' : 'Hisobot yuklab olindi.')
  }
  const printReport = () => window.print()
  const visibleScheduleRows =
    moduleId === 'schedule'
      ? scheduleRows.filter(
          (row) =>
            scheduleMode === 'month' ||
            (scheduleMode === 'week'
              ? row[4] <= '2026-09-14'
              : row[4] === '2026-09-07')
        )
      : []
  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>
      <Main className='flex flex-1 flex-col gap-6'>
        <div>
          <p className='text-sm font-medium text-primary'>
            SFERA IT Academy CRM
          </p>
          <h1 className='text-2xl font-bold tracking-tight'>{title}</h1>
          <p className='text-muted-foreground'>{roleDescription}</p>
        </div>
        <div className='grid gap-4 md:grid-cols-3'>
          <Card>
            <CardHeader>
              <CardTitle>{english ? 'Overview' : 'Umumiy ko‘rinish'}</CardTitle>
            </CardHeader>
            <CardContent className='text-sm text-muted-foreground'>
              {english
                ? 'This module is ready for academy workflows.'
                : 'Ushbu modul academy jarayonlari uchun tayyor.'}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{stats[0]}</CardTitle>
            </CardHeader>
            <CardContent className='text-2xl font-bold'>{stats[1]}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{stats[2]}</CardTitle>
            </CardHeader>
            <CardContent className='text-2xl font-bold'>
              {secondaryStat}
            </CardContent>
          </Card>
        </div>
        {moduleId === 'leads' && (
          <div className='space-y-5'>
            <div className='grid gap-4 sm:grid-cols-3'>
              <Card className='overflow-hidden bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-orange-500/15'><CardContent className='pt-5'><p className='text-xs text-muted-foreground'>{english ? 'Total applications' : 'Jami arizalar'}</p><p className='mt-1 text-2xl font-bold'>{crm.applications.length}</p><p className='mt-1 text-xs text-amber-600'>{crm.applications.filter((a) => a.status === 'NEW').length} {english ? 'new' : 'yangi'}</p></CardContent></Card>
              <Card><CardContent className='pt-5'><p className='text-xs text-muted-foreground'>{english ? 'Conversion pipeline' : 'Qabul oqimi'}</p><p className='mt-1 text-2xl font-bold'>{crm.applications.filter((a) => ['APPROVED','ENROLLED'].includes(a.status)).length}</p><p className='mt-1 text-xs text-emerald-600'>{english ? 'Approved / enrolled' : 'Tasdiqlangan / qabul qilingan'}</p></CardContent></Card>
              <Card><CardContent className='pt-5'><p className='text-xs text-muted-foreground'>{english ? 'Follow-up queue' : 'Qayta aloqa navbati'}</p><p className='mt-1 text-2xl font-bold'>{crm.applications.filter((a) => a.status === 'CONTACTED').length}</p><p className='mt-1 text-xs text-primary'>{english ? 'Need manager action' : 'Manager aloqasini kutmoqda'}</p></CardContent></Card>
            </div>
            <Card className='overflow-hidden'><CardHeader className='border-b bg-gradient-to-r from-amber-500/15 via-primary/[0.06] to-orange-500/12 py-3'><div className='flex items-center justify-between gap-3'><div><CardTitle className='text-base leading-5'>{english ? 'Application funnel analytics' : 'Arizalar oqimi tahlili'}</CardTitle><CardDescription className='mt-0.5'>{english ? 'See where applications concentrate before opening the detailed list.' : 'Batafsil ro‘yxatga kirishdan oldin arizalar qaysi bosqichda jamlanganini ko‘ring.'}</CardDescription></div><LineChartIcon className='size-5 shrink-0 text-amber-500' /></div></CardHeader><CardContent className='p-4'><div className='h-[250px]'><ResponsiveContainer width='100%' height='100%'><BarChart data={[
              { stage: english ? 'New' : 'Yangi', value: crm.applications.filter((a) => a.status === 'NEW').length },
              { stage: english ? 'Contacted' : 'Aloqa', value: crm.applications.filter((a) => a.status === 'CONTACTED').length },
              { stage: english ? 'Trial' : 'Sinov', value: crm.applications.filter((a) => a.status === 'TRIAL LESSON').length },
              { stage: english ? 'Approved' : 'Tasdiqlangan', value: crm.applications.filter((a) => a.status === 'APPROVED').length },
              { stage: english ? 'Enrolled' : 'Qabul', value: crm.applications.filter((a) => a.status === 'ENROLLED').length },
            ]} barCategoryGap='26%'><CartesianGrid strokeDasharray='3 3' vertical={false}/><XAxis dataKey='stage' tick={{ fontSize: 10 }}/><YAxis allowDecimals={false}/><RechartsTooltip/><Bar dataKey='value' fill='#f59e0b' radius={[9,9,3,3]}/></BarChart></ResponsiveContainer></div></CardContent></Card>
            <LeadsPanel english={english} />
          </div>
        )}
        {moduleId === 'groups' && (
          <Card>
            <CardHeader className='border-b bg-gradient-to-r from-primary/[0.08] via-transparent to-sky-500/[0.08] py-3'>
              <CardTitle className='text-base leading-5'>
                {english ? 'Groups & learners' : 'Guruhlar va o‘quvchilar'}
              </CardTitle>
              <p className='mt-1 text-xs text-muted-foreground'>
                {english
                  ? 'Select a group to see its learners and schedule.'
                  : 'Guruhni tanlab, o‘quvchilar va jadvalini ko‘ring.'}
              </p>
            </CardHeader>
            <CardContent className='grid gap-4 p-4 lg:grid-cols-[1fr_1.1fr]'>
              <div className='grid gap-3'>
                {groups.map((group) => (
                  <button
                    type='button'
                    key={group.name}
                    onClick={() => setSelectedGroupName(group.name)}
                    className={`group rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md ${selectedGroupName === group.name ? 'border-primary bg-primary/[0.07] shadow-sm' : 'bg-card'}`}
                  >
                    <div className='flex items-start justify-between gap-3'>
                      <span className='flex size-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary'>
                        {group.name.slice(0, 2)}
                      </span>
                      <span className='rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300'>
                        {english
                          ? group.status
                          : group.status === 'Active'
                            ? 'Faol'
                            : 'Boshlanmagan'}
                      </span>
                    </div>
                    <p className='mt-3 font-semibold'>{group.name}</p>
                    <p className='text-xs text-muted-foreground'>
                      {group.course}
                    </p>
                    <div className='mt-3 flex items-center justify-between text-xs text-muted-foreground'>
                      <span>{group.teacher}</span>
                      <span>
                        {group.students} {english ? 'learners' : 'o‘quvchi'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              <div className='rounded-2xl border bg-muted/20 p-4'>
                {(() => {
                  const selected =
                    groups.find((group) => group.name === selectedGroupName) ??
                    groups[0]
                  const learners = crm.students.filter((student) =>
                    crm.groups
                      .find((item) => item.name === selected.name)
                      ?.studentIds.includes(student.id)
                  )
                  return (
                    <>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='text-lg font-bold'>{selected.name}</p>
                          <p className='text-xs text-muted-foreground'>
                            {selected.course} · {selected.schedule}
                          </p>
                        </div>
                        <span className='rounded-xl bg-primary/10 px-3 py-2 text-xs font-semibold text-primary'>
                          {learners.length} {english ? 'learners' : 'o‘quvchi'}
                        </span>
                      </div>
                      <div className='mt-4 space-y-2'>
                        {learners.map((student) => (
                          <div
                            key={student.id}
                            className='flex items-center justify-between rounded-xl border bg-card p-3'
                          >
                            <div className='flex items-center gap-3'>
                              <span className='flex size-8 items-center justify-center rounded-full bg-sky-500/10 text-xs font-bold text-sky-700 dark:text-sky-300'>
                                {student.name
                                  .split(' ')
                                  .map((part) => part[0])
                                  .join('')
                                  .slice(0, 2)}
                              </span>
                              <div>
                                <p className='text-sm font-semibold'>
                                  {student.name}
                                </p>
                                <p className='text-xs text-muted-foreground'>
                                  {student.email}
                                </p>
                              </div>
                            </div>
                            <span className='text-xs font-semibold text-emerald-600 dark:text-emerald-400'>
                              {student.attendance}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )
                })()}
              </div>
            </CardContent>
          </Card>
        )}
        {moduleId === 'teachers' && (
          <div className='space-y-5'>
          <div className='grid gap-4 sm:grid-cols-3'>
            <Card className='bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-teal-500/15'><CardContent className='pt-5'><p className='text-xs text-muted-foreground'>{english ? 'Active teachers' : 'Faol o‘qituvchilar'}</p><p className='mt-1 text-2xl font-bold'>{teacherRows.length}</p><p className='mt-1 text-xs text-emerald-600'>{english ? 'Teaching this week' : 'Shu hafta darsda'}</p></CardContent></Card>
            <Card className='bg-gradient-to-br from-violet-500/20 via-violet-500/10 to-fuchsia-500/15'><CardContent className='pt-5'><p className='text-xs text-muted-foreground'>{english ? 'Learners covered' : 'Qamrab olingan o‘quvchi'}</p><p className='mt-1 text-2xl font-bold'>{teacherRows.reduce((sum, teacher) => sum + teacher.students, 0)}</p><p className='mt-1 text-xs text-violet-600'>{english ? 'Across assigned groups' : 'Biriktirilgan guruhlar bo‘yicha'}</p></CardContent></Card>
            <Card className='bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-orange-500/15'><CardContent className='pt-5'><p className='text-xs text-muted-foreground'>{english ? 'Schedule coverage' : 'Jadval qamrovi'}</p><p className='mt-1 text-2xl font-bold'>94%</p><p className='mt-1 text-xs text-amber-600'>{english ? 'Weekly teaching plan' : 'Haftalik dars rejasi'}</p></CardContent></Card>
          </div>
          <Card>
            <CardHeader className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <CardTitle>
                  {english ? 'Teacher management' : 'O‘qituvchilar boshqaruvi'}
                </CardTitle>
                <p className='mt-1 text-xs text-muted-foreground'>
                  {english
                    ? 'Teachers and their group schedules.'
                    : 'O‘qituvchilar va ularning guruhlari.'}
                </p>
              </div>
              <Button
                size='sm'
                className='gap-1.5'
                onClick={() => setTeacherDialogOpen(true)}
              >
                <Plus className='size-4' />
                {english ? 'Add teacher' : 'O‘qituvchi qo‘shish'}
              </Button>
            </CardHeader>
            <CardContent>
              <div className='overflow-x-auto rounded-lg border'>
                <table className='w-full min-w-[750px] border-collapse text-left text-sm'>
                  <thead>
                    <tr className='border-b bg-muted/40 text-xs font-medium text-muted-foreground'>
                      <th className='px-4 py-3'>
                        {english ? 'Teacher' : 'O‘qituvchi'}
                      </th>
                      <th className='px-4 py-3'>
                        {english
                          ? 'Specialization / Courses'
                          : 'Yo‘nalish / Kurslar'}
                      </th>
                      <th className='px-4 py-3'>
                        {english
                          ? 'Groups & Students'
                          : 'Guruhlar va o‘quvchilar'}
                      </th>
                      <th className='px-4 py-3'>
                        {english ? 'Schedule' : 'Dars jadvali'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y'>
                    {teacherRows.map((teacher, index) => (
                      <tr
                        key={teacher.name}
                        className='transition-colors hover:bg-muted/30'
                      >
                        <td className='px-4 py-3.5'>
                          <div className='flex items-center gap-3'>
                            <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${index % 3 === 0 ? 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300' : index % 3 === 1 ? 'bg-violet-500/12 text-violet-700 dark:text-violet-300' : 'bg-amber-500/12 text-amber-700 dark:text-amber-300'}`}>
                              {teacher.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)}
                            </div>
                            <div>
                              <strong className='font-semibold text-foreground'>
                                {teacher.name}
                              </strong>
                              <p className='text-xs text-muted-foreground'>
                                {teacher.email} · {teacher.phone}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className='px-4 py-3.5 text-xs font-medium'>
                          {teacher.courses}
                        </td>
                        <td className='px-4 py-3.5 text-xs'>
                          {teacher.groups} · {teacher.students}{' '}
                          {english ? 'students' : 'o‘quvchi'}
                        </td>
                        <td className='px-4 py-3.5 font-mono text-xs text-muted-foreground'>
                          {teacher.schedule}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          </div>
        )}
        {moduleId === 'schedule' && (
          <Card>
            <CardHeader className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <CardTitle>
                  {english ? 'Academy schedule' : 'Academy jadvali'}
                </CardTitle>
                <p className='mt-1 text-xs text-muted-foreground'>
                  {english
                    ? 'Lesson timetables and room assignments.'
                    : 'Dars jadvali va xonalar taqsimoti.'}
                </p>
              </div>
              <div className='flex gap-1.5 rounded-lg border bg-muted/30 p-1'>
                <Button
                  variant={scheduleMode === 'day' ? 'default' : 'ghost'}
                  size='sm'
                  className='h-8 text-xs'
                  onClick={() => setScheduleMode('day')}
                >
                  {english ? 'Day' : 'Kun'}
                </Button>
                <Button
                  variant={scheduleMode === 'week' ? 'default' : 'ghost'}
                  size='sm'
                  className='h-8 text-xs'
                  onClick={() => setScheduleMode('week')}
                >
                  {english ? 'Week' : 'Hafta'}
                </Button>
                <Button
                  variant={scheduleMode === 'month' ? 'default' : 'ghost'}
                  size='sm'
                  className='h-8 text-xs'
                  onClick={() => setScheduleMode('month')}
                >
                  {english ? 'Month' : 'Oy'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='mb-5 grid gap-3 sm:grid-cols-3'>
                <div className='rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/15 via-primary/8 to-sky-500/10 p-4'><p className='text-xs text-muted-foreground'>{english ? 'Scheduled sessions' : 'Rejalashtirilgan darslar'}</p><p className='mt-1 text-2xl font-bold'>{visibleScheduleRows.length}</p><p className='mt-1 text-xs text-primary'>{english ? 'Visible in this view' : 'Ushbu ko‘rinishda'}</p></div>
                <div className='rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/15 via-emerald-500/8 to-teal-500/10 p-4'><p className='text-xs text-muted-foreground'>{english ? 'Room coverage' : 'Xona qamrovi'}</p><p className='mt-1 text-2xl font-bold'>96%</p><p className='mt-1 text-xs text-emerald-600'>{english ? 'Rooms assigned' : 'Xonalar biriktirilgan'}</p></div>
                <div className='rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/15 via-violet-500/8 to-fuchsia-500/10 p-4'><p className='text-xs text-muted-foreground'>{english ? 'Teacher load' : 'O‘qituvchi yuklamasi'}</p><p className='mt-1 text-2xl font-bold'>84%</p><p className='mt-1 text-xs text-violet-600'>{english ? 'Balanced this week' : 'Shu hafta muvozanatlangan'}</p></div>
              </div>
              <div className='mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
                {visibleScheduleRows.slice(0, 6).map((row, index) => <div key={`${row[0]}-${row[4]}`} className='rounded-2xl border border-primary/15 bg-gradient-to-br from-card via-primary/[0.04] to-violet-500/[0.08] p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md'><div className='flex items-center justify-between'><Badge variant={index === 0 ? 'default' : 'secondary'}>{index === 0 ? (english ? 'Next' : 'Keyingi') : (english ? 'Planned' : 'Reja')}</Badge><span className='text-xs font-semibold text-muted-foreground'>{row[4]}</span></div><p className='mt-3 font-semibold'>{row[0]}</p><p className='mt-1 text-xs text-muted-foreground'>{row[1]} · {row[2]}</p><div className='mt-3 flex items-center justify-between rounded-xl bg-muted/30 px-3 py-2 text-xs'><span>{row[5]}–{row[6]}</span><span>{english ? 'Room' : 'Xona'} {row[3]}</span></div></div>)}
              </div>
              <div className='overflow-x-auto rounded-2xl border shadow-sm'>
                <table className='w-full min-w-[750px] border-collapse text-left text-sm'>
                  <thead>
                    <tr className='border-b bg-muted/40 text-xs font-medium text-muted-foreground'>
                      <th className='px-4 py-3'>
                        {english ? 'Course' : 'Kurs'}
                      </th>
                      <th className='px-4 py-3'>
                        {english ? 'Group' : 'Guruh'}
                      </th>
                      <th className='px-4 py-3'>
                        {english ? 'Teacher' : 'O‘qituvchi'}
                      </th>
                      <th className='px-4 py-3'>{english ? 'Room' : 'Xona'}</th>
                      <th className='px-4 py-3'>{english ? 'Date' : 'Sana'}</th>
                      <th className='px-4 py-3'>
                        {english ? 'Start' : 'Boshlanish'}
                      </th>
                      <th className='px-4 py-3'>
                        {english ? 'End' : 'Tugash'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y'>
                    {visibleScheduleRows.map((row) => (
                      <tr
                        key={`${row[1]}-${row[4]}`}
                        className='transition-colors hover:bg-muted/30'
                      >
                        <td className='px-4 py-3.5 text-xs font-medium'>
                          {row[0]}
                        </td>
                        <td className='px-4 py-3.5 text-xs'>
                          <span className='rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]'>
                            {row[1]}
                          </span>
                        </td>
                        <td className='px-4 py-3.5 text-xs font-medium'>
                          {row[2]}
                        </td>
                        <td className='px-4 py-3.5 text-xs text-muted-foreground'>
                          {row[3]}
                        </td>
                        <td className='px-4 py-3.5 font-mono text-xs text-muted-foreground'>
                          {row[4]}
                        </td>
                        <td className='px-4 py-3.5 text-xs font-medium'>
                          {row[5]}
                        </td>
                        <td className='px-4 py-3.5 text-xs text-muted-foreground'>
                          {row[6]}
                        </td>
                      </tr>
                    ))}
                    {visibleScheduleRows.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className='py-8 text-center text-sm text-muted-foreground'
                        >
                          {english
                            ? 'No lessons scheduled for this day.'
                            : 'Bu kun uchun darslar rejalashtirilmagan.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
        {moduleId === 'attendance' &&
          (() => {
            const selectedGroup = crm.groups.find(
              (g) => g.id === selectedAttendanceGroupId
            )
            const displayedStudents =
              selectedAttendanceGroupId === 'all'
                ? crm.students
                : crm.students.filter(
                    (s) =>
                      s.groupId === selectedAttendanceGroupId ||
                      (selectedGroup && selectedGroup.studentIds.includes(s.id))
                  )

            return (
              <div className='space-y-5'>
                {/* 1. Guruh tanlash qismi */}
                <Card className='border-border/70 shadow-sm'>
                  <CardHeader className='pb-3'>
                    <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                      <div>
                        <CardTitle className='flex items-center gap-2 text-base font-semibold'>
                          <UsersRound className='size-4 text-primary' />
                          {english
                            ? 'Select Group for Attendance'
                            : 'Davomat uchun guruhni tanlang'}
                        </CardTitle>
                        <p className='mt-0.5 text-xs text-muted-foreground'>
                          {english
                            ? 'Choose a teacher’s group to view its learners and record today’s attendance.'
                            : 'O‘qituvchining guruhini tanlang, o‘quvchilar ro‘yxati chiqadi va shu yerda davomat belgilanadi.'}
                        </p>
                      </div>
                      <span className='rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary'>
                        {new Date().toLocaleDateString(
                          english ? 'en-US' : 'uz-UZ',
                          {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          }
                        )}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
                      {/* Barcha guruhlar kartasi */}
                      <button
                        type='button'
                        onClick={() => setSelectedAttendanceGroupId('all')}
                        className={`flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all ${
                          selectedAttendanceGroupId === 'all'
                            ? 'border-primary bg-primary/[0.06] shadow-xs ring-1 ring-primary/30'
                            : 'border-border/70 bg-card hover:border-primary/40 hover:bg-muted/30'
                        }`}
                      >
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-semibold'>
                            {english ? 'All groups' : 'Barcha guruhlar'}
                          </span>
                          <Badge
                            variant={
                              selectedAttendanceGroupId === 'all'
                                ? 'default'
                                : 'secondary'
                            }
                            className='text-[10px]'
                          >
                            {crm.students.length}{' '}
                            {english ? 'students' : 'o‘quvchi'}
                          </Badge>
                        </div>
                        <p className='mt-2 text-xs text-muted-foreground'>
                          {english
                            ? 'All active learners across academy'
                            : 'Akademiyadagi barcha faol o‘quvchilar'}
                        </p>
                      </button>

                      {/* Guruhlar bo'yicha kartalar */}
                      {crm.groups.map((grp) => {
                        const isSelected = selectedAttendanceGroupId === grp.id
                        const grpStudentsCount = crm.students.filter(
                          (s) =>
                            s.groupId === grp.id ||
                            grp.studentIds.includes(s.id)
                        ).length

                        return (
                          <button
                            key={grp.id}
                            type='button'
                            onClick={() => setSelectedAttendanceGroupId(grp.id)}
                            className={`flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all ${
                              isSelected
                                ? 'border-primary bg-primary/[0.06] shadow-xs ring-1 ring-primary/30'
                                : 'border-border/70 bg-card hover:border-primary/40 hover:bg-muted/30'
                            }`}
                          >
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center gap-2'>
                                <span className='flex size-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary'>
                                  {grp.name.slice(0, 2)}
                                </span>
                                <div>
                                  <span className='text-sm leading-tight font-semibold'>
                                    {grp.name}
                                  </span>
                                  <p className='text-[11px] leading-tight text-muted-foreground'>
                                    {grp.course}
                                  </p>
                                </div>
                              </div>
                              <Badge
                                variant={isSelected ? 'default' : 'outline'}
                                className='text-[10px]'
                              >
                                {grpStudentsCount}{' '}
                                {english ? 'students' : 'o‘quvchi'}
                              </Badge>
                            </div>
                            <div className='mt-3 flex items-center justify-between border-t border-border/40 pt-2 text-[11px] text-muted-foreground'>
                              <span>{grp.teacher}</span>
                              <span>{grp.schedule}</span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* 2. Bugungi Davomat Asosiy Card */}
                <Card className='border-border/70 shadow-sm'>
                  <CardHeader className='flex flex-col gap-2 border-b bg-gradient-to-r from-emerald-500/[0.06] via-transparent to-amber-500/[0.06] py-3 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                      <CardTitle className='flex items-center gap-2.5 text-base leading-5'>
                        <span className='flex size-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 shadow-xs dark:text-emerald-400'>
                          <CheckCircle2 className='size-4' />
                        </span>
                        <span>
                          {selectedGroup
                            ? `${selectedGroup.name} — ${english ? 'Attendance' : 'Davomat'}`
                            : english
                              ? 'Today’s attendance'
                              : 'Bugungi davomat'}
                        </span>
                      </CardTitle>
                      <p className='mt-1 text-xs text-muted-foreground'>
                        {selectedGroup
                          ? `${selectedGroup.course} · ${selectedGroup.teacher} · ${selectedGroup.schedule}`
                          : english
                            ? 'Click the checkbox on any learner to mark attendance status.'
                            : 'Davomat holatini belgilash uchun o‘quvchi yonidagi chekboxni bosing.'}
                      </p>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        className='gap-1.5 border-emerald-500/30 text-xs text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300'
                        onClick={() => {
                          const updated: Record<
                            string,
                            'present' | 'late' | 'absent' | 'excused'
                          > = {}
                          displayedStudents.forEach((st) => {
                            updated[st.id] = 'present'
                          })
                          setAttendanceStatuses((prev) => ({
                            ...prev,
                            ...updated,
                          }))
                          toast.success(
                            english
                              ? 'All learners in group marked as Present.'
                              : 'Guruhdagi barcha o‘quvchilar "Kelgan" deb belgilandi.'
                          )
                        }}
                      >
                        <CheckCheck className='size-3.5 text-emerald-600 dark:text-emerald-400' />
                        {english
                          ? 'Mark all present'
                          : 'Barchasini kelgan qilish'}
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className='space-y-4 pt-4'>
                    {/* 4 Ta Status Metrika Kartasi */}
                    <div className='grid gap-3 sm:grid-cols-4'>
                      {[
                        {
                          key: 'present',
                          Icon: Check,
                          label: english ? 'Present' : 'Kelgan',
                          card: 'border-emerald-500/20 bg-emerald-500/[0.06] dark:bg-emerald-500/[0.08]',
                          text: 'text-emerald-700 dark:text-emerald-300',
                          icon: 'text-emerald-600 dark:text-emerald-400',
                        },
                        {
                          key: 'late',
                          Icon: Clock3,
                          label: english ? 'Late' : 'Kechikkan',
                          card: 'border-amber-500/20 bg-amber-500/[0.06] dark:bg-amber-500/[0.08]',
                          text: 'text-amber-700 dark:text-amber-300',
                          icon: 'text-amber-600 dark:text-amber-400',
                        },
                        {
                          key: 'absent',
                          Icon: X,
                          label: english ? 'Absent' : 'Kelmagan',
                          card: 'border-rose-500/20 bg-rose-500/[0.06] dark:bg-rose-500/[0.08]',
                          text: 'text-rose-700 dark:text-rose-300',
                          icon: 'text-rose-600 dark:text-rose-400',
                        },
                        {
                          key: 'excused',
                          Icon: CircleHelp,
                          label: english ? 'Excused' : 'Sababli',
                          card: 'border-sky-500/20 bg-sky-500/[0.06] dark:bg-sky-500/[0.08]',
                          text: 'text-sky-700 dark:text-sky-300',
                          icon: 'text-sky-600 dark:text-sky-400',
                        },
                      ].map(({ key, Icon, label, card, text, icon }) => {
                        const count = displayedStudents.filter(
                          (student) =>
                            (attendanceStatuses[student.id] ?? 'present') ===
                            key
                        ).length
                        return (
                          <div
                            key={key}
                            className={`rounded-xl border p-3.5 transition-all ${card}`}
                          >
                            <div className='flex items-center justify-between'>
                              <span className={`text-xs font-semibold ${text}`}>
                                {label}
                              </span>
                              <span className='flex size-6 items-center justify-center rounded-lg bg-background/80 shadow-2xs'>
                                <Icon className={`size-3.5 ${icon}`} />
                              </span>
                            </div>
                            <p className='mt-2 text-2xl font-bold tracking-tight'>
                              {count}
                            </p>
                          </div>
                        )
                      })}
                    </div>

                    {/* Davomat Jadvali */}
                    <div className='overflow-x-auto rounded-xl border border-border/70 bg-card shadow-2xs'>
                      <table className='w-full min-w-[680px] text-left text-sm'>
                        <thead className='border-b bg-muted/40 text-xs font-medium text-muted-foreground'>
                          <tr>
                            <th className='px-4 py-3'>
                              {english ? 'Learner' : 'O‘quvchi'}
                            </th>
                            <th className='px-4 py-3'>
                              {english ? 'Group' : 'Guruh'}
                            </th>
                            <th className='px-4 py-3'>
                              {english ? 'Attendance' : 'Davomat'}
                            </th>
                            <th className='px-4 py-3'>
                              {english ? 'Lesson time' : 'Dars vaqti'}
                            </th>
                          </tr>
                        </thead>
                        <tbody className='divide-y divide-border/60'>
                          {displayedStudents.map((student) => {
                            const status =
                              attendanceStatuses[student.id] ?? 'present'
                            return (
                              <tr
                                key={student.id}
                                className='transition-colors hover:bg-muted/20'
                              >
                                <td className='px-4 py-3'>
                                  <div className='flex items-center gap-3'>
                                    <span className='flex size-9 items-center justify-center rounded-xl bg-primary/10 text-xs font-semibold text-primary shadow-2xs'>
                                      {student.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')
                                        .slice(0, 2)}
                                    </span>
                                    <div>
                                      <p className='text-sm font-semibold'>
                                        {student.name}
                                      </p>
                                      <p className='text-xs text-muted-foreground'>
                                        {student.course}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className='px-4 py-3'>
                                  <span className='rounded-md border border-border/80 bg-muted/60 px-2.5 py-1 text-xs font-medium'>
                                    {crm.groups.find(
                                      (group) => group.id === student.groupId
                                    )?.name ?? '—'}
                                  </span>
                                </td>
                                <td className='px-4 py-3'>
                                  <AttendanceStatusCheckbox
                                    value={status}
                                    onChange={(next) => {
                                      setAttendanceStatuses((current) => ({
                                        ...current,
                                        [student.id]: next,
                                      }))
                                    }}
                                    studentName={student.name}
                                    locale={english ? 'en' : 'uz'}
                                  />
                                </td>
                                <td className='px-4 py-3 text-xs text-muted-foreground'>
                                  {crm.groups.find(
                                    (group) => group.id === student.groupId
                                  )?.schedule ??
                                    (english
                                      ? 'Du-Chor-Ju · 18:00'
                                      : 'Du-Chor-Ju · 18:00')}
                                </td>
                              </tr>
                            )
                          })}
                          {displayedStudents.length === 0 && (
                            <tr>
                              <td
                                colSpan={4}
                                className='py-8 text-center text-sm text-muted-foreground'
                              >
                                {english
                                  ? 'No learners found in this group.'
                                  : 'Ushbu guruhda o‘quvchilar topilmadi.'}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className='mt-5 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]'>
                      <Card className='overflow-hidden'>
                        <CardHeader className='border-b bg-gradient-to-r from-emerald-500/[0.07] via-card to-primary/[0.04]'><CardTitle className='text-base'>{english ? 'Attendance trend' : 'Davomat dinamikasi'}</CardTitle><CardDescription>{english ? 'Last month vs current month by weekly checkpoints.' : 'O‘tgan oy va joriy oy haftalik ko‘rsatkichlari.'}</CardDescription></CardHeader>
                        <CardContent className='p-4'><div className='h-[220px]'><ResponsiveContainer width='100%' height='100%'><AreaChart data={[{week:'1',last:86,current:90},{week:'2',last:88,current:92},{week:'3',last:87,current:91},{week:'4',last:89,current:94}]}><defs><linearGradient id='attendanceTrend' x1='0' y1='0' x2='0' y2='1'><stop offset='5%' stopColor='#10b981' stopOpacity={0.28}/><stop offset='95%' stopColor='#10b981' stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray='3 3' vertical={false}/><XAxis dataKey='week'/><YAxis domain={[70,100]} tickFormatter={(v) => `${v}%`}/><RechartsTooltip formatter={(value,name) => [`${value}%`, name === 'current' ? (english ? 'Current month' : 'Joriy oy') : (english ? 'Last month' : 'O‘tgan oy')]}/><Area type='monotone' dataKey='last' stroke='#94a3b8' fill='none' strokeDasharray='6 4' strokeWidth={2}/><Area type='monotone' dataKey='current' stroke='#10b981' fill='url(#attendanceTrend)' strokeWidth={3}/></AreaChart></ResponsiveContainer></div></CardContent>
                      </Card>
                      <Card><CardHeader><CardTitle className='text-base'>{english ? 'Top attendance learners' : 'Top davomatli o‘quvchilar'}</CardTitle><CardDescription>{english ? 'Highest current attendance rates.' : 'Joriy davomat ko‘rsatkichi eng yuqori o‘quvchilar.'}</CardDescription></CardHeader><CardContent className='space-y-3'>{[...displayedStudents].sort((a,b) => b.attendance - a.attendance).slice(0,4).map((student,index) => <div key={student.id} className='flex items-center gap-3 rounded-xl border p-3'><span className='flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-xs font-bold text-emerald-700 dark:text-emerald-300'>{index + 1}</span><div className='min-w-0 flex-1'><p className='truncate text-sm font-semibold'>{student.name}</p><p className='text-[11px] text-muted-foreground'>{student.course}</p></div><span className='font-bold text-emerald-600'>{student.attendance}%</span></div>)}</CardContent></Card>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })()}
        {moduleId === 'finance' && (
          <div className='space-y-5'>
            {/* Top Financial KPI Cards */}
            <div className='grid gap-4 sm:grid-cols-3'>
              <Card className='border-border/70 shadow-sm'>
                <CardContent className='pt-5'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-xs font-medium text-muted-foreground'>
                        {english
                          ? 'Total Revenue (September)'
                          : 'Jami tushum (Sentyabr)'}
                      </p>
                      <p className='mt-1 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400'>
                        58,400,000 so‘m
                      </p>
                    </div>
                    <span className='flex size-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'>
                      <Wallet className='size-5' />
                    </span>
                  </div>
                  <div className='mt-3 flex items-center gap-1.5 text-xs text-muted-foreground'>
                    <span className='font-semibold text-emerald-600'>
                      +12.4%
                    </span>
                    <span>
                      {english ? 'from last month' : 'o‘tgan oyga nisbatan'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className='border-border/70 shadow-sm'>
                <CardContent className='pt-5'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-xs font-medium text-muted-foreground'>
                        {english
                          ? 'Recorded Transactions'
                          : 'Qayd etilgan to‘lovlar'}
                      </p>
                      <p className='mt-1 text-2xl font-bold tracking-tight'>
                        {crm.payments.length + 3} ta
                      </p>
                    </div>
                    <span className='flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary'>
                      <CreditCard className='size-5' />
                    </span>
                  </div>
                  <div className='mt-3 flex items-center gap-1.5 text-xs text-muted-foreground'>
                    <span className='font-semibold text-primary'>94%</span>
                    <span>
                      {english ? 'collection rate' : 'yig‘ish darajasi'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className='border-border/70 shadow-sm'>
                <CardContent className='pt-5'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-xs font-medium text-muted-foreground'>
                        {english ? 'Pending / Debt' : 'Qarzdorlik / Kutilmoqda'}
                      </p>
                      <p className='mt-1 text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400'>
                        1,650,000 so‘m
                      </p>
                    </div>
                    <span className='flex size-10 items-center justify-center rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400'>
                      <TrendingUp className='size-5' />
                    </span>
                  </div>
                  <div className='mt-3 flex items-center gap-1.5 text-xs text-muted-foreground'>
                    <span className='font-semibold text-rose-600'>3 nafar</span>
                    <span>
                      {english
                        ? 'debtor students'
                        : 'o‘quvchida muddat kechikkan'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Transactions Card */}
            <Card className='border-border/70 shadow-sm'>
              <CardHeader className='flex flex-col gap-3 border-b bg-gradient-to-r from-emerald-500/[0.06] via-transparent to-violet-500/[0.06] py-4 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                  <CardTitle className='text-base font-semibold'>
                    {english
                      ? 'Payment Activity & History'
                      : 'To‘lovlar faoliyati va tarixi'}
                  </CardTitle>
                  <p className='mt-0.5 text-xs text-muted-foreground'>
                    {english
                      ? 'Detailed log of course tuition fees, payment methods, and receipt status.'
                      : 'O‘quvchilar to‘lovlari, to‘lov usullari va chek holatlari haqida batafsil ma’lumot.'}
                  </p>
                </div>
                <div className='flex items-center gap-2'>
                  <Button
                    size='sm'
                    variant='outline'
                    className='gap-1.5 text-xs'
                    onClick={() => {
                      toast.success(
                        english
                          ? 'Receipts export generated.'
                          : 'To‘lov cheklari hisoboti yuklab olindi.'
                      )
                    }}
                  >
                    <Download className='size-3.5' />
                    {english ? 'Export Statement' : 'Hisobotni yuklash'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className='p-4'>
                <div className='overflow-x-auto rounded-xl border border-border/70 bg-card'>
                  <table className='w-full min-w-[700px] text-left text-sm'>
                    <thead className='border-b bg-muted/40 text-xs font-medium text-muted-foreground'>
                      <tr>
                        <th className='px-4 py-3'>
                          {english ? 'Learner & Course' : 'O‘quvchi va kurs'}
                        </th>
                        <th className='px-4 py-3'>
                          {english ? 'Invoice' : 'Hisob raqam'}
                        </th>
                        <th className='px-4 py-3'>
                          {english ? 'Amount' : 'Summa'}
                        </th>
                        <th className='px-4 py-3'>
                          {english ? 'Method' : 'Usul'}
                        </th>
                        <th className='px-4 py-3'>
                          {english ? 'Date & Time' : 'Sana va vaqt'}
                        </th>
                        <th className='px-4 py-3'>
                          {english ? 'Status' : 'Holati'}
                        </th>
                        <th className='px-4 py-3 text-end'>
                          {english ? 'Action' : 'Amal'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-border/60'>
                      {localizedPaymentRows.map((row, index) => {
                        const methods = ['Click', 'Payme', 'Karta']
                        const method = methods[index % methods.length]
                        const isPaid =
                          row[4] === (english ? 'Paid' : 'To‘langan')
                        const isPartial = row[4].includes(
                          english ? 'Part' : 'Qisman'
                        )
                        const invNumber = `INV-2026-00${index + 1}`

                        return (
                          <tr
                            key={row[0]}
                            className='transition-colors hover:bg-muted/20'
                          >
                            <td className='px-4 py-3'>
                              <div className='flex items-center gap-3'>
                                <span className='flex size-8 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary'>
                                  {row[0].slice(0, 2)}
                                </span>
                                <div>
                                  <p className='text-sm font-semibold'>
                                    {row[0]}
                                  </p>
                                  <p className='text-xs text-muted-foreground'>
                                    {row[1]}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className='px-4 py-3 font-mono text-xs text-muted-foreground'>
                              {invNumber}
                            </td>
                            <td className='px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400'>
                              {row[3]}
                            </td>
                            <td className='px-4 py-3'>
                              <span className='inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/50 px-2 py-0.5 text-xs font-medium'>
                                <CreditCard className='size-3 text-muted-foreground' />
                                {method}
                              </span>
                            </td>
                            <td className='px-4 py-3 font-mono text-xs text-muted-foreground'>
                              14 Sep ·{' '}
                              {index === 0
                                ? '12:20'
                                : index === 1
                                  ? '11:45'
                                  : '10:08'}
                            </td>
                            <td className='px-4 py-3'>
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                  isPaid
                                    ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                    : isPartial
                                      ? 'border border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                                      : 'border border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300'
                                }`}
                              >
                                <span
                                  className={`size-1.5 rounded-full ${
                                    isPaid
                                      ? 'bg-emerald-500'
                                      : isPartial
                                        ? 'bg-amber-500'
                                        : 'bg-rose-500'
                                  }`}
                                />
                                {row[4]}
                              </span>
                            </td>
                            <td className='px-4 py-3 text-end'>
                              <Button
                                size='sm'
                                variant='ghost'
                                className='h-8 text-xs text-muted-foreground hover:text-foreground'
                                onClick={() => {
                                  toast.success(
                                    english
                                      ? `Receipt for ${row[0]} downloaded.`
                                      : `${row[0]} uchun to‘lov kvitansiyasi tayyorlandi.`
                                  )
                                }}
                              >
                                <FileText className='me-1 size-3.5' />
                                {english ? 'Receipt' : 'Chek'}
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {moduleId === 'reports' && (
          <div className='space-y-5'>
            {/* Top Filter & Actions Bar */}
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <h2 className='text-lg font-bold tracking-tight'>
                  {english
                    ? 'Academy Performance Reports'
                    : 'Akademiya faoliyat hisobotlari'}
                </h2>
                <p className='text-xs text-muted-foreground'>
                  {english
                    ? 'Key operational indicators, attendance dynamics, and revenue analytics.'
                    : 'Asosiy operatsion ko‘rsatkichlar, davomat dinamikasi va tushum tahlili.'}
                </p>
              </div>

              <div className='flex flex-wrap items-center gap-2.5'>
                <Select value={reportRange} onValueChange={setReportRange}>
                  <SelectTrigger className='h-9 min-w-32 rounded-lg border-border/70 bg-background shadow-2xs'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    align='end'
                    className='rounded-xl border-border/70 p-1 shadow-xl'
                  >
                    <SelectItem value='today' className='rounded-lg'>
                      {english ? 'Today' : 'Bugun'}
                    </SelectItem>
                    <SelectItem value='7' className='rounded-lg'>
                      {english ? '7 days' : '7 kun'}
                    </SelectItem>
                    <SelectItem value='30' className='rounded-lg'>
                      {english ? '30 days' : '30 kun'}
                    </SelectItem>
                    <SelectItem value='month' className='rounded-lg'>
                      {english ? 'This month' : 'Bu oy'}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant='outline'
                  size='sm'
                  className='h-9 gap-1.5 border-emerald-500/30 text-xs text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300'
                  onClick={exportReport}
                >
                  <FileSpreadsheet className='size-3.5 text-emerald-600 dark:text-emerald-400' />
                  {english ? 'CSV Export' : 'CSV yuklash'}
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-9 gap-1.5 border-rose-500/30 text-xs text-rose-700 hover:bg-rose-500/10 dark:text-rose-300'
                  onClick={printReport}
                >
                  <Printer className='size-3.5 text-rose-500 dark:text-rose-400' />
                  {english ? 'Print / PDF' : 'Chop etish / PDF'}
                </Button>
              </div>
            </div>

            {/* 3 TA ASOSIY CARD (Temur ustoz / Izzatbek talabi bo'yicha) */}
            <div className='grid gap-4 sm:grid-cols-3'>
              {/* 1-Card: Davomat darajasi */}
              <Card className='relative overflow-hidden border-border/70 bg-card p-5 shadow-xs transition-all hover:border-emerald-500/40 hover:shadow-md'>
                <div className='flex items-start justify-between'>
                  <div className='space-y-1'>
                    <p className='text-xs font-semibold tracking-wide text-muted-foreground uppercase'>
                      {english ? 'Overall Attendance' : 'Umumiy davomat'}
                    </p>
                    <div className='flex items-baseline gap-2'>
                      <span className='text-3xl font-bold tracking-tight text-foreground'>
                        91.4%
                      </span>
                      <span className='inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400'>
                        <ArrowUpRight className='size-3' /> +3.2%
                      </span>
                    </div>
                  </div>
                  <span className='flex size-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 shadow-xs dark:text-emerald-400'>
                    <CheckCircle2 className='size-5' />
                  </span>
                </div>
                <div className='mt-4'>
                  <div className='mb-1.5 flex items-center justify-between text-xs text-muted-foreground'>
                    <span>
                      {english ? 'Minimal target: 80%' : 'Minimal talab: 80%'}
                    </span>
                    <span className='font-semibold text-emerald-600 dark:text-emerald-400'>
                      A’lo
                    </span>
                  </div>
                  <Progress
                    value={91.4}
                    className='h-2 bg-muted [&>div]:bg-emerald-500'
                  />
                </div>
              </Card>

              {/* 2-Card: Moliyaviy tushum */}
              <Card className='relative overflow-hidden border-border/70 bg-card p-5 shadow-xs transition-all hover:border-sky-500/40 hover:shadow-md'>
                <div className='flex items-start justify-between'>
                  <div className='space-y-1'>
                    <p className='text-xs font-semibold tracking-wide text-muted-foreground uppercase'>
                      {english ? 'Monthly Revenue' : 'Oylik tushum'}
                    </p>
                    <div className='flex items-baseline gap-2'>
                      <span className='text-3xl font-bold tracking-tight text-foreground'>
                        58.4M
                      </span>
                      <span className='inline-flex items-center gap-0.5 rounded-full bg-sky-500/10 px-2 py-0.5 text-xs font-semibold text-sky-600 dark:text-sky-400'>
                        <ArrowUpRight className='size-3' /> +12.4%
                      </span>
                    </div>
                  </div>
                  <span className='flex size-11 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-600 shadow-xs dark:text-sky-400'>
                    <Wallet className='size-5' />
                  </span>
                </div>
                <div className='mt-4'>
                  <div className='mb-1.5 flex items-center justify-between text-xs text-muted-foreground'>
                    <span>
                      {english ? 'Plan: 62.0M so‘m' : 'Reja: 62.0M so‘m'}
                    </span>
                    <span className='font-semibold text-sky-600 dark:text-sky-400'>
                      94.2%
                    </span>
                  </div>
                  <Progress
                    value={94.2}
                    className='h-2 bg-muted [&>div]:bg-sky-500'
                  />
                </div>
              </Card>

              {/* 3-Card: O'quvchilar va guruhlar */}
              <Card className='relative overflow-hidden border-border/70 bg-card p-5 shadow-xs transition-all hover:border-amber-500/40 hover:shadow-md'>
                <div className='flex items-start justify-between'>
                  <div className='space-y-1'>
                    <p className='text-xs font-semibold tracking-wide text-muted-foreground uppercase'>
                      {english
                        ? 'Learners & Groups'
                        : 'O‘quvchilar va guruhlar'}
                    </p>
                    <div className='flex items-baseline gap-2'>
                      <span className='text-3xl font-bold tracking-tight text-foreground'>
                        54 ta
                      </span>
                      <span className='inline-flex items-center gap-0.5 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400'>
                        <Users className='size-3' /> 2 guruh
                      </span>
                    </div>
                  </div>
                  <span className='flex size-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 shadow-xs dark:text-amber-400'>
                    <GraduationCap className='size-5' />
                  </span>
                </div>
                <div className='mt-4'>
                  <div className='mb-1.5 flex items-center justify-between text-xs text-muted-foreground'>
                    <span>{english ? 'Average score' : 'O‘rtacha baho'}</span>
                    <span className='font-semibold text-amber-600 dark:text-amber-400'>
                      86%
                    </span>
                  </div>
                  <Progress
                    value={86}
                    className='h-2 bg-muted [&>div]:bg-amber-500'
                  />
                </div>
              </Card>
            </div>

            {/* GRAFIK (Temur ustoz / Izzatbek talabi bo'yicha) */}
            <Card className='border-border/70 shadow-sm'>
              <CardHeader className='flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                  <CardTitle className='flex items-center gap-2 text-base font-semibold'>
                    <BarChart3 className='size-4 text-primary' />
                    {english
                      ? 'Performance Dynamics Chart'
                      : 'Faoliyat dinamikasi grafigi'}
                  </CardTitle>
                  <p className='mt-0.5 text-xs text-muted-foreground'>
                    {english
                      ? 'Interactive trend analysis for the selected reporting period.'
                      : 'Tanlangan hisobot davri bo‘yicha davomat va tushum ko‘rsatkichlari grafigi.'}
                  </p>
                </div>

                {/* Grafik tablari */}
                <div className='flex items-center gap-1 rounded-lg border border-border/80 bg-muted/40 p-1'>
                  <button
                    type='button'
                    onClick={() => setAttendanceChartTab('attendance')}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                      attendanceChartTab === 'attendance'
                        ? 'bg-background text-foreground shadow-2xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {english ? 'Attendance %' : 'Davomat %'}
                  </button>
                  <button
                    type='button'
                    onClick={() => setAttendanceChartTab('revenue')}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                      attendanceChartTab === 'revenue'
                        ? 'bg-background text-foreground shadow-2xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {english ? 'Revenue (mln)' : 'Tushum (mln)'}
                  </button>
                </div>
              </CardHeader>

              <CardContent className='pt-6'>
                <div className='h-[300px] w-full'>
                  <ResponsiveContainer width='100%' height='100%'>
                    {attendanceChartTab === 'attendance' ? (
                      <AreaChart
                        data={[
                          {
                            name: english ? 'Mon' : 'Dush',
                            value: 92,
                            target: 80,
                          },
                          {
                            name: english ? 'Tue' : 'Sesh',
                            value: 88,
                            target: 80,
                          },
                          {
                            name: english ? 'Wed' : 'Chor',
                            value: 95,
                            target: 80,
                          },
                          {
                            name: english ? 'Thu' : 'Pay',
                            value: 90,
                            target: 80,
                          },
                          {
                            name: english ? 'Fri' : 'Jum',
                            value: 94,
                            target: 80,
                          },
                          {
                            name: english ? 'Sat' : 'Shan',
                            value: 89,
                            target: 80,
                          },
                          {
                            name: english ? 'Sun' : 'Yak',
                            value: 91,
                            target: 80,
                          },
                        ]}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id='attendanceGradient'
                            x1='0'
                            y1='0'
                            x2='0'
                            y2='1'
                          >
                            <stop
                              offset='5%'
                              stopColor='rgb(16, 185, 129)'
                              stopOpacity={0.4}
                            />
                            <stop
                              offset='95%'
                              stopColor='rgb(16, 185, 129)'
                              stopOpacity={0.0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray='3 3'
                          vertical={false}
                          opacity={0.3}
                        />
                        <XAxis
                          dataKey='name'
                          tickLine={false}
                          axisLine={false}
                          fontSize={12}
                        />
                        <YAxis
                          domain={[60, 100]}
                          tickLine={false}
                          axisLine={false}
                          fontSize={12}
                          unit='%'
                        />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: 'var(--popover)',
                            borderColor: 'var(--border)',
                            borderRadius: '12px',
                            color: 'var(--popover-foreground)',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                          }}
                          formatter={(value) => [
                            `${value}%`,
                            english ? 'Attendance' : 'Davomat',
                          ]}
                        />
                        <Area
                          type='monotone'
                          dataKey='value'
                          stroke='rgb(16, 185, 129)'
                          strokeWidth={2.5}
                          fill='url(#attendanceGradient)'
                        />
                      </AreaChart>
                    ) : (
                      <AreaChart
                        data={[
                          { name: '1-hafta', value: 12.5 },
                          { name: '2-hafta', value: 14.8 },
                          { name: '3-hafta', value: 16.2 },
                          { name: '4-hafta', value: 14.9 },
                        ]}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id='revenueGradient'
                            x1='0'
                            y1='0'
                            x2='0'
                            y2='1'
                          >
                            <stop
                              offset='5%'
                              stopColor='var(--primary)'
                              stopOpacity={0.4}
                            />
                            <stop
                              offset='95%'
                              stopColor='var(--primary)'
                              stopOpacity={0.0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray='3 3'
                          vertical={false}
                          opacity={0.3}
                        />
                        <XAxis
                          dataKey='name'
                          tickLine={false}
                          axisLine={false}
                          fontSize={12}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          fontSize={12}
                          unit='M'
                        />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: 'var(--popover)',
                            borderColor: 'var(--border)',
                            borderRadius: '12px',
                            color: 'var(--popover-foreground)',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                          }}
                          formatter={(value) => [
                            `${value} mln so‘m`,
                            english ? 'Revenue' : 'Tushum',
                          ]}
                        />
                        <Area
                          type='monotone'
                          dataKey='value'
                          stroke='var(--primary)'
                          strokeWidth={2.5}
                          fill='url(#revenueGradient)'
                        />
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Qolgan ko'rsatkichlar */}
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              {[
                {
                  label: english ? 'Course performance' : 'Kurslar natijasi',
                  value: '86%',
                  progress: 86,
                  color: 'text-primary',
                },
                {
                  label: english
                    ? 'Group performance'
                    : 'Guruhlar ko‘rsatkichi',
                  value: '91%',
                  progress: 91,
                  color: 'text-emerald-600',
                },
                {
                  label: english
                    ? 'Teacher performance'
                    : 'O‘qituvchilar bahosi',
                  value: '94%',
                  progress: 94,
                  color: 'text-sky-600',
                },
                {
                  label: english ? 'Debt index' : 'Qarzdorlik indeksi',
                  value: '1.6M',
                  progress: 15,
                  color: 'text-rose-600',
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className='rounded-xl border border-border/70 bg-card p-4 shadow-2xs'
                >
                  <p className='text-xs text-muted-foreground'>{item.label}</p>
                  <p className={`mt-1 text-2xl font-bold ${item.color}`}>
                    {item.value}
                  </p>
                  <Progress
                    value={item.progress}
                    className='mt-2.5 h-1.5 bg-muted'
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </Main>
      <Dialog open={teacherDialogOpen} onOpenChange={setTeacherDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>
              {english ? 'Add teacher' : 'O‘qituvchi qo‘shish'}
            </DialogTitle>
          </DialogHeader>
          <div className='grid gap-3'>
            <Input
              placeholder={english ? 'Full name' : 'To‘liq ism'}
              value={newTeacher.name}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, name: e.target.value })
              }
            />
            <Input
              placeholder='Email'
              type='email'
              value={newTeacher.email}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, email: e.target.value })
              }
            />
            <Input
              placeholder={english ? 'Phone' : 'Telefon'}
              value={newTeacher.phone}
              onChange={(e) =>
                setNewTeacher({
                  ...newTeacher,
                  phone: e.target.value.replace(/[^\d+()\s-]/g, ''),
                })
              }
            />
            <Input
              placeholder={english ? 'Course' : 'Kurs'}
              value={newTeacher.course}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, course: e.target.value })
              }
            />
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setTeacherDialogOpen(false)}
            >
              {english ? 'Cancel' : 'Bekor qilish'}
            </Button>
            <Button
              onClick={() => {
                const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                  newTeacher.email
                )
                const phoneOk = /^\+?[0-9 ()-]{9,18}$/.test(newTeacher.phone)
                if (newTeacher.name.trim().length < 3 || !emailOk || !phoneOk) {
                  toast.error(
                    english
                      ? 'Enter a valid name, email and phone.'
                      : 'Ism, email va telefonni to‘g‘ri kiriting.'
                  )
                  return
                }
                setTeacherRows([
                  ...teacherRows,
                  {
                    name: newTeacher.name,
                    email: newTeacher.email,
                    phone: newTeacher.phone,
                    courses:
                      newTeacher.course ||
                      (english ? 'Not assigned' : 'Biriktirilmagan'),
                    groups: english ? 'No groups' : 'Guruh yo‘q',
                    students: 0,
                    schedule: english
                      ? 'Not scheduled'
                      : 'Jadval belgilanmagan',
                  },
                ])
                setNewTeacher({ name: '', email: '', phone: '', course: '' })
                setTeacherDialogOpen(false)
                toast.success(
                  english
                    ? 'Teacher added successfully.'
                    : 'O‘qituvchi muvaffaqiyatli qo‘shildi.'
                )
              }}
            >
              {english ? 'Create' : 'Yaratish'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function academyModulePermission(moduleId: string) {
  const permissions: Record<
    string,
    | 'leads.read'
    | 'groups.read'
    | 'teachers.read'
    | 'groups.manage_schedule'
    | 'students.read'
    | 'payments.read'
    | 'reports.read'
  > = {
    leads: 'leads.read',
    groups: 'groups.read',
    teachers: 'teachers.read',
    schedule: 'groups.manage_schedule',
    attendance: 'students.read',
    finance: 'payments.read',
    reports: 'reports.read',
  }
  return permissions[moduleId] ?? 'dashboard.read'
}
