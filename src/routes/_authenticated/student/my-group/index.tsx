import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  AtSign,
  CheckCircle2,
  Clock,
  GraduationCap,
  Mail,
  Phone,
  Search,
  UserCheck,
  Users,
  X,
} from 'lucide-react'
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
  email: string
  phone: string
  avatarBg: string
}

const studentsList: StudentMember[] = [
  ['Ali Valiyev', 'AV', 'Talaba (Siz)', '87.5%', 90, '@ali_valiyev', 'ali.valiyev@example.com', '+998 90 123 45 67', 'bg-primary'],
  ['Sardor Toshmatov', 'ST', 'Guruh sardori', '95.0%', 94, '@sardor_t', 'sardor.toshmatov@example.com', '+998 91 234 56 78', 'bg-blue-500'],
  ['Nilufar Rahimova', 'NR', 'Talaba', '91.2%', 92, '@nilufar_r', 'nilufar.rahimova@example.com', '+998 93 345 67 89', 'bg-rose-500'],
  ['Jasur Mirzayev', 'JM', 'Talaba', '85.0%', 86, '@jasur_m', 'jasur.mirzayev@example.com', '+998 94 456 78 90', 'bg-amber-500'],
  ['Dilnoza Yusupova', 'DY', 'Talaba', '93.5%', 91, '@dilnoza_y', 'dilnoza.yusupova@example.com', '+998 95 567 89 01', 'bg-teal-500'],
  ['Bobur Xasanov', 'BX', 'Talaba', '82.0%', 84, '@bobur_x', 'bobur.xasanov@example.com', '+998 97 678 90 12', 'bg-indigo-500'],
  ['Malika Sobirova', 'MS', 'Talaba', '88.5%', 89, '@malika_s', 'malika.sobirova@example.com', '+998 98 789 01 23', 'bg-purple-500'],
  ['Otabek Qodirov', 'OQ', 'Talaba', '79.0%', 81, '@otabek_q', 'otabek.qodirov@example.com', '+998 99 890 12 34', 'bg-emerald-500'],
].map(([name, initials, role, attendance, avgScore, telegram, email, phone, avatarBg], index) => ({
  id: String(index + 1),
  name: name as string,
  initials: initials as string,
  role: role as string,
  attendance: attendance as string,
  avgScore: avgScore as number,
  telegram: telegram as string,
  email: email as string,
  phone: phone as string,
  avatarBg: avatarBg as string,
}))

function MyGroupPage() {
  const { language } = useLanguage()
  const english = language === 'en'
  const user = useAuthStore((state) => state.auth.user)
  const currentUserName = user?.name || 'Ali Valiyev'
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<StudentMember | null>(null)
  const label = (uz: string, en: string) => (english ? en : uz)
  const filteredStudents = studentsList.filter((student) =>
    `${student.name} ${student.telegram} ${student.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <Header fixed>
        <div className='flex items-center gap-2'>
          <h1 className='text-lg font-semibold tracking-tight'>{label('Mening guruhim', 'My group')}</h1>
          <Badge variant='outline' className='border-primary/30 text-primary'>G-14 Frontend</Badge>
        </div>
        <div className='ms-auto flex items-center gap-2'>
          <GlobalSearch className='me-auto sm:me-0' />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='space-y-6'>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <SummaryCard icon={<Users className='size-5' />} label={label('Guruh raqami', 'Group number')} value='G-14' detail={label('Frontend React/TS', 'Frontend React/TS')} />
          <SummaryCard icon={<GraduationCap className='size-5' />} label={label('O‘qituvchi (Mentor)', 'Teacher (Mentor)')} value='Abdulloh Karimov' detail='Senior Software Engineer' />
          <SummaryCard icon={<UserCheck className='size-5' />} label={label('Guruh a’zolari', 'Group members')} value='12 / 15 ta' detail={label('Barcha talabalar faol', 'All students are active')} />
          <SummaryCard icon={<Clock className='size-5' />} label={label('Dars vaqtlari', 'Class times')} value='Du / Chor / Jum' detail={label('09:00 – 11:00 · Xona 201', '09:00 – 11:00 · Room 201')} />
        </div>

        <Card className='shadow-sm'>
          <CardHeader>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <CardTitle className='text-base'>{label('Guruh a’zolari ro‘yxati', 'Group member list')}</CardTitle>
                <CardDescription>{label('G-14 guruhidagi talabalar ma’lumoti', 'Students enrolled in group G-14')}</CardDescription>
              </div>
              <div className='relative w-full sm:w-72'>
                <Search className='absolute top-2.5 left-3 size-4 text-muted-foreground' />
                <Input placeholder={label('Ism, telegram yoki email bo‘yicha qidirish...', 'Search name, Telegram or email...')} className='h-9 pl-9 text-xs' value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='divide-y rounded-lg border bg-background'>
              {filteredStudents.map((student) => {
                const isCurrentUser = student.id === '1'
                return (
                  <button key={student.id} type='button' onClick={() => setSelectedStudent(student)} className='flex w-full flex-col gap-3 p-3.5 text-start transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className={`flex size-10 items-center justify-center rounded-full text-xs font-bold text-white ${student.avatarBg}`}>
                        {(isCurrentUser ? currentUserName : student.name).split(' ').map((part) => part[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                      <div>
                        <div className='flex flex-wrap items-center gap-2'>
                          <h4 className='text-sm font-semibold'>{isCurrentUser ? currentUserName : student.name}</h4>
                          {student.role === 'Guruh sardori' && <Badge variant='outline' className='border-amber-300 text-[10px] text-amber-600'>★ {label('Sardor', 'Leader')}</Badge>}
                          {isCurrentUser && <Badge className='bg-primary text-[10px] text-primary-foreground'>{label('Siz', 'You')}</Badge>}
                        </div>
                        <p className='mt-0.5 text-xs text-muted-foreground'>{student.telegram} · {student.email}</p>
                      </div>
                    </div>
                    <div className='flex items-center justify-between gap-6 text-xs sm:justify-end'>
                      <div className='text-start sm:text-end'><p className='text-[11px] text-muted-foreground'>{label('Davomat', 'Attendance')}</p><p className='font-semibold text-green-600 dark:text-green-400'>{student.attendance}</p></div>
                      <div className='text-start sm:text-end'><p className='text-[11px] text-muted-foreground'>{label('O‘rtacha ball', 'Average score')}</p><p className='font-semibold text-primary'>{student.avgScore} / 100</p></div>
                      <span className='hidden rounded-full border px-2 py-1 text-[11px] text-muted-foreground sm:inline'>{label('Ko‘rish', 'View')}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
          <CardFooter className='flex justify-between border-t py-3 text-xs text-muted-foreground'>
            <span>{label(`Jami: ${studentsList.length} nafar o‘quvchi`, `Total: ${studentsList.length} students`)}</span>
            <span>Sfera IT Academy · 2026</span>
          </CardFooter>
        </Card>
      </Main>

      {selectedStudent && (
        <div className='fixed inset-0 z-[60] flex items-end justify-center bg-black/20 p-4 backdrop-blur-[2px] sm:items-center' onClick={() => setSelectedStudent(null)}>
          <Card className='w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-200' onClick={(event) => event.stopPropagation()}>
            <CardHeader className='flex flex-row items-start justify-between gap-4 border-b'>
              <div className='flex items-center gap-3'>
                <div className={`flex size-12 items-center justify-center rounded-full text-sm font-bold text-white ${selectedStudent.avatarBg}`}>{selectedStudent.initials}</div>
                <div><CardTitle className='text-base'>{selectedStudent.name}</CardTitle><CardDescription>{selectedStudent.role} · G-14 Frontend</CardDescription></div>
              </div>
              <button type='button' aria-label={label('Yopish', 'Close')} onClick={() => setSelectedStudent(null)} className='rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground'><X className='size-4' /></button>
            </CardHeader>
            <CardContent className='space-y-4 pt-5'>
              <div className='grid grid-cols-2 gap-3'><Metric label={label('Davomat', 'Attendance')} value={selectedStudent.attendance} tone='text-emerald-600' /><Metric label={label('O‘rtacha ball', 'Average score')} value={`${selectedStudent.avgScore}/100`} tone='text-primary' /></div>
              <div className='space-y-2 rounded-xl border bg-muted/20 p-3 text-sm'>
                <div className='flex items-center gap-2'><AtSign className='size-4 text-muted-foreground' /><span>{selectedStudent.telegram}</span></div>
                <div className='flex items-center gap-2'><Mail className='size-4 text-muted-foreground' /><span className='truncate'>{selectedStudent.email}</span></div>
                <div className='flex items-center gap-2'><Phone className='size-4 text-muted-foreground' /><span>{selectedStudent.phone}</span></div>
              </div>
              <div className='flex items-center gap-2 text-xs text-emerald-600'><CheckCircle2 className='size-4' />{label('Faol guruh a’zosi', 'Active group member')}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

function SummaryCard({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return <Card className='shadow-sm transition-shadow hover:shadow-md'><CardContent className='pt-5'><div className='flex items-start justify-between gap-3'><div><p className='text-xs text-muted-foreground'>{label}</p><p className='mt-1 text-lg font-bold'>{value}</p></div><div className='rounded-lg bg-primary/10 p-2 text-primary'>{icon}</div></div><p className='mt-3 text-xs text-muted-foreground'>{detail}</p></CardContent></Card>
}

function Metric({ label, value, tone }: { label: string; value: string; tone: string }) {
  return <div className='rounded-xl border bg-background p-3'><p className='text-xs text-muted-foreground'>{label}</p><p className={`mt-1 text-xl font-bold ${tone}`}>{value}</p></div>
}
