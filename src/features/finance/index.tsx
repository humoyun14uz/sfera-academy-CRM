import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Clock, GraduationCap, Search, UserCheck, Users } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { requireRole } from '@/lib/route-guard'
import { useLanguage } from '@/context/language-provider'
import { useCrmStore } from '@/lib/crm-store'
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

function MyGroupPage() {
  const { language } = useLanguage()
  const english = language === 'en'
  const {
    auth: { user },
  } = useAuthStore()
  const crm = useCrmStore()
  const currentUserName = user?.name || 'Azizbek Karimov'
  const [searchTerm, setSearchTerm] = useState('')
  const label = (uz: string, en: string) => (english ? en : uz)

  const currentStudent =
    crm.students.find((student) => student.name.toLowerCase() === currentUserName.toLowerCase()) ??
    crm.students[0] ??
    null

  const currentGroup =
    crm.groups.find((group) => group.id === currentStudent?.groupId) ??
    crm.groups[0] ??
    null

  const studentsList: StudentMember[] = (currentGroup ? crm.students.filter((student) => student.groupId === currentGroup.id) : crm.students).map((student, index) => ({
    id: student.id,
    name: student.name,
    initials: student.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
    role: student.name === currentUserName ? 'Talaba (Siz)' : index === 0 ? 'Guruh sardori' : 'Talaba',
    attendance: `${student.attendance}%`,
    avgScore: student.averageGrade,
    telegram: `@${student.name.toLowerCase().replace(/\s+/g, '_')}`,
    avatarBg: ['bg-primary', 'bg-blue-500', 'bg-rose-500', 'bg-amber-500', 'bg-teal-500', 'bg-indigo-500', 'bg-purple-500', 'bg-emerald-500'][index % 8],
  }))

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
            {currentGroup?.name ?? 'G-14'}
          </Badge>
        </div>
        <div className='ms-auto flex items-center gap-2'>
          <GlobalSearch className='me-auto sm:me-0' />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='space-y-6'>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <Card className='shadow-sm'>
            <CardContent className='pt-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs text-muted-foreground'>
                    {label('Guruh raqami', 'Group number')}
                  </p>
                  <p className='mt-0.5 text-2xl font-bold'>{currentGroup?.name ?? 'G-14'}</p>
                </div>
                <div className='rounded-lg bg-primary/10 p-2 text-primary'>
                  <Users className='size-5' />
                </div>
              </div>
              <p className='mt-3 text-xs text-muted-foreground'>
                {label(
                  `Yo‘nalish: ${currentGroup?.course ?? 'Frontend React/TS'}`,
                  `Track: ${currentGroup?.course ?? 'Frontend React/TS'}`
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
                  <p className='mt-0.5 text-base font-bold'>{currentGroup?.teacher ?? 'Abdulloh Karimov'}</p>
                </div>
                <div className='rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400'>
                  <GraduationCap className='size-5' />
                </div>
              </div>
              <p className='mt-3 text-xs text-muted-foreground'>
                {label('Kurs mentor', 'Course mentor')}
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
                  <p className='mt-0.5 text-2xl font-bold'>
                    {studentsList.length} / {currentGroup?.capacity ?? studentsList.length}
                  </p>
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
                  <p className='mt-0.5 text-base font-bold'>{currentGroup?.schedule ?? 'Du / Chor / Jum'}</p>
                </div>
                <div className='rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400'>
                  <Clock className='size-5' />
                </div>
              </div>
              <p className='mt-3 text-xs text-muted-foreground'>
                {label(`09:00 – 11:00 · Xona ${currentGroup?.room ?? '201'}`, `09:00 – 11:00 · Room ${currentGroup?.room ?? '201'}`)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className='shadow-sm'>
          <CardHeader>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <CardTitle className='text-base'>
                  {label('Guruh a’zolari ro‘yxati', 'Group member list')}
                </CardTitle>
                <CardDescription>
                  {label(
                    `${currentGroup?.name ?? 'G-14'} guruhida tahsil olayotgan talabalar ma’lumoti`,
                    `Students enrolled in group ${currentGroup?.name ?? 'G-14'}`
                  )}
                </CardDescription>
              </div>
              <div className='relative w-full sm:w-64'>
                <Search className='absolute top-2.5 left-3 size-4 text-muted-foreground' />
                <Input
                  placeholder={label('Ism bo‘yicha qidirish...', 'Search by name...')}
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
                      {student.initials}
                    </div>
                    <div>
                      <div className='flex items-center gap-2'>
                        <h4 className='text-sm font-semibold'>{student.name}</h4>
                        {student.role === 'Guruh sardori' && (
                          <Badge
                            variant='outline'
                            className='border-amber-300 text-[10px] text-amber-600'
                          >
                            {label('★ Sardor', '★ Leader')}
                          </Badge>
                        )}
                        {student.name === currentUserName && (
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
            <span>
              {label(`Jami ro‘yxatda: ${studentsList.length} nafar o‘quvchi`, `Total in list: ${studentsList.length} students`)}
            </span>
            <span>Sfera IT Academy · 2026</span>
          </CardFooter>
        </Card>
      </Main>
    </>
  )
}
