import { useState } from 'react'
import {
  BarChart3,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  GraduationCap,
  LineChart as LineChartIcon,
  Target,
  UsersRound,
  WalletCards,
  Shield,
  Settings,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
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

const COLORS = [
  '#2563eb',
  '#14b8a6',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#64748b',
]

export function Dashboard() {
  const { language, t } = useLanguage()
  const crm = useApiStore()
  const [range, setRange] = useState('this-month')
  const en = language === 'en'

  if (crm.isLoading) {
    return (
      <>
        <Header>
          <TopNav links={[{ title: t('executiveOverview'), href: '/', isActive: true }]} />
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
          <TopNav links={[{ title: t('executiveOverview'), href: '/', isActive: true }]} />
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

  const monthLabel = (month: number) =>
    new Intl.DateTimeFormat(en ? 'en-US' : 'uz-UZ', { month: 'short' }).format(
      new Date(2026, month, 1)
    )
  const paymentMethodLabel = (method: string) =>
    ({
      cash: t('cash'),
      card: t('card'),
      click: t('click'),
      payme: t('payme'),
      bank: t('bankTransfer'),
      bank_transfer: t('bankTransfer'),
    })[method.toLowerCase()] || method
  const collectedRevenue = (crm.financeSummary as Record<string, number> | null)?.collectedRevenue ?? 0
  const outstandingBalance = (crm.financeSummary as Record<string, number> | null)?.outstandingBalance ?? 0
  const revenueSeries = collectedRevenue || outstandingBalance
    ? [{ month: en ? 'This Month' : 'Bu Oy', collected: collectedRevenue, pending: outstandingBalance }]
    : []
  const activeStudents = crm.students.filter(
    (student) => student.status === 'active'
  )
  const studentGrowthData = [
    { month: 3, active: 18, newStudents: 5 },
    { month: 4, active: 23, newStudents: 7 },
    { month: 5, active: 27, newStudents: 6 },
    { month: 6, active: 31, newStudents: 8 },
    { month: 7, active: 35, newStudents: 9 },
    { month: 8, active: activeStudents.length, newStudents: 4 },
  ].map((item) => ({ ...item, month: monthLabel(item.month) }))
  const debt = crm.students.reduce((sum, student) => sum + student.debt, 0)
  const collected = crm.payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  )
  const avgAttendance = Math.round(
    activeStudents.reduce((sum, student) => sum + student.attendance, 0) /
      Math.max(activeStudents.length, 1)
  )
  const debtors = crm.students.filter((student) => student.debt > 0)
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
  const paymentMethods = Object.entries(
    crm.payments.reduce<Record<string, number>>((result, payment) => {
      result[payment.method] = (result[payment.method] || 0) + payment.amount
      return result
    }, {})
  ).map(([name, value]) => ({ name: paymentMethodLabel(name), value }))
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
  const applicationAnalytics = [
    { label: en ? 'New' : 'Yangi', value: crm.applications.filter((a) => a.status === 'NEW').length },
    { label: en ? 'Contacted' : 'Aloqa', value: crm.applications.filter((a) => a.status === 'CONTACTED').length },
    { label: en ? 'Trial' : 'Sinov', value: crm.applications.filter((a) => a.status === 'TRIAL LESSON').length },
    { label: en ? 'Approved' : 'Tasdiqlangan', value: crm.applications.filter((a) => a.status === 'APPROVED').length },
    { label: en ? 'Enrolled' : 'Qabul qilingan', value: crm.applications.filter((a) => a.status === 'ENROLLED').length },
  ]
    const rangeLabel = {
    today: t('today'),
    'this-month': t('thisMonth'),
    quarter: t('thisQuarter'),
    year: t('thisYear'),
  }[range]
  const stats = [
    {
      label: t('totalStudents'),
      value: activeStudents.length,
      hint: t('growthVsLastMonth'),
      icon: GraduationCap,
      tone: 'text-sky-600',
    },
    {
      label: t('monthlyRevenue'),
      value: formatCurrency(collected, language),
      hint: t('recordedTransactions'),
      icon: CircleDollarSign,
      tone: 'text-emerald-600',
    },
    {
      label: t('outstandingDebt'),
      value: formatCurrency(debt, language),
      hint: `${debtors.length} ${t('debtors')}`,
      icon: WalletCards,
      tone: 'text-rose-600',
    },
    {
      label: t('academyAttendance'),
      value: `${avgAttendance}%`,
      hint: t('acrossActiveStudents'),
      icon: CheckCircle2,
      tone: 'text-violet-600',
    },
    {
      label: t('applications'),
      value: crm.applications.length,
      hint: `${crm.applications.filter((a) => a.status === 'NEW').length} ${t('new')}`,
      icon: Target,
      tone: 'text-amber-600',
    },
    {
      label: t('activeGroups'),
      value: crm.groups.length,
      hint: `${crm.groups.filter((g) => g.studentIds.length / g.capacity >= 0.9).length} ${t('nearCapacity')}`,
      icon: UsersRound,
      tone: 'text-indigo-600',
    },
  ]
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
              title: t('executiveOverview'),
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
            <p className='text-sm font-medium text-primary'>
              SFERA IT Academy · {en ? 'Admin Console' : 'Admin Konsoli'}
            </p>
            <h1 className='text-3xl font-bold tracking-tight'>
              {en ? 'Academy Command Center' : 'Akademiya Boshqaruv Markazi'}
            </h1>
            <p className='mt-1 text-sm text-muted-foreground'>
              {en ? 'System overview and administrative controls' : 'Tizim ko‘rinishi va maʼmuriy boshqaruv'}
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
              <a href='/users/manage'>
                <Shield className='me-2 size-4' />
                {en ? 'Manage Users' : 'Foydalanuvchilarni Boshqarish'}
              </a>
            </Button>
          </div>
        </div>
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <a
                key={stat.label}
                href={
                  stat.label.includes('revenue') ||
                  stat.label.includes('tushum') ||
                  stat.label.includes('debt') ||
                  stat.label.includes('Qarz')
                    ? '/academy/finance'
                    : '#'
                }
              >
                <Card className='h-full cursor-pointer transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md'>
                  <CardHeader className='flex flex-row items-start justify-between pb-2'>
                    <CardTitle className='text-sm font-medium'>
                      {stat.label}
                    </CardTitle>
                    <Icon className={`size-5 ${stat.tone}`} />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>{stat.value}</div>
                    <p className='mt-1 text-xs text-muted-foreground'>
                      {stat.hint}
                    </p>
                  </CardContent>
                </Card>
              </a>
            )
          })}
        </div>
        <div className='mt-6 grid gap-6 xl:grid-cols-[1.65fr_1fr]'>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>{t('revenueAnalytics')}</CardTitle>
                  <CardDescription>{`${t('collectedPending')} · ${rangeLabel}`}</CardDescription>
                </div>
                <LineChartIcon className='size-5 text-muted-foreground' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='h-[260px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart
                    data={revenueSeries.map((item, index) => ({
                      ...item,
                      month: monthLabel(index + 3),
                    }))}
                  >
                    <defs>
                      <linearGradient
                        id='collected'
                        x1='0'
                        y1='0'
                        x2='0'
                        y2='1'
                      >
                        <stop
                          offset='5%'
                          stopColor='#2563eb'
                          stopOpacity={0.28}
                        />
                        <stop
                          offset='95%'
                          stopColor='#2563eb'
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray='3 3' vertical={false} />
                    <XAxis dataKey='month' />
                    <YAxis
                      tickFormatter={(value) =>
                        `${Math.round(value / 1000000)}M`
                      }
                    />
                    <Tooltip
                      formatter={(value, name) => [
                        formatCurrency(Number(value ?? 0), language),
                        name === 'collected'
                          ? t('collected')
                          : t('pendingAmount'),
                      ]}
                    />
                    <Area
                      type='monotone'
                      dataKey='collected'
                      name={t('collected')}
                      stroke='#2563eb'
                      fill='url(#collected)'
                      strokeWidth={2}
                    />
                    <Area
                      type='monotone'
                      dataKey='pending'
                      name={t('pendingAmount')}
                      stroke='#f59e0b'
                      fill='none'
                      strokeDasharray='5 5'
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('paymentStatistics')}</CardTitle>
              <CardDescription>{t('distributionActual')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='h-[220px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={
                        paymentMethods.length
                          ? paymentMethods
                          : [{ name: t('notAvailable'), value: 1 }]
                      }
                      dataKey='value'
                      nameKey='name'
                      innerRadius={58}
                      outerRadius={82}
                      paddingAngle={4}
                    >
                      {(paymentMethods.length
                        ? paymentMethods
                        : [{ name: t('notAvailable'), value: 1 }]
                      ).map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) =>
                        formatCurrency(Number(value ?? 0), language)
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className='grid grid-cols-2 gap-2 text-xs'>
                {paymentMethods.map((method, index) => (
                  <div key={method.name} className='flex items-center gap-2'>
                    <span
                      className='size-2 rounded-full'
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    {method.name}:{' '}
                    {Math.round((method.value / Math.max(collected, 1)) * 100)}%
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className='mt-6 grid gap-6 lg:grid-cols-2'>
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
          <Card>
            <CardHeader>
              <CardTitle>{t('studentGrowth')}</CardTitle>
              <CardDescription>{t('activeStudentTrend')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='h-[280px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart data={studentGrowthData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id='studentsGrowthFill' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='0%' stopColor='#8b5cf6' stopOpacity={0.34} />
                        <stop offset='100%' stopColor='#8b5cf6' stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id='studentsGrowthNewFill' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='0%' stopColor='#14b8a6' stopOpacity={0.24} />
                        <stop offset='100%' stopColor='#14b8a6' stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray='3 3' vertical={false} opacity={0.4} />
                    <XAxis dataKey='month' tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} width={34} />
                    <Tooltip
                      cursor={{ stroke: 'currentColor', strokeOpacity: 0.12 }}
                      contentStyle={{ borderRadius: 14, borderColor: 'var(--border)', background: 'var(--card)' }}
                      formatter={(value, name) => [value, name === 'active' ? t('activeStudents') : t('newStudentsSeries')]}
                    />
                    <Area type='monotone' dataKey='active' name={t('activeStudents')} stroke='#8b5cf6' fill='url(#studentsGrowthFill)' strokeWidth={3} />
                    <Area type='monotone' dataKey='newStudents' name={t('newStudentsSeries')} stroke='#14b8a6' fill='url(#studentsGrowthNewFill)' strokeWidth={2} strokeDasharray='6 4' />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className='mt-6 grid gap-6 xl:grid-cols-[1.25fr_1fr]'>
          <Card>
            <CardHeader>
              <CardTitle>{t('studentsAtRisk')}</CardTitle>
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
        </div>
        <div className='mt-6 grid gap-6 lg:grid-cols-2'>
          <Card className='overflow-hidden'>
            <CardHeader className='border-b bg-gradient-to-r from-primary/[0.07] via-card to-violet-500/[0.06]'>
              <div className='flex items-center justify-between gap-3'><div><CardTitle>{t('coursePerformance')}</CardTitle><CardDescription>{en ? 'Attendance + academic performance by course' : 'Kurslar kesimida davomat va o‘zlashtirish'}</CardDescription></div><LineChartIcon className='size-5 text-primary' /></div>
            </CardHeader>
            <CardContent className='p-4'>
              <div className='h-[270px]'><ResponsiveContainer width='100%' height='100%'><BarChart data={courseAnalytics} barGap={8} margin={{ top: 10, right: 12, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray='3 3' vertical={false}/><XAxis dataKey='course' tick={{ fontSize: 10 }} interval={0}/><YAxis domain={[0,100]} tickFormatter={(v) => `${v}%`}/>
                <Tooltip formatter={(value, name) => [`${value}%`, name === 'grade' ? t('averageGrade') : t('attendance')]}/>
                <Bar dataKey='attendance' name={t('attendance')} fill='#2563eb' radius={[8,8,0,0]} />
                <Bar dataKey='grade' name={t('averageGrade')} fill='#8b5cf6' radius={[8,8,0,0]} />
              </BarChart></ResponsiveContainer></div>
              <div className='mt-3 grid gap-2 sm:grid-cols-2'>{courseAnalytics.map((item) => <div key={item.course} className='rounded-xl border bg-muted/20 p-3'><div className='flex items-center justify-between text-xs'><span className='truncate font-semibold'>{item.course}</span><span>{item.students} {t('students')}</span></div><div className='mt-2 h-1.5 rounded-full bg-muted'><div className='h-full rounded-full bg-gradient-to-r from-primary to-violet-500' style={{ width: `${item.grade}%` }}/></div><p className='mt-1 text-[11px] text-muted-foreground'>{t('averageGrade')}: {item.grade}% · {t('attendance')}: {item.attendance}%</p></div>)}</div>
            </CardContent>
          </Card>
          <Card className='overflow-hidden'>
            <CardHeader className='border-b bg-gradient-to-r from-amber-500/[0.07] via-card to-primary/[0.04]'>
              <CardTitle>{en ? 'Application pipeline' : 'Arizalar oqimi'}</CardTitle>
              <CardDescription>{en ? 'Current application distribution by stage.' : 'Arizalarning joriy bosqichlar bo‘yicha taqsimoti.'}</CardDescription>
            </CardHeader>
            <CardContent className='p-4'>
              <div className='h-[210px]'><ResponsiveContainer width='100%' height='100%'><BarChart data={applicationAnalytics} barCategoryGap='28%'><CartesianGrid strokeDasharray='3 3' vertical={false}/><XAxis dataKey='label' tick={{ fontSize: 10 }}/><YAxis allowDecimals={false}/><Tooltip/><Bar dataKey='value' fill='#f59e0b' radius={[9,9,3,3]} /></BarChart></ResponsiveContainer></div>
              <div className='mt-3 rounded-2xl border bg-amber-500/[0.05] p-3'><div className='flex items-center justify-between text-sm'><span>{en ? 'Total applications' : 'Jami arizalar'}</span><b>{crm.applications.length}</b></div><div className='mt-2 h-2 rounded-full bg-muted'><div className='h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500' style={{ width: `${Math.min((crm.applications.length / Math.max(activeStudents.length + crm.applications.length,1))*100,100)}%` }}/></div><p className='mt-1 text-[11px] text-muted-foreground'>{crm.applications.filter((a) => a.status === 'NEW').length} {t('new')}</p></div>
            </CardContent>
          </Card>
        </div>

        {/* Admin-specific system overview */}
        <div className='mt-6 grid gap-6 lg:grid-cols-3'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Shield className='size-5 text-primary' />
                {en ? 'System Health' : 'Tizim Sog‘ligi'}
              </CardTitle>
              <CardDescription>{en ? 'Overall system status' : 'Umumiy tizim holati'}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm'>{en ? 'API Status' : 'API Holati'}</span>
                <Badge variant='outline' className='text-emerald-600'>{en ? 'Operational' : 'Ishlayapti'}</Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm'>{en ? 'Database' : 'Maʼlumotlar bazasi'}</span>
                <Badge variant='outline' className='text-emerald-600'>{en ? 'Connected' : 'Ulangan'}</Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm'>{en ? 'Storage' : 'Xotira'}</span>
                <Badge variant='outline' className='text-amber-600'>{en ? '45% Used' : '45% Foydalanilmoqda'}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <UsersRound className='size-5 text-primary' />
                {en ? 'User Activity' : 'Foydalanuvchi Faoliyati'}
              </CardTitle>
              <CardDescription>{en ? 'Active users by role' : 'Rol bo‘yicha faol foydalanuvchilar'}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm'>{en ? 'Admins' : 'Adminlar'}</span>
                <span className='font-semibold'>3</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm'>{en ? 'Managers' : 'Managerlar'}</span>
                <span className='font-semibold'>5</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm'>{en ? 'Teachers' : 'O‘qituvchilar'}</span>
                <span className='font-semibold'>12</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm'>{en ? 'Students' : 'O‘quvchilar'}</span>
                <span className='font-semibold'>{activeStudents.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Settings className='size-5 text-primary' />
                {en ? 'Quick Admin Actions' : 'Tezkor Admin Harakatlari'}
              </CardTitle>
              <CardDescription>{en ? 'System management' : 'Tizim boshqaruvi'}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              <Button asChild variant='outline' className='w-full justify-start'>
                <a href='/users/manage'>
                  <Shield className='me-2 size-4' />
                  {en ? 'Manage Users' : 'Foydalanuvchilarni Boshqarish'}
                </a>
              </Button>
              <Button asChild variant='outline' className='w-full justify-start'>
                <a href='/settings'>
                  <Settings className='me-2 size-4' />
                  {en ? 'System Settings' : 'Tizim Sozlamalari'}
                </a>
              </Button>
              <Button asChild variant='outline' className='w-full justify-start'>
                <a href='/academy/reports'>
                  <BarChart3 className='me-2 size-4' />
                  {en ? 'View Reports' : 'Hisobotlarni Ko‘rish'}
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className='mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]'>
          <Card>
            <CardHeader className='border-b bg-muted/[0.16]'><div className='flex items-center justify-between gap-3'><div><CardTitle>{t('recentActivity')}</CardTitle><CardDescription>{t('transparentAuditTrail')}</CardDescription></div><BarChart3 className='size-5 text-primary' /></div></CardHeader>
            <CardContent className='p-4'>
              <div className='relative space-y-1'>
                <div className='absolute bottom-2 start-[17px] top-2 w-px bg-border' />
                {crm.activities.map((activity, index) => (
                  <div key={activity.id} className='relative flex gap-4 rounded-2xl p-3 transition-colors hover:bg-muted/30'>
                    <div className='relative z-10 mt-1 flex size-9 shrink-0 items-center justify-center rounded-xl border bg-background shadow-sm'><span className={`size-2.5 rounded-full ${index === 0 ? 'bg-emerald-500' : 'bg-primary'}`} /></div>
                    <div className='min-w-0 flex-1'><div className='flex flex-wrap items-center gap-2'><p className='text-sm font-semibold'>{activity.action}</p><Badge variant='secondary' className='text-[10px]'>{activity.role}</Badge></div><p className='mt-1 text-xs text-muted-foreground'>{activity.entity} · {activity.user}</p><p className='mt-1 text-[11px] text-muted-foreground'>{new Date(activity.createdAt).toLocaleString(en ? 'en-US' : 'uz-UZ')}</p></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('upcomingLessons')}</CardTitle>
              <CardDescription>{t('scheduleConnectedGroups')}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {crm.groups.map((group) => (
                <div key={group.id} className='flex items-center gap-3'>
                  <CalendarClock className='size-5 text-primary' />
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>{group.course}</p>
                    <p className='text-xs text-muted-foreground'>
                      {group.name} · {group.schedule} · {group.room}
                    </p>
                  </div>
                  <Badge variant='outline'>{group.studentIds.length}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
