import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Banknote,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  GraduationCap,
  FileSpreadsheet,
  FileText,
  Landmark,
  Pencil,
  Plus,
  Printer,
  RotateCcw,
  Search as SearchIcon,
  Smartphone,
  Trash2,
  TrendingDown,
  WalletCards,
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
import { TopNav } from '@/components/layout/top-nav'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { NotFoundError } from '@/features/errors/not-found-error'
import { RoleSettings } from '@/features/role-settings'
import { ProfileForm } from '@/features/settings/profile/profile-form'

const payments = [
  {
    id: 'PAY-001',
    student: 'Azizbek Karimov',
    group: 'Frontend 2-guruh',
    groupEn: 'Frontend Group 2',
    course: 'Frontend development',
    amount: 850000,
    date: '2026-09-08',
    status: 'paid',
  },
  {
    id: 'PAY-002',
    student: 'Madina Aliyeva',
    group: 'Python boshlang‘ich',
    groupEn: 'Python beginners',
    course: 'Python development',
    amount: 650000,
    date: '2026-09-08',
    status: 'paid',
  },
  {
    id: 'PAY-003',
    student: 'Javohir Rasulov',
    group: 'React amaliyot',
    groupEn: 'React practice',
    course: 'React.js',
    amount: 450000,
    date: '2026-09-07',
    status: 'pending',
  },
]
const debts = [
  {
    student: 'Shahnoza Ergasheva',
    group: 'Frontend 2-guruh',
    groupEn: 'Frontend Group 2',
    amount: 350000,
    days: 12,
  },
  {
    student: 'Bekzod Tursunov',
    group: 'Python boshlang‘ich',
    groupEn: 'Python beginners',
    amount: 650000,
    days: 7,
  },
  {
    student: 'Javohir Rasulov',
    group: 'React amaliyot',
    groupEn: 'React practice',
    amount: 450000,
    days: 4,
  },
]
const students = [
  {
    name: 'Azizbek Karimov',
    group: 'Frontend 2-guruh',
    groupEn: 'Frontend Group 2',
    teacher: 'Azizbek Karimov',
    balance: 0,
  },
  {
    name: 'Madina Aliyeva',
    group: 'Python boshlang‘ich',
    groupEn: 'Python beginners',
    teacher: 'Golib Abduhalil',
    balance: 0,
  },
  {
    name: 'Javohir Rasulov',
    group: 'React amaliyot',
    groupEn: 'React practice',
    teacher: 'Sardor Islomov',
    balance: 450000,
  },
  {
    name: 'Shahnoza Ergasheva',
    group: 'Frontend 2-guruh',
    groupEn: 'Frontend Group 2',
    teacher: 'Azizbek Karimov',
    balance: 350000,
  },
  {
    name: 'Bekzod Tursunov',
    group: 'Python boshlang‘ich',
    groupEn: 'Python beginners',
    teacher: 'Golib Abduhalil',
    balance: 650000,
  },
  {
    name: 'Zarina Abdullayeva',
    group: 'Frontend 2-guruh',
    groupEn: 'Frontend Group 2',
    teacher: 'Azizbek Karimov',
    balance: 250000,
  },
  {
    name: 'Jasur Rahimov',
    group: 'Python boshlang‘ich',
    groupEn: 'Python beginners',
    teacher: 'Golib Abduhalil',
    balance: 180000,
  },
  {
    name: 'Kamola Rustamova',
    group: 'React amaliyot',
    groupEn: 'React practice',
    teacher: 'Sardor Islomov',
    balance: 0,
  },
]

type Labels = Record<string, string>

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
            dashboard: 'Finance dashboard',
            finance: 'Finance',
            payments: 'Payments',
            debt: 'Outstanding debt',
            students: 'Students',
            reports: 'Reports',
            tasks: 'Tasks',
            profile: 'My profile',
            settings: 'Settings',
            settingsHint: 'Manage preferences for your finance workspace.',
            firstName: 'First name',
            lastName: 'Last name',
            group: 'Group',
            groupName: 'Group name',
            groupRequired: 'Enter a group name.',
            paidDebt: 'Mark as paid',
            debtSettled: 'Payment marked as paid.',
            settingsSaved: 'Finance settings saved successfully.',
            nameRequired: 'Enter both first and last name.',
            paymentNotFound: 'No payment found for this name.',
            title: 'Finance workspace',
            subtitle:
              'Track payments, debt and academy financial performance in one place.',
            welcome: 'Good morning',
            totalIncome: 'Total income',
            todayIncome: 'Today’s income',
            monthIncome: 'This month’s income',
            pendingPayments: 'Pending payments',
            totalDebt: 'Outstanding debt',
            refunded: 'Refunded payments',
            collectionRate: 'Collection rate',
            incomeAnalytics: 'Income analytics',
            last30Days: 'Last 30 days',
            last6Months: 'Last 6 months',
            lastYear: 'Last year',
            paymentMethods: 'Payment methods',
            cash: 'Cash',
            card: 'Card',
            click: 'Click',
            payme: 'Payme',
            bankTransfer: 'Bank transfer',
            debtAnalytics: 'Debt analytics',
            totalDebtors: 'Total debtors',
            overdue1to7: '1–7 days overdue',
            overdue8to30: '8–30 days overdue',
            overdue30plus: '30+ days overdue',
            largestDebts: 'Largest debts',
            courseFinance: 'Finance by course',
            learnerCount: 'Students',
            income: 'Income',
            paymentList: 'Recent payments',
            debtList: 'Students with outstanding debt',
            studentList: 'Student accounts',
            reportTitle: 'Financial reports',
            addPayment: 'Add payment',
            createReport: 'Create report',
            search: 'Search',
            student: 'Student',
            course: 'Course',
            amount: 'Amount',
            date: 'Date',
            status: 'Status',
            paid: 'Paid',
            pending: 'Pending',
            save: 'Save',
            saved: 'Payment saved successfully.',
            added: 'Payment added successfully.',
            deleted: 'Payment deleted successfully.',
            updated: 'Payment updated successfully.',
            name: 'Student name',
            courseName: 'Course name',
            empty: 'No records found.',
            edit: 'Edit',
            delete: 'Delete',
            cancel: 'Cancel',
            editPayment: 'Edit payment',
            newPayment: 'New payment',
            reportHint:
              'Choose a report type and date range to export financial data.',
            generate: 'Generate report',
            reportReady: 'Report prepared successfully.',
            debtDays: 'days overdue',
            averagePayment: 'Average payment',
            balance: 'Balance',
            reportType: 'Report type',
            monthly: 'Monthly income',
            debtReport: 'Debt report',
            studentsReport: 'Student payment report',
            exportExcel: 'Excel',
            exportPdf: 'PDF',
            print: 'Print',
            reportMonth: 'September 2026',
            totalCollected: 'Total collected',
            paymentCount: 'Payments',
            topPayments: 'Top payments',
            courseRevenue: 'Revenue by course',
            growth: 'Growth',
          }
        : {
            locale: 'uz',
            dashboard: 'Moliya paneli',
            finance: 'Moliya',
            payments: 'To‘lovlar',
            debt: 'Qarzdorlik',
            students: 'O‘quvchilar',
            reports: 'Hisobotlar',
            tasks: 'Vazifalar',
            profile: 'Profilim',
            settings: 'Sozlamalar',
            settingsHint: 'Moliya ish maydoni sozlamalarini boshqaring.',
            firstName: 'Ism',
            lastName: 'Familiya',
            group: 'Guruh',
            groupName: 'Guruh nomi',
            groupRequired: 'Guruh nomini kiriting.',
            paidDebt: 'To‘landi deb belgilash',
            debtSettled: 'To‘lov to‘landi.',
            settingsSaved: 'Moliya sozlamalari muvaffaqiyatli saqlandi.',
            nameRequired: 'Ism va familiyani kiriting.',
            paymentNotFound: 'Bu ism bo‘yicha to‘lov topilmadi.',
            title: 'Moliya ish maydoni',
            subtitle:
              'To‘lovlar, qarzdorlik va akademiya moliyaviy holatini bir joyda boshqaring.',
            welcome: 'Xayrli tong',
            totalIncome: 'Jami tushum',
            todayIncome: 'Bugungi tushum',
            monthIncome: 'Shu oy tushumi',
            pendingPayments: 'Kutilayotgan to‘lovlar',
            totalDebt: 'Jami qarzdorlik',
            refunded: 'Qaytarilgan to‘lovlar',
            collectionRate: 'To‘lovlarni yig‘ish darajasi',
            incomeAnalytics: 'Tushum tahlili',
            last30Days: 'Oxirgi 30 kun',
            last6Months: 'Oxirgi 6 oy',
            lastYear: 'Oxirgi 1 yil',
            paymentMethods: 'To‘lov usullari',
            cash: 'Naqd',
            card: 'Karta',
            click: 'Click',
            payme: 'Payme',
            bankTransfer: 'Bank o‘tkazmasi',
            debtAnalytics: 'Qarzdorlik tahlili',
            totalDebtors: 'Jami qarzdorlar',
            overdue1to7: '1–7 kun kechikkan',
            overdue8to30: '8–30 kun kechikkan',
            overdue30plus: '30 kundan ortiq kechikkan',
            largestDebts: 'Eng katta qarzdorliklar',
            courseFinance: 'Kurslar bo‘yicha moliya',
            learnerCount: 'O‘quvchilar',
            income: 'Tushum',
            paymentList: 'So‘nggi to‘lovlar',
            debtList: 'Qarzdor o‘quvchilar',
            studentList: 'O‘quvchilar hisoblari',
            reportTitle: 'Moliyaviy hisobotlar',
            addPayment: 'To‘lov qo‘shish',
            createReport: 'Hisobot yaratish',
            search: 'Qidirish',
            student: 'O‘quvchi',
            course: 'Kurs',
            amount: 'Summa',
            date: 'Sana',
            status: 'Holati',
            paid: 'To‘langan',
            pending: 'Kutilmoqda',
            save: 'Saqlash',
            saved: 'To‘lov muvaffaqiyatli saqlandi.',
            added: 'To‘lov muvaffaqiyatli qo‘shildi.',
            deleted: 'To‘lov muvaffaqiyatli o‘chirildi.',
            updated: 'To‘lov muvaffaqiyatli tahrirlandi.',
            name: 'O‘quvchi nomi',
            courseName: 'Kurs nomi',
            empty: 'Ma’lumot topilmadi.',
            edit: 'Tahrirlash',
            delete: 'O‘chirish',
            cancel: 'Bekor qilish',
            editPayment: 'To‘lovni tahrirlash',
            newPayment: 'Yangi to‘lov',
            reportHint:
              'Moliyaviy ma’lumotlarni olish uchun hisobot turi va sana oralig‘ini tanlang.',
            generate: 'Hisobot yaratish',
            reportReady: 'Hisobot muvaffaqiyatli tayyorlandi.',
            debtDays: 'kun kechikkan',
            averagePayment: 'O‘rtacha to‘lov',
            balance: 'Qoldiq',
            reportType: 'Hisobot turi',
            monthly: 'Oylik tushum',
            debtReport: 'Qarzdorlik hisoboti',
            studentsReport: 'O‘quvchilar to‘lov hisoboti',
            exportExcel: 'Excel',
            exportPdf: 'PDF',
            print: 'Chop etish',
            reportMonth: '2026-yil sentyabr',
            totalCollected: 'Jami tushum',
            paymentCount: 'To‘lovlar',
            topPayments: 'To‘lovlar bo‘yicha',
            courseRevenue: 'Kurslar bo‘yicha tushum',
            growth: 'O‘sish',
          },
    [isEnglish]
  )
  const nav = [
    {
      title: labels.dashboard,
      href: '/finance',
      isActive: section === 'dashboard',
    },
    {
      title: labels.payments,
      href: '/finance/payments',
      isActive: section === 'payments',
    },
    { title: labels.debt, href: '/finance/debt', isActive: section === 'debt' },
    {
      title: labels.students,
      href: '/finance/students',
      isActive: section === 'students',
    },
    {
      title: labels.reports,
      href: '/finance/reports',
      isActive: section === 'reports',
    },
  ]
  const activeNav = nav.filter((item) => item.isActive)
  const displayNav = activeNav.length > 0 ? activeNav : [nav[0]]
  const shell = (content: React.ReactNode) => (
    <>
      <Header>
        <TopNav links={displayNav} className='me-auto' />
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
      <RoleProfilePage title={labels.profile} description={labels.subtitle} />
    )
  if (section === 'settings') return shell(<RoleSettingsPage labels={labels} />)
  if (section !== 'dashboard') return <NotFoundError />
  return shell(<Dashboard labels={labels} name={user?.name} />)
}

function Heading({
  title,
  description,
  action,
}: {
  labels?: Labels
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className='mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end'>
      <div>
        <p className='text-sm font-medium text-primary'>SFERA IT Academy CRM</p>
        <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>
          {title}
        </h1>
        <p className='mt-1 text-sm text-muted-foreground'>{description}</p>
      </div>
      {action}
    </div>
  )
}
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
function Dashboard({ labels, name }: { labels: Labels; name?: string }) {
  const [range, setRange] = useState<'days' | 'months' | 'year'>('days')
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
    [labels.cash, 25, Banknote],
    [labels.card, 45, CreditCard],
    [labels.payme, 20, Smartphone],
    [labels.click, 10, Smartphone],
    [labels.bankTransfer, 8, Landmark],
  ] as const
  const courses = [
    {
      name: labels.locale === 'en' ? 'Frontend' : 'Frontend',
      students: 45,
      income: 4500000,
      debt: 600000,
    },
    {
      name: labels.locale === 'en' ? 'Backend' : 'Backend',
      students: 30,
      income: 3200000,
      debt: 400000,
    },
    {
      name: labels.locale === 'en' ? 'English' : 'Ingliz tili',
      students: 70,
      income: 5800000,
      debt: 900000,
    },
  ]
  return (
    <>
      <Heading
        labels={labels}
        title={labels.title}
        description={labels.subtitle}
        action={
          <a href='/finance/payments'>
            <Button>
              <Plus className='me-2 size-4' />
              {labels.addPayment}
            </Button>
          </a>
        }
      />
      <p className='-mt-4 mb-6 text-sm text-muted-foreground'>
        {labels.welcome}, {name || labels.finance}
      </p>
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
        <Metric
          icon={WalletCards}
          title={labels.totalIncome}
          value={format(1950000)}
          detail={labels.monthly}
        />
        <Metric
          icon={CalendarDays}
          title={labels.todayIncome}
          value={format(980000)}
          detail={labels.todayIncome}
        />
        <Metric
          icon={CalendarDays}
          title={labels.monthIncome}
          value={format(13500000)}
          detail={labels.monthIncome}
        />
        <Metric
          icon={CreditCard}
          title={labels.pendingPayments}
          value={format(450000)}
          detail={labels.pending}
        />
        <Metric
          icon={AlertTriangle}
          title={labels.totalDebt}
          value={format(1000000)}
          detail={labels.totalDebtors}
        />
        <Metric
          icon={RotateCcw}
          title={labels.refunded}
          value={format(120000)}
          detail={labels.refunded}
        />
      </div>
      <div className='mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]'>
        <Card>
          <CardHeader>
            <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
              <div>
                <CardTitle>{labels.incomeAnalytics}</CardTitle>
                <CardDescription>{labels.subtitle}</CardDescription>
              </div>
              <div className='flex gap-1 rounded-lg bg-muted p-1'>
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
                    onClick={() => setRange(key)}
                  >
                    {text}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='h-[280px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id='incomeFill' x1='0' y1='0' x2='0' y2='1'>
                      <stop
                        offset='5%'
                        stopColor='var(--primary)'
                        stopOpacity={0.3}
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
                    opacity={0.7}
                  />
                  <XAxis
                    dataKey='name'
                    tickLine={false}
                    axisLine={false}
                    stroke='var(--muted-foreground)'
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    stroke='var(--muted-foreground)'
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                    tickFormatter={(value) =>
                      `${Math.round(Number(value) / 1000000)}M`
                    }
                  />
                  <Tooltip
                    cursor={{ stroke: 'var(--border)', strokeDasharray: '4 4' }}
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--popover)',
                      color: 'var(--popover-foreground)',
                      boxShadow: '0 12px 30px rgb(0 0 0 / 18%)',
                    }}
                    labelStyle={{
                      color: 'var(--popover-foreground)',
                      fontWeight: 600,
                    }}
                    itemStyle={{ color: 'var(--primary)' }}
                    formatter={(value) => [
                      format(Number(value)),
                      labels.income,
                    ]}
                  />
                  <Area
                    type='monotone'
                    dataKey='value'
                    stroke='var(--primary)'
                    fill='url(#incomeFill)'
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{labels.paymentMethods}</CardTitle>
            <CardDescription>{labels.totalIncome}</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {methods.map(([method, percent, Icon]) => (
              <div key={method}>
                <div className='mb-1 flex items-center justify-between text-sm'>
                  <span className='flex items-center gap-2'>
                    <Icon className='size-4 text-primary' />
                    {method}
                  </span>
                  <span className='font-semibold'>{percent}%</span>
                </div>
                <div className='h-2 rounded-full bg-muted'>
                  <div
                    className='h-2 rounded-full bg-primary'
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className='mt-6 grid gap-6 xl:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>{labels.debtAnalytics}</CardTitle>
            <CardDescription>{labels.totalDebt}</CardDescription>
          </CardHeader>
          <CardContent className='grid gap-3 sm:grid-cols-2'>
            {[
              [labels.totalDebtors, '12'],
              [labels.overdue1to7, '5'],
              [labels.overdue8to30, '4'],
              [labels.overdue30plus, '3'],
            ].map(([title, value]) => (
              <div key={title} className='rounded-xl border p-4'>
                <p className='text-sm text-muted-foreground'>{title}</p>
                <p className='mt-2 text-2xl font-bold'>{value}</p>
              </div>
            ))}
            <div className='sm:col-span-2'>
              <p className='mb-2 text-sm font-medium'>{labels.largestDebts}</p>
              {debts
                .slice()
                .sort((a, b) => b.amount - a.amount)
                .map((item) => (
                  <div
                    key={item.student}
                    className='flex justify-between border-t py-2 text-sm'
                  >
                    <span>{item.student}</span>
                    <span className='font-semibold text-destructive'>
                      {format(item.amount)}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{labels.courseFinance}</CardTitle>
            <CardDescription>{labels.subtitle}</CardDescription>
          </CardHeader>
          <CardContent className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b text-start text-muted-foreground'>
                  <th className='p-2 text-start'>{labels.course}</th>
                  <th className='p-2 text-end'>{labels.learnerCount}</th>
                  <th className='p-2 text-end'>{labels.income}</th>
                  <th className='p-2 text-end'>{labels.debt}</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.name} className='border-b last:border-0'>
                    <td className='p-2 font-medium'>{course.name}</td>
                    <td className='p-2 text-end'>{course.students}</td>
                    <td className='p-2 text-end text-emerald-600'>
                      {format(course.income)}
                    </td>
                    <td className='p-2 text-end text-destructive'>
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
function PaymentsPage({ labels }: { labels: Labels }) {
  const crm = useCrmStore()
  const format = (value: number) =>
    `${new Intl.NumberFormat(labels.locale === 'en' ? 'en-US' : 'uz-UZ').format(value)} ${labels.locale === 'en' ? 'UZS' : 'so‘m'}`
  const [items, setItems] = useState(() =>
    crm.payments.length
      ? crm.payments.map((payment) => ({
          id: payment.id,
          student:
            crm.students.find((student) => student.id === payment.studentId)
              ?.name ?? 'Unknown student',
          group:
            crm.groups.find((group) =>
              group.studentIds.includes(payment.studentId)
            )?.name ?? '',
          groupEn:
            crm.groups.find((group) =>
              group.studentIds.includes(payment.studentId)
            )?.name ?? '',
          course:
            crm.students.find((student) => student.id === payment.studentId)
              ?.course ?? '',
          amount: payment.amount,
          date: payment.date,
          status: 'paid' as const,
        }))
      : payments
  )
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [amount, setAmount] = useState('')
  const [group, setGroup] = useState('')
  const filtered = items.filter((item) =>
    `${item.student} ${item.id}`.toLowerCase().includes(query.toLowerCase())
  )
  const save = () => {
    const fullName = `${firstName.trim()} ${lastName.trim()}`
      .replace(/\s+/g, ' ')
      .trim()
    const numeric = Number(amount)
    if (!firstName.trim() || !lastName.trim()) {
      toast.error(labels.nameRequired)
      return
    }
    if (!group.trim()) {
      toast.error(labels.groupRequired)
      return
    }
    if (!Number.isFinite(numeric) || numeric <= 0) {
      toast.error(
        `${labels.amount}: ${labels.locale === 'en' ? 'enter a value greater than 0.' : '0 dan katta qiymat kiriting.'}`
      )
      return
    }
    if (editing) {
      setItems((current) =>
        current.map((item) =>
          item.id === editing
            ? { ...item, student: fullName, amount: numeric }
            : item
        )
      )
      toast.success(
        labels.updated
      ) /* BACKEND: PATCH /api/finance/payments/:paymentId */
    } else {
      const matchedStudent = crm.students.find(
        (student) => student.name === fullName
      )
      if (matchedStudent)
        crm.recordPayment({
          studentId: matchedStudent.id,
          amount: numeric,
          method: 'other',
          date: new Date().toISOString().slice(0, 10),
          description: group,
        })
      setItems((current) => [
        {
          id: `PAY-${current.length + 1}`,
          student: fullName,
          group,
          groupEn: group,
          course: labels.course,
          amount: numeric,
          date: new Date().toISOString().slice(0, 10),
          status: 'paid',
        },
        ...current,
      ])
      toast.success(labels.added) /* BACKEND: POST /api/finance/payments */
    }
    setEditing(null)
    setFirstName('')
    setLastName('')
    setAmount('')
    setGroup('')
  }
  const beginEdit = (item: (typeof payments)[number]) => {
    const parts = item.student.split(' ')
    setEditing(item.id)
    setFirstName(parts.shift() || '')
    setLastName(parts.join(' '))
    setAmount(String(item.amount))
    setGroup(labels.locale === 'en' ? item.groupEn || '' : item.group || '')
  }
  return (
    <>
      <Heading
        labels={labels}
        title={labels.payments}
        description={labels.subtitle}
      />
      <Card>
        <CardHeader>
          <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
            <CardTitle>
              {editing ? labels.editPayment : labels.newPayment}
            </CardTitle>
            <div className='relative'>
              <SearchIcon className='absolute start-3 top-2.5 size-4 text-muted-foreground' />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={labels.search}
                className='ps-9'
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className='grid gap-3 sm:grid-cols-3'>
          <Input
            value={firstName}
            onChange={(event) =>
              setFirstName(
                event.target.value.replace(/[^\p{L}\s-]/gu, '').slice(0, 40)
              )
            }
            placeholder={labels.firstName}
          />
          <Input
            value={lastName}
            onChange={(event) =>
              setLastName(
                event.target.value.replace(/[^\p{L}\s-]/gu, '').slice(0, 60)
              )
            }
            placeholder={labels.lastName}
          />
          <Input
            value={group}
            onChange={(event) =>
              setGroup(
                event.target.value
                  .replace(/[^\p{L}\p{N}\s-]/gu, '')
                  .slice(0, 80)
              )
            }
            placeholder={labels.groupName}
          />
          <Input
            value={amount}
            onChange={(event) =>
              setAmount(event.target.value.replace(/[^0-9]/g, '').slice(0, 12))
            }
            inputMode='numeric'
            placeholder={labels.amount}
          />
          <div className='flex gap-2 sm:col-span-3'>
            <Button onClick={save}>
              {editing ? labels.save : labels.addPayment}
            </Button>
            {editing && (
              <Button
                variant='outline'
                onClick={() => {
                  setEditing(null)
                  setFirstName('')
                  setLastName('')
                  setAmount('')
                  setGroup('')
                }}
              >
                {labels.cancel}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      <Card className='mt-6'>
        <CardHeader>
          <CardTitle>{labels.paymentList}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          {filtered.map((item) => (
            <div
              key={item.id}
              className='flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center'
            >
              <div className='flex-1'>
                <p className='font-medium'>{item.student}</p>
                <p className='text-xs text-muted-foreground'>
                  {labels.locale === 'en'
                    ? item.groupEn || item.group
                    : item.group}{' '}
                  · {item.course} · {item.date}
                </p>
              </div>
              <span className='font-semibold'>{format(item.amount)}</span>
              <Badge>
                {item.status === 'paid' ? labels.paid : labels.pending}
              </Badge>
              <Button
                size='icon'
                variant='ghost'
                aria-label={labels.edit}
                onClick={() => beginEdit(item)}
              >
                <Pencil className='size-4' />
              </Button>
              <Button
                size='icon'
                variant='ghost'
                aria-label={labels.delete}
                onClick={() => {
                  setItems((current) =>
                    current.filter((payment) => payment.id !== item.id)
                  )
                  toast.success(
                    labels.deleted
                  ) /* BACKEND: DELETE /api/finance/payments/:paymentId */
                }}
              >
                <Trash2 className='size-4 text-destructive' />
              </Button>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className='py-8 text-center text-sm text-muted-foreground'>
              {labels.paymentNotFound}
            </p>
          )}
        </CardContent>
      </Card>
    </>
  )
}
function DebtPage({ labels }: { labels: Labels }) {
  const format = (value: number) =>
    `${new Intl.NumberFormat(labels.locale === 'en' ? 'en-US' : 'uz-UZ').format(value)} ${labels.locale === 'en' ? 'UZS' : 'so‘m'}`
  const [paid, setPaid] = useState<Record<string, boolean>>({})
  const activeDebts = debts.filter((item) => !paid[item.student])
  const currentTotal = activeDebts.reduce((sum, item) => sum + item.amount, 0)
  const previousMonthTotal = 2900000
  const change = Math.round(
    ((currentTotal - previousMonthTotal) / previousMonthTotal) * 100
  )
  const trend = [
    { month: labels.locale === 'en' ? 'Apr' : 'Apr', value: 3800000 },
    { month: labels.locale === 'en' ? 'May' : 'May', value: 3400000 },
    { month: labels.locale === 'en' ? 'Jun' : 'Iyun', value: 3100000 },
    { month: labels.locale === 'en' ? 'Jul' : 'Iyul', value: 2700000 },
    {
      month: labels.locale === 'en' ? 'Aug' : 'Avg',
      value: previousMonthTotal,
    },
    { month: labels.locale === 'en' ? 'Sep' : 'Sen', value: currentTotal },
  ]
  const topDebtors = [...activeDebts].sort((a, b) => b.amount - a.amount)
  const maxDebt = Math.max(...topDebtors.map((item) => item.amount), 1)

  return (
    <>
      <Heading
        labels={labels}
        title={labels.debt}
        description={labels.subtitle}
      />

      <div className='grid gap-4 md:grid-cols-3'>
        <Card className='overflow-hidden border-rose-500/20 bg-gradient-to-br from-rose-500/[0.09] via-card to-card'>
          <CardHeader className='pb-2'>
            <CardDescription>{labels.totalDebt}</CardDescription>
            <CardTitle className='text-3xl text-rose-600 dark:text-rose-400'>
              {format(currentTotal)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`flex items-center gap-2 text-xs font-semibold ${change <= 0 ? 'text-emerald-600' : 'text-rose-600'}`}
            >
              <TrendingDown className='size-4' />
              {Math.abs(change)}%{' '}
              {labels.locale === 'en'
                ? 'vs last month'
                : 'o‘tgan oyga nisbatan'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardDescription>{labels.totalDebtors}</CardDescription>
            <CardTitle className='text-3xl'>{activeDebts.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
              <AlertTriangle className='size-4 text-amber-500' />
              {activeDebts.filter((item) => item.days > 7).length}{' '}
              {labels.locale === 'en'
                ? 'seriously overdue'
                : 'jiddiy kechikkan'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardDescription>
              {labels.locale === 'en' ? 'Average debt' : 'O‘rtacha qarzdorlik'}
            </CardDescription>
            <CardTitle className='text-3xl'>
              {format(
                activeDebts.length
                  ? Math.round(currentTotal / activeDebts.length)
                  : 0
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-xs text-muted-foreground'>
              {labels.locale === 'en'
                ? 'per debtor'
                : 'har bir qarzdor hisobiga'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className='mt-4 grid gap-4 xl:grid-cols-[1.5fr_1fr]'>
        <Card className='overflow-hidden'>
          <CardHeader className='border-b border-rose-500/10 bg-gradient-to-r from-rose-500/[0.08] to-transparent'>
            <div className='flex items-center justify-between gap-3'>
              <div>
                <CardTitle>
                  {labels.locale === 'en'
                    ? 'Debt trend'
                    : 'Qarzdorlik dinamikasi'}
                </CardTitle>
                <CardDescription>
                  {labels.locale === 'en'
                    ? 'Outstanding balance over the last six months'
                    : 'Oxirgi 6 oydagi jami qarzdorlik dinamikasi'}
                </CardDescription>
              </div>
              <span className='rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400'>
                {change <= 0 ? '↓' : '↑'} {Math.abs(change)}%
              </span>
            </div>
          </CardHeader>
          <CardContent className='pt-5'>
            <div className='h-[280px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart
                  data={trend}
                  margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id='debtFill' x1='0' y1='0' x2='0' y2='1'>
                      <stop
                        offset='0%'
                        stopColor='rgb(244 63 94)'
                        stopOpacity={0.32}
                      />
                      <stop
                        offset='100%'
                        stopColor='rgb(244 63 94)'
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray='3 3'
                    vertical={false}
                    className='stroke-border/60'
                  />
                  <XAxis
                    dataKey='month'
                    tickLine={false}
                    axisLine={false}
                    className='text-xs'
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={64}
                    tickFormatter={(value) => `${Math.round(value / 1000000)}M`}
                    className='text-xs'
                  />
                  <Tooltip
                    formatter={(value) => [
                      format(Number(value ?? 0)),
                      labels.debt,
                    ]}
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid hsl(var(--border))',
                      background: 'hsl(var(--card))',
                    }}
                  />
                  <Area
                    type='monotone'
                    dataKey='value'
                    stroke='rgb(244 63 94)'
                    strokeWidth={3}
                    fill='url(#debtFill)'
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {labels.locale === 'en'
                ? 'Highest debtors'
                : 'Eng ko‘p qarzdor o‘quvchilar'}
            </CardTitle>
            <CardDescription>
              {labels.locale === 'en'
                ? 'Students requiring attention first'
                : 'Birinchi navbatda e’tibor talab qiladiganlar'}
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-5'>
            {topDebtors.map((item, index) => (
              <div key={item.student}>
                <div className='mb-2 flex items-center justify-between gap-3 text-sm'>
                  <div className='flex min-w-0 items-center gap-2'>
                    <span className='flex size-7 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-xs font-bold text-rose-600 dark:text-rose-400'>
                      {index + 1}
                    </span>
                    <span className='truncate font-medium'>{item.student}</span>
                  </div>
                  <span className='shrink-0 font-bold text-rose-600 dark:text-rose-400'>
                    {format(item.amount)}
                  </span>
                </div>
                <div className='h-2 overflow-hidden rounded-full bg-rose-500/10'>
                  <div
                    className='h-full rounded-full bg-gradient-to-r from-rose-500 to-red-600 transition-all'
                    style={{ width: `${(item.amount / maxDebt) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className='mt-4'>
        <CardHeader className='flex flex-row items-center justify-between pb-4'>
          <div>
            <CardTitle>{labels.debtList}</CardTitle>
            <CardDescription className='mt-1'>
              {labels.totalDebt}
            </CardDescription>
          </div>
          <Badge
            variant='outline'
            className='border-rose-300 text-rose-600 dark:text-rose-400'
          >
            {activeDebts.length}{' '}
            {labels.locale === 'en' ? 'debtors' : 'qarzdor'}
          </Badge>
        </CardHeader>
        <CardContent className='space-y-3'>
          {debts.map((item) => {
            const isPaid = paid[item.student] ?? false
            return (
              <div
                key={item.student}
                className='flex flex-col gap-3 rounded-xl border p-4 transition-colors hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between'
              >
                <div className='flex items-center gap-3'>
                  <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-xs font-bold text-rose-600 dark:text-rose-400'>
                    {item.student
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className='font-semibold text-foreground'>
                      {item.student}
                    </p>
                    <p className='mt-0.5 flex items-center gap-2 text-xs text-muted-foreground'>
                      <span>
                        {labels.locale === 'en' ? item.groupEn : item.group}
                      </span>
                      <span>•</span>
                      <span className='font-medium text-amber-600 dark:text-amber-400'>
                        {item.days} {labels.debtDays}
                      </span>
                    </p>
                  </div>
                </div>
                <div className='flex items-center justify-between gap-3 border-t pt-2 sm:justify-end sm:border-t-0 sm:pt-0'>
                  {isPaid ? (
                    <Badge className='gap-1.5 border-green-200 bg-green-500/15 px-3 py-1.5 font-medium text-green-600 dark:border-green-800 dark:text-green-400'>
                      <CheckCircle2 className='size-3.5' />
                      {labels.paid}
                    </Badge>
                  ) : (
                    <>
                      <span className='text-base font-bold text-rose-600 dark:text-rose-400'>
                        {format(item.amount)}
                      </span>
                      <Button
                        size='sm'
                        variant='outline'
                        className='gap-1.5 border-primary/30 hover:bg-primary/10 hover:text-primary'
                        onClick={() => {
                          setPaid((current) => ({
                            ...current,
                            [item.student]: true,
                          }))
                          toast.success(labels.debtSettled)
                        }}
                      >
                        <CheckCircle2 className='size-3.5 text-primary' />
                        {labels.paidDebt}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </>
  )
}
function StudentsPage({ labels }: { labels: Labels }) {
  const [query, setQuery] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const groupList = Array.from(
    new Map(
      students.map((student) => [
        student.group,
        {
          name: student.group,
          nameEn: student.groupEn,
          teacher: student.teacher,
          students: students.filter((item) => item.group === student.group)
            .length,
          debt: students
            .filter((item) => item.group === student.group)
            .reduce((sum, item) => sum + item.balance, 0),
        },
      ])
    ).values()
  )
  const activeGroup = groupList.find((group) => group.name === selectedGroup)
  const filtered = students.filter((student) => {
    const matchesQuery = student.name
      .toLowerCase()
      .includes(query.toLowerCase())
    return matchesQuery && (!selectedGroup || student.group === selectedGroup)
  })
  const format = (value: number) =>
    `${new Intl.NumberFormat(labels.locale === 'en' ? 'en-US' : 'uz-UZ').format(value)} ${labels.locale === 'en' ? 'UZS' : 'so‘m'}`

  if (activeGroup) {
    return (
      <>
        <Heading
          labels={labels}
          title={activeGroup.name}
          description={labels.subtitle}
          action={
            <Button variant='outline' onClick={() => setSelectedGroup(null)}>
              ← {labels.locale === 'en' ? 'All groups' : 'Barcha guruhlar'}
            </Button>
          }
        />
        <div className='grid gap-4 md:grid-cols-3'>
          <Card>
            <CardHeader className='pb-2'>
              <CardDescription>{labels.students}</CardDescription>
              <CardTitle className='text-3xl'>{activeGroup.students}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardDescription>
                {labels.locale === 'en' ? 'Teacher' : 'O‘qituvchi'}
              </CardDescription>
              <CardTitle className='text-lg'>{activeGroup.teacher}</CardTitle>
            </CardHeader>
          </Card>
          <Card className='border-rose-500/20'>
            <CardHeader className='pb-2'>
              <CardDescription>{labels.debt}</CardDescription>
              <CardTitle className='text-2xl text-rose-600'>
                {format(activeGroup.debt)}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
        <Card className='mt-4'>
          <CardHeader>
            <CardTitle>{labels.students}</CardTitle>
            <div className='relative mt-3 max-w-sm'>
              <SearchIcon className='absolute start-3 top-2.5 size-4 text-muted-foreground' />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={labels.search}
                className='ps-9'
              />
            </div>
          </CardHeader>
          <CardContent className='divide-y'>
            {filtered.map((student) => (
              <div
                key={student.name}
                className='flex items-center justify-between gap-3 py-4'
              >
                <div className='flex items-center gap-3'>
                  <span className='flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary'>
                    {student.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </span>
                  <div>
                    <p className='font-medium'>{student.name}</p>
                    <p className='text-xs text-muted-foreground'>
                      {student.teacher}
                    </p>
                  </div>
                </div>
                <Badge variant={student.balance ? 'destructive' : 'secondary'}>
                  {student.balance ? format(student.balance) : labels.paid}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <>
      <Heading
        labels={labels}
        title={labels.students}
        description={labels.subtitle}
      />
      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {groupList.map((group) => (
          <button
            key={group.name}
            type='button'
            onClick={() => setSelectedGroup(group.name)}
            className='group cursor-pointer text-left'
          >
            <Card className='h-full transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-lg'>
              <CardHeader>
                <div className='flex items-start justify-between gap-3'>
                  <div>
                    <CardTitle className='text-lg'>
                      {labels.locale === 'en' ? group.nameEn : group.name}
                    </CardTitle>
                    <CardDescription>
                      {group.students} {labels.students.toLowerCase()}
                    </CardDescription>
                  </div>
                  <span className='rounded-xl bg-primary/10 p-2 text-primary'>
                    <GraduationCap className='size-5' />
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className='rounded-xl bg-muted/40 p-3'>
                  <p className='text-xs text-muted-foreground'>
                    {labels.locale === 'en' ? 'Teacher' : 'O‘qituvchi'}
                  </p>
                  <p className='mt-1 font-semibold'>{group.teacher}</p>
                </div>
                <div className='mt-3 flex items-center justify-between text-sm'>
                  <span className='text-muted-foreground'>{labels.debt}</span>
                  <span className='font-bold text-rose-600'>
                    {format(group.debt)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>
    </>
  )
}
function ReportsPage({ labels }: { labels: Labels }) {
  const crm = useCrmStore()
  const format = (value: number) =>
    `${new Intl.NumberFormat(labels.locale === 'en' ? 'en-US' : 'uz-UZ').format(value)} ${labels.locale === 'en' ? 'UZS' : 'so‘m'}`
  const totalCollected = crm.payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  )
  const paymentCount = crm.payments.length
  const averagePayment = paymentCount
    ? Math.round(totalCollected / paymentCount)
    : 0
  const topPayments = crm.payments.slice(0, 5).map((payment) => ({
    id: payment.id,
    student:
      crm.students.find((student) => student.id === payment.studentId)?.name ??
      (labels.locale === 'en' ? 'Unknown student' : 'Noma’lum o‘quvchi'),
    amount: payment.amount,
  }))
  const courseTotals = crm.payments.reduce<Record<string, number>>(
    (result, payment) => {
      const course =
        crm.students.find((student) => student.id === payment.studentId)
          ?.course ?? (labels.locale === 'en' ? 'Other' : 'Boshqa')
      result[course] = (result[course] || 0) + payment.amount
      return result
    },
    {}
  )
  const courseRevenue = Object.entries(courseTotals)
    .sort(([, first], [, second]) => second - first)
    .slice(0, 5)
  const reportData = incomeData.days
  const downloadExcel = () => {
    const csv = `${labels.student},${labels.amount}\n${topPayments.map((item) => `${item.student},${item.amount}`).join('\n')}`
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `finance-monthly-report.csv`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    setTimeout(() => URL.revokeObjectURL(url), 100)
    toast.success(labels.reportReady)
  }
  const printReport = () => window.print()
  return (
    <div className='print-report space-y-6'>
      <Heading
        labels={labels}
        title={labels.monthly}
        description={labels.reportMonth}
        action={
          <div className='flex flex-wrap gap-2 print:hidden'>
            <Button
              variant='outline'
              size='sm'
              onClick={downloadExcel}
              className='gap-2'
            >
              <FileSpreadsheet className='size-4' />
              {labels.exportExcel}
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={printReport}
              className='gap-2'
            >
              <FileText className='size-4' />
              {labels.exportPdf}
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={printReport}
              className='gap-2'
            >
              <Printer className='size-4' />
              {labels.print}
            </Button>
          </div>
        }
      />
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <Metric
          icon={WalletCards}
          title={labels.totalCollected}
          value={format(totalCollected)}
          detail={labels.totalIncome}
        />
        <Metric
          icon={CreditCard}
          title={labels.paymentCount}
          value={String(paymentCount)}
          detail={labels.paymentList}
        />
        <Metric
          icon={Banknote}
          title={labels.averagePayment}
          value={format(averagePayment)}
          detail={labels.averagePayment}
        />
        <Metric
          icon={TrendingDown}
          title={labels.growth}
          value='+12.4%'
          detail={labels.changeFromLastMonth ?? labels.growth}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{labels.incomeAnalytics}</CardTitle>
          <CardDescription>{labels.totalIncome}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='h-[280px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <AreaChart
                data={reportData}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id='reportIncomeFill'
                    x1='0'
                    y1='0'
                    x2='0'
                    y2='1'
                  >
                    <stop
                      offset='5%'
                      stopColor='var(--primary)'
                      stopOpacity={0.3}
                    />
                    <stop
                      offset='95%'
                      stopColor='var(--primary)'
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke='var(--border)'
                  strokeDasharray='3 3'
                  vertical={false}
                />
                <XAxis
                  dataKey='name'
                  stroke='var(--muted-foreground)'
                  tick={{ fill: 'var(--muted-foreground)' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke='var(--muted-foreground)'
                  tick={{ fill: 'var(--muted-foreground)' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) =>
                    `${Math.round(Number(value) / 1000)}k`
                  }
                />
                <Tooltip
                  formatter={(value) => [format(Number(value)), labels.income]}
                />
                <Area
                  type='monotone'
                  dataKey='value'
                  name={labels.income}
                  stroke='var(--primary)'
                  fill='url(#reportIncomeFill)'
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <div className='grid gap-6 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>{labels.topPayments}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-1'>
            {topPayments.map((payment, index) => (
              <div
                key={payment.id}
                className='flex items-center justify-between border-b py-3 last:border-0'
              >
                <span className='text-sm'>
                  <span className='me-2 text-muted-foreground'>
                    {index + 1}.
                  </span>
                  {payment.student}
                </span>
                <span className='text-sm font-semibold'>
                  {format(payment.amount)}
                </span>
              </div>
            ))}
            {!topPayments.length && (
              <p className='py-6 text-sm text-muted-foreground'>
                {labels.empty}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{labels.courseRevenue}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-1'>
            {courseRevenue.map(([course, amount]) => (
              <div
                key={course}
                className='flex items-center justify-between border-b py-3 last:border-0'
              >
                <span className='text-sm'>{course}</span>
                <span className='text-sm font-semibold text-emerald-600 dark:text-emerald-400'>
                  {format(amount)}
                </span>
              </div>
            ))}
            {!courseRevenue.length && (
              <p className='py-6 text-sm text-muted-foreground'>
                {labels.empty}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
function Metric({
  icon: Icon,
  title,
  value,
  detail,
}: {
  icon: typeof WalletCards
  title: string
  value: string
  detail: string
}) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <span className='rounded-lg bg-primary/10 p-2 text-primary'>
          <Icon className='size-4' />
        </span>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        <p className='mt-1 text-xs text-muted-foreground'>{detail}</p>
      </CardContent>
    </Card>
  )
}
function RoleSettingsPage({ labels }: { labels: Labels }) {
  return (
    <RoleSettings
      labels={{
        locale: labels.locale === 'en' ? 'en' : 'uz',
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
        saved: labels.settingsSaved,
        enabled: labels.locale === 'en' ? 'Enabled' : 'Yoqilgan',
        disabled: labels.locale === 'en' ? 'Disabled' : 'O‘chirilgan',
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
  const { language } = useLanguage()
  const english = language === 'en'
  return (
    <div className='space-y-5'>
      <div className='relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/[0.10] via-card to-amber-500/[0.06] p-6 shadow-sm'>
        <div className='pointer-events-none absolute -end-12 -top-20 size-52 rounded-full bg-primary/10 blur-3xl' />
        <div className='relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
          <div>
            <p className='text-xs font-semibold tracking-[0.18em] text-primary uppercase'>
              SFERA IT ACADEMY
            </p>
            <h1 className='mt-2 text-2xl font-bold tracking-tight md:text-3xl'>
              {title}
            </h1>
            <p className='mt-1 max-w-2xl text-sm text-muted-foreground'>
              {description}
            </p>
          </div>
          <div className='rounded-2xl border bg-background/75 px-4 py-3 text-xs shadow-sm'>
            <p className='font-semibold'>
              {english ? 'Finance workspace' : 'Moliya ish maydoni'}
            </p>
            <p className='mt-1 text-muted-foreground'>
              {english
                ? 'Profile and account identity'
                : 'Profil va hisob ma’lumotlari'}
            </p>
          </div>
        </div>
      </div>
      <div className='grid gap-4 sm:grid-cols-3'>
        <Card>
          <CardContent className='p-4'>
            <p className='text-xs text-muted-foreground'>
              {english ? 'Account' : 'Hisob'}
            </p>
            <p className='mt-1 font-semibold'>{english ? 'Active' : 'Faol'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <p className='text-xs text-muted-foreground'>
              {english ? 'Workspace' : 'Ish maydoni'}
            </p>
            <p className='mt-1 font-semibold'>
              {english ? 'Finance' : 'Moliya'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <p className='text-xs text-muted-foreground'>
              {english ? 'Security' : 'Xavfsizlik'}
            </p>
            <p className='mt-1 font-semibold text-emerald-600'>
              {english ? 'Protected' : 'Himoyalangan'}
            </p>
          </CardContent>
        </Card>
      </div>
      <Card className='overflow-hidden'>
        <CardHeader className='border-b bg-muted/[0.16]'>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className='pt-5'>
          <ProfileForm />
        </CardContent>
      </Card>
    </div>
  )
}
