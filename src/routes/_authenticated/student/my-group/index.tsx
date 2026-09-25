import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Clock, GraduationCap, Search, UserCheck, Users } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { requireRole } from '@/lib/route-guard'
import { useLanguage } from '@/context/language-provider'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Search as GlobalSearch } from '@/components/search'

export const Route = createFileRoute('/_authenticated/student/my-group/')({
  beforeLoad: () => requireRole('Student'),
  component: MyGroupPage,
})

type StudentMember = {
  id: string
  name: string
  initials: string
  role: string
  attendance: string
  avgScore: number
  telegram: string
  avatarBg: string
}

const studentsList: StudentMember[] = [
  {
    id: '1',
    name: 'Ali Valiyev',
    initials: 'AV',
    role: 'Talaba (Siz)',
    attendance: '87.5%',
    avgScore: 90,
    telegram: '@ali_valiyev',
    avatarBg: 'bg-primary',
  },
  {
    id: '2',
    name: 'Sardor Toshmatov',
    initials: 'ST',
    role: 'Guruh sardori',
    attendance: '95.0%',
    avgScore: 94,
    telegram: '@sardor_t',
    avatarBg: 'bg-blue-500',
  },
  {
    id: '3',
    name: 'Nilufar Rahimova',
    initials: 'NR',
    role: 'Talaba',
    attendance: '91.2%',
    avgScore: 92,
    telegram: '@nilufar_r',
    avatarBg: 'bg-rose-500',
  },
  {
    id: '4',
    name: 'Jasur Mirzayev',
    initials: 'JM',
    role: 'Talaba',
    attendance: '85.0%',
    avgScore: 86,
    telegram: '@jasur_m',
    avatarBg: 'bg-amber-500',
  },
  {
    id: '5',
    name: 'Dilnoza Yusupova',
    initials: 'DY',
    role: 'Talaba',
    attendance: '93.5%',
    avgScore: 91,
    telegram: '@dilnoza_y',
    avatarBg: 'bg-teal-500',
  },
  {
    id: '6',
    name: 'Bobur Xasanov',
    initials: 'BX',
    role: 'Talaba',
    attendance: '82.0%',
    avgScore: 84,
    telegram: '@bobur_x',
    avatarBg: 'bg-indigo-500',
  },
  {
    id: '7',
    name: 'Malika Sobirova',
    initials: 'MS',
    role: 'Talaba',
    attendance: '88.5%',
    avgScore: 89,
    telegram: '@malika_s',
    avatarBg: 'bg-purple-500',
  },
  {
    id: '8',
    name: 'Otabek Qodirov',
    initials: 'OQ',
    role: 'Talaba',
    attendance: '79.0%',
    avgScore: 81,
    telegram: '@otabek_q',
    avatarBg: 'bg-emerald-500',
  },
]

function MyGroupPage() {
  const { language } = useLanguage()
  const english = language === 'en'
  const {
    auth: { user },
  } = useAuthStore()
  const currentUserName = user?.name || 'Ali Valiyev'
  const [searchTerm, setSearchTerm] = useState('')
  const label = (uz: string, en: string) => (english ? en : uz)

  const filteredStudents = studentsList.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.telegram.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <Header fixed>
        <div className='flex items-center gap-2'>
          <h1 className='text-lg font-semibold tracking-tight'>
            {english ? 'My group' : 'Mening guruhim'}
          </h1>
          <Badge variant='outline' className='border-primary/30 text-primary'>
            G-14 Frontend
          </Badge>
        </div>
        <div className='ms-auto flex items-center gap-2'>
          <GlobalSearch className='me-auto sm:me-0' />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='space-y-6'>
        {/* Guruh Ma'lumotlari Card */}
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <Card className='shadow-sm'>
            <CardContent className='pt-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs text-muted-foreground'>
                    {label('Guruh raqami', 'Group number')}
                  </p>
                  <p className='mt-0.5 text-2xl font-bold'>G-14</p>
                </div>
                <div className='rounded-lg bg-primary/10 p-2 text-primary'>
                  <Users className='size-5' />
                </div>
              </div>
              <p className='mt-3 text-xs text-muted-foreground'>
                {label(
                  'Yo‘nalish: Frontend React/TS',
                  'Track: Frontend React/TS'
                )}
              </p>
            </CardContent>
          </Card>

          <Card className='shadow-sm'>
            <CardContent className='pt-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs text-muted-foreground'>
                    {label('O‘qituvchi (Mentor)', 'Teacher (Mentor)')}
                  </p>
                  <p className='mt-0.5 text-base font-bold'>Abdulloh Karimov</p>
                </div>
                <div className='rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400'>
                  <GraduationCap className='size-5' />
                </div>
              </div>
              <p className='mt-3 text-xs text-muted-foreground'>
                Senior Software Engineer
              </p>
            </CardContent>
          </Card>

          <Card className='shadow-sm'>
            <CardContent className='pt-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs text-muted-foreground'>
                    {label('Guruh a’zolari', 'Group members')}
                  </p>
                  <p className='mt-0.5 text-2xl font-bold'>12 / 15 ta</p>
                </div>
                <div className='rounded-lg bg-green-500/10 p-2 text-green-600 dark:text-green-400'>
                  <UserCheck className='size-5' />
                </div>
              </div>
              <p className='mt-3 text-xs text-muted-foreground'>
                {label('Barcha talabalar faol', 'All students are active')}
              </p>
            </CardContent>
          </Card>

          <Card className='shadow-sm'>
            <CardContent className='pt-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs text-muted-foreground'>
                    {label('Dars vaqtlari', 'Class times')}
                  </p>
                  <p className='mt-0.5 text-base font-bold'>Du / Chor / Jum</p>
                </div>
                <div className='rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400'>
                  <Clock className='size-5' />
                </div>
              </div>
              <p className='mt-3 text-xs text-muted-foreground'>
                {label('09:00 – 11:00 · Xona 201', '09:00 – 11:00 · Room 201')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Guruhdoshlar ro'yxati jadvali */}
        <Card className='shadow-sm'>
          <CardHeader>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <CardTitle className='text-base'>
                  {label('Guruh a’zolari ro‘yxati', 'Group member list')}
                </CardTitle>
                <CardDescription>
                  {label(
                    'G-14 guruhida tahsil olayotgan talabalar ma’lumoti',
                    'Students enrolled in group G-14'
                  )}
                </CardDescription>
              </div>
              <div className='relative w-full sm:w-64'>
                <Search className='absolute top-2.5 left-3 size-4 text-muted-foreground' />
                <Input
                  placeholder={label(
                    'Ism bo‘yicha qidirish...',
                    'Search by name...'
                  )}
                  className='h-9 pl-9 text-xs'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='divide-y rounded-lg border bg-background'>
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className='flex flex-col gap-3 p-3.5 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between'
                >
                  <div className='flex items-center gap-3'>
                    <div
                      className={`flex size-10 items-center justify-center rounded-full text-xs font-bold text-white ${student.avatarBg}`}
                    >
                      {student.id === '1'
                        ? currentUserName
                            .split(' ')
                            .map((p: string) => p[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)
                        : student.initials}
                    </div>
                    <div>
                      <div className='flex items-center gap-2'>
                        <h4 className='text-sm font-semibold'>
                          {student.id === '1' ? currentUserName : student.name}
                        </h4>
                        {student.role === 'Guruh sardori' && (
                          <Badge
                            variant='outline'
                            className='border-amber-300 text-[10px] text-amber-600'
                          >
                            {label('★ Sardor', '★ Leader')}
                          </Badge>
                        )}
                        {student.name.includes('(Siz)') && (
                          <Badge className='bg-primary text-[10px] text-primary-foreground'>
                            {label('Siz', 'You')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center justify-between gap-6 text-xs sm:justify-end'>
                    <div className='text-start sm:text-end'>
                      <p className='text-[11px] text-muted-foreground'>
                        {label('Davomat', 'Attendance')}
                      </p>
                      <p className='font-semibold text-green-600 dark:text-green-400'>
                        {student.attendance}
                      </p>
                    </div>
                    <div className='text-start sm:text-end'>
                      <p className='text-[11px] text-muted-foreground'>
                        {label('O‘rtacha ball', 'Average score')}
                      </p>
                      <p className='font-semibold text-primary'>
                        {student.avgScore} / 100
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className='flex justify-between border-t py-3 text-xs text-muted-foreground'>
            <span>Jami ro‘yxatda: {studentsList.length} nafar o‘quvchi</span>
            <span>Sfera IT Academy · 2026</span>
          </CardFooter>
        </Card>
      </Main>
    </>
  )
}
