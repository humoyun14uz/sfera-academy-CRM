import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Award,
  CheckCircle2,
  Download,
  GraduationCap,
  TrendingUp,
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
import { useAuthStore } from '@/stores/auth-store'
import { requireRole } from '@/lib/route-guard'
import { readSharedGrades, type SharedGrade } from '@/lib/teacher-student-sync'
import { useLanguage } from '@/context/language-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Search as GlobalSearch } from '@/components/search'

export const Route = createFileRoute('/_authenticated/student/my-grades/')({
  beforeLoad: () => requireRole('Student'),
  component: MyGradesPage,
})

const gradesChartData = [
  { subject: 'HTML/CSS', ball: 95 },
  { subject: 'JavaScript', ball: 88 },
  { subject: 'React.js', ball: 92 },
  { subject: 'TypeScript', ball: 85 },
  { subject: 'Amaliyot', ball: 90 },
]

const modulesGrades = [
  {
    id: 'MOD-1',
    name: 'HTML5, CSS3 va Semantik Layoutlar',
    teacher: 'Abdulloh Karimov',
    examScore: 96,
    homeworkScore: 94,
    totalScore: 95,
    grade: 'A+',
    status: 'Tugallangan',
    feedback:
      'Maketni mukammal darajada moslashtirgan. CSS Grid va Flexboxni to‘g‘ri qo‘llagan.',
  },
  {
    id: 'MOD-2',
    name: 'JavaScript (ES6+) va Asinxron Mantiq',
    teacher: 'Abdulloh Karimov',
    examScore: 86,
    homeworkScore: 90,
    totalScore: 88,
    grade: 'B+',
    status: 'Tugallangan',
    feedback:
      'Asinxron kod va Promise zanjirlarini yaxshi tushungan. Event loop qoidalarini mustahkamlash tavsiya etiladi.',
  },
  {
    id: 'MOD-3',
    name: 'React.js Ekosistemasi & State Management',
    teacher: 'Abdulloh Karimov',
    examScore: 94,
    homeworkScore: 90,
    totalScore: 92,
    grade: 'A',
    status: 'Tugallangan',
    feedback: 'Komponent arxitekturasi va Custom Hooklar namunali yozilgan.',
  },
  {
    id: 'MOD-4',
    name: 'TypeScript & TanStack Tools',
    teacher: 'Abdulloh Karimov',
    examScore: 84,
    homeworkScore: 86,
    totalScore: 85,
    grade: 'B+',
    status: 'Jarayonda',
    feedback:
      'Generics va Utility tiplar ustida amaliy mashg‘ulotlar davom etmoqda.',
  },
]

function MyGradesPage() {
  const { language } = useLanguage()
  const english = language === 'en'
  const user = useAuthStore((state) => state.auth.user)
  const [sharedGrades, setSharedGrades] = useState<SharedGrade[]>([])
  useEffect(() => {
    const sync = () => setSharedGrades(readSharedGrades())
    sync()
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])
  const currentGrade = sharedGrades.find(
    (grade) => grade.student === user?.name
  )
  const avgScore = currentGrade?.score ?? 90
  const gpa = '3.8 / 4.0'
  const downloadReport = () => {
    const rows = [
      ['Modul ID', 'Modul nomi', 'O\'qituvchi', 'Oraliq imtihon', 'Uy vazifalari', 'Umumiy ball', 'Daraja', 'Holati'],
      ...modulesGrades.map((mod) => [
        mod.id,
        mod.name,
        mod.teacher,
        String(mod.examScore),
        String(mod.homeworkScore),
        String(mod.totalScore),
        mod.grade,
        mod.status,
      ]),
    ]
    const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `baholar-hisoboti-${user?.name ?? 'talaba'}.csv`
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
            {english ? 'My grades' : 'Baholarim'}
          </h1>
          <Badge variant='outline' className='border-primary/30 text-primary'>
            GPA {gpa}
          </Badge>
        </div>
        <div className='ms-auto flex items-center gap-2'>
          <GlobalSearch className='me-auto sm:me-0' />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='space-y-6'>
        {/* Metrika Kartochkalari */}
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <Card className='shadow-sm'>
            <CardContent className='pt-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs text-muted-foreground'>
                    O‘rtacha ko‘rsatkich
                  </p>
                  <p className='mt-0.5 text-2xl font-bold'>{avgScore} / 100</p>
                </div>
                <div className='rounded-lg bg-blue-500/10 p-2.5 text-blue-600 dark:text-blue-400'>
                  <TrendingUp className='size-5' />
                </div>
              </div>
              <Progress
                value={avgScore}
                className='mt-3 h-1.5 [&>div]:bg-blue-500'
              />
              <p className='mt-2 text-[11px] text-muted-foreground'>
                GPA Ekvivalenti: 3.8 (A)
              </p>
            </CardContent>
          </Card>

          <Card className='shadow-sm'>
            <CardContent className='pt-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs text-muted-foreground'>
                    Guruhdagi o‘rningiz
                  </p>
                  <p className='mt-0.5 text-2xl font-bold text-primary'>
                    2-o‘rin
                  </p>
                </div>
                <div className='rounded-lg bg-primary/10 p-2.5 text-primary'>
                  <Award className='size-5' />
                </div>
              </div>
              <p className='mt-4 text-[11px] text-muted-foreground'>
                12 nafar talaba orasida
              </p>
            </CardContent>
          </Card>

          <Card className='shadow-sm'>
            <CardContent className='pt-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs text-muted-foreground'>
                    Tugallangan modullar
                  </p>
                  <p className='mt-0.5 text-2xl font-bold text-green-600 dark:text-green-400'>
                    3 / 5 modul
                  </p>
                </div>
                <div className='rounded-lg bg-green-500/10 p-2.5 text-green-600 dark:text-green-400'>
                  <CheckCircle2 className='size-5' />
                </div>
              </div>
              <p className='mt-4 text-[11px] text-muted-foreground'>
                Barcha imtihonlar topshirildi
              </p>
            </CardContent>
          </Card>

          <Card className='shadow-sm'>
            <CardContent className='pt-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs text-muted-foreground'>
                    Sertifikat darajasi
                  </p>
                  <p className='mt-0.5 text-2xl font-bold text-purple-600 dark:text-purple-400'>
                    A'lo (Honor)
                  </p>
                </div>
                <div className='rounded-lg bg-purple-500/10 p-2.5 text-purple-600 dark:text-purple-400'>
                  <GraduationCap className='size-5' />
                </div>
              </div>
              <p className='mt-4 text-[11px] text-muted-foreground'>
                Kvalifikatsiya talabiga to‘liq mos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Fanlar diagrammasi */}
        <Card className='shadow-sm'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle className='text-base'>
                  Fanlar bo‘yicha o‘zlashtirish balansi
                </CardTitle>
                <CardDescription>
                  Barcha modullar natijalari 100 ballik shkalada
                </CardDescription>
              </div>
              <Badge variant='secondary' className='text-xs'>
                Maksimal: 100
              </Badge>
            </div>
          </CardHeader>
          <CardContent className='pt-2'>
            <ResponsiveContainer width='100%' height={220}>
              <BarChart
                data={gradesChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray='3 3'
                  vertical={false}
                  opacity={0.2}
                />
                <XAxis
                  dataKey='subject'
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />
                <YAxis
                  domain={[60, 100]}
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--popover)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                    color: 'var(--popover-foreground)',
                  }}
                />
                <Bar
                  dataKey='ball'
                  fill='var(--primary)'
                  radius={[4, 4, 0, 0]}
                  name='To‘plangan ball'
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Modullar Natijalari Kartochkalari */}
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h3 className='text-base font-semibold tracking-tight'>
              Modullar va imtihon qaydnomasi
            </h3>
            <Button variant='outline' size='sm' className='gap-1.5 text-xs' onClick={downloadReport}>
              <Download className='size-3.5' /> Baholar varaqasini yuklash
              (.pdf)
            </Button>
          </div>

          <div className='grid gap-4 md:grid-cols-2'>
            {modulesGrades.map((mod) => (
              <Card
                key={mod.id}
                className='shadow-sm transition-colors hover:border-primary/30'
              >
                <CardHeader className='pb-3'>
                  <div className='flex items-start justify-between gap-2'>
                    <div>
                      <span className='font-mono text-[10px] text-muted-foreground'>
                        {mod.id}
                      </span>
                      <CardTitle className='mt-0.5 text-sm font-bold'>
                        {mod.name}
                      </CardTitle>
                      <CardDescription className='text-xs'>
                        O‘qituvchi: {mod.teacher}
                      </CardDescription>
                    </div>
                    <div className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-base font-bold text-primary'>
                      {mod.grade}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-3 text-xs'>
                  <div className='grid grid-cols-2 gap-2 rounded-lg border bg-muted/30 p-2.5'>
                    <div>
                      <span className='text-[11px] text-muted-foreground'>
                        Oraliq imtihon:
                      </span>
                      <p className='font-semibold'>{mod.examScore} / 100</p>
                    </div>
                    <div>
                      <span className='text-[11px] text-muted-foreground'>
                        Uy vazifalari:
                      </span>
                      <p className='font-semibold'>{mod.homeworkScore} / 100</p>
                    </div>
                  </div>

                  <p className='rounded border bg-background p-2 text-[11px] text-muted-foreground italic'>
                    "{mod.feedback}"
                  </p>
                </CardContent>
                <CardFooter className='flex justify-between border-t bg-muted/10 py-2.5 text-xs'>
                  <span className='text-muted-foreground'>
                    Umumiy ball: <b>{mod.totalScore}</b>
                  </span>
                  <Badge
                    variant={
                      mod.status === 'Tugallangan' ? 'default' : 'secondary'
                    }
                    className={
                      mod.status === 'Tugallangan'
                        ? 'bg-green-500 text-[10px] text-white hover:bg-green-600'
                        : 'text-[10px]'
                    }
                  >
                    {mod.status}
                  </Badge>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </Main>
    </>
  )
}
