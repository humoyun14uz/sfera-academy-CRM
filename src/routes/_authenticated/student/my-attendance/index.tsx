import { createFileRoute } from '@tanstack/react-router'
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  UserCheck,
  XCircle,
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
import { requireRole } from '@/lib/route-guard'
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
import { Progress } from '@/components/ui/progress'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Search as GlobalSearch } from '@/components/search'

export const Route = createFileRoute('/_authenticated/student/my-attendance/')({
  beforeLoad: () => requireRole('Student'),
  component: MyAttendancePage,
})

const attendanceData = [
  { month: 'Mart', kelgan: 12, kelmagan: 0 },
  { month: 'Aprel', kelgan: 11, kelmagan: 1 },
  { month: 'May', kelgan: 12, kelmagan: 0 },
  { month: 'Iyun', kelgan: 10, kelmagan: 2 },
  { month: 'Iyul', kelgan: 11, kelmagan: 1 },
  { month: 'Avgust', kelgan: 12, kelmagan: 0 },
]

const attendanceRecords = [
  {
    id: 1,
    date: '08-Sentabr 2026',
    day: 'Dushanba',
    topic: 'TypeScript Generics & Utility Types',
    status: 'present',
    time: '09:00',
    teacher: 'Abdulloh K.',
  },
  {
    id: 2,
    date: '05-Sentabr 2026',
    day: 'Juma',
    topic: 'TanStack React Query & Mutatsiyalar',
    status: 'present',
    time: '09:00',
    teacher: 'Abdulloh K.',
  },
  {
    id: 3,
    date: '03-Sentabr 2026',
    day: 'Chorshanba',
    topic: 'React Context API va Clean State',
    status: 'present',
    time: '09:00',
    teacher: 'Abdulloh K.',
  },
  {
    id: 4,
    date: '01-Sentabr 2026',
    day: 'Dushanba',
    topic: 'Mustaqillik bayrami (Dars bo‘lmadi)',
    status: 'holiday',
    time: '—',
    teacher: '—',
  },
  {
    id: 5,
    date: '29-Avgust 2026',
    day: 'Juma',
    topic: 'React Custom Hooks amaliyoti',
    status: 'present',
    time: '09:00',
    teacher: 'Abdulloh K.',
  },
  {
    id: 6,
    date: '27-Avgust 2026',
    day: 'Chorshanba',
    topic: 'useEffect to‘g‘ri boshqaruvi',
    status: 'absent_excused',
    time: '09:00',
    teacher: 'Abdulloh K.',
  },
  {
    id: 7,
    date: '25-Avgust 2026',
    day: 'Dushanba',
    topic: 'React Komponentlar hayot sikli',
    status: 'present',
    time: '09:00',
    teacher: 'Abdulloh K.',
  },
]

function MyAttendancePage() {
  const { language } = useLanguage()
  const english = language === 'en'
  const totalLessons = 48
  const attendedLessons = 42
  const excusedLessons = 4
  const unexcusedLessons = 2
  const attendanceRate = Math.round((attendedLessons / totalLessons) * 100)

  const downloadAttendance = () => {
    const rows = [
      ['Sana', 'Kun', 'Mavzu', 'Holat', 'Vaqt', 'O\'qituvchi'],
      ...attendanceRecords.map((rec) => [
        rec.date,
        rec.day,
        rec.topic,
        rec.status === 'present' ? 'Kelgan' : rec.status === 'absent_excused' ? 'Sababli kelmagan' : rec.status === 'holiday' ? 'Bayram' : 'Kelmagan',
        rec.time,
        rec.teacher,
      ]),
    ]
    const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'davomat-hisoboti.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => URL.revokeObjectURL(url), 150)
  }

  return (
    <>
      <Header fixed>
        <div className='flex items-center gap-2'>
          <h1 className='text-lg font-semibold tracking-tight'>
            {english ? 'My attendance' : 'Davomatim'}
          </h1>
          <Badge
            variant='outline'
            className='border-green-300 bg-green-50 text-green-600 dark:bg-green-950'
          >
            {attendanceRate}% {english ? 'Attendance rate' : 'Faol qatnashuv'}
          </Badge>
        </div>
        <div className='ms-auto flex items-center gap-2'>
          <GlobalSearch className='me-auto sm:me-0' />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='space-y-6'>
        {/* 4 Ta Metrika */}
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <Card className='shadow-sm'>
            <CardContent className='pt-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs text-muted-foreground'>
                    Umumiy davomat
                  </p>
                  <p className='mt-0.5 text-2xl font-bold'>{attendanceRate}%</p>
                </div>
                <div className='rounded-lg bg-green-500/10 p-2.5 text-green-600 dark:text-green-400'>
                  <UserCheck className='size-5' />
                </div>
              </div>
              <Progress
                value={attendanceRate}
                className='mt-3 h-1.5 [&>div]:bg-green-500'
              />
              <p className='mt-2 text-[11px] text-muted-foreground'>
                Minimal talab: 80% (Bajarildi ✓)
              </p>
            </CardContent>
          </Card>

          <Card className='shadow-sm'>
            <CardContent className='pt-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs text-muted-foreground'>
                    Qatnashilgan darslar
                  </p>
                  <p className='mt-0.5 text-2xl font-bold text-green-600 dark:text-green-400'>
                    {attendedLessons} ta
                  </p>
                </div>
                <div className='rounded-lg bg-green-500/10 p-2.5 text-green-600 dark:text-green-400'>
                  <CheckCircle2 className='size-5' />
                </div>
              </div>
              <p className='mt-4 text-[11px] text-muted-foreground'>
                Jami {totalLessons} ta darsdan
              </p>
            </CardContent>
          </Card>

          <Card className='shadow-sm'>
            <CardContent className='pt-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs text-muted-foreground'>
                    Sababli qoldirilgan
                  </p>
                  <p className='mt-0.5 text-2xl font-bold text-amber-600 dark:text-amber-400'>
                    {excusedLessons} ta
                  </p>
                </div>
                <div className='rounded-lg bg-amber-500/10 p-2.5 text-amber-600 dark:text-amber-400'>
                  <AlertTriangle className='size-5' />
                </div>
              </div>
              <p className='mt-4 text-[11px] text-muted-foreground'>
                Ariza tasdiqlangan
              </p>
            </CardContent>
          </Card>

          <Card className='shadow-sm'>
            <CardContent className='pt-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs text-muted-foreground'>
                    Sababsiz qoldirilgan
                  </p>
                  <p className='mt-0.5 text-2xl font-bold text-red-600 dark:text-red-400'>
                    {unexcusedLessons} ta
                  </p>
                </div>
                <div className='rounded-lg bg-red-500/10 p-2.5 text-red-600 dark:text-red-400'>
                  <XCircle className='size-5' />
                </div>
              </div>
              <p className='mt-4 text-[11px] text-muted-foreground'>
                Ruxsat etilgan limit: 5 tagacha
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Oylik qatnashuv dinamikasi */}
        <Card className='shadow-sm'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle className='text-base'>
                  Oylik davomat dinamikasi
                </CardTitle>
                <CardDescription>
                  Oxirgi 6 oylik qatnashuv statistikasi
                </CardDescription>
              </div>
              <Badge variant='outline' className='text-xs'>
                Oylar kesimida
              </Badge>
            </div>
          </CardHeader>
          <CardContent className='pt-2'>
            <ResponsiveContainer width='100%' height={220}>
              <BarChart
                data={attendanceData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray='3 3'
                  vertical={false}
                  opacity={0.2}
                />
                <XAxis
                  dataKey='month'
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--popover)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                    color: 'var(--popover-foreground)',
                  }}
                />
                <Bar
                  dataKey='kelgan'
                  fill='var(--primary)'
                  radius={[4, 4, 0, 0]}
                  name='Qatnashgan darslar'
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Davomat Jurnali Jadvali */}
        <Card className='shadow-sm'>
          <CardHeader>
            <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <CardTitle className='text-base'>Davomat jurnali</CardTitle>
                <CardDescription>
                  Oxirgi darslar bo‘yicha qatnashuv holatlari
                </CardDescription>
              </div>
              <Button
                variant='outline'
                size='sm'
                className='w-fit gap-1.5 text-xs'
                onClick={downloadAttendance}
              >
                <Download className='size-3.5' /> Hisobotni yuklab olish
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className='divide-y rounded-lg border bg-background text-xs'>
              {attendanceRecords.map((rec) => (
                <div
                  key={rec.id}
                  className='flex flex-col gap-2 p-3 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between'
                >
                  <div className='space-y-0.5'>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm font-semibold'>{rec.date}</span>
                      <span className='text-muted-foreground'>({rec.day})</span>
                    </div>
                    <p className='text-muted-foreground'>{rec.topic}</p>
                  </div>

                  <div className='flex items-center justify-between gap-3 sm:justify-end'>
                    <span className='text-muted-foreground'>
                      {rec.time} · {rec.teacher}
                    </span>
                    {rec.status === 'present' && (
                      <Badge className='gap-1 bg-green-500 text-[11px] text-white hover:bg-green-600'>
                        <CheckCircle2 className='size-3' /> Kelgan
                      </Badge>
                    )}
                    {rec.status === 'absent_excused' && (
                      <Badge
                        variant='outline'
                        className='gap-1 border-amber-400 bg-amber-50 text-[11px] text-amber-600 dark:bg-amber-950'
                      >
                        <AlertTriangle className='size-3' /> Sababli
                      </Badge>
                    )}
                    {rec.status === 'holiday' && (
                      <Badge variant='secondary' className='text-[11px]'>
                        Bayram
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
