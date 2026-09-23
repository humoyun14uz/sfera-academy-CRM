import { useState } from 'react'
import {
  CalendarClock,
  LineChart as LineChartIcon,
  Plus,
  UsersRound,
  TrendingUp,
  Clock,
  AlertCircle,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useApiStore } from '@/lib/api-store'
import { formatCurrency, useLanguage } from '@/context/language-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { SummaryCards, useSummaryCards } from '@/components/ui/summary-cards'

export function ManagerDashboard() {
  const { language, t } = useLanguage()
  const crm = useApiStore()
  const [range, setRange] = useState('this-month')
  const en = language === 'en'
  const { academyCards } = useSummaryCards()

  if (crm.isLoading) {
    return (
      <>
        <Header>
          <TopNav links={[{ title: en ? 'Manager Dashboard' : 'Manager Boshqaruv Paneli', href: '/', isActive: true }]} />
          <Search />
          <ThemeSwitch />
        </Header>
        <Main>
          <div className='space-y-4'>
            <div className='h-9 w-64 rounded-lg bg-muted animate-pulse' />
            <div className='h-10 w-96 rounded-lg bg-muted animate-pulse' />
            <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className='h-28 rounded-xl border bg-muted/30 animate-pulse' />
              ))}
            </div>
          </div>
        </Main>
      </>
    )
  }

  if (crm.isError) {
    return (
      <>
        <Header>
          <TopNav links={[{ title: en ? 'Manager Dashboard' : 'Manager Boshqaruv Paneli', href: '/', isActive: true }]} />
          <Search />
          <ThemeSwitch />
        </Header>
        <Main>
          <Card>
            <CardHeader>
              <CardTitle>Failed to load data</CardTitle>
              <CardDescription>Please try again or contact support.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={crm.refetch}>Retry</Button>
            </CardContent>
          </Card>
        </Main>
      </>
    )
  }

  const activeStudents = crm.students.filter(
    (student) => student.status === 'active'
  )

  const collected = crm.payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  )

  const avgAttendance = Math.round(
    activeStudents.reduce((sum, student) => sum + student.attendance, 0) /
      Math.max(activeStudents.length, 1)
  )

  const stageOrder = [
    'NEW',
    'CONTACTED',
    'TRIAL LESSON',
    'APPROVED',
    'GROUP ASSIGNED',
    'ENROLLED',
    'STUDENT',
  ] as const

  const funnel = stageOrder.map((stage) => ({
    stage,
    count:
      crm.applications.filter((application) => application.status === stage)
        .length + (stage === 'STUDENT' ? activeStudents.length : 0),
  }))

  const funnelMax = Math.max(...funnel.map((item) => item.count), 1)

  const risks = activeStudents
    .map((student) => ({
      ...student,
      risk:
        student.attendance < 70 ||
        student.debt > 600000 ||
        student.averageGrade < 70
          ? 'High'
          : student.attendance < 80 || student.progress < 45
            ? 'Medium'
            : 'Healthy',
    }))
    .filter((student) => student.risk !== 'Healthy')

  const courseAnalytics = [
    ...new Set(crm.students.map((student) => student.course)),
  ].map((course) => {
    const students = activeStudents.filter(
      (student) => student.course === course
    )
    return {
      course,
      students: students.length,
      attendance: Math.round(
        students.reduce((sum, student) => sum + student.attendance, 0) /
          Math.max(students.length, 1)
      ),
      grade: Math.round(
        students.reduce((sum, student) => sum + student.averageGrade, 0) /
          Math.max(students.length, 1)
      ),
    }
  })

  const managerAttendance = [
    { month: en ? 'Last month' : 'O‘tgan oy', value: 87 },
    { month: en ? 'Current month' : 'Joriy oy', value: avgAttendance },
  ]

  const topAttendanceStudents = [...activeStudents]
    .sort((a, b) => b.attendance - a.attendance)
    .slice(0, 4)

  // Override with real data for manager
  const summaryCards = academyCards.map(card => ({
    ...card,
    value: card.title.includes('Students') ? activeStudents.length :
              card.title.includes('Revenue') ? formatCurrency(collected, language) :
              card.title.includes('Tasks') ? 23 :
              card.value
  }))

  const tr = (key: string) =>
    ({
      NEW: t('applications'),
      CONTACTED: t('contactedStage'),
      'TRIAL LESSON': t('trialLessonStage'),
      APPROVED: t('approvedStage'),
      'GROUP ASSIGNED': t('groupAssignedStage'),
      ENROLLED: t('enrolledStage'),
      STUDENT: t('activeStudentStage'),
    })[key] || key

  return (
    <>
      <Header>
        <TopNav
          links={[
            {
              title: en ? 'Manager Dashboard' : 'Manager Boshqaruv Paneli',
              href: '/',
              isActive: true,
              disabled: false,
            },
          ]}
          className='me-auto'
        />
        <Search />
        <ThemeSwitch />
      </Header>
      <Main>
        <div className='mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <p className='text-sm font-medium text-emerald-600 dark:text-emerald-400'>
              SFERA IT Academy · {en ? 'Manager Operations' : 'Manager Boshqaruvi'}
            </p>
            <h1 className='text-3xl font-bold tracking-tight'>
              {en ? 'Manager Dashboard' : 'Manager Boshqaruv Paneli'}
            </h1>
            <p className='mt-1 text-sm text-muted-foreground'>
              {en ? 'Daily operations and team performance overview' : 'Kundalik operatsiyalar va jamoa faoliyati ko‘rinishi'}
            </p>
          </div>
          <div className='flex flex-wrap gap-2'>
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger
                aria-label={t('dashboardRange')}
                className='h-9 min-w-36 rounded-lg border-border/70 bg-background shadow-sm transition-colors hover:border-primary/50 focus:ring-2 focus:ring-primary/20'
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                align='end'
                className='min-w-40 rounded-xl border-border/70 p-1.5 shadow-xl'
              >
                <SelectItem value='today' className='rounded-lg'>
                  {t('today')}
                </SelectItem>
                <SelectItem value='this-month' className='rounded-lg'>
                  {t('thisMonth')}
                </SelectItem>
                <SelectItem value='quarter' className='rounded-lg'>
                  {t('thisQuarter')}
                </SelectItem>
                <SelectItem value='year' className='rounded-lg'>
                  {t('thisYear')}
                </SelectItem>
              </SelectContent>
            </Select>
            <Button asChild>
              <a href='/academy/leads'>
                <Plus className='me-2 size-4' />
                {en ? 'New Application' : 'Yangi Ariza'}
              </a>
            </Button>
          </div>
        </div>

        {/* Manager-specific KPI cards */}
        <SummaryCards cards={summaryCards} />

        {/* Manager-specific analytics sections */}
        <div className='mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]'>
          <Card className='overflow-hidden'>
            <CardHeader className='border-b bg-gradient-to-r from-emerald-500/[0.12] via-card to-teal-500/[0.08]'>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <CardTitle className='flex items-center gap-2'>
                    <TrendingUp className='size-5 text-emerald-600' />
                    {en ? 'Attendance Analytics' : 'Davomat Tahlili'}
                  </CardTitle>
                  <CardDescription>{en ? 'Compare last month with the current month.' : 'O‘tgan oy va joriy oy davomatini solishtiring.'}</CardDescription>
                </div>
                <Badge variant='outline' className='bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'>{avgAttendance}%</Badge>
              </div>
            </CardHeader>
            <CardContent className='p-4'>
              <div className='h-[250px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={managerAttendance} barSize={52}>
                    <defs>
                      <linearGradient id='managerAttendance' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='0%' stopColor='#10b981' stopOpacity={0.95}/>
                        <stop offset='100%' stopColor='#14b8a6' stopOpacity={0.75}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray='3 3' vertical={false}/>
                    <XAxis dataKey='month'/>
                    <YAxis domain={[0,100]} tickFormatter={(v) => `${v}%`}/>
                    <Tooltip formatter={(value) => [`${value}%`, en ? 'Attendance' : 'Davomat']}/>
                    <Bar dataKey='value' fill='url(#managerAttendance)' radius={[10,10,4,4]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Clock className='size-5 text-emerald-600' />
                {en ? 'Top Attendance Learners' : 'Eng Yaxshi Davomat Ko‘rsatganlar'}
              </CardTitle>
              <CardDescription>{en ? 'Students with the strongest attendance rate.' : 'Davomat foizi eng yuqori bo‘lgan o‘quvchilar.'}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              {topAttendanceStudents.map((student, index) => (
                <div key={student.id} className='flex items-center gap-3 rounded-2xl border p-3'>
                  <span className='flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-xs font-bold text-emerald-700 dark:text-emerald-300'>
                    {index + 1}
                  </span>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-semibold'>{student.name}</p>
                    <p className='text-xs text-muted-foreground'>{student.course}</p>
                  </div>
                  <span className='font-bold text-emerald-600'>{student.attendance}%</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Manager-specific risk and enrollment sections */}
        <div className='mt-6 grid gap-6 xl:grid-cols-[1.25fr_1fr]'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <AlertCircle className='size-5 text-orange-600' />
                {t('studentsAtRisk')}
              </CardTitle>
              <CardDescription>{t('calculatedRisk')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                  <thead>
                    <tr className='border-b text-left text-xs text-muted-foreground'>
                      <th className='p-2'>{t('student')}</th>
                      <th className='p-2'>{t('attendance')}</th>
                      <th className='p-2'>{t('averageGrade')}</th>
                      <th className='p-2'>{t('risk')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {risks.map((student) => (
                      <tr
                        key={student.id}
                        className='border-b transition-colors hover:bg-muted/50'
                      >
                        <td className='p-2 font-medium'>
                          {student.name}
                          <div className='text-xs text-muted-foreground'>
                            {student.course}
                          </div>
                        </td>
                        <td className='p-2'>{student.attendance}%</td>
                        <td className='p-2'>{student.averageGrade}%</td>
                        <td className='p-2'>
                          <Badge
                            variant={
                              student.risk === 'High'
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            {student.risk === 'High' ? t('high') : t('medium')}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('enrollmentFunnel')}</CardTitle>
              <CardDescription>{t('dropOffAdmissions')}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              {funnel.map((item, index) => (
                <a
                  href={`/academy/leads?status=${item.stage}`}
                  key={item.stage}
                  className='block'
                >
                  <div className='mb-1 flex items-center justify-between text-sm'>
                    <span>
                      {index + 1}. {tr(item.stage)}
                    </span>
                    <b>{item.count}</b>
                  </div>
                  <div className='h-8 overflow-hidden rounded-md bg-muted'>
                    <div
                      className='flex h-full items-center rounded-md bg-primary/80 px-3 text-xs text-primary-foreground transition-all'
                      style={{
                        width: `${Math.max((item.count / funnelMax) * 100, item.count ? 18 : 0)}%`,
                      }}
                    >
                      {item.count
                        ? `${Math.round((item.count / funnelMax) * 100)}%`
                        : ''}
                    </div>
                  </div>
                </a>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Manager-specific group capacity and course performance */}
        <div className='mt-6 grid gap-6 lg:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>{t('groupCapacity')}</CardTitle>
              <CardDescription>{t('availableSeats')}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-5'>
              {crm.groups.map((group) => {
                const percent = Math.round(
                  (group.studentIds.length / group.capacity) * 100
                )
                return (
                  <a
                    href='/academy/groups'
                    key={group.id}
                    className='block transition-opacity hover:opacity-80'
                  >
                    <div className='mb-1 flex justify-between text-sm'>
                      <span className='font-medium'>
                        {group.name} · {group.teacher}
                      </span>
                      <span>
                        {group.studentIds.length}/{group.capacity}
                      </span>
                    </div>
                    <div className='h-2 rounded-full bg-muted'>
                      <div
                        className={`h-2 rounded-full ${percent >= 100 ? 'bg-rose-500' : percent >= 85 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className='mt-1 text-xs text-muted-foreground'>
                      {group.course} ·{' '}
                      {Math.max(group.capacity - group.studentIds.length, 0)}{' '}
                      {t('seatsLeft')}
                    </p>
                  </a>
                )
              })}
            </CardContent>
          </Card>

          <Card className='overflow-hidden'>
            <CardHeader className='border-b bg-gradient-to-r from-primary/[0.07] via-card to-violet-500/[0.06]'>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <CardTitle>{t('coursePerformance')}</CardTitle>
                  <CardDescription>{en ? 'Attendance + academic performance by course' : 'Kurslar kesimida davomat va o‘zlashtirish'}</CardDescription>
                </div>
                <LineChartIcon className='size-5 text-primary' />
              </div>
            </CardHeader>
            <CardContent className='p-4'>
              <div className='h-[270px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={courseAnalytics} barGap={8} margin={{ top: 10, right: 12, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray='3 3' vertical={false}/>
                    <XAxis dataKey='course' tick={{ fontSize: 10 }} interval={0}/>
                    <YAxis domain={[0,100]} tickFormatter={(v) => `${v}%`}/>
                    <Tooltip formatter={(value, name) => [`${value}%`, name === 'grade' ? t('averageGrade') : t('attendance')]}/>
                    <Bar dataKey='attendance' name={t('attendance')} fill='#3b82f6' radius={[8,8,0,0]} />
                    <Bar dataKey='grade' name={t('averageGrade')} fill='#8b5cf6' radius={[8,8,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className='mt-3 grid gap-2 sm:grid-cols-2'>
                {courseAnalytics.map((item) => (
                  <div key={item.course} className='rounded-xl border bg-muted/20 p-3'>
                    <div className='flex items-center justify-between text-xs'>
                      <span className='truncate font-semibold'>{item.course}</span>
                      <span>{item.students} {t('students')}</span>
                    </div>
                    <div className='mt-2 h-1.5 rounded-full bg-muted'>
                      <div className='h-full rounded-full bg-gradient-to-r from-primary to-violet-500' style={{ width: `${item.grade}%` }}/>
                    </div>
                    <p className='mt-1 text-[11px] text-muted-foreground'>{t('averageGrade')}: {item.grade}% · {t('attendance')}: {item.attendance}%</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Manager-specific quick actions */}
        <div className='mt-6'>
          <Card>
            <CardHeader>
              <CardTitle>{en ? 'Quick Actions' : 'Tezkor Harakatlar'}</CardTitle>
              <CardDescription>{en ? 'Common management tasks' : 'Keng tarqalgan boshqaruv vazifalari'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
                <Button asChild variant='outline' className='h-auto flex-col gap-2 p-4'>
                  <a href='/academy/leads'>
                    <Target className='size-5' />
                    <span>{en ? 'New Application' : 'Yangi Ariza'}</span>
                  </a>
                </Button>
                <Button asChild variant='outline' className='h-auto flex-col gap-2 p-4'>
                  <a href='/academy/groups'>
                    <UsersRound className='size-5' />
                    <span>{en ? 'Manage Groups' : 'Guruhlarni Boshqarish'}</span>
                  </a>
                </Button>
                <Button asChild variant='outline' className='h-auto flex-col gap-2 p-4'>
                  <a href='/academy/finance'>
                    <WalletCards className='size-5' />
                    <span>{en ? 'Record Payment' : 'To‘lov Qayd Qilish'}</span>
                  </a>
                </Button>
                <Button asChild variant='outline' className='h-auto flex-col gap-2 p-4'>
                  <a href='/tasks'>
                    <CalendarClock className='size-5' />
                    <span>{en ? 'View Tasks' : 'Vazifalarni Ko‘rish'}</span>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}