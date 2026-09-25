import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  BarChart3,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  GraduationCap,
  LineChart as LineChartIcon,
  Plus,
  Target,
  UsersRound,
  WalletCards,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useCrmStore } from '@/lib/crm-store'
import {
  apiErrorMessage,
  formatApiCurrency,
  getApiData,
  isBackendEnabled,
  type ManagerDashboardApi,
} from '@/lib/api-client'
import { getPrimaryRole } from '@/lib/rbac'
import { useAuthStore } from '@/stores/auth-store'
import { BackendStatusCard } from '@/components/backend-status-card'
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
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

const COLORS = [
  '#29a956',
  '#218c48',
  '#67bd80',
  '#0c0d12',
  '#176f38',
  '#64748b',
]
const revenueSeries = [
  { month: 'Apr', collected: 6200000, pending: 900000 },
  { month: 'May', collected: 7400000, pending: 1200000 },
  { month: 'Jun', collected: 8100000, pending: 1000000 },
  { month: 'Jul', collected: 9300000, pending: 1300000 },
  { month: 'Aug', collected: 10600000, pending: 1600000 },
  { month: 'Sep', collected: 0, pending: 0 },
]

export function Dashboard() {
  const { language, t } = useLanguage()
  const crm = useCrmStore()
  const role = getPrimaryRole(useAuthStore((state) => state.auth.user?.role))
  const managerApi = useQuery({
    queryKey: ['backend', 'manager', 'dashboard'],
    queryFn: () => getApiData<ManagerDashboardApi>('/manager/dashboard'),
    enabled:
      isBackendEnabled() &&
      (role === 'Manager' || role === 'Super Admin'),
  })
  const [range, setRange] = useState('this-month')
  const en = language === 'en'
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
      tone: 'text-emerald-600',
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
      tone: 'text-emerald-600',
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
      tone: 'text-emerald-700',
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
        <Search />
        <ThemeSwitch />
      </Header>
      <Main>
        <div className='mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <p className='text-sm font-medium text-primary'>
              SFERA IT Academy · {t('executiveIntelligence')}
            </p>
            <h1 className='text-3xl font-bold tracking-tight'>
              {t('academyCommandCenter')}
            </h1>
            <p className='mt-1 text-sm text-muted-foreground'>
              {t('academyCommandDescription')}
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
                {t('quickAction')}
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
                <Card className='h-full transition-all hover:-translate-y-0.5 hover:shadow-md'>
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
        <BackendStatusCard
          title={language === 'en' ? 'Manager API data' : 'Manager API ma’lumotlari'}
          description={language === 'en' ? 'Statistics returned by the NestJS backend.' : 'NestJS backend qaytargan statistikalar.'}
          status={!isBackendEnabled() ? 'disabled' : managerApi.isPending ? 'loading' : managerApi.isError ? 'error' : 'connected'}
          statusLabels={{
            disabled: language === 'en' ? 'Demo mode' : 'Demo rejim',
            loading: language === 'en' ? 'Loading' : 'Yuklanmoqda',
            error: language === 'en' ? 'API error' : 'API xatosi',
            connected: language === 'en' ? 'Connected' : 'Ulandi',
          }}
          errorMessage={apiErrorMessage(managerApi.error)}
          metrics={managerApi.data ? [
            { label: language === 'en' ? 'Students' : 'O‘quvchilar', value: managerApi.data.totalStudents },
            { label: language === 'en' ? 'Groups' : 'Guruhlar', value: managerApi.data.totalGroups },
            { label: language === 'en' ? 'Teachers' : 'O‘qituvchilar', value: managerApi.data.totalTeachers },
            { label: language === 'en' ? 'Monthly income' : 'Oylik tushum', value: formatApiCurrency(managerApi.data.monthlyRevenue, language === 'en' ? 'en-US' : 'uz-UZ') },
          ] : []}
        />
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
                          stopColor='#29a956'
                          stopOpacity={0.28}
                        />
                        <stop
                          offset='95%'
                          stopColor='#29a956'
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
                      stroke='#29a956'
                      fill='url(#collected)'
                      strokeWidth={2}
                    />
                    <Area
                      type='monotone'
                      dataKey='pending'
                      name={t('pendingAmount')}
                      stroke='#67bd80'
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
                  <LineChart data={studentGrowthData}>
                    <CartesianGrid strokeDasharray='3 3' vertical={false} />
                    <XAxis dataKey='month' />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        value,
                        name === 'active'
                          ? t('activeStudents')
                          : t('newStudentsSeries'),
                      ]}
                    />
                    <Line
                      type='monotone'
                      dataKey='active'
                      name={t('activeStudents')}
                      stroke='#29a956'
                      strokeWidth={3}
                    />
                    <Line
                      type='monotone'
                      dataKey='newStudents'
                      name={t('newStudentsSeries')}
                      stroke='#218c48'
                      strokeWidth={2}
                    />
                  </LineChart>
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
          <Card>
            <CardHeader>
              <CardTitle>{t('coursePerformance')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='h-[250px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={courseAnalytics} layout='vertical'>
                    <CartesianGrid strokeDasharray='3 3' horizontal={false} />
                    <XAxis type='number' domain={[0, 100]} />
                    <YAxis
                      type='category'
                      dataKey='course'
                      width={120}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip />
                    <Bar
                      dataKey='attendance'
                      name={t('attendance')}
                      fill='#29a956'
                      radius={[0, 4, 4, 0]}
                    />
                    <Bar
                      dataKey='grade'
                      name={t('averageGrade')}
                      fill='#218c48'
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('operationalAttention')}</CardTitle>
              <CardDescription>{t('openSourceRecord')}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              {risks.length > 0 && (
                <a
                  href='/academy/attendance?filter=low'
                  className='flex items-center gap-3 rounded-lg border p-3 hover:bg-muted'
                >
                  <CheckCircle2 className='size-5 text-amber-500' />
                  <span className='flex-1 text-sm'>
                    {risks.length} {t('academicReview')}
                  </span>
                </a>
              )}
              <a
                href='/academy/leads?filter=follow-up'
                className='flex items-center gap-3 rounded-lg border p-3 hover:bg-muted'
              >
                <Target className='size-5 text-violet-500' />
                <span className='flex-1 text-sm'>
                  {crm.applications.filter((a) => a.status === 'NEW').length}{' '}
                  {t('applicationsFollowup')}
                </span>
              </a>
              <a
                href='/academy/finance?filter=overdue'
                className='flex items-center gap-3 rounded-lg border p-3 hover:bg-muted'
              >
                <WalletCards className='size-5 text-rose-500' />
                <span className='flex-1 text-sm'>
                  {debtors.length} {t('studentsOutstandingDebt')}
                </span>
              </a>
            </CardContent>
          </Card>
        </div>
        <div className='mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]'>
          <Card>
            <CardHeader>
              <CardTitle>{t('recentActivity')}</CardTitle>
              <CardDescription>{t('transparentAuditTrail')}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {crm.activities.map((activity) => (
                <div key={activity.id} className='flex gap-3'>
                  <div className='rounded-full bg-primary/10 p-2'>
                    <BarChart3 className='size-4 text-primary' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>{activity.action}</p>
                    <p className='text-xs text-muted-foreground'>
                      {activity.entity} · {activity.user} · {activity.role}
                    </p>
                    <p className='mt-1 text-[11px] text-muted-foreground'>
                      {new Date(activity.createdAt).toLocaleString(
                        en ? 'en-US' : 'uz-UZ'
                      )}
                    </p>
                  </div>
                </div>
              ))}
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
