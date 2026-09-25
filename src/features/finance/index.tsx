import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Download,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  Grid3X3,
  MessageSquare,
  Pencil,
  Plus,
  Printer,
  RotateCcw,
  Search as SearchIcon,
  Send,
  Smartphone,
  Table as TableIcon,
  Trash2,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
  WalletCards,
  X,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { useCrmStore } from '@/lib/crm-store'
import { useLanguage } from '@/context/language-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { NotFoundError } from '@/features/errors/not-found-error'
import { RoleSettings } from '@/features/role-settings'
import { ProfileForm } from '@/features/settings/profile/profile-form'
import {
  apiErrorMessage,
  formatApiCurrency,
  getApiData,
  isBackendEnabled,
  type FinanceSummaryApi,
} from '@/lib/api-client'
import { BackendStatusCard } from '@/components/backend-status-card'

// ==========================================
// TIZIM MA'LUMOTLARI VA MODELLARI
// ==========================================

export interface FinanceGroup {
  id: string
  name: string
  course: string
  teacher: string
  teacherPhone: string
  room: string
  schedule: string
  studentsCount: number
  capacity: number
  totalRevenue: number
  totalDebt: number
}

const initialGroups: FinanceGroup[] = [
  {
    id: 'grp-frontend-2',
    name: 'Frontend 2-guruh',
    course: 'Frontend Development',
    teacher: 'Azizbek Karimov',
    teacherPhone: '+998 90 123 45 67',
    room: '301-xona',
    schedule: 'Du-Chor-Ju 18:00',
    studentsCount: 3,
    capacity: 16,
    totalRevenue: 2550000,
    totalDebt: 350000,
  },
  {
    id: 'grp-python-1',
    name: 'Python boshlang‘ich',
    course: 'Python Development',
    teacher: 'G‘olib Abduxalil',
    teacherPhone: '+998 91 234 56 78',
    room: '201-xona',
    schedule: 'Se-Pay-Sha 19:00',
    studentsCount: 3,
    capacity: 18,
    totalRevenue: 1950000,
    totalDebt: 650000,
  },
  {
    id: 'grp-react-1',
    name: 'React amaliyot',
    course: 'React.js',
    teacher: 'Sardor Islomov',
    teacherPhone: '+998 93 345 67 89',
    room: 'Lab 2',
    schedule: 'Du-Chor-Ju 19:30',
    studentsCount: 2,
    capacity: 12,
    totalRevenue: 1350000,
    totalDebt: 450000,
  },
]

export interface FinanceStudent {
  id: string
  name: string
  phone: string
  groupId: string
  groupName: string
  course: string
  balance: number
  debt: number
  overdueDays: number
  lastPaymentDate: string
  status: 'paid' | 'debt'
}

const initialStudents: FinanceStudent[] = [
  {
    id: 'stu-01',
    name: 'Azizbek Karimov',
    phone: '+998 90 111 22 33',
    groupId: 'grp-frontend-2',
    groupName: 'Frontend 2-guruh',
    course: 'Frontend Development',
    balance: 0,
    debt: 0,
    overdueDays: 0,
    lastPaymentDate: '2026-09-08',
    status: 'paid',
  },
  {
    id: 'stu-02',
    name: 'Shahnoza Ergasheva',
    phone: '+998 94 444 55 66',
    groupId: 'grp-frontend-2',
    groupName: 'Frontend 2-guruh',
    course: 'Frontend Development',
    balance: -350000,
    debt: 350000,
    overdueDays: 12,
    lastPaymentDate: '2026-08-20',
    status: 'debt',
  },
  {
    id: 'stu-03',
    name: 'Olimjon Sobirov',
    phone: '+998 99 777 88 99',
    groupId: 'grp-frontend-2',
    groupName: 'Frontend 2-guruh',
    course: 'Frontend Development',
    balance: 0,
    debt: 0,
    overdueDays: 0,
    lastPaymentDate: '2026-09-06',
    status: 'paid',
  },
  {
    id: 'stu-04',
    name: 'Madina Aliyeva',
    phone: '+998 91 222 33 44',
    groupId: 'grp-python-1',
    groupName: 'Python boshlang‘ich',
    course: 'Python Development',
    balance: 0,
    debt: 0,
    overdueDays: 0,
    lastPaymentDate: '2026-09-08',
    status: 'paid',
  },
  {
    id: 'stu-05',
    name: 'Bekzod Tursunov',
    phone: '+998 97 555 66 77',
    groupId: 'grp-python-1',
    groupName: 'Python boshlang‘ich',
    course: 'Python Development',
    balance: -650000,
    debt: 650000,
    overdueDays: 7,
    lastPaymentDate: '2026-08-28',
    status: 'debt',
  },
  {
    id: 'stu-06',
    name: 'Nodira Salimova',
    phone: '+998 90 888 99 00',
    groupId: 'grp-python-1',
    groupName: 'Python boshlang‘ich',
    course: 'Python Development',
    balance: 0,
    debt: 0,
    overdueDays: 0,
    lastPaymentDate: '2026-09-05',
    status: 'paid',
  },
  {
    id: 'stu-07',
    name: 'Javohir Rasulov',
    phone: '+998 93 333 44 55',
    groupId: 'grp-react-1',
    groupName: 'React amaliyot',
    course: 'React.js',
    balance: -450000,
    debt: 450000,
    overdueDays: 4,
    lastPaymentDate: '2026-08-25',
    status: 'debt',
  },
  {
    id: 'stu-08',
    name: 'Kamola Rustamova',
    phone: '+998 99 666 77 88',
    groupId: 'grp-react-1',
    groupName: 'React amaliyot',
    course: 'React.js',
    balance: 0,
    debt: 0,
    overdueDays: 0,
    lastPaymentDate: '2026-09-02',
    status: 'paid',
  },
]

type PaymentListItem = {
  id: string
  student: string
  group: string
  course: string
  amount: number
  method: string
  date: string
  status: string
}

const recentPayments = [
  {
    id: 'PAY-001',
    student: 'Azizbek Karimov',
    group: 'Frontend 2-guruh',
    course: 'Frontend Development',
    amount: 850000,
    method: 'Payme',
    date: '2026-09-08 14:30',
    status: 'paid',
  },
  {
    id: 'PAY-002',
    student: 'Madina Aliyeva',
    group: 'Python boshlang‘ich',
    course: 'Python Development',
    amount: 650000,
    method: 'Click',
    date: '2026-09-08 11:15',
    status: 'paid',
  },
  {
    id: 'PAY-003',
    student: 'Olimjon Sobirov',
    group: 'Frontend 2-guruh',
    course: 'Frontend Development',
    amount: 850000,
    method: 'Naqd',
    date: '2026-09-06 16:45',
    status: 'paid',
  },
  {
    id: 'PAY-004',
    student: 'Kamola Rustamova',
    group: 'React amaliyot',
    course: 'React.js',
    amount: 450000,
    method: 'Karta',
    date: '2026-09-02 10:20',
    status: 'paid',
  },
  {
    id: 'PAY-005',
    student: 'Nodira Salimova',
    group: 'Python boshlang‘ich',
    course: 'Python Development',
    amount: 650000,
    method: 'Payme',
    date: '2026-09-05 13:10',
    status: 'paid',
  },
]

const incomeData = {
  days: [
    { name: '01', value: 420000 },
    { name: '05', value: 510000 },
    { name: '10', value: 680000 },
    { name: '15', value: 590000 },
    { name: '20', value: 820000 },
    { name: '25', value: 760000 },
    { name: '30', value: 980000 },
  ],
  months: [
    { name: 'Yan', value: 8200000 },
    { name: 'Fev', value: 9100000 },
    { name: 'Mar', value: 10400000 },
    { name: 'Apr', value: 9800000 },
    { name: 'May', value: 12100000 },
    { name: 'Iyun', value: 13500000 },
  ],
  monthsEn: [
    { name: 'Jan', value: 8200000 },
    { name: 'Feb', value: 9100000 },
    { name: 'Mar', value: 10400000 },
    { name: 'Apr', value: 9800000 },
    { name: 'May', value: 12100000 },
    { name: 'Jun', value: 13500000 },
  ],
  year: [
    { name: '2022', value: 82000000 },
    { name: '2023', value: 104000000 },
    { name: '2024', value: 128000000 },
    { name: '2025', value: 156000000 },
    { name: '2026', value: 184000000 },
  ],
}

type Labels = Record<string, string>

// ==========================================
// ASOSIY COMPONENT: FinanceDashboard
// ==========================================

export function FinanceDashboard({
  section = 'dashboard',
}: {
  section?: string
}) {
  const { language } = useLanguage()
  const user = useAuthStore((state) => state.auth.user)
  const isEnglish = language === 'en'

  const labels = useMemo<Labels>(
    () =>
      isEnglish
        ? {
            locale: 'en',
            dashboard: 'Overview',
            finance: 'Finance',
            payments: 'Payments',
            debt: 'Debts Control',
            students: 'Groups & Students',
            reports: 'Analytics & Reports',
            profile: 'My profile',
            settings: 'Settings',
            settingsHint: 'Manage preferences for your finance workspace.',
            totalIncome: 'Total income',
            todayIncome: 'Today’s income',
            monthIncome: 'This month’s income',
            pendingPayments: 'Pending payments',
            totalDebt: 'Outstanding debt',
            refunded: 'Refunded payments',
            incomeAnalytics: 'Revenue analytics',
            last30Days: 'Last 30 days',
            last6Months: 'Last 6 months',
            lastYear: 'Last year',
            paymentMethods: 'Payment methods',
            cash: 'Cash',
            card: 'Card',
            click: 'Click',
            payme: 'Payme',
            bankTransfer: 'Bank transfer',
            courseFinance: 'Revenue by course',
            addPayment: 'Add payment',
            search: 'Search...',
            empty: 'No records found.',
            save: 'Save',
            cancel: 'Cancel',
            exportExcel: 'Excel (CSV)',
            exportPdf: 'PDF',
            print: 'Print',
          }
        : {
            locale: 'uz',
            dashboard: 'Umumiy ko‘rsatkichlar',
            finance: 'Moliya',
            payments: 'To‘lovlar',
            debt: 'Qarzdorlik nazorati',
            students: 'Guruhlar va o‘quvchilar',
            reports: 'Tahliliy hisobotlar',
            profile: 'Profilim',
            settings: 'Sozlamalar',
            settingsHint: 'Moliya ish maydoni sozlamalarini boshqaring.',
            totalIncome: 'Jami tushum',
            todayIncome: 'Bugungi tushum',
            monthIncome: 'Shu oy tushumi',
            pendingPayments: 'Kutilayotgan to‘lovlar',
            totalDebt: 'Jami qarzdorlik',
            refunded: 'Qaytarilgan to‘lovlar',
            incomeAnalytics: 'Tushum dinamikasi',
            last30Days: 'Oxirgi 30 kun',
            last6Months: 'Oxirgi 6 oy',
            lastYear: 'Oxirgi 1 yil',
            paymentMethods: 'To‘lov usullari',
            cash: 'Naqd',
            card: 'Karta',
            click: 'Click',
            payme: 'Payme',
            bankTransfer: 'Bank o‘tkazmasi',
            courseFinance: 'Kurslar bo‘yicha moliya',
            addPayment: 'To‘lov qo‘shish',
            search: 'Qidirish...',
            empty: 'Ma’lumot topilmadi.',
            save: 'Saqlash',
            cancel: 'Bekor qilish',
            exportExcel: 'Excel (CSV)',
            exportPdf: 'PDF',
            print: 'Chop etish',
          },
    [isEnglish]
  )

  const shell = (content: React.ReactNode) => (
    <>
      <Header>
        <Search />
        <ThemeSwitch />
      </Header>
      <Main>{content}</Main>
    </>
  )

  if (section === 'payments') return shell(<PaymentsPage labels={labels} />)
  if (section === 'debt') return shell(<DebtPage labels={labels} />)
  if (section === 'students') return shell(<StudentsPage labels={labels} />)
  if (section === 'reports') return shell(<ReportsPage labels={labels} />)
  if (section === 'profile')
    return shell(
      <RoleProfilePage
        title={labels.profile}
        description='Shaxsiy profilingiz ma’lumotlarini tahrirlang'
      />
    )
  if (section === 'settings') return shell(<RoleSettingsPage labels={labels} />)
  if (section !== 'dashboard') return <NotFoundError />

  return shell(<Dashboard labels={labels} name={user?.name} />)
}

// ==========================================
// IXCHAM VA PROFESSIONAL HEADING (6-BAND)
// ==========================================

function Heading({
  breadcrumb,
  title,
  description,
  action,
}: {
  breadcrumb: string
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className='mb-6 flex flex-col justify-between gap-4 border-b border-border/40 pb-5 sm:flex-row sm:items-end'>
      <div>
        <div className='flex items-center gap-1.5 text-xs font-medium text-muted-foreground'>
          <span>Moliya</span>
          <ChevronRight className='size-3 text-muted-foreground/60' />
          <span className='font-semibold text-primary'>{breadcrumb}</span>
        </div>
        <h1 className='mt-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
          {title}
        </h1>
        <p className='mt-1 text-xs text-muted-foreground sm:text-sm'>
          {description}
        </p>
      </div>
      {action && <div className='shrink-0'>{action}</div>}
    </div>
  )
}

// ==========================================
// 1. MOLIYA BOSH SAHIFASI (DASHBOARD - 2-BAND)
// ==========================================

function Dashboard({ labels, name }: { labels: Labels; name?: string }) {
  const [range, setRange] = useState<'days' | 'months' | 'year'>('days')
  const financeApi = useQuery({
    queryKey: ['backend', 'finance', 'summary'],
    queryFn: () => getApiData<FinanceSummaryApi>('/api/v1/finance/summary'),
    enabled: isBackendEnabled(),
  })

  const format = (value: number) =>
    `${new Intl.NumberFormat(labels.locale === 'en' ? 'en-US' : 'uz-UZ').format(value)} ${labels.locale === 'en' ? 'UZS' : 'so‘m'}`

  const data =
    incomeData[
      range === 'months'
        ? labels.locale === 'en'
          ? 'monthsEn'
          : 'months'
        : range
    ]

  const methods = [
    [labels.card, 45, CreditCard],
    [labels.cash, 25, Banknote],
    [labels.payme, 20, Smartphone],
    [labels.click, 10, Smartphone],
  ] as const

  const courses = [
    { name: 'Frontend Development', students: 45, income: 4500000, debt: 600000 },
    { name: 'Python Backend', students: 30, income: 3200000, debt: 400000 },
    { name: 'Ingliz tili / IELTS', students: 70, income: 5800000, debt: 900000 },
  ]

  return (
    <>
      <Heading
        breadcrumb='Umumiy ko‘rsatkichlar'
        title='Moliya bosh sahifasi'
        description={`Xayrli kun, ${name || 'Moliya xodimi'}! Markazning joriy moliyaviy holati, tushumlar va kassa balansi.`}
        action={
          <a href='/finance/payments'>
            <Button className='gap-2 shadow-xs'>
              <Plus className='size-4' />
              {labels.addPayment}
            </Button>
          </a>
        }
      />

      <BackendStatusCard
        title={labels.locale === 'en' ? 'Live finance data' : 'Backend moliya ma’lumotlari'}
        description={labels.locale === 'en' ? 'Academy-scoped totals returned by the Finance API.' : 'Finance API qaytargan akademiya bo‘yicha jamlanma.'}
        status={!isBackendEnabled() ? 'disabled' : financeApi.isPending ? 'loading' : financeApi.isError ? 'error' : 'connected'}
        statusLabels={{
          disabled: labels.locale === 'en' ? 'Demo mode' : 'Demo rejim',
          loading: labels.locale === 'en' ? 'Loading' : 'Yuklanmoqda',
          error: labels.locale === 'en' ? 'API error' : 'API xatosi',
          connected: labels.locale === 'en' ? 'Connected' : 'Ulandi',
        }}
        errorMessage={apiErrorMessage(financeApi.error)}
        metrics={financeApi.data ? [
          { label: labels.locale === 'en' ? 'Collected' : 'Yig‘ilgan', value: formatApiCurrency(financeApi.data.collectedRevenue, labels.locale === 'en' ? 'en-US' : 'uz-UZ') },
          { label: labels.locale === 'en' ? 'Outstanding' : 'Qarzdorlik', value: formatApiCurrency(financeApi.data.outstandingBalance, labels.locale === 'en' ? 'en-US' : 'uz-UZ') },
          { label: labels.locale === 'en' ? 'Overdue' : 'Muddati o‘tgan', value: formatApiCurrency(financeApi.data.overdueBalance, labels.locale === 'en' ? 'en-US' : 'uz-UZ') },
          { label: labels.locale === 'en' ? 'Invoices' : 'Hisoblar', value: financeApi.data.counts.invoices },
        ] : []}
      />

      {/* 6 TA ASOSIY KPI KARTALARI */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
        <Metric
          icon={WalletCards}
          title={labels.totalIncome}
          value={format(1950000)}
          detail='+12% o‘tgan oyga nisbatan'
          trend='up'
        />
        <Metric
          icon={CalendarDays}
          title={labels.todayIncome}
          value={format(980000)}
          detail='Bugungi jami kirim'
        />
        <Metric
          icon={TrendingUp}
          title={labels.monthIncome}
          value={format(13500000)}
          detail='Reja: 20,000,000 so‘m'
        />
        <Metric
          icon={CreditCard}
          title={labels.pendingPayments}
          value={format(450000)}
          detail='Yaqin kunlarda kutilmoqda'
        />
        <Metric
          icon={AlertTriangle}
          title='Jami qarzdorlik'
          value={format(1450000)}
          detail='3 ta o‘quvchida kechikkan'
          trend='down'
        />
        <Metric
          icon={RotateCcw}
          title={labels.refunded}
          value={format(120000)}
          detail='Qaytarilgan to‘lovlar'
        />
      </div>

      {/* GRAFIK VA TO'LOV USULLARI */}
      <div className='mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]'>
        {/* Tushum dinamikasi */}
        <Card className='border-border/70 shadow-xs'>
          <CardHeader className='pb-3'>
            <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
              <div>
                <CardTitle className='text-base font-semibold'>
                  {labels.incomeAnalytics}
                </CardTitle>
                <CardDescription className='text-xs'>
                  O‘quv to‘lovlarining tushum oqimi dinamikasi
                </CardDescription>
              </div>
              <div className='flex gap-1 rounded-lg border border-border/60 bg-muted/40 p-1'>
                {(
                  [
                    ['days', labels.last30Days],
                    ['months', labels.last6Months],
                    ['year', labels.lastYear],
                  ] as const
                ).map(([key, text]) => (
                  <Button
                    key={key}
                    size='sm'
                    variant={range === key ? 'default' : 'ghost'}
                    className='h-7 text-xs px-2.5'
                    onClick={() => setRange(key)}
                  >
                    {text}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='h-[260px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id='incomeFill' x1='0' y1='0' x2='0' y2='1'>
                      <stop
                        offset='5%'
                        stopColor='var(--primary)'
                        stopOpacity={0.25}
                      />
                      <stop
                        offset='95%'
                        stopColor='var(--primary)'
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray='3 3'
                    stroke='var(--border)'
                    opacity={0.6}
                  />
                  <XAxis
                    dataKey='name'
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                    tickFormatter={(value) =>
                      `${Math.round(Number(value) / 1000000)}M`
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--popover)',
                      color: 'var(--popover-foreground)',
                    }}
                    formatter={(value) => [format(Number(value)), 'Tushum']}
                  />
                  <Area
                    type='monotone'
                    dataKey='value'
                    stroke='var(--primary)'
                    fill='url(#incomeFill)'
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* To'lov usullari ulushi */}
        <Card className='border-border/70 shadow-xs'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-base font-semibold'>
              {labels.paymentMethods}
            </CardTitle>
            <CardDescription className='text-xs'>
              Tushumlarning to‘lov kanallari bo‘yicha taqsimoti
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {methods.map(([method, percent, Icon]) => (
              <div key={method} className='space-y-1.5'>
                <div className='flex items-center justify-between text-xs font-medium'>
                  <span className='flex items-center gap-2'>
                    <Icon className='size-4 text-primary' />
                    {method}
                  </span>
                  <span className='font-semibold'>{percent}%</span>
                </div>
                <div className='h-2 rounded-full bg-muted overflow-hidden'>
                  <div
                    className='h-full rounded-full bg-primary transition-all duration-500'
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            ))}

            {/* Kassa va hisob raqamlari balansi (YANGI FOYDALI BLOK) */}
            <div className='mt-5 rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-2'>
              <p className='text-xs font-semibold text-foreground uppercase tracking-wider'>
                Kassa va hisob raqamlar
              </p>
              <div className='flex items-center justify-between text-xs'>
                <span className='text-muted-foreground'>Asosiy bank hisobida:</span>
                <span className='font-mono font-semibold'>8,200,000 so‘m</span>
              </div>
              <div className='flex items-center justify-between text-xs'>
                <span className='text-muted-foreground'>Naqd pul seyfda:</span>
                <span className='font-mono font-semibold text-emerald-600 dark:text-emerald-400'>
                  4,800,000 so‘m
                </span>
              </div>
              <div className='flex items-center justify-between text-xs'>
                <span className='text-muted-foreground'>Payme / Click tranzit:</span>
                <span className='font-mono font-semibold'>2,500,000 so‘m</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PASTKI QATOR: SO'NGGI TO'LOVLAR OQIMI VA KURSLAR MOLIYASI (QARZDORLIK DUBLIKATI OLIB TASHLANDI) */}
      <div className='mt-6 grid gap-6 xl:grid-cols-2'>
        {/* 1. So'nggi operatsiyalar oqimi */}
        <Card className='border-border/70 shadow-xs'>
          <CardHeader className='flex flex-row items-center justify-between border-b pb-3'>
            <div>
              <CardTitle className='text-base font-semibold'>
                So‘nggi to‘lovlar oqimi
              </CardTitle>
              <CardDescription className='text-xs'>
                Bugun va so‘nggi kunlarda amalga oshirilgan kirimlar
              </CardDescription>
            </div>
            <a href='/finance/payments'>
              <Button variant='ghost' size='sm' className='text-xs gap-1 h-8'>
                Barchasi <ChevronRight className='size-3.5' />
              </Button>
            </a>
          </CardHeader>
          <CardContent className='pt-3 space-y-2.5'>
            {recentPayments.slice(0, 4).map((pay) => (
              <div
                key={pay.id}
                className='flex items-center justify-between rounded-xl border border-border/60 bg-card p-3 transition-colors hover:bg-muted/20'
              >
                <div className='flex items-center gap-3'>
                  <span className='flex size-9 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary'>
                    {pay.student
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </span>
                  <div>
                    <p className='text-sm font-semibold leading-tight'>
                      {pay.student}
                    </p>
                    <p className='text-xs text-muted-foreground mt-0.5'>
                      {pay.group} ·{' '}
                      <span className='font-medium text-foreground/80'>
                        {pay.method}
                      </span>
                    </p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-sm font-bold text-emerald-600 dark:text-emerald-400'>
                    +{format(pay.amount)}
                  </p>
                  <p className='text-[11px] text-muted-foreground font-mono'>
                    {pay.date}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 2. Kurslar bo'yicha daromad tahlili */}
        <Card className='border-border/70 shadow-xs'>
          <CardHeader className='border-b pb-3'>
            <CardTitle className='text-base font-semibold'>
              {labels.courseFinance}
            </CardTitle>
            <CardDescription className='text-xs'>
              Kurslar bo‘yicha o‘quvchilar soni, daromad va qarzdorlik
            </CardDescription>
          </CardHeader>
          <CardContent className='pt-3 overflow-x-auto'>
            <table className='w-full text-xs sm:text-sm'>
              <thead>
                <tr className='border-b text-muted-foreground'>
                  <th className='p-2 text-start font-medium'>Kurs nomi</th>
                  <th className='p-2 text-end font-medium'>O‘quvchilar</th>
                  <th className='p-2 text-end font-medium'>Tushum</th>
                  <th className='p-2 text-end font-medium'>Qarz miqdori</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border/60'>
                {courses.map((course) => (
                  <tr
                    key={course.name}
                    className='transition-colors hover:bg-muted/20'
                  >
                    <td className='p-2 font-medium'>{course.name}</td>
                    <td className='p-2 text-end font-mono'>{course.students} ta</td>
                    <td className='p-2 text-end font-semibold text-emerald-600 dark:text-emerald-400'>
                      {format(course.income)}
                    </td>
                    <td className='p-2 text-end font-semibold text-rose-600 dark:text-rose-400'>
                      {format(course.debt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

// ==========================================
// 2. QARZDORLIK SAHIFASI (DEBTPAGE - 1-BAND)
// ==========================================

function DebtPage({ labels }: { labels: Labels }) {
  const format = (value: number) =>
    `${new Intl.NumberFormat(labels.locale === 'en' ? 'en-US' : 'uz-UZ').format(value)} ${labels.locale === 'en' ? 'UZS' : 'so‘m'}`

  const [studentsList, setStudentsList] = useState(initialStudents)
  const [query, setQuery] = useState('')
  const [filterPeriod, setFilterPeriod] = useState<
    'all' | '1-7' | '8-15' | '15+'
  >('all')
  const [filterGroup, setFilterGroup] = useState<string>('all')

  // Qarzdor o'quvchilar ro'yxati
  const debtors = studentsList.filter((s) => s.debt > 0)

  // Filtrlangan qarzdorlar
  const filteredDebtors = debtors.filter((item) => {
    const matchesQuery =
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.groupName.toLowerCase().includes(query.toLowerCase()) ||
      item.phone.includes(query)

    const matchesPeriod =
      filterPeriod === 'all'
        ? true
        : filterPeriod === '1-7'
          ? item.overdueDays >= 1 && item.overdueDays <= 7
          : filterPeriod === '8-15'
            ? item.overdueDays >= 8 && item.overdueDays <= 15
            : item.overdueDays > 15

    const matchesGroup =
      filterGroup === 'all' ? true : item.groupName === filterGroup

    return matchesQuery && matchesPeriod && matchesGroup
  })

  // Jami hisob-kitoblar
  const totalDebtAmount = debtors.reduce((sum, s) => sum + s.debt, 0)
  const totalDebtorsCount = debtors.length
  const averageDebt =
    totalDebtorsCount > 0 ? Math.round(totalDebtAmount / totalDebtorsCount) : 0
  const severeDebtorsCount = debtors.filter((s) => s.overdueDays >= 10).length

  // Qarzni to'lash funksiyasi
  const settleDebt = (studentId: string, studentName: string) => {
    setStudentsList((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? { ...s, debt: 0, balance: 0, overdueDays: 0, status: 'paid' }
          : s
      )
    )
    toast.success(`${studentName} uchun qarz to‘liq so‘ndirildi!`)
  }

  // SMS eslatma yuborish
  const sendSmsReminder = (student: FinanceStudent) => {
    toast.success(
      `${student.name}ga (${student.phone}) qarzdorlik eslatmasi SMS orqali yuborildi!`
    )
  }

  // CSV yuklab olish
  const downloadDebtReport = () => {
    const header = 'O‘quvchi,Guruhi,Kursi,Telefoni,Qarz miqdori,Kechikkan kunlar\n'
    const rows = filteredDebtors
      .map(
        (s) =>
          `"${s.name}","${s.groupName}","${s.course}","${s.phone}",${s.debt},${s.overdueDays}`
      )
      .join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'qarzdorlar-hisoboti.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Qarzdorlar hisoboti CSV formatida yuklab olindi!')
  }

  return (
    <>
      <Heading
        breadcrumb='Qarzdorlik nazorati'
        title='Qarzdorlik boshqaruvi'
        description='To‘lov muddati o‘tgan o‘quvchilar, qarzdorlik dinamikasi va eslatma yuborish amallari.'
        action={
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={downloadDebtReport}
              className='gap-1.5'
            >
              <Download className='size-3.5' />
              Eksport (CSV)
            </Button>
            <Button
              size='sm'
              className='gap-1.5'
              onClick={() => {
                debtors.forEach((d) => sendSmsReminder(d))
                toast.success('Barcha qarzdorlarga umumiy SMS eslatma jo‘natildi!')
              }}
            >
              <Send className='size-3.5' />
              Barchaga SMS jo‘natish
            </Button>
          </div>
        }
      />

      {/* 4 TA ANIQ VA TUSHUNARLI KPI KARTALARI */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card className='border-border/70 shadow-xs'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              Jami qarzdorlik
            </CardTitle>
            <span className='rounded-xl bg-rose-500/10 p-2 text-rose-600 dark:text-rose-400'>
              <TrendingDown className='size-4' />
            </span>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-rose-600 dark:text-rose-400'>
              {format(totalDebtAmount)}
            </div>
            <p className='mt-1 text-xs text-muted-foreground'>
              O‘tgan oyga nisbatan -15% kamaygan
            </p>
          </CardContent>
        </Card>

        <Card className='border-border/70 shadow-xs'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              Qarzdor o‘quvchilar
            </CardTitle>
            <span className='rounded-xl bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400'>
              <AlertTriangle className='size-4' />
            </span>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalDebtorsCount} nafar</div>
            <p className='mt-1 text-xs text-amber-600 dark:text-amber-400 font-medium'>
              {severeDebtorsCount} nafarida 10 kundan oshiq
            </p>
          </CardContent>
        </Card>

        <Card className='border-border/70 shadow-xs'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              O‘rtacha qarz miqdori
            </CardTitle>
            <span className='rounded-xl bg-primary/10 p-2 text-primary'>
              <Wallet className='size-4' />
            </span>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{format(averageDebt)}</div>
            <p className='mt-1 text-xs text-muted-foreground'>
              Har bir qarzdor o‘quvchiga to‘g‘ri keladi
            </p>
          </CardContent>
        </Card>

        <Card className='border-border/70 shadow-xs'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              Undirilgan qarzlar (oy)
            </CardTitle>
            <span className='rounded-xl bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400'>
              <CheckCircle2 className='size-4' />
            </span>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-emerald-600 dark:text-emerald-400'>
              {format(4200000)}
            </div>
            <p className='mt-1 text-xs text-muted-foreground'>
              Bu oyda 8 ta to‘lov muvaffaqiyatli yopildi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* DINAMIKA GRAFIGI VA ENG KATTA QARZLAR */}
      <div className='mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]'>
        {/* Qarzdorlik dinamikasi grafigi */}
        <Card className='border-border/70 shadow-xs'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-base font-semibold'>
              Qarzdorlik dinamikasi
            </CardTitle>
            <CardDescription className='text-xs'>
              Oxirgi 6 oydagi umumiy qarzdorlikning kamayib borish tendentsiyasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='h-[240px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart
                  data={[
                    { name: 'Apr', value: 4200000 },
                    { name: 'May', value: 3600000 },
                    { name: 'Iyun', value: 2900000 },
                    { name: 'Iyul', value: 2800000 },
                    { name: 'Avg', value: 3100000 },
                    { name: 'Sen', value: totalDebtAmount },
                  ]}
                >
                  <defs>
                    <linearGradient id='debtFill' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor='#0c0d12' stopOpacity={0.25} />
                      <stop offset='95%' stopColor='#0c0d12' stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray='3 3'
                    stroke='var(--border)'
                    opacity={0.6}
                  />
                  <XAxis
                    dataKey='name'
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                    tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--popover)',
                    }}
                    formatter={(val) => [format(Number(val)), 'Qarz miqdori']}
                  />
                  <Area
                    type='monotone'
                    dataKey='value'
                    stroke='#0c0d12'
                    fill='url(#debtFill)'
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Eng ko'p qarzdor o'quvchilar */}
        <Card className='border-border/70 shadow-xs'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-base font-semibold'>
              Birinchi navbatdagi qarzdorlar
            </CardTitle>
            <CardDescription className='text-xs'>
              Kechikish muddati va qarz summasi eng yuqori bo‘lganlar
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-3.5'>
            {debtors
              .slice()
              .sort((a, b) => b.debt - a.debt)
              .slice(0, 3)
              .map((item, idx) => (
                <div key={item.id} className='space-y-1.5'>
                  <div className='flex items-center justify-between text-xs'>
                    <span className='font-semibold text-foreground flex items-center gap-1.5'>
                      <span className='size-5 rounded-full bg-muted flex items-center justify-center text-[10px]'>
                        {idx + 1}
                      </span>
                      {item.name}
                    </span>
                    <span className='font-mono font-bold text-rose-600 dark:text-rose-400'>
                      {format(item.debt)}
                    </span>
                  </div>
                  <div className='h-2 rounded-full bg-muted overflow-hidden'>
                    <div
                      className='h-full rounded-full bg-rose-500'
                      style={{
                        width: `${Math.min(100, (item.debt / 800000) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className='flex justify-between text-[11px] text-muted-foreground'>
                    <span>{item.groupName}</span>
                    <span className='text-amber-600 font-medium'>
                      {item.overdueDays} kun kechikkan
                    </span>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* QARZDOR O'QUVCHILAR RO'YXATI (FILTRLAR VA AMALLAR BILAN) */}
      <Card className='mt-6 border-border/70 shadow-xs'>
        <CardHeader className='border-b pb-4'>
          <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
            <div>
              <CardTitle className='text-base font-semibold'>
                Qarzdor o‘quvchilar ro‘yxati
              </CardTitle>
              <CardDescription className='text-xs'>
                Qarzdorlar bilan ishlash, to‘lovni qabul qilish va eslatma
                yuborish
              </CardDescription>
            </div>

            {/* Qidiruv va Filtrlar */}
            <div className='flex flex-wrap items-center gap-2'>
              <div className='relative w-full sm:w-56'>
                <SearchIcon className='absolute start-2.5 top-2.5 size-3.5 text-muted-foreground' />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder='Ism yoki telefon...'
                  className='h-8 ps-8 text-xs'
                />
              </div>

              {/* Muddat filtri */}
              <div className='flex rounded-lg border border-border/70 bg-muted/30 p-0.5 text-xs'>
                {(
                  [
                    ['all', 'Barchasi'],
                    ['1-7', '1–7 kun'],
                    ['8-15', '8–15 kun'],
                    ['15+', '15+ kun'],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type='button'
                    onClick={() => setFilterPeriod(key)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                      filterPeriod === key
                        ? 'bg-background text-foreground shadow-2xs font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Guruh filtri */}
              <select
                value={filterGroup}
                onChange={(e) => setFilterGroup(e.target.value)}
                className='h-8 rounded-lg border border-border/70 bg-background px-2 text-xs text-foreground shadow-2xs focus:outline-none'
              >
                <option value='all'>Barcha guruhlar</option>
                {initialGroups.map((g) => (
                  <option key={g.id} value={g.name}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className='pt-4 space-y-3'>
          {filteredDebtors.map((student) => (
            <div
              key={student.id}
              className='flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-4 transition-all hover:border-primary/40 hover:bg-muted/15 sm:flex-row sm:items-center sm:justify-between'
            >
              <div className='flex items-center gap-3'>
                <div className='flex size-11 shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 text-xs font-bold text-rose-600 dark:text-rose-400 shadow-2xs'>
                  {student.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div>
                  <div className='flex items-center gap-2'>
                    <p className='font-semibold text-sm text-foreground'>
                      {student.name}
                    </p>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        student.overdueDays >= 10
                          ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {student.overdueDays} kun kechikkan
                    </span>
                  </div>
                  <p className='mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground'>
                    <span>{student.groupName}</span>
                    <span>•</span>
                    <span>{student.course}</span>
                    <span>•</span>
                    <span className='font-mono'>{student.phone}</span>
                    <span>•</span>
                    <span>Oxirgi to‘lov: {student.lastPaymentDate}</span>
                  </p>
                </div>
              </div>

              {/* Amallar */}
              <div className='flex items-center justify-between gap-3 border-t border-border/50 pt-2 sm:border-0 sm:pt-0'>
                <div className='text-right'>
                  <p className='text-xs text-muted-foreground'>Qarz summasi:</p>
                  <p className='text-base font-bold text-rose-600 dark:text-rose-400'>
                    {format(student.debt)}
                  </p>
                </div>

                <div className='flex items-center gap-1.5'>
                  {/* SMS eslatma */}
                  <Button
                    size='sm'
                    variant='outline'
                    className='gap-1.5 h-8 text-xs border-amber-500/30 text-amber-700 hover:bg-amber-500/10 dark:text-amber-300'
                    onClick={() => sendSmsReminder(student)}
                    title='Qarzdorlik eslatmasi SMS yuborish'
                  >
                    <MessageSquare className='size-3.5' />
                    SMS
                  </Button>

                  {/* To'landi deb belgilash */}
                  <Button
                    size='sm'
                    className='gap-1.5 h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    onClick={() => settleDebt(student.id, student.name)}
                  >
                    <CheckCircle2 className='size-3.5' />
                    To‘landi deb belgilash
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {filteredDebtors.length === 0 && (
            <div className='py-12 text-center text-muted-foreground'>
              <CheckCircle2 className='mx-auto size-10 text-emerald-500/60 mb-2' />
              <p className='text-sm font-medium text-foreground'>
                Qarzdorliklar topilmadi!
              </p>
              <p className='text-xs mt-1'>
                Barcha o‘quvchilar dars to‘lovlarini o‘z vaqtida amalga oshirgan.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}

// ==========================================
// 3 & 4. GURUHLAR VA O'QUVCHILAR (STUDENTSPAGE - 3- VA 4-BANDLAR)
// ==========================================

function StudentsPage({ labels }: { labels: Labels }) {
  const format = (value: number) =>
    `${new Intl.NumberFormat(labels.locale === 'en' ? 'en-US' : 'uz-UZ').format(value)} ${labels.locale === 'en' ? 'UZS' : 'so‘m'}`

  const [groupsList, setGroupsList] = useState(initialGroups)
  const [studentsList, setStudentsList] = useState(initialStudents)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [query, setQuery] = useState('')
  const [filterCourse, setFilterCourse] = useState('all')

  // Yangi o'quvchi qo'shish modal holatlari
  const [newStudentName, setNewStudentName] = useState('')
  const [newStudentPhone, setNewStudentPhone] = useState('')
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)

  // Tanlangan guruh
  const currentGroup = groupsList.find((g) => g.id === selectedGroupId)
  const groupStudents = studentsList.filter(
    (s) => s.groupId === selectedGroupId
  )

  // Filtrlangan guruhlar
  const filteredGroups = groupsList.filter((g) => {
    const matchesQuery =
      g.name.toLowerCase().includes(query.toLowerCase()) ||
      g.teacher.toLowerCase().includes(query.toLowerCase())
    const matchesCourse =
      filterCourse === 'all' || g.course === filterCourse
    return matchesQuery && matchesCourse
  })

  // Yangi o'quvchi qo'shish
  const handleAddStudent = () => {
    if (!newStudentName.trim() || !newStudentPhone.trim()) {
      toast.error('Iltimos, o‘quvchining ismi va telefon raqamini kiriting!')
      return
    }

    if (!selectedGroupId || !currentGroup) return

    const newId = `stu-${Date.now()}`
    const newStudent: FinanceStudent = {
      id: newId,
      name: newStudentName.trim(),
      phone: newStudentPhone.trim(),
      groupId: selectedGroupId,
      groupName: currentGroup.name,
      course: currentGroup.course,
      balance: 0,
      debt: 0,
      overdueDays: 0,
      lastPaymentDate: new Date().toISOString().slice(0, 10),
      status: 'paid',
    }

    setStudentsList((prev) => [...prev, newStudent])
    setGroupsList((prev) =>
      prev.map((g) =>
        g.id === selectedGroupId
          ? { ...g, studentsCount: g.studentsCount + 1 }
          : g
      )
    )

    toast.success(`${newStudentName} guruhga muvaffaqiyatli qo‘shildi!`)
    setNewStudentName('')
    setNewStudentPhone('')
    setIsAddStudentOpen(false)
  }

  // ------------------------------------------
  // AGAR GURUH TANLANGAN BO'LSA (4-BAND: GURUH ICHI)
  // ------------------------------------------
  if (currentGroup) {
    const groupDebtors = groupStudents.filter((s) => s.debt > 0)
    const totalGroupDebt = groupStudents.reduce((sum, s) => sum + s.debt, 0)

    return (
      <div className='space-y-6'>
        {/* Yuqori orqaga qaytish va harakatlar */}
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4'>
          <div className='flex items-center gap-3'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setSelectedGroupId(null)}
              className='gap-1.5'
            >
              ← Barcha guruhlar
            </Button>
            <div>
              <h1 className='text-2xl font-bold tracking-tight'>
                {currentGroup.name}
              </h1>
              <p className='text-xs text-muted-foreground'>
                {currentGroup.course} · O‘qituvchi: {currentGroup.teacher}
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              size='sm'
              className='gap-1.5'
              onClick={() => setIsAddStudentOpen(true)}
            >
              <UserPlus className='size-4' />
              O‘quvchi qo‘shish
            </Button>
          </div>
        </div>

        {/* GURUH PASPORTI (3 TA ASOSIY METRIKA) */}
        <div className='grid gap-4 sm:grid-cols-3'>
          <Card className='border-border/70 shadow-xs'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                Guruh o‘quvchilari
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{groupStudents.length} ta</div>
              <p className='mt-1 text-xs text-muted-foreground'>
                Guruh sig‘imi: {currentGroup.capacity} o‘rin
              </p>
            </CardContent>
          </Card>

          <Card className='border-border/70 shadow-xs'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                O‘qituvchi va dars vaqti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-lg font-bold truncate'>
                {currentGroup.teacher}
              </div>
              <p className='mt-1 text-xs text-muted-foreground'>
                {currentGroup.schedule} · {currentGroup.room}
              </p>
            </CardContent>
          </Card>

          <Card className='border-border/70 shadow-xs'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                Guruh qarzdorligi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  totalGroupDebt > 0
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {format(totalGroupDebt)}
              </div>
              <p className='mt-1 text-xs text-muted-foreground'>
                {groupDebtors.length} ta o‘quvchida kechikish bor
              </p>
            </CardContent>
          </Card>
        </div>

        {/* O'QUVCHILAR RO'YXATI VA AMALLAR */}
        <Card className='border-border/70 shadow-xs'>
          <CardHeader className='flex flex-row items-center justify-between border-b pb-3'>
            <div>
              <CardTitle className='text-base font-semibold'>
                Guruh o‘quvchilari va to‘lov holati
              </CardTitle>
              <CardDescription className='text-xs'>
                O‘quvchilar balansi, qarzlar va tezkor kvitansiya
              </CardDescription>
            </div>
            <Badge variant='outline' className='font-mono'>
              {groupStudents.length} nafar o‘quvchi
            </Badge>
          </CardHeader>
          <CardContent className='pt-4 divide-y divide-border/60'>
            {groupStudents.map((stu) => {
              const hasDebt = stu.debt > 0
              return (
                <div
                  key={stu.id}
                  className='flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between transition-colors hover:bg-muted/15 px-2 rounded-lg'
                >
                  <div className='flex items-center gap-3'>
                    <span className='flex size-10 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary'>
                      {stu.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </span>
                    <div>
                      <p className='font-semibold text-sm'>{stu.name}</p>
                      <p className='text-xs text-muted-foreground mt-0.5 flex items-center gap-2'>
                        <span className='font-mono'>{stu.phone}</span>
                        <span>•</span>
                        <span>Oxirgi to‘lov: {stu.lastPaymentDate}</span>
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center justify-between sm:justify-end gap-3'>
                    <div className='text-right'>
                      <p className='text-[11px] text-muted-foreground'>
                        To‘lov holati:
                      </p>
                      <p
                        className={`text-xs font-bold ${
                          hasDebt
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {hasDebt ? `-${format(stu.debt)}` : 'To‘langan'}
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        hasDebt
                          ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20'
                          : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          hasDebt ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                      />
                      {hasDebt
                        ? `${stu.overdueDays} kun qarz`
                        : 'Qarzsiz'}
                    </span>

                    {/* Tezkor amallar */}
                    <div className='flex items-center gap-1'>
                      {hasDebt && (
                        <Button
                          size='sm'
                          variant='outline'
                          className='h-7 text-xs border-emerald-500/30 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300'
                          onClick={() => {
                            setStudentsList((prev) =>
                              prev.map((s) =>
                                s.id === stu.id
                                  ? { ...s, debt: 0, balance: 0, status: 'paid' }
                                  : s
                              )
                            )
                            toast.success(`${stu.name} uchun to‘lov qabul qilindi!`)
                          }}
                        >
                          To‘lov
                        </Button>
                      )}
                      <Button
                        size='icon'
                        variant='ghost'
                        className='size-8 text-muted-foreground hover:text-foreground'
                        onClick={() =>
                          toast.success(`${stu.name} uchun kvitansiya tayyorlandi!`)
                        }
                        title='Chek ko‘rish'
                      >
                        <FileText className='size-3.5' />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* YANGI O'QUVCHI QO'SHISH MODAL OYNASI */}
        {isAddStudentOpen && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='w-full max-w-md rounded-2xl border border-border/80 bg-background p-6 shadow-2xl space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-bold'>Guruhga o‘quvchi qo‘shish</h3>
                <Button
                  size='icon'
                  variant='ghost'
                  className='size-8'
                  onClick={() => setIsAddStudentOpen(false)}
                >
                  <X className='size-4' />
                </Button>
              </div>
              <p className='text-xs text-muted-foreground'>
                {currentGroup.name} guruhi uchun yangi o‘quvchi ma’lumotlarini
                kiriting.
              </p>
              <div className='space-y-3'>
                <div>
                  <label className='text-xs font-medium text-foreground'>
                    O‘quvchi ismi va familiyasi
                  </label>
                  <Input
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder='Masalan: Jasur Qodirov'
                    className='mt-1'
                  />
                </div>
                <div>
                  <label className='text-xs font-medium text-foreground'>
                    Telefon raqami
                  </label>
                  <Input
                    value={newStudentPhone}
                    onChange={(e) => setNewStudentPhone(e.target.value)}
                    placeholder='+998 90 123 45 67'
                    className='mt-1'
                  />
                </div>
              </div>
              <div className='flex justify-end gap-2 pt-2'>
                <Button
                  variant='outline'
                  onClick={() => setIsAddStudentOpen(false)}
                >
                  Bekor qilish
                </Button>
                <Button onClick={handleAddStudent}>Qo‘shish</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ------------------------------------------
  // BARCHA GURUHLAR RO'YXATI (3-BAND)
  // ------------------------------------------
  const totalStudentsCount = studentsList.length
  const totalDebtorsCount = studentsList.filter((s) => s.debt > 0).length
  const totalPaidCount = totalStudentsCount - totalDebtorsCount

  return (
    <>
      <Heading
        breadcrumb='Guruhlar va o‘quvchilar'
        title='Guruhlar va o‘quvchilar hisobi'
        description='Guruhlar bo‘yicha to‘lovlar nazorati, o‘quvchilar soni va qarzdorlik holati.'
      />

      {/* TOP 4 TA STATISTIKA (BO'SHLIQNI YO'QOTISH VA ANIQ TASAVVUR UCHUN) */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card className='border-border/70 shadow-xs'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              Jami guruhlar
            </CardTitle>
            <span className='rounded-xl bg-primary/10 p-2 text-primary'>
              <GraduationCap className='size-4' />
            </span>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{groupsList.length} ta guruh</div>
            <p className='mt-1 text-xs text-muted-foreground'>
              Faol o‘quv guruhlari
            </p>
          </CardContent>
        </Card>

        <Card className='border-border/70 shadow-xs'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              Jami o‘quvchilar
            </CardTitle>
            <span className='rounded-xl bg-sky-500/10 p-2 text-sky-600 dark:text-sky-400'>
              <Users className='size-4' />
            </span>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalStudentsCount} nafar</div>
            <p className='mt-1 text-xs text-muted-foreground'>
              Guruhlarga biriktirilgan
            </p>
          </CardContent>
        </Card>

        <Card className='border-border/70 shadow-xs'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              To‘liq to‘laganlar
            </CardTitle>
            <span className='rounded-xl bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400'>
              <CheckCircle2 className='size-4' />
            </span>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-emerald-600 dark:text-emerald-400'>
              {totalPaidCount} nafar
            </div>
            <p className='mt-1 text-xs text-muted-foreground'>
              Qarzdorligi yo‘q o‘quvchilar
            </p>
          </CardContent>
        </Card>

        <Card className='border-border/70 shadow-xs'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              Qarzdor o‘quvchilar
            </CardTitle>
            <span className='rounded-xl bg-rose-500/10 p-2 text-rose-600 dark:text-rose-400'>
              <AlertTriangle className='size-4' />
            </span>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-rose-600 dark:text-rose-400'>
              {totalDebtorsCount} nafar
            </div>
            <p className='mt-1 text-xs text-muted-foreground'>
              To‘lov muddati kechikkan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* QIDIRUV VA VIEW SWITCHER (ODAM KO'PAYGANDA SCROLL MUAMMOSINI HAL QILISH) */}
      <div className='mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-wrap items-center gap-2'>
          <div className='relative w-full sm:w-64'>
            <SearchIcon className='absolute start-2.5 top-2.5 size-3.5 text-muted-foreground' />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Guruh yoki o‘qituvchi nomi...'
              className='h-8 ps-8 text-xs'
            />
          </div>

          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className='h-8 rounded-lg border border-border/70 bg-background px-2 text-xs text-foreground shadow-2xs focus:outline-none'
          >
            <option value='all'>Barcha kurslar</option>
            <option value='Frontend Development'>Frontend Development</option>
            <option value='Python Development'>Python Development</option>
            <option value='React.js'>React.js</option>
          </select>
        </div>

        {/* Ko'rinish rejimi: Kartalar (Grid) yoki Ixcham Jadval (Table) */}
        <div className='flex items-center gap-1 rounded-lg border border-border/70 bg-muted/40 p-1'>
          <button
            type='button'
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
              viewMode === 'grid'
                ? 'bg-background text-foreground shadow-2xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Grid3X3 className='size-3.5' />
            Kartalar
          </button>
          <button
            type='button'
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
              viewMode === 'table'
                ? 'bg-background text-foreground shadow-2xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <TableIcon className='size-3.5' />
            Jadval
          </button>
        </div>
      </div>

      {/* 1. GRID KO'RINISHI */}
      {viewMode === 'grid' && (
        <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {filteredGroups.map((grp) => {
            const groupStu = studentsList.filter((s) => s.groupId === grp.id)
            const debtAmount = groupStu.reduce((sum, s) => sum + s.debt, 0)
            const occupancy = Math.round(
              (groupStu.length / grp.capacity) * 100
            )

            return (
              <Card
                key={grp.id}
                className='group relative border-border/70 bg-card shadow-xs transition-all hover:border-primary/50 hover:shadow-md cursor-pointer'
                onClick={() => setSelectedGroupId(grp.id)}
              >
                <CardHeader className='pb-3'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <CardTitle className='text-base font-semibold group-hover:text-primary transition-colors'>
                        {grp.name}
                      </CardTitle>
                      <p className='text-xs text-muted-foreground mt-0.5'>
                        {grp.course}
                      </p>
                    </div>
                    <span className='rounded-xl bg-primary/10 p-2 text-primary'>
                      <GraduationCap className='size-4' />
                    </span>
                  </div>
                </CardHeader>
                <CardContent className='space-y-3 pt-0'>
                  {/* O'qituvchi */}
                  <div className='flex items-center justify-between text-xs'>
                    <span className='text-muted-foreground'>O‘qituvchi:</span>
                    <span className='font-semibold text-foreground'>
                      {grp.teacher}
                    </span>
                  </div>

                  {/* Sig'im progress */}
                  <div className='space-y-1'>
                    <div className='flex items-center justify-between text-xs text-muted-foreground'>
                      <span>O‘quvchilar:</span>
                      <span className='font-mono font-medium text-foreground'>
                        {groupStu.length} / {grp.capacity} ta ({occupancy}%)
                      </span>
                    </div>
                    <div className='h-1.5 rounded-full bg-muted overflow-hidden'>
                      <div
                        className='h-full rounded-full bg-primary'
                        style={{ width: `${occupancy}%` }}
                      />
                    </div>
                  </div>

                  {/* Dars vaqti va xona */}
                  <div className='flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/60'>
                    <span>{grp.schedule}</span>
                    <span className='font-medium text-foreground'>
                      {grp.room}
                    </span>
                  </div>

                  {/* Qarzdorlik nishoni */}
                  <div className='flex items-center justify-between text-xs pt-1'>
                    <span className='text-muted-foreground'>Qarzdorlik:</span>
                    <span
                      className={`font-semibold ${
                        debtAmount > 0
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {debtAmount > 0 ? format(debtAmount) : 'Qarzsiz'}
                    </span>
                  </div>

                  {/* Guruhga kirish tugmasi */}
                  <Button
                    size='sm'
                    variant='outline'
                    className='w-full mt-2 text-xs gap-1 group-hover:bg-primary group-hover:text-primary-foreground transition-all'
                  >
                    Guruhni ochish <ChevronRight className='size-3.5' />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* 2. IXCHAM JADVAL KO'RINISHI (KO'P GURUHLAR UCHUN) */}
      {viewMode === 'table' && (
        <Card className='mt-4 border-border/70 shadow-xs'>
          <CardContent className='p-0 overflow-x-auto'>
            <table className='w-full text-xs sm:text-sm text-left'>
              <thead className='border-b bg-muted/30 text-xs text-muted-foreground font-medium'>
                <tr>
                  <th className='p-3.5'>Guruh nomi</th>
                  <th className='p-3.5'>Kurs</th>
                  <th className='p-3.5'>O‘qituvchi</th>
                  <th className='p-3.5'>O‘quvchilar</th>
                  <th className='p-3.5'>Dars vaqti</th>
                  <th className='p-3.5'>Qarzdorlik</th>
                  <th className='p-3.5 text-end'>Amal</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border/60'>
                {filteredGroups.map((grp) => {
                  const groupStu = studentsList.filter(
                    (s) => s.groupId === grp.id
                  )
                  const debtAmount = groupStu.reduce(
                    (sum, s) => sum + s.debt,
                    0
                  )

                  return (
                    <tr
                      key={grp.id}
                      className='transition-colors hover:bg-muted/20 cursor-pointer'
                      onClick={() => setSelectedGroupId(grp.id)}
                    >
                      <td className='p-3.5 font-semibold text-foreground'>
                        {grp.name}
                      </td>
                      <td className='p-3.5 text-muted-foreground'>
                        {grp.course}
                      </td>
                      <td className='p-3.5 font-medium'>{grp.teacher}</td>
                      <td className='p-3.5 font-mono'>
                        {groupStu.length} / {grp.capacity}
                      </td>
                      <td className='p-3.5 text-muted-foreground'>
                        {grp.schedule} ({grp.room})
                      </td>
                      <td className='p-3.5'>
                        <span
                          className={`font-semibold ${
                            debtAmount > 0
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {debtAmount > 0 ? format(debtAmount) : '0 so‘m'}
                        </span>
                      </td>
                      <td className='p-3.5 text-end'>
                        <Button size='sm' variant='ghost' className='h-7 text-xs'>
                          Ochish →
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </>
  )
}

// ==========================================
// 4. TO'LOVLAR SAHIFASI (PAYMENTSPAGE)
// ==========================================

function PaymentsPage({ labels }: { labels: Labels }) {
  const crm = useCrmStore()
  const format = (value: number) =>
    `${new Intl.NumberFormat(labels.locale === 'en' ? 'en-US' : 'uz-UZ').format(value)} ${labels.locale === 'en' ? 'UZS' : 'so‘m'}`

  const [items, setItems] = useState<PaymentListItem[]>(() =>
    crm.payments.length
      ? crm.payments.map((payment) => ({
          id: payment.id,
          student:
            crm.students.find((student) => student.id === payment.studentId)
              ?.name ?? 'O‘quvchi',
          group:
            crm.groups.find((group) =>
              group.studentIds.includes(payment.studentId)
            )?.name ?? 'Frontend 2-guruh',
          course:
            crm.students.find((student) => student.id === payment.studentId)
              ?.course ?? 'Frontend Development',
          amount: payment.amount,
          method: payment.method,
          date: payment.date,
          status: 'paid' as const,
        }))
      : recentPayments
  )

  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [studentName, setStudentName] = useState('')
  const [groupName, setGroupName] = useState('')
  const [amount, setAmount] = useState('')

  const filtered = items.filter((item) =>
    `${item.student} ${item.id} ${item.group}`
      .toLowerCase()
      .includes(query.toLowerCase())
  )

  const savePayment = () => {
    if (!studentName.trim() || !groupName.trim()) {
      toast.error('O‘quvchi ismi va guruhini kiriting!')
      return
    }
    const num = Number(amount)
    if (!num || num <= 0) {
      toast.error('To‘lov summasini 0 dan katta kiriting!')
      return
    }

    if (editing) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editing
            ? { ...item, student: studentName, group: groupName, amount: num }
            : item
        )
      )
      toast.success('To‘lov muvaffaqiyatli yangilandi!')
    } else {
      const newPay = {
        id: `PAY-00${items.length + 1}`,
        student: studentName,
        group: groupName,
        course: 'Frontend Development',
        amount: num,
        method: 'Naqd',
        date: new Date().toISOString().slice(0, 10),
        status: 'paid' as const,
      }
      setItems((prev) => [newPay, ...prev])
      toast.success('Yangi to‘lov muvaffaqiyatli qo‘shildi!')
    }

    setEditing(null)
    setStudentName('')
    setGroupName('')
    setAmount('')
  }

  const handleEdit = (item: (typeof items)[number]) => {
    setEditing(item.id)
    setStudentName(item.student)
    setGroupName(item.group)
    setAmount(String(item.amount))
  }

  return (
    <>
      <Heading
        breadcrumb='To‘lovlar jurnali'
        title='To‘lovlar boshqaruvi'
        description='Yangi to‘lovlarni qabul qilish, tahrirlash va kvitansiyalarni chiqarish.'
      />

      {/* TO'LOV QO'SHISH SHAKLI */}
      <Card className='border-border/70 shadow-xs'>
        <CardHeader className='border-b pb-3'>
          <CardTitle className='text-base font-semibold'>
            {editing ? 'To‘lovni tahrirlash' : 'Yangi to‘lov qabul qilish'}
          </CardTitle>
          <CardDescription className='text-xs'>
            O‘quvchining navbatdagi to‘lovini tizimda qayd etish
          </CardDescription>
        </CardHeader>
        <CardContent className='pt-4 grid gap-3 sm:grid-cols-3'>
          <Input
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder='O‘quvchi ismi...'
          />
          <Input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder='Guruh nomi...'
          />
          <Input
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder='To‘lov summasi (so‘m)...'
            inputMode='numeric'
          />
          <div className='flex gap-2 sm:col-span-3'>
            <Button onClick={savePayment} className='gap-2 shadow-xs'>
              <Check className='size-4' />
              {editing ? 'Saqlash' : 'To‘lovni kiritish'}
            </Button>
            {editing && (
              <Button
                variant='outline'
                onClick={() => {
                  setEditing(null)
                  setStudentName('')
                  setGroupName('')
                  setAmount('')
                }}
              >
                Bekor qilish
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SO'NGGI TO'LOVLAR RO'YXATI */}
      <Card className='mt-6 border-border/70 shadow-xs'>
        <CardHeader className='flex flex-row items-center justify-between border-b pb-3'>
          <div>
            <CardTitle className='text-base font-semibold'>
              To‘lovlar jurnali
            </CardTitle>
            <CardDescription className='text-xs'>
              Tizimga kiritilgan barcha to‘lovlar ro‘yxati
            </CardDescription>
          </div>
          <div className='relative w-56'>
            <SearchIcon className='absolute start-2.5 top-2.5 size-3.5 text-muted-foreground' />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Qidirish...'
              className='h-8 ps-8 text-xs'
            />
          </div>
        </CardHeader>
        <CardContent className='pt-3 space-y-2.5'>
          {filtered.map((item) => (
            <div
              key={item.id}
              className='flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-3.5 transition-all hover:border-primary/30 hover:bg-muted/15 sm:flex-row sm:items-center sm:justify-between'
            >
              <div className='flex items-center gap-3'>
                <span className='flex size-9 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary'>
                  {item.student
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </span>
                <div>
                  <p className='font-semibold text-sm leading-tight'>
                    {item.student}
                  </p>
                  <p className='text-xs text-muted-foreground mt-0.5'>
                    {item.group} · {item.course} ·{' '}
                    <span className='font-mono'>{item.date}</span>
                  </p>
                </div>
              </div>

              <div className='flex items-center justify-between gap-3 sm:justify-end'>
                <span className='font-bold text-sm text-emerald-600 dark:text-emerald-400'>
                  {format(item.amount)}
                </span>
                <span className='inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'>
                  <CheckCircle2 className='size-3 text-emerald-500' />
                  To‘langan
                </span>
                <div className='flex items-center gap-1'>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='size-8'
                    onClick={() => handleEdit(item)}
                    title='Tahrirlash'
                  >
                    <Pencil className='size-3.5' />
                  </Button>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='size-8 text-destructive hover:bg-destructive/10'
                    onClick={() => {
                      setItems((prev) => prev.filter((p) => p.id !== item.id))
                      toast.success('To‘lov o‘chirildi!')
                    }}
                    title='O‘chirish'
                  >
                    <Trash2 className='size-3.5' />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className='py-8 text-center text-sm text-muted-foreground'>
              To‘lovlar topilmadi.
            </p>
          )}
        </CardContent>
      </Card>
    </>
  )
}

// ==========================================
// 5. TAHLILIY HISOBOTLAR (REPORTSPAGE - 7-BAND)
// ==========================================

function ReportsPage({ labels }: { labels: Labels }) {
  const format = (value: number) =>
    `${new Intl.NumberFormat(labels.locale === 'en' ? 'en-US' : 'uz-UZ').format(value)} ${labels.locale === 'en' ? 'UZS' : 'so‘m'}`

  const [period, setPeriod] = useState<'month' | 'prevMonth' | 'year'>('month')

  // Hisobot ma'lumotlari
  const totalRevenue =
    period === 'month' ? 13500000 : period === 'prevMonth' ? 12100000 : 184000000
  const totalTransactions = period === 'month' ? 18 : 16
  const averageTicket = Math.round(totalRevenue / totalTransactions)

  const courseBreakdown = [
    {
      course: 'Frontend Development',
      students: 45,
      revenue: 4500000,
      share: 33,
    },
    { course: 'Python Development', students: 30, revenue: 3200000, share: 24 },
    { course: 'React.js', students: 25, revenue: 2600000, share: 19 },
    {
      course: 'Ingliz tili / IELTS',
      students: 70,
      revenue: 3200000,
      share: 24,
    },
  ]

  const downloadCsv = () => {
    const header = 'Kurs nomi,O‘quvchilar soni,Tushum,Ulushi\n'
    const rows = courseBreakdown
      .map((c) => `"${c.course}",${c.students},${c.revenue},"${c.share}%"`)
      .join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `moliya-hisobot-${period}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Moliyaviy hisobot CSV formatida yuklandi!')
  }

  const printReport = () => window.print()

  return (
    <div className='print-report space-y-6'>
      <Heading
        breadcrumb='Tahliliy hisobotlar'
        title='Moliyaviy hisobotlar va tahlil'
        description='Oylik va davriy daromadlar tahlili, kurslar rentabelligi va moliyaviy eksport.'
        action={
          <div className='flex flex-wrap items-center gap-2 print:hidden'>
            <div className='flex rounded-lg border border-border/70 bg-muted/30 p-0.5 text-xs'>
              {(
                [
                  ['month', 'Sentyabr 2026'],
                  ['prevMonth', 'Avgust 2026'],
                  ['year', '2026-yil'],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type='button'
                  onClick={() => setPeriod(key)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                    period === key
                      ? 'bg-background text-foreground shadow-2xs font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <Button
              variant='outline'
              size='sm'
              onClick={downloadCsv}
              className='gap-1.5'
            >
              <FileSpreadsheet className='size-3.5' />
              Excel (CSV)
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={printReport}
              className='gap-1.5'
            >
              <Printer className='size-3.5' />
              Chop etish
            </Button>
          </div>
        }
      />

      {/* 4 TA METRIKA KARTALARI */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Metric
          icon={WalletCards}
          title='Jami daromad'
          value={format(totalRevenue)}
          detail='+12.4% o‘tgan davrga nisbatan'
          trend='up'
        />
        <Metric
          icon={CreditCard}
          title='Tranzaksiyalar soni'
          value={`${totalTransactions} ta`}
          detail='Barcha tasdiqlangan to‘lovlar'
        />
        <Metric
          icon={Banknote}
          title='O‘rtacha to‘lov'
          value={format(averageTicket)}
          detail='Bitta to‘lov cheki miqdori'
        />
        <Metric
          icon={TrendingUp}
          title='Reja bajarilishi'
          value='94.2%'
          detail='Oylik maqsadga erishish darajasi'
          trend='up'
        />
      </div>

      {/* GRAFIK (TUSHUM DINAMIKASI) */}
      <Card className='border-border/70 shadow-xs'>
        <CardHeader className='pb-3'>
          <CardTitle className='text-base font-semibold'>
            Daromad o‘sish sur’ati
          </CardTitle>
          <CardDescription className='text-xs'>
            Hisobot davri bo‘yicha to‘lovlar tushumi dinamikasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='h-[260px] w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <AreaChart data={incomeData.months}>
                <defs>
                  <linearGradient id='reportFill' x1='0' y1='0' x2='0' y2='1'>
                    <stop
                      offset='5%'
                      stopColor='var(--primary)'
                      stopOpacity={0.25}
                    />
                    <stop
                      offset='95%'
                      stopColor='var(--primary)'
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray='3 3'
                  stroke='var(--border)'
                  opacity={0.6}
                />
                <XAxis
                  dataKey='name'
                  stroke='var(--muted-foreground)'
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke='var(--muted-foreground)'
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  formatter={(v) => [format(Number(v)), 'Tushum']}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--popover)',
                  }}
                />
                <Area
                  type='monotone'
                  dataKey='value'
                  stroke='var(--primary)'
                  fill='url(#reportFill)'
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* KURSLAR SAMARADORLIGI JADVALI VA TO'LOV KANALLARI */}
      <div className='grid gap-6 lg:grid-cols-2'>
        <Card className='border-border/70 shadow-xs'>
          <CardHeader className='border-b pb-3'>
            <CardTitle className='text-base font-semibold'>
              Kurslar bo‘yicha moliyaviy taqsimot
            </CardTitle>
            <CardDescription className='text-xs'>
              Har bir kursning umumiy daromaddagi ulushi va rentabelligi
            </CardDescription>
          </CardHeader>
          <CardContent className='pt-3 space-y-3'>
            {courseBreakdown.map((item) => (
              <div key={item.course} className='space-y-1'>
                <div className='flex items-center justify-between text-xs'>
                  <span className='font-semibold text-foreground'>
                    {item.course} ({item.students} ta o‘quvchi)
                  </span>
                  <span className='font-mono font-bold text-emerald-600 dark:text-emerald-400'>
                    {format(item.revenue)} ({item.share}%)
                  </span>
                </div>
                <div className='h-2 rounded-full bg-muted overflow-hidden'>
                  <div
                    className='h-full rounded-full bg-emerald-500'
                    style={{ width: `${item.share}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className='border-border/70 shadow-xs'>
          <CardHeader className='border-b pb-3'>
            <CardTitle className='text-base font-semibold'>
              Eng katta to‘lovlar jurnali
            </CardTitle>
            <CardDescription className='text-xs'>
              Davr bo‘yicha eng yuqori summadagi to‘lovlar
            </CardDescription>
          </CardHeader>
          <CardContent className='pt-3 divide-y divide-border/60'>
            {recentPayments.map((pay, idx) => (
              <div
                key={pay.id}
                className='flex items-center justify-between py-2.5 text-xs'
              >
                <div className='flex items-center gap-2.5'>
                  <span className='flex size-6 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary'>
                    {idx + 1}
                  </span>
                  <div>
                    <p className='font-semibold text-foreground'>{pay.student}</p>
                    <p className='text-muted-foreground'>{pay.course}</p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='font-bold text-emerald-600 dark:text-emerald-400'>
                    {format(pay.amount)}
                  </p>
                  <p className='text-muted-foreground text-[10px]'>{pay.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ==========================================
// YORDAMCHI COMPONENTLAR
// ==========================================

function Metric({
  icon: Icon,
  title,
  value,
  detail,
  trend,
}: {
  icon: typeof WalletCards
  title: string
  value: string
  detail: string
  trend?: 'up' | 'down'
}) {
  return (
    <Card className='border-border/70 shadow-xs transition-all hover:border-primary/40'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
          {title}
        </CardTitle>
        <span className='rounded-lg bg-primary/10 p-2 text-primary'>
          <Icon className='size-4' />
        </span>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold tracking-tight'>{value}</div>
        <p className='mt-1 text-xs text-muted-foreground flex items-center gap-1'>
          {trend === 'up' && (
            <ArrowUpRight className='size-3 text-emerald-600 inline' />
          )}
          {trend === 'down' && (
            <ArrowDownRight className='size-3 text-rose-600 inline' />
          )}
          <span>{detail}</span>
        </p>
      </CardContent>
    </Card>
  )
}

function RoleSettingsPage({ labels }: { labels: Labels }) {
  return (
    <RoleSettings
      labels={{
        title: labels.settings,
        description: labels.settingsHint,
        language: labels.locale === 'en' ? 'Language' : 'Til',
        notifications:
          labels.locale === 'en' ? 'Notifications' : 'Bildirishnomalar',
        notificationsHint:
          labels.locale === 'en'
            ? 'Receive finance updates.'
            : 'Moliya yangiliklari haqida xabar oling.',
        security: labels.locale === 'en' ? 'Security' : 'Xavfsizlik',
        securityHint:
          labels.locale === 'en'
            ? 'Manage finance account security.'
            : 'Moliya hisobi xavfsizligini boshqaring.',
        appearance: labels.locale === 'en' ? 'Appearance' : 'Ko‘rinish',
        appearanceHint:
          labels.locale === 'en'
            ? 'Adjust workspace appearance.'
            : 'Ish maydoni ko‘rinishini sozlang.',
        save: labels.save,
        saved: 'Moliya sozlamalari saqlandi.',
        enabled: 'Yoqilgan',
        disabled: 'O‘chirilgan',
      }}
    />
  )
}

function RoleProfilePage({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <>
      <Heading
        breadcrumb='Profil'
        title={title}
        description={description}
      />
      <Card className='border-border/70 shadow-xs'>
        <CardHeader>
          <CardTitle className='text-base font-semibold'>{title}</CardTitle>
          <CardDescription className='text-xs'>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>
    </>
  )
}
