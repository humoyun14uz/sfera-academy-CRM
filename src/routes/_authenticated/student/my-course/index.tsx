import { createFileRoute } from '@tanstack/react-router'
import {
  Award,
  CalendarDays,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  GraduationCap,
  Layers,
  Lock,
  PlayCircle,
  Users,
} from 'lucide-react'
import { IconGithub } from '@/assets/brand-icons'
import { requireRole } from '@/lib/route-guard'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Search as GlobalSearch } from '@/components/search'

export const Route = createFileRoute('/_authenticated/student/my-course/')({
  beforeLoad: () => requireRole('Student'),
  component: MyCoursePage,
})

type CourseLesson = {
  title: string
  type: string
  duration: string
  done: boolean
  active?: boolean
}

type CourseModule = {
  id: number
  title: string
  duration: string
  status: string
  score: string
  lessons: CourseLesson[]
}

const modulesList: CourseModule[] = [
  {
    id: 1,
    title: '1-Modul: HTML5, Zamonaviy CSS va Semantika',
    duration: '3 hafta · 12 ta dars',
    status: 'completed',
    score: '95/100',
    lessons: [
      {
        title: 'HTML5 semantik teglari va a11y',
        type: 'video',
        duration: '1s 45d',
        done: true,
      },
      {
        title: 'Flexbox va CSS Grid layoutlari',
        type: 'video',
        duration: '2s 10d',
        done: true,
      },
      {
        title: 'Responsive dizayn va media queries',
        type: 'practice',
        duration: '1s 30d',
        done: true,
      },
      {
        title: '1-Modul Imtihon loyihasi',
        type: 'exam',
        duration: 'Topshirilgan',
        done: true,
      },
    ],
  },
  {
    id: 2,
    title: '2-Modul: JavaScript (ES6+) va Asinxron Dasturlash',
    duration: '4 hafta · 16 ta dars',
    status: 'completed',
    score: '88/100',
    lessons: [
      {
        title: 'Array metodlari, Destructuring & Rest/Spread',
        type: 'video',
        duration: '2s',
        done: true,
      },
      {
        title: 'DOM manipulyatsiyasi va Eventlar',
        type: 'video',
        duration: '2s 15d',
        done: true,
      },
      {
        title: 'Promises, Async/Await va Fetch API',
        type: 'practice',
        duration: '2s',
        done: true,
      },
      {
        title: 'Mini CRUD ilova yaratish',
        type: 'exam',
        duration: 'Topshirilgan',
        done: true,
      },
    ],
  },
  {
    id: 3,
    title: '3-Modul: React.js Asoslari va State Management',
    duration: '6 hafta · 24 ta dars',
    status: 'completed',
    score: '92/100',
    lessons: [
      {
        title: 'JSX, Komponentlar va Props',
        type: 'video',
        duration: '1s 50d',
        done: true,
      },
      {
        title: 'useState va useEffect hooklari',
        type: 'video',
        duration: '2s 30d',
        done: true,
      },
      {
        title: 'Custom Hooklar va Context API',
        type: 'practice',
        duration: '2s',
        done: true,
      },
      {
        title: 'TanStack Query bilan server statedan foydalanish',
        type: 'practice',
        duration: '2s 10d',
        done: true,
      },
    ],
  },
  {
    id: 4,
    title: '4-Modul: TypeScript va Mukammal Arxitektura',
    duration: '4 hafta · 16 ta dars',
    status: 'current',
    score: 'Jarayonda',
    lessons: [
      {
        title: 'TypeScript asoslari: Interfaces & Types',
        type: 'video',
        duration: '2s',
        done: true,
      },
      {
        title: 'Generics va Advanced Types',
        type: 'video',
        duration: '2s 15d',
        done: false,
        active: true,
      },
      {
        title: 'React bilan TypeScript integratsiyasi',
        type: 'practice',
        duration: '2s',
        done: false,
      },
      {
        title: 'Zod va React Hook Form validatsiyalari',
        type: 'practice',
        duration: '2s',
        done: false,
      },
    ],
  },
  {
    id: 5,
    title: '5-Modul: Katta Loyiha (Portfolio Capstone)',
    duration: '5 hafta · 20 ta dars',
    status: 'locked',
    score: 'Kutilmoqda',
    lessons: [
      {
        title: 'Fullstack E-Commerce yoki CRM arxitekturasi',
        type: 'project',
        duration: '3 hafta',
        done: false,
      },
      {
        title: 'CI/CD, Deploy va Optimallashtirish',
        type: 'video',
        duration: '1 hafta',
        done: false,
      },
      {
        title: 'Diplom himoyasi va Rezyume tayyorlash',
        type: 'exam',
        duration: '1 hafta',
        done: false,
      },
    ],
  },
]

function MyCoursePage() {
  const { language } = useLanguage()
  const english = language === 'en'
  const completedModules = modulesList.filter(
    (m) => m.status === 'completed'
  ).length
  const progress = Math.round((completedModules / modulesList.length) * 100)

  return (
    <>
      <Header fixed>
        <div className='flex items-center gap-2'>
          <h1 className='text-lg font-semibold tracking-tight'>
            {english ? 'My course' : 'Mening kursim'}
          </h1>
          <Badge
            variant='outline'
            className='border-green-300 bg-green-50 text-green-600 dark:bg-green-950'
          >
            {english ? 'Active learning' : 'Faol o‘qish'}
          </Badge>
        </div>
        <div className='ms-auto flex items-center gap-2'>
          <GlobalSearch className='me-auto sm:me-0' />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='space-y-6'>
        {/* Kurs haqida asosiy karta */}
        <div className='grid gap-6 lg:grid-cols-3'>
          <Card className='border-primary/20 bg-gradient-to-br from-card to-muted/30 shadow-sm lg:col-span-2'>
            <CardHeader>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <Badge className='bg-primary text-primary-foreground'>
                  Frontend Rivojlantirish
                </Badge>
                <span className='flex items-center gap-1 text-xs text-muted-foreground'>
                  <CalendarDays className='size-3.5' /> 1-Mart – 1-Sentabr 2026
                  (6 oy)
                </span>
              </div>
              <CardTitle className='mt-2 text-2xl font-bold'>
                React, TypeScript va Zamonaviy Veb Texnologiyalari
              </CardTitle>
              <CardDescription className='text-sm leading-relaxed'>
                Professional darajadagi frontend muhandisi bo‘lish uchun
                intensiv amaliy kurs. Junior-dan Middle darajagacha bo‘lgan
                barcha zamonaviy texnologiyalar.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <div className='mb-1.5 flex items-center justify-between text-sm'>
                  <span className='text-xs font-medium text-muted-foreground'>
                    Umumiy o‘zlashtirish jarayoni
                  </span>
                  <span className='font-bold text-primary'>
                    {progress}% yakunlandi
                  </span>
                </div>
                <Progress value={progress} className='h-2.5' />
              </div>

              <div className='grid grid-cols-2 gap-3 pt-2 text-xs sm:grid-cols-4'>
                <div className='rounded-lg border bg-background p-3'>
                  <p className='text-muted-foreground'>O‘qituvchi</p>
                  <p className='mt-0.5 text-sm font-semibold'>Abdulloh K.</p>
                </div>
                <div className='rounded-lg border bg-background p-3'>
                  <p className='text-muted-foreground'>Guruh</p>
                  <p className='mt-0.5 text-sm font-semibold'>G-14</p>
                </div>
                <div className='rounded-lg border bg-background p-3'>
                  <p className='text-muted-foreground'>Jami modullar</p>
                  <p className='mt-0.5 text-sm font-semibold'>5 ta modul</p>
                </div>
                <div className='rounded-lg border bg-background p-3'>
                  <p className='text-muted-foreground'>Sertifikat</p>
                  <p className='mt-0.5 text-sm font-semibold text-green-600'>
                    A'lo daraja
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* O'ng blok: Tezkor ma'lumotlar va mentor */}
          <Card className='flex flex-col justify-between shadow-sm'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-base'>
                <GraduationCap className='size-4 text-primary' />
                Kurs mentori
              </CardTitle>
              <CardDescription>Savollar va yordam uchun</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center gap-3'>
                <div className='flex size-12 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary'>
                  AK
                </div>
                <div>
                  <h4 className='text-sm font-bold'>Abdulloh Karimov</h4>
                  <p className='text-xs text-muted-foreground'>
                    Senior Frontend Engineer (5+ yil)
                  </p>
                  <p className='mt-0.5 text-[10px] text-green-600 dark:text-green-400'>
                    ● Onlayn (savollarga javob beradi)
                  </p>
                </div>
              </div>
              <div className='space-y-2 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground'>
                <p>
                  📍 Keyingi amaliy dars: <b>Bugun, 09:00</b>
                </p>
                <p>
                  🏛 Auditoriya: <b>201-xona</b>
                </p>
                <p>
                  💬 Telegram guruh: <b>@sfera_g14_frontend</b>
                </p>
              </div>
            </CardContent>
            <CardFooter className='border-t pt-3'>
              <Button
                variant='outline'
                size='sm'
                className='w-full gap-1.5 text-xs'
                onClick={() => (window.location.href = '/student/my-group')}
              >
                <Users className='size-3.5' /> Guruh ro‘yxatini ko‘rish
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Tablar: Dastur va Resurslar */}
        <Tabs defaultValue='syllabus' className='space-y-4'>
          <TabsList className='bg-muted/60 p-1'>
            <TabsTrigger value='syllabus' className='text-xs sm:text-sm'>
              <Layers className='me-1.5 size-3.5' /> Dastur rejasi (Syllabus)
            </TabsTrigger>
            <TabsTrigger value='materials' className='text-xs sm:text-sm'>
              <FileText className='me-1.5 size-3.5' /> O‘quv materiallari va
              slaydlar
            </TabsTrigger>
            <TabsTrigger value='certificate' className='text-xs sm:text-sm'>
              <Award className='me-1.5 size-3.5' /> Sertifikat talablari
            </TabsTrigger>
          </TabsList>

          <TabsContent value='syllabus' className='space-y-3'>
            {modulesList.map((m) => (
              <Card
                key={m.id}
                className={`shadow-sm transition-colors ${m.status === 'current' ? 'border-primary/50 ring-1 ring-primary/20' : ''}`}
              >
                <CardHeader className='py-4'>
                  <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='flex items-center gap-3'>
                      <div
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          m.status === 'completed'
                            ? 'bg-green-500 text-white'
                            : m.status === 'current'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {m.status === 'completed' ? (
                          '✓'
                        ) : m.status === 'locked' ? (
                          <Lock className='size-3.5' />
                        ) : (
                          m.id
                        )}
                      </div>
                      <div>
                        <CardTitle className='text-base font-semibold'>
                          {m.title}
                        </CardTitle>
                        <CardDescription className='text-xs'>
                          {m.duration}
                        </CardDescription>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <Badge
                        variant={
                          m.status === 'completed'
                            ? 'default'
                            : m.status === 'current'
                              ? 'secondary'
                              : 'outline'
                        }
                        className={
                          m.status === 'completed'
                            ? 'bg-green-500 hover:bg-green-600'
                            : ''
                        }
                      >
                        {m.status === 'completed'
                          ? `Tugallangan · ${m.score}`
                          : m.status === 'current'
                            ? 'Hozirgi mavzu'
                            : 'Qulflangan'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='pt-0 pb-4'>
                  <div className='divide-y rounded-lg border bg-background/50 text-xs'>
                    {m.lessons.map((lesson, idx) => (
                      <div
                        key={idx}
                        className='flex items-center justify-between p-2.5 sm:px-4'
                      >
                        <div className='flex items-center gap-2.5'>
                          {lesson.done ? (
                            <CheckCircle2 className='size-4 shrink-0 text-green-500' />
                          ) : lesson.active ? (
                            <PlayCircle className='size-4 shrink-0 animate-pulse text-primary' />
                          ) : (
                            <Clock className='size-4 shrink-0 text-muted-foreground' />
                          )}
                          <span
                            className={`font-medium ${lesson.active ? 'text-primary' : ''}`}
                          >
                            {lesson.title}
                          </span>
                        </div>
                        <span className='text-[11px] text-muted-foreground'>
                          {lesson.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value='materials' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {[
                {
                  title: 'TypeScript Cheat Sheet (PDF)',
                  hajmi: '2.4 MB',
                  tur: 'PDF Hujjat',
                  icon: FileText,
                },
                {
                  title: 'React Hooks Best Practices',
                  hajmi: '1.8 MB',
                  tur: 'Taqdimot (Slayd)',
                  icon: FileText,
                },
                {
                  title: 'G-14 Amaliyot Kodlari Repository',
                  hajmi: 'Github',
                  tur: 'Manba kodi',
                  icon: IconGithub,
                },
                {
                  title: 'CSS Flexbox & Grid Masalalar to‘plami',
                  hajmi: '850 KB',
                  tur: 'Mashqlar',
                  icon: FileText,
                },
                {
                  title: 'JavaScript Interview Savollari 2026',
                  hajmi: '3.1 MB',
                  tur: 'Qo‘llanma',
                  icon: FileText,
                },
              ].map((mat, i) => (
                <Card
                  key={i}
                  className='shadow-sm transition-shadow hover:shadow'
                >
                  <CardHeader className='pb-3'>
                    <div className='flex items-start justify-between'>
                      <div className='rounded-lg bg-primary/10 p-2 text-primary'>
                        <mat.icon className='size-5' />
                      </div>
                      <Badge variant='outline' className='text-[10px]'>
                        {mat.tur}
                      </Badge>
                    </div>
                    <CardTitle className='mt-2 text-sm font-semibold'>
                      {mat.title}
                    </CardTitle>
                    <CardDescription className='text-xs'>
                      {mat.hajmi}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className='pt-0'>
                    <Button
                      variant='secondary'
                      size='sm'
                      className='w-full gap-1.5 text-xs'
                    >
                      <Download className='size-3.5' /> Yuklab olish
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value='certificate' className='space-y-4'>
            <Card className='shadow-sm'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-base'>
                  <Award className='size-5 text-primary' />
                  Sfera IT Academy Rasmiy Diplomi va Sertifikati
                </CardTitle>
                <CardDescription>
                  Kursni muvaffaqiyatli bitirib, sertifikatga ega bo‘lish
                  mezonlari
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid gap-3 text-xs sm:grid-cols-3'>
                  <div className='space-y-1 rounded-xl border bg-muted/20 p-4'>
                    <p className='text-muted-foreground'>Davomat chegarasi</p>
                    <p className='text-lg font-bold'>80% minimum</p>
                    <p className='font-medium text-green-600'>
                      Sizda: 87.5% (Bajarildi ✓)
                    </p>
                  </div>
                  <div className='space-y-1 rounded-xl border bg-muted/20 p-4'>
                    <p className='text-muted-foreground'>
                      O‘rtacha imtihon bali
                    </p>
                    <p className='text-lg font-bold'>70 ball minimum</p>
                    <p className='font-medium text-green-600'>
                      Sizda: 90 ball (Bajarildi ✓)
                    </p>
                  </div>
                  <div className='space-y-1 rounded-xl border bg-muted/20 p-4'>
                    <p className='text-muted-foreground'>
                      Capstone diplom ishi
                    </p>
                    <p className='text-lg font-bold'>Majburiy himoya</p>
                    <p className='font-medium text-amber-600'>
                      5-modulda kutilmoqda
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
