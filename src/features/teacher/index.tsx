import { useEffect, useMemo, useState } from 'react'
import {
  CalendarDays,
  CheckCheck,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Download,
  GraduationCap,
  Pencil,
  BarChart3,
  ClipboardCheck,
  Trophy,
  CalendarRange,
  Plus,
  Save,
  Search as SearchIcon,
  Star,
  Trash2,
  UsersRound,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuthStore } from '@/stores/auth-store'
import {
  readSharedAssignments,
  writeSharedAssignments,
  writeSharedGrade,
  type SharedAssignment,
} from '@/lib/teacher-student-sync'
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
import { AttendanceStatusCheckbox } from '@/components/attendance-checkbox'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { NotFoundError } from '@/features/errors/not-found-error'
import { RoleSettings } from '@/features/role-settings'
import { ProfileForm } from '@/features/settings/profile/profile-form'

const groups = [
  {
    id: 'frontend-2',
    name: 'Frontend 2-guruh',
    nameEn: 'Frontend Group 2',
    course: 'Frontend dasturlash',
    courseEn: 'Frontend development',
    students: 14,
    time: '09:00 – 10:30',
    room: '301-xona',
    roomEn: 'Room 301',
    teacher: 'Azizbek Karimov',
  },
  {
    id: 'python-1',
    name: 'Python boshlang‘ich',
    nameEn: 'Python beginners',
    course: 'Python dasturlash',
    courseEn: 'Python development',
    students: 18,
    time: '14:00 – 15:30',
    room: 'Onlayn',
    roomEn: 'Online',
    teacher: 'Golib Abduhalil',
  },
  {
    id: 'react-1',
    name: 'React amaliyot',
    nameEn: 'React practice',
    course: 'React.js',
    courseEn: 'React.js',
    students: 11,
    time: '18:00 – 19:30',
    room: 'Lab 2',
    roomEn: 'Lab 2',
    teacher: 'Sardor Islomov',
  },
]
const students = [
  'Ali Valiyev',
  'Azizbek Karimov',
  'Madina Aliyeva',
  'Javohir Rasulov',
  'Shahnoza Ergasheva',
  'Bekzod Tursunov',
]
const lessons = groups.map((group, index) => ({
  ...group,
  day: index === 0 ? 'Bugun' : index === 1 ? 'Ertaga' : 'Payshanba',
  dayEn: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : 'Thursday',
}))
const groupText = (group: (typeof groups)[number], labels: Labels) => ({
  name: labels.locale === 'en' ? group.nameEn : group.name,
  course: labels.locale === 'en' ? group.courseEn : group.course,
  room: labels.locale === 'en' ? group.roomEn : group.room,
})

export function TeacherDashboard({
  section = 'dashboard',
}: {
  section?: string
}) {
  const { language } = useLanguage()
  const user = useAuthStore((state) => state.auth.user)
  const isEnglish = language === 'en'
  const labels = useMemo(
    () =>
      isEnglish
        ? {
            locale: 'en',
            language: 'Language',
            notificationsSetting: 'Notifications',
            notificationsHint:
              'Receive updates about lessons and student activity.',
            security: 'Security',
            securityHint: 'Manage your account security settings.',
            appearance: 'Appearance',
            appearanceHint: 'Adjust your workspace display preferences.',
            dashboard: 'Dashboard',
            title: 'Teacher workspace',
            subtitle:
              'Manage your groups, lessons and student progress in one place.',
            groups: 'My groups',
            schedule: 'My schedule',
            today: 'Today’s lessons',
            attendance: 'Attendance',
            students: 'Students',
            assignments: 'Assignments',
            grades: 'Grades',
            profile: 'My profile',
            settings: 'Settings',
            upcoming: 'Upcoming lessons',
            mark: 'Mark attendance',
            present: 'Present',
            absent: 'Absent',
            greeting: 'Good morning',
            quick: 'Quick access',
            addTask: 'Add assignment',
            task1: 'Complete the flexbox practice',
            task2: 'Submit the React component',
            task3: 'Review the lesson recording',
            due: 'Due today',
            done: 'Completed',
            pending: 'Pending',
            avg: 'Average grade',
            completion: 'Assignment completion',
            search: 'Search',
            save: 'Save',
            saved: 'Saved',
            settingsSaved: 'Teacher settings saved successfully.',
            name: 'Name',
            course: 'Course',
            room: 'Room',
            time: 'Time',
            action: 'Action',
            noData: 'No records yet',
            back: 'Back to dashboard',
            edit: 'Edit',
            delete: 'Delete',
            cancel: 'Cancel',
            editTask: 'Edit assignment',
            updated: 'Assignment updated successfully.',
            deleted: 'Assignment deleted successfully.',
            score: 'Score',
            comment: 'Comment',
            status: 'Status',
            active: 'Active',
            published: 'Published',
            create: 'Create assignment',
            taskName: 'Assignment name',
            deadline: 'Deadline',
            profileText: 'Update your personal teacher information.',
            settingsText:
              'Manage your language, notifications and workspace preferences.',
            metricStudents: 'Students assigned to your groups',
            metricAverage: 'Average score across graded work',
            metricCompletion: 'Submitted assignments completed on time',
            requiredTask: 'Enter an assignment name first.',
            invalidScore: 'Score must be between 0 and 100.',
            created: 'Assignment added successfully.',
            attendanceSaved: 'Attendance saved successfully.',
            gradeSaved: 'Grade saved successfully.',
          }
        : {
            locale: 'uz',
            language: 'Til',
            notificationsSetting: 'Bildirishnomalar',
            notificationsHint:
              'Darslar va o‘quvchilar faoliyati haqidagi xabarlarni oling.',
            security: 'Xavfsizlik',
            securityHint: 'Hisobingiz xavfsizligi sozlamalarini boshqaring.',
            appearance: 'Ko‘rinish',
            appearanceHint:
              'Ish maydoni ko‘rinishi sozlamalarini o‘zgartiring.',
            dashboard: 'Boshqaruv paneli',
            title: 'O‘qituvchi ish maydoni',
            subtitle:
              'Guruhlar, darslar va o‘quvchilar rivojini bir joyda boshqaring.',
            groups: 'Mening guruhlarim',
            schedule: 'Jadvalim',
            today: 'Bugungi darslar',
            attendance: 'Davomat',
            students: 'O‘quvchilar',
            assignments: 'Vazifalar',
            grades: 'Baholar',
            profile: 'Profilim',
            settings: 'Sozlamalar',
            upcoming: 'Yaqinlashayotgan darslar',
            mark: 'Davomatni belgilash',
            present: 'Bor',
            absent: 'Yo‘q',
            greeting: 'Xayrli tong',
            quick: 'Tezkor kirish',
            addTask: 'Vazifa qo‘shish',
            task1: 'Flexbox amaliyotini yakunlash',
            task2: 'React komponentini topshirish',
            task3: 'Dars yozuvini ko‘rib chiqish',
            due: 'Bugun',
            done: 'Bajarildi',
            pending: 'Kutilmoqda',
            avg: 'O‘rtacha baho',
            completion: 'Vazifalar bajarilishi',
            search: 'Qidirish',
            save: 'Saqlash',
            saved: 'Saqlandi',
            settingsSaved: 'O‘qituvchi sozlamalari muvaffaqiyatli saqlandi.',
            name: 'Nomi',
            course: 'Kurs',
            room: 'Xona',
            time: 'Vaqt',
            action: 'Amal',
            noData: 'Hozircha ma’lumot yo‘q',
            back: 'Boshqaruv paneliga qaytish',
            edit: 'Tahrirlash',
            delete: 'O‘chirish',
            cancel: 'Bekor qilish',
            editTask: 'Vazifani tahrirlash',
            updated: 'Vazifa muvaffaqiyatli tahrirlandi.',
            deleted: 'Vazifa muvaffaqiyatli o‘chirildi.',
            score: 'Baho',
            comment: 'Izoh',
            status: 'Holati',
            active: 'Faol',
            published: 'Chop etilgan',
            create: 'Vazifa yaratish',
            taskName: 'Vazifa nomi',
            deadline: 'Muddat',
            profileText:
              'O‘qituvchi sifatidagi shaxsiy ma’lumotlaringizni yangilang.',
            settingsText:
              'Til, bildirishnomalar va ish maydoni sozlamalarini boshqaring.',
            metricStudents: 'Sizga biriktirilgan guruhlardagi o‘quvchilar',
            metricAverage: 'Baholangan ishlar bo‘yicha o‘rtacha natija',
            metricCompletion: 'O‘z vaqtida topshirilgan vazifalar ulushi',
            requiredTask: 'Avval vazifa nomini kiriting.',
            invalidScore: 'Baho 0 dan 100 gacha bo‘lishi kerak.',
            created: 'Vazifa muvaffaqiyatli qo‘shildi.',
            attendanceSaved: 'Davomat muvaffaqiyatli saqlandi.',
            gradeSaved: 'Baho muvaffaqiyatli saqlandi.',
          },
    [isEnglish]
  )
  const nav = [
    {
      title: labels.dashboard,
      href: '/teacher',
      isActive: section === 'dashboard',
    },
    {
      title: labels.groups,
      href: '/teacher/groups',
      isActive: section === 'groups',
    },
    {
      title: labels.schedule,
      href: '/teacher/schedule',
      isActive: section === 'schedule',
    },
    {
      title: labels.today,
      href: '/teacher/today',
      isActive: section === 'today',
    },
    {
      title: labels.attendance,
      href: '/teacher/attendance',
      isActive: section === 'attendance',
    },
    {
      title: labels.students,
      href: '/teacher/students',
      isActive: section === 'students',
    },
    {
      title: labels.assignments,
      href: '/teacher/assignments',
      isActive: section === 'assignments',
    },
    {
      title: labels.grades,
      href: '/teacher/grades',
      isActive: section === 'grades',
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
  if (section === 'dashboard')
    return shell(<DashboardContent labels={labels} userName={user?.name} />)
  if (section === 'groups') return shell(<GroupsPage labels={labels} />)
  if (section === 'schedule' || section === 'today')
    return shell(
      <SchedulePage labels={labels} todayOnly={section === 'today'} />
    )
  if (section === 'attendance') return shell(<AttendancePage labels={labels} />)
  if (section === 'students') return shell(<StudentsPage labels={labels} />)
  if (section === 'assignments')
    return shell(<AssignmentsPage labels={labels} />)
  if (section === 'grades') return shell(<GradesPage labels={labels} />)
  if (section !== 'profile' && section !== 'settings') return <NotFoundError />
  return shell(
    section === 'profile' ? (
      <RoleProfilePage
        title={labels.profile}
        description={labels.profileText}
      />
    ) : (
      <RoleSettings
        labels={{
          title: labels.settings,
          description: labels.settingsText,
          language: labels.language,
          notifications: labels.notificationsSetting,
          notificationsHint: labels.notificationsHint,
          security: labels.security,
          securityHint: labels.securityHint,
          appearance: labels.appearance,
          appearanceHint: labels.appearanceHint,
          save: labels.save,
          saved: labels.settingsSaved,
          enabled: labels.locale === 'en' ? 'Enabled' : 'Yoqilgan',
          disabled: labels.locale === 'en' ? 'Disabled' : 'O‘chirilgan',
        }}
      />
    )
  )
}

type Labels = Record<string, string>
function PageHeading({
  title,
  description,
  action,
}: {
  title: string
  description: string
  labels?: Labels
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
function DashboardContent({
  labels,
  userName,
}: {
  labels: Labels
  userName?: string
}) {
  const [attendance, setAttendance] = useState<Record<string, boolean>>({})
  const [taskDone, setTaskDone] = useState<Record<number, boolean>>({})
  const tasks = [labels.task1, labels.task2, labels.task3]
  return (
    <>
      <PageHeading
        title={labels.title}
        description={labels.subtitle}
        labels={labels}
        action={
          <a href='/teacher/assignments'>
            <Button>
              <Plus className='me-2 size-4' />
              {labels.addTask}
            </Button>
          </a>
        }
      />
      <p className='-mt-4 mb-6 text-sm text-muted-foreground'>
        {labels.greeting}, {userName || labels.title}
      </p>
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <TeacherStat icon={UsersRound} title={labels.groups} value='3' />
        <TeacherStat icon={GraduationCap} title={labels.students} value='43' />
        <TeacherStat icon={Star} title={labels.avg} value='86%' />
        <TeacherStat
          icon={ClipboardList}
          title={labels.completion}
          value='78%'
        />
      </div>
      <div className='mt-6 grid gap-6 lg:grid-cols-[1.35fr_1fr]'>
        <Card>
          <CardHeader>
            <CardTitle>{labels.upcoming}</CardTitle>
            <CardDescription>{labels.today}</CardDescription>
          </CardHeader>
          <CardContent className='space-y-3'>
            {groups.map((group) => (
              <div
                key={group.id}
                className='flex flex-col gap-3 rounded-xl border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between'
              >
                <div>
                  <div className='flex items-center gap-2 font-semibold'>
                    <Clock3 className='size-4 text-primary' />
                    {group.time}
                  </div>
                  <p className='mt-1 text-sm'>
                    {groupText(group, labels).name}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {groupText(group, labels).course} ·{' '}
                    {groupText(group, labels).room}
                  </p>
                </div>
                <Badge variant='secondary'>
                  {group.students} {labels.students.toLowerCase()}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{labels.mark}</CardTitle>
            <CardDescription>
              {groupText(groups[0], labels).name}
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-2'>
            {students.map((student) => {
              const checked = attendance[student] ?? false
              return (
                <button
                  key={student}
                  type='button'
                  onClick={() =>
                    setAttendance((current) => ({
                      ...current,
                      [student]: !checked,
                    }))
                  }
                  className='flex w-full items-center justify-between rounded-lg border p-3 text-start hover:bg-muted/50'
                >
                  <span className='flex items-center gap-2 text-sm'>
                    <span
                      className={`size-2 rounded-full ${checked ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`}
                    />
                    {student}
                  </span>
                  <span
                    className={`text-xs font-medium ${checked ? 'text-emerald-600' : 'text-muted-foreground'}`}
                  >
                    {checked ? labels.present : labels.absent}
                  </span>
                </button>
              )
            })}
          </CardContent>
        </Card>
      </div>
      <Card className='mt-6'>
        <CardHeader>
          <CardTitle>{labels.assignments}</CardTitle>
          <CardDescription>{labels.due}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-3'>
          {tasks.map((task, index) => (
            <button
              type='button'
              key={task}
              onClick={() =>
                setTaskDone((current) => ({
                  ...current,
                  [index]: !current[index],
                }))
              }
              className='flex w-full items-center gap-3 rounded-xl border p-3 text-start hover:bg-muted/50'
            >
              <CheckCircle2
                className={`size-5 ${taskDone[index] ? 'text-emerald-500' : 'text-muted-foreground/40'}`}
              />
              <span
                className={
                  taskDone[index]
                    ? 'text-sm text-muted-foreground line-through'
                    : 'text-sm'
                }
              >
                {task}
              </span>
              <span className='ms-auto text-xs text-muted-foreground'>
                {taskDone[index] ? labels.done : labels.pending}
              </span>
            </button>
          ))}
        </CardContent>
      </Card>
    </>
  )
}
function GroupsPage({ labels }: { labels: Labels }) {
  const [query, setQuery] = useState('')
  const filtered = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(query.toLowerCase()) ||
      group.course.toLowerCase().includes(query.toLowerCase())
  )
  const progress = [88, 76, 93]
  const attendance = [94, 89, 97]

  return (
    <>
      <PageHeading title={labels.groups} description={labels.subtitle} labels={labels} />
      <div className='mb-4 grid gap-4 md:grid-cols-3'>
        <TeacherStat icon={UsersRound} title={labels.students} value='43' detail={labels.locale === 'en' ? 'Across your groups' : 'Guruhlaringiz bo‘yicha'} />
        <TeacherStat icon={Star} title={labels.avg} value='87%' detail={labels.locale === 'en' ? 'Average group result' : 'Guruhlar o‘rtacha natijasi'} />
        <TeacherStat icon={CheckCircle2} title={labels.attendance} value='93%' detail={labels.locale === 'en' ? 'This month' : 'Shu oy'} />
      </div>

      <div className='mb-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]'>
        <Card className='overflow-hidden'>
          <CardHeader>
            <CardTitle>{labels.locale === 'en' ? 'Group performance' : 'Guruhlar natijasi'}</CardTitle>
            <CardDescription>{labels.locale === 'en' ? 'Progress and attendance at a glance' : 'O‘zlashtirish va davomatni bir qarashda ko‘ring'}</CardDescription>
          </CardHeader>
          <CardContent className='space-y-5'>
            {groups.map((group, index) => (
              <div key={group.id}>
                <div className='mb-2 flex items-center justify-between gap-3 text-sm'>
                  <span className='font-semibold'>{groupText(group, labels).name}</span>
                  <span className='font-bold text-primary'>{progress[index]}%</span>
                </div>
                <div className='h-2.5 rounded-full bg-muted'>
                  <div className='h-full rounded-full bg-gradient-to-r from-primary to-violet-500' style={{ width: `${progress[index]}%` }} />
                </div>
                <div className='mt-1.5 flex justify-between text-[11px] text-muted-foreground'>
                  <span>{labels.avg}: {progress[index]}%</span>
                  <span>{labels.attendance}: {attendance[index]}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-primary/[0.08] via-card to-violet-500/[0.06]'>
          <CardHeader>
            <CardTitle>{labels.locale === 'en' ? 'Your teaching snapshot' : 'O‘qituvchilik ko‘rsatkichi'}</CardTitle>
            <CardDescription>{labels.locale === 'en' ? 'A quick view of this week' : 'Shu haftaning qisqa ko‘rinishi'}</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='rounded-2xl border bg-background/70 p-4'>
              <p className='text-xs text-muted-foreground'>{labels.locale === 'en' ? 'Best performing group' : 'Eng yaxshi natijali guruh'}</p>
              <p className='mt-1 text-lg font-bold'>{groupText(groups[2], labels).name}</p>
              <p className='mt-1 text-sm text-emerald-600'>{progress[2]}% {labels.avg.toLowerCase()}</p>
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div className='rounded-2xl border bg-background/70 p-3'><p className='text-xs text-muted-foreground'>{labels.locale === 'en' ? 'Lessons' : 'Darslar'}</p><p className='mt-1 text-2xl font-bold'>12</p></div>
              <div className='rounded-2xl border bg-background/70 p-3'><p className='text-xs text-muted-foreground'>{labels.locale === 'en' ? 'Assignments' : 'Vazifalar'}</p><p className='mt-1 text-2xl font-bold'>28</p></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
            <div><CardTitle>{labels.groups}</CardTitle><CardDescription>{filtered.length} {labels.groups.toLowerCase()}</CardDescription></div>
            <div className='relative'>
              <SearchIcon className='absolute start-3 top-2.5 size-4 text-muted-foreground' />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={labels.search} className='ps-9' />
            </div>
          </div>
        </CardHeader>
        <CardContent className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {filtered.map((group) => (
            <Card key={group.id} className='bg-muted/20 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg'>
              <CardHeader>
                <div className='flex items-start justify-between gap-2'>
                  <div><CardTitle className='text-base'>{groupText(group, labels).name}</CardTitle><CardDescription>{groupText(group, labels).course}</CardDescription></div>
                  <Badge variant='secondary'>{group.students}</Badge>
                </div>
              </CardHeader>
              <CardContent className='space-y-3 text-sm'>
                <div className='rounded-xl border bg-background/60 p-3'>
                  <p className='text-[11px] text-muted-foreground'>{labels.locale === 'en' ? 'Teacher' : 'O‘qituvchi'}</p>
                  <p className='font-semibold'>{group.teacher}</p>
                </div>
                <div className='flex items-center justify-between text-xs text-muted-foreground'><span><Clock3 className='me-1 inline size-4 text-primary' />{group.time}</span><span>{groupText(group, labels).room}</span></div>
                <Button variant='outline' className='mt-1 w-full cursor-pointer' asChild><a href={`/teacher/students?group=${group.id}`}>{labels.students}</a></Button>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </>
  )
}

function SchedulePage({ labels, todayOnly }: { labels: Labels; todayOnly: boolean }) {
  const data = todayOnly ? lessons.filter((lesson) => lesson.dayEn === 'Today') : lessons
  const days = labels.locale === 'en'
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan']
  const weekCards = days.map((day, index) => ({
    day,
    count: index < data.length ? 1 : 0,
    lesson: index < data.length ? data[index] : undefined,
  }))
  const nextLesson = data[0]
  const completed = data.filter((_, index) => index === 0).length
  const attendanceRate = 93
  return (
    <>
      <PageHeading
        title={todayOnly ? labels.today : labels.schedule}
        description={todayOnly ? (labels.locale === 'en' ? 'Today’s teaching plan and classroom focus.' : 'Bugungi darslar va o‘qituvchi ish rejasi.') : (labels.locale === 'en' ? 'A visual weekly teaching board with group, room and attendance signals.' : 'Guruh, xona va davomat ko‘rsatkichlari bilan haftalik vizual dars jadvali.')}
        action={!todayOnly ? <Button variant='outline' className='cursor-pointer'><CalendarRange className='me-2 size-4' />{labels.locale === 'en' ? 'Current week' : 'Joriy hafta'}</Button> : undefined}
      />
      <div className='mb-5 grid gap-4 sm:grid-cols-3'>
        <TeacherStat icon={CalendarDays} title={labels.locale === 'en' ? 'Planned lessons' : 'Rejalashtirilgan darslar'} value={String(data.length)} detail={labels.locale === 'en' ? 'Visible on this board' : 'Ushbu jadvaldagi darslar'} />
        <TeacherStat icon={ClipboardCheck} title={labels.locale === 'en' ? 'Attendance signal' : 'Davomat ko‘rsatkichi'} value={`${attendanceRate}%`} detail={labels.locale === 'en' ? 'Across your groups' : 'Guruhlaringiz bo‘yicha'} />
        <TeacherStat icon={Trophy} title={labels.locale === 'en' ? 'Next focus' : 'Keyingi yo‘nalish'} value={nextLesson ? groupText(nextLesson, labels).name : (labels.locale === 'en' ? 'No lesson' : 'Dars yo‘q')} detail={nextLesson ? nextLesson.time : (labels.locale === 'en' ? 'Free slot' : 'Bo‘sh vaqt')} />
      </div>
      <Card className='mb-5 overflow-hidden'>
        <CardHeader className='border-b bg-gradient-to-r from-primary/[0.09] via-card to-violet-500/[0.05]'>
          <div className='flex items-center justify-between gap-3'>
            <div>
              <CardTitle>{todayOnly ? labels.today : (labels.locale === 'en' ? 'Teaching week' : 'O‘qituvchilik haftasi')}</CardTitle>
              <CardDescription>{labels.locale === 'en' ? 'A compact planner instead of a plain schedule list.' : 'Oddiy ro‘yxat o‘rniga ixcham va professional rejalashtirish ko‘rinishi.'}</CardDescription>
            </div>
            <span className='rounded-full border bg-background/75 px-3 py-1 text-xs font-semibold'>{data.length} {labels.locale === 'en' ? 'lessons' : 'dars'}</span>
          </div>
        </CardHeader>
        <CardContent className='p-4'>
          <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
            {weekCards.map((slot, index) => (
              <div key={slot.day} className={`rounded-2xl border p-4 transition-all ${slot.lesson ? 'bg-card shadow-sm hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md' : 'bg-muted/20'}`}>
                <div className='flex items-center justify-between'>
                  <span className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>{slot.day}</span>
                  <span className={`size-2 rounded-full ${slot.lesson ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`} />
                </div>
                {slot.lesson ? (
                  <>
                    <p className='mt-3 text-base font-bold'>{groupText(slot.lesson, labels).name}</p>
                    <p className='mt-1 text-xs text-muted-foreground'>{groupText(slot.lesson, labels).course}</p>
                    <div className='mt-4 grid grid-cols-2 gap-2 text-xs'>
                      <div className='rounded-xl border bg-muted/25 p-2.5'><p className='text-muted-foreground'>{labels.locale === 'en' ? 'Time' : 'Vaqt'}</p><p className='mt-1 font-semibold text-primary'>{slot.lesson.time}</p></div>
                      <div className='rounded-xl border bg-muted/25 p-2.5'><p className='text-muted-foreground'>{labels.locale === 'en' ? 'Room' : 'Xona'}</p><p className='mt-1 font-semibold'>{groupText(slot.lesson, labels).room}</p></div>
                    </div>
                    <div className='mt-3 flex items-center justify-between text-xs text-muted-foreground'><span>{slot.lesson.students} {labels.students.toLowerCase()}</span><span>{index === 0 && completed ? (labels.locale === 'en' ? 'Completed' : 'O‘tilgan') : (labels.locale === 'en' ? 'Planned' : 'Reja')}</span></div>
                  </>
                ) : (
                  <div className='mt-5 rounded-xl border border-dashed p-4 text-center'><p className='text-sm font-medium'>{labels.locale === 'en' ? 'Open slot' : 'Bo‘sh vaqt'}</p><p className='mt-1 text-xs text-muted-foreground'>{labels.locale === 'en' ? 'No lesson assigned' : 'Dars biriktirilmagan'}</p></div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>{labels.locale === 'en' ? 'Schedule health' : 'Jadval holati'}</CardTitle><CardDescription>{labels.locale === 'en' ? 'Quick planning signals for your teaching week.' : 'Haftalik dars rejangiz uchun tezkor ko‘rsatkichlar.'}</CardDescription></CardHeader>
        <CardContent className='grid gap-3 sm:grid-cols-3'>
          <div className='rounded-2xl border bg-emerald-500/[0.05] p-4'><p className='text-xs text-muted-foreground'>{labels.locale === 'en' ? 'Attendance-ready' : 'Davomatga tayyor'}</p><p className='mt-1 text-2xl font-bold'>100%</p><p className='mt-1 text-xs text-emerald-600'>{labels.locale === 'en' ? 'All groups have students mapped' : 'Barcha guruhlarga o‘quvchilar biriktirilgan'}</p></div>
          <div className='rounded-2xl border bg-primary/[0.05] p-4'><p className='text-xs text-muted-foreground'>{labels.locale === 'en' ? 'Peak session' : 'Eng band dars'}</p><p className='mt-1 text-2xl font-bold'>18</p><p className='mt-1 text-xs text-primary'>{labels.locale === 'en' ? 'learners in one group' : 'bitta guruhdagi o‘quvchi'}</p></div>
          <div className='rounded-2xl border bg-violet-500/[0.05] p-4'><p className='text-xs text-muted-foreground'>{labels.locale === 'en' ? 'Coverage' : 'Qamrov'}</p><p className='mt-1 text-2xl font-bold'>6/6</p><p className='mt-1 text-xs text-violet-600'>{labels.locale === 'en' ? 'planner slots visible' : 'jadval slotlari ko‘rinmoqda'}</p></div>
        </CardContent>
      </Card>
    </>
  )
}

function AttendancePage({ labels }: { labels: Labels }) {
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0)
  const [selected, setSelected] = useState<
    Record<string, 'present' | 'late' | 'absent' | 'excused'>
  >({
    'Azizbek Karimov': 'present',
    'Madina Aliyeva': 'late',
    'Javohir Rasulov': 'absent',
    'Shahnoza Ergasheva': 'present',
  })
  const saveAttendance = () => {
    toast.success(labels.attendanceSaved)
  }
  const currentGroup = groups[selectedGroupIndex] ?? groups[0]

  return (
    <>
      <PageHeading
        title={labels.attendance}
        description={labels.mark}
        labels={labels}
        action={
          <Button onClick={saveAttendance} className='gap-2 shadow-xs'>
            <Save className='size-4' />
            {labels.save}
          </Button>
        }
      />

      {/* Guruh tanlash */}
      <div className='mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
        {groups.map((grp, idx) => {
          const isSel = selectedGroupIndex === idx
          const gt = groupText(grp, labels)
          return (
            <button
              key={grp.id}
              type='button'
              onClick={() => setSelectedGroupIndex(idx)}
              className={`flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all ${
                isSel
                  ? 'border-primary bg-primary/[0.06] shadow-xs ring-1 ring-primary/30'
                  : 'border-border/70 bg-card hover:border-primary/40 hover:bg-muted/30'
              }`}
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <span className='flex size-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary'>
                    {gt.name.slice(0, 2)}
                  </span>
                  <div>
                    <span className='text-sm leading-tight font-semibold'>
                      {gt.name}
                    </span>
                    <p className='text-[11px] leading-tight text-muted-foreground'>
                      {gt.course}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={isSel ? 'default' : 'outline'}
                  className='text-[10px]'
                >
                  {students.length} {labels.students}
                </Badge>
              </div>
              <div className='mt-3 flex items-center justify-between border-t border-border/40 pt-2 text-[11px] text-muted-foreground'>
                <span>{gt.room}</span>
                <span>{grp.time}</span>
              </div>
            </button>
          )
        })}
      </div>

      <Card className='border-border/70 shadow-xs'>
        <CardHeader className='flex flex-col gap-3 border-b bg-gradient-to-r from-emerald-500/[0.06] via-transparent to-amber-500/[0.06] py-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <CardTitle className='flex items-center gap-2 text-base font-semibold'>
              <CheckCircle2 className='size-5 text-emerald-600 dark:text-emerald-400' />
              <span>
                {groupText(currentGroup, labels).name} — {labels.attendance}
              </span>
            </CardTitle>
            <CardDescription className='mt-0.5 text-xs'>
              {groupText(currentGroup, labels).course} ·{' '}
              {groupText(currentGroup, labels).room} · {labels.today}
            </CardDescription>
          </div>
          <Button
            size='sm'
            variant='outline'
            className='gap-1.5 border-emerald-500/30 text-xs text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300'
            onClick={() => {
              const allPresent: Record<
                string,
                'present' | 'late' | 'absent' | 'excused'
              > = {}
              students.forEach((st) => {
                allPresent[st] = 'present'
              })
              setSelected(allPresent)
              toast.success(
                labels.locale === 'en'
                  ? 'All marked as present.'
                  : 'Barchasi "Kelgan" deb belgilandi.'
              )
            }}
          >
            <CheckCheck className='size-3.5' />
            {labels.locale === 'en'
              ? 'Mark all present'
              : 'Barchasini kelgan qilish'}
          </Button>
        </CardHeader>

        <CardContent className='space-y-4 pt-4'>
          {/* 4 Ta Metrika */}
          <div className='grid gap-3 sm:grid-cols-4'>
            {[
              {
                key: 'present',
                label: labels.locale === 'en' ? 'Present' : 'Kelgan',
                color:
                  'border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-700 dark:text-emerald-300',
              },
              {
                key: 'late',
                label: labels.locale === 'en' ? 'Late' : 'Kechikkan',
                color:
                  'border-amber-500/20 bg-amber-500/[0.06] text-amber-700 dark:text-amber-300',
              },
              {
                key: 'absent',
                label: labels.locale === 'en' ? 'Absent' : 'Kelmagan',
                color:
                  'border-rose-500/20 bg-rose-500/[0.06] text-rose-700 dark:text-rose-300',
              },
              {
                key: 'excused',
                label: labels.locale === 'en' ? 'Excused' : 'Sababli',
                color:
                  'border-sky-500/20 bg-sky-500/[0.06] text-sky-700 dark:text-sky-300',
              },
            ].map(({ key, label, color }) => {
              const cnt = students.filter(
                (st) => (selected[st] ?? 'absent') === key
              ).length
              return (
                <div key={key} className={`rounded-xl border p-3 ${color}`}>
                  <p className='text-xs font-semibold'>{label}</p>
                  <p className='mt-1 text-2xl font-bold'>{cnt}</p>
                </div>
              )
            })}
          </div>

          <div className='overflow-x-auto rounded-xl border border-border/70 bg-card shadow-2xs'>
            <table className='w-full min-w-[500px] text-left text-sm'>
              <thead className='border-b bg-muted/40 text-xs font-medium text-muted-foreground'>
                <tr>
                  <th className='px-4 py-3'>{labels.students}</th>
                  <th className='px-4 py-3'>{labels.attendance}</th>
                  <th className='px-4 py-3'>{labels.time}</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border/60'>
                {students.map((student) => {
                  const state = selected[student] || 'absent'
                  return (
                    <tr
                      key={student}
                      className='transition-colors hover:bg-muted/20'
                    >
                      <td className='px-4 py-3'>
                        <div className='flex items-center gap-2.5'>
                          <span className='flex size-8 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary'>
                            {student
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </span>
                          <span className='text-sm font-semibold'>
                            {student}
                          </span>
                        </div>
                      </td>
                      <td className='px-4 py-3'>
                        <AttendanceStatusCheckbox
                          value={state}
                          onChange={(next) => {
                            setSelected((current) => ({
                              ...current,
                              [student]: next,
                            }))
                          }}
                          studentName={student}
                          locale={labels.locale === 'en' ? 'en' : 'uz'}
                        />
                      </td>
                      <td className='px-4 py-3 font-mono text-xs text-muted-foreground'>
                        {currentGroup.time}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
function StudentsPage({ labels }: { labels: Labels }) {
  const params = new URLSearchParams(window.location.search)
  const requestedGroup = params.get('group')
  const [selectedGroup, setSelectedGroup] = useState(requestedGroup)
  const [query, setQuery] = useState('')
  const groupStudents = (groupId: string) => {
    const groupIndex = groups.findIndex((group) => group.id === groupId)
    return students.filter((_, index) => index % groups.length === groupIndex)
  }
  const activeGroup = groups.find((group) => group.id === selectedGroup)
  const visibleStudents = activeGroup ? groupStudents(activeGroup.id) : students.filter((student) => student.toLowerCase().includes(query.toLowerCase()))

  if (activeGroup) {
    return (
      <>
        <PageHeading title={groupText(activeGroup, labels).name} description={labels.subtitle} action={<Button variant='outline' className='cursor-pointer' onClick={() => setSelectedGroup(null)}>← {labels.locale === 'en' ? 'All students' : 'Barcha o‘quvchilar'}</Button>} />
        <div className='mb-4 grid gap-4 md:grid-cols-3'>
          <TeacherStat icon={UsersRound} title={labels.students} value={String(activeGroup.students)} />
          <TeacherStat icon={Star} title={labels.avg} value='89%' detail={labels.locale === 'en' ? 'Group average' : 'Guruh o‘rtachasi'} />
          <TeacherStat icon={CheckCircle2} title={labels.attendance} value='94%' detail={labels.locale === 'en' ? 'Current month' : 'Joriy oy'} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{labels.students}</CardTitle>
            <CardDescription><span className='font-medium'>{labels.locale === 'en' ? 'Teacher:' : 'O‘qituvchi:'}</span> {activeGroup.teacher}</CardDescription>
          </CardHeader>
          <CardContent className='divide-y'>
            {visibleStudents.map((student, index) => (
              <div key={student} className='flex items-center justify-between gap-3 py-4'>
                <div className='flex items-center gap-3'><span className='flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary'>{student.split(' ').map((n) => n[0]).join('').slice(0,2)}</span><div><p className='font-semibold'>{student}</p><p className='text-xs text-muted-foreground'>{groupText(activeGroup, labels).course}</p></div></div>
                <Badge variant='secondary'>{index % 2 ? '82%' : '91%'} {labels.avg.toLowerCase()}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <>
      <PageHeading title={labels.students} description={labels.subtitle} />
      <Card>
        <CardHeader>
          <div className='relative max-w-sm'><SearchIcon className='absolute start-3 top-2.5 size-4 text-muted-foreground' /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={labels.search} className='ps-9' /></div>
          <CardDescription className='mt-3'>{labels.locale === 'en' ? 'Choose a group to view its students and teacher.' : 'Guruhni tanlab, o‘quvchilar va o‘qituvchini ko‘ring.'}</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-3 md:grid-cols-3'>
          {groups.map((group) => (
            <button key={group.id} type='button' className='cursor-pointer rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg' onClick={() => setSelectedGroup(group.id)}>
              <div className='flex items-center justify-between'><span className='font-semibold'>{groupText(group, labels).name}</span><Badge>{group.students}</Badge></div>
              <p className='mt-2 text-xs text-muted-foreground'>{groupText(group, labels).course}</p>
              <p className='mt-3 text-sm'><span className='text-muted-foreground'>{labels.locale === 'en' ? 'Teacher:' : 'O‘qituvchi:'}</span> {group.teacher}</p>
            </button>
          ))}
        </CardContent>
      </Card>
      {!selectedGroup && visibleStudents.length > 0 && <Card className='mt-4'><CardHeader><CardTitle>{labels.locale === 'en' ? 'All students' : 'Barcha o‘quvchilar'}</CardTitle></CardHeader><CardContent className='divide-y'>{visibleStudents.map((student) => <div key={student} className='py-3 text-sm font-medium'>{student}</div>)}</CardContent></Card>}
    </>
  )
}

function AssignmentsPage({ labels }: { labels: Labels }) {
  const [items, setItems] = useState<{ title: string; groupId: string }[]>(() => {
    const shared = readSharedAssignments()
    return shared.length
      ? shared.map((item, index) => ({ title: item.title, groupId: groups[index % groups.length].id }))
      : [
          { title: labels.task1, groupId: groups[0].id },
          { title: labels.task2, groupId: groups[1].id },
          { title: labels.task3, groupId: groups[2].id },
        ]
  })
  const [value, setValue] = useState('')
  const [taskGroup, setTaskGroup] = useState(groups[0].id)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const completion = [92, 78, 64]
  const groupCompletion = groups.map((group, index) => ({ group, value: completion[index] }))
  const bestGroup = groupCompletion.reduce((best, item) => item.value > best.value ? item : best, groupCompletion[0])

  useEffect(() => {
    const shared: SharedAssignment[] = items.map((item, index) => ({ id: `teacher-task-${index}`, title: item.title, module: 'Teacher assignment', description: item.title, deadline: labels.deadline, status: 'pending' }))
    writeSharedAssignments(shared)
  }, [items, labels.deadline])

  const resetForm = () => {
    setValue('')
    setEditingIndex(null)
    setTaskGroup(groups[0].id)
    setCreateOpen(false)
  }
  const add = () => {
    const name = value.trim().replace(/\s+/g, ' ')
    if (!name || name.length < 3) { toast.error(labels.requiredTask); return }
    if (editingIndex === null) { setItems((current) => [...current, { title: name, groupId: taskGroup }]); toast.success(labels.created) }
    else { setItems((current) => current.map((item, index) => index === editingIndex ? { ...item, title: name, groupId: taskGroup } : item)); toast.success(labels.updated) }
    resetForm()
  }
  const edit = (index: number) => { setEditingIndex(index); setValue(items[index].title); setTaskGroup(items[index].groupId); setCreateOpen(true) }
  const remove = (index: number) => {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))
    if (editingIndex === index) resetForm()
    toast.success(labels.deleted)
  }

  return (
    <>
      <PageHeading title={labels.assignments} description={labels.subtitle} labels={labels} action={<Button className='cursor-pointer' onClick={() => { setEditingIndex(null); setValue(''); setTaskGroup(groups[0].id); setCreateOpen(true) }}><Plus className='me-2 size-4' />{labels.addTask}</Button>} />
      <div className='mb-4 grid gap-4 md:grid-cols-3'>
        <TeacherStat icon={ClipboardList} title={labels.assignments} value={String(items.length)} detail={labels.locale === 'en' ? 'Published this term' : 'Shu davrda berilgan'} />
        <TeacherStat icon={CheckCircle2} title={labels.completion} value='78%' detail={labels.locale === 'en' ? 'Overall completion' : 'Umumiy bajarilish'} />
        <TeacherStat icon={Star} title={labels.locale === 'en' ? 'Top group' : 'Top guruh'} value={groupText(bestGroup.group, labels).name} detail={`${bestGroup.value}% ${labels.completion.toLowerCase()}`} />
      </div>

      <div className='mb-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]'>
        <Card>
          <CardHeader><CardTitle>{labels.locale === 'en' ? 'Completion by group' : 'Guruhlar bo‘yicha bajarilish'}</CardTitle><CardDescription>{labels.locale === 'en' ? 'Submission rate across your groups' : 'Guruhlar kesimida topshirish darajasi'}</CardDescription></CardHeader>
          <CardContent className='space-y-5'>
            {groupCompletion.map(({ group, value: rate }) => (
              <div key={group.id}>
                <div className='mb-2 flex justify-between text-sm'><span className='font-semibold'>{groupText(group, labels).name}</span><span className='font-bold'>{rate}%</span></div>
                <div className='h-3 rounded-full bg-muted'><div className='h-full rounded-full bg-gradient-to-r from-primary via-violet-500 to-cyan-500' style={{ width: `${rate}%` }} /></div>
                <div className='mt-1.5 flex justify-between text-[11px] text-muted-foreground'><span>{group.students} {labels.students.toLowerCase()}</span><span>{labels.locale === 'en' ? `${Math.round(group.students * rate / 100)} submitted` : `${Math.round(group.students * rate / 100)} topshirgan`}</span></div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className='bg-gradient-to-br from-primary/[0.07] via-card to-emerald-500/[0.05]'>
          <CardHeader><CardTitle>{labels.locale === 'en' ? 'Assignment pulse' : 'Vazifalar ritmi'}</CardTitle><CardDescription>{labels.locale === 'en' ? 'What needs your attention next' : 'Keyingi e’tibor talab qiladigan ko‘rsatkichlar'}</CardDescription></CardHeader>
          <CardContent className='grid gap-3'>
            <div className='rounded-2xl border bg-background/70 p-4'><div className='flex items-center gap-2 text-xs text-muted-foreground'><BarChart3 className='size-4 text-primary' />{labels.locale === 'en' ? 'On time' : 'O‘z vaqtida'}</div><p className='mt-2 text-3xl font-bold'>72%</p><p className='mt-1 text-xs text-emerald-600'>{labels.locale === 'en' ? 'Healthy delivery signal' : 'Topshirish ko‘rsatkichi yaxshi'}</p></div>
            <div className='grid grid-cols-2 gap-3'><div className='rounded-2xl border bg-background/70 p-4'><p className='text-xs text-muted-foreground'>{labels.locale === 'en' ? 'Needs review' : 'Tekshiruvda'}</p><p className='mt-1 text-2xl font-bold text-amber-600'>9</p></div><div className='rounded-2xl border bg-background/70 p-4'><p className='text-xs text-muted-foreground'>{labels.locale === 'en' ? 'Best group' : 'Eng yaxshi guruh'}</p><p className='mt-1 truncate text-sm font-bold'>{groupText(bestGroup.group, labels).name}</p></div></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>{labels.assignments}</CardTitle><CardDescription>{labels.locale === 'en' ? 'Every assignment is tied to a group.' : 'Har bir vazifa aniq guruhga biriktiriladi.'}</CardDescription></CardHeader>
        <CardContent className='space-y-2'>
          {items.map((item, index) => {
            const group = groups.find((entry) => entry.id === item.groupId) ?? groups[0]
            return <div key={`${item.title}-${index}`} className='flex flex-col gap-3 rounded-2xl border p-4 transition-all hover:border-primary/35 hover:bg-muted/20 sm:flex-row sm:items-center'>
              <div className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary'><ClipboardList className='size-5' /></div>
              <div className='min-w-0 flex-1'><p className='truncate text-sm font-semibold'>{item.title}</p><p className='mt-1 text-xs text-muted-foreground'>{groupText(group, labels).name} · {group.students} {labels.students.toLowerCase()}</p></div>
              <Badge variant='secondary'>{labels.published}</Badge>
              <div className='flex gap-1'><Button size='icon' variant='ghost' aria-label={labels.edit} className='cursor-pointer' onClick={() => edit(index)}><Pencil className='size-4' /></Button><Button size='icon' variant='ghost' aria-label={labels.delete} className='cursor-pointer' onClick={() => remove(index)}><Trash2 className='size-4 text-destructive' /></Button></div>
            </div>
          })}
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className='sm:max-w-[560px]'>
          <DialogHeader><DialogTitle>{editingIndex === null ? labels.create : labels.editTask}</DialogTitle><DialogDescription>{labels.locale === 'en' ? 'Select the group first, then assign the task to its learners.' : 'Avval guruhni tanlang, keyin shu guruh o‘quvchilariga vazifa bering.'}</DialogDescription></DialogHeader>
          <div className='space-y-4'>
            <div className='rounded-2xl border bg-muted/20 p-4'><p className='mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>{labels.groups}</p><Select value={taskGroup} onValueChange={setTaskGroup}><SelectTrigger className='cursor-pointer'><SelectValue /></SelectTrigger><SelectContent>{groups.map((group) => <SelectItem key={group.id} value={group.id}>{groupText(group, labels).name} · {group.students} {labels.students.toLowerCase()}</SelectItem>)}</SelectContent></Select></div>
            <div><p className='mb-2 text-xs font-semibold text-muted-foreground'>{labels.taskName}</p><Input autoFocus value={value} onChange={(event) => setValue(event.target.value)} placeholder={labels.taskName} maxLength={120} onKeyDown={(event) => event.key === 'Enter' && add()} /></div>
          </div>
          <DialogFooter><Button variant='outline' className='cursor-pointer' onClick={resetForm}>{labels.cancel}</Button><Button className='cursor-pointer' onClick={add}>{editingIndex === null ? labels.create : labels.save}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function GradesPage({ labels }: { labels: Labels }) {
  const [selectedGroup, setSelectedGroup] = useState(groups[0].id)
  const [scores, setScores] = useState<Record<string, string>>({})
  const currentGroup = groups.find((group) => group.id === selectedGroup) ?? groups[0]
  const groupStudents = students.filter((_, index) => index % groups.length === groups.findIndex((group) => group.id === currentGroup.id))
  const defaultScores = groupStudents.map((student, index) => ({ student, score: 78 + ((index * 7) % 20) }))
  const topStudent = [...defaultScores].sort((a, b) => b.score - a.score)[0]
  const average = Math.round(defaultScores.reduce((sum, item) => sum + item.score, 0) / Math.max(defaultScores.length, 1))
  const excellent = defaultScores.filter((item) => item.score >= 90).length
  const needsSupport = defaultScores.filter((item) => item.score < 70).length

  const exportGrades = () => {
    const rows = defaultScores.map(({ student, score }) => [student, scores[student] ?? String(score)])
    const csv = [['Student', 'Score'], ...rows].map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'grades.csv'; anchor.click(); URL.revokeObjectURL(url)
    toast.success(labels.saved)
  }
  const printGrades = () => window.print()
  const saveGrade = (student: string) => {
    const score = Number(scores[student])
    if (!Number.isFinite(score) || score < 0 || score > 100) { toast.error(labels.invalidScore); return }
    writeSharedGrade({ student, score, updatedAt: new Date().toISOString() })
    toast.success(labels.gradeSaved)
  }

  return (
    <>
      <PageHeading title={labels.grades} description={labels.locale === 'en' ? 'Select a group first, then review and update learner performance.' : 'Avval guruhni tanlang, keyin o‘quvchilar natijasini ko‘rib chiqing va baholang.'} labels={labels} />
      <div className='mb-4 grid gap-4 md:grid-cols-3'>
        <TeacherStat icon={Trophy} title={labels.locale === 'en' ? 'Top student' : 'Eng yaxshi o‘quvchi'} value={topStudent.student} detail={`${topStudent.score}%`} />
        <TeacherStat icon={Star} title={labels.avg} value={`${average}%`} detail={labels.locale === 'en' ? 'Current group average' : 'Joriy guruh o‘rtachasi'} />
        <TeacherStat icon={GraduationCap} title={labels.locale === 'en' ? 'Grade coverage' : 'Baholash qamrovi'} value={`${defaultScores.length}/${defaultScores.length}`} detail={labels.locale === 'en' ? 'Learners reviewed' : 'O‘quvchilar ko‘rib chiqildi'} />
      </div>

      <Card className='mb-4 overflow-hidden'>
        <CardHeader className='border-b bg-gradient-to-r from-primary/[0.08] via-card to-violet-500/[0.06]'>
          <CardTitle>{labels.locale === 'en' ? 'Choose a group' : 'Guruhni tanlang'}</CardTitle>
          <CardDescription>{labels.locale === 'en' ? 'The selected group controls the gradebook below.' : 'Tanlangan guruh pastdagi baholash jurnalini boshqaradi.'}</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-3 p-4 md:grid-cols-3'>
          {groups.map((group) => (
            <button key={group.id} type='button' className={`cursor-pointer rounded-2xl border p-4 text-left transition-all ${selectedGroup === group.id ? 'border-primary bg-primary/[0.07] shadow-sm ring-1 ring-primary/20' : 'hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md'}`} onClick={() => setSelectedGroup(group.id)}>
              <div className='flex items-center justify-between'><span className='font-semibold'>{groupText(group, labels).name}</span><Badge variant={selectedGroup === group.id ? 'default' : 'secondary'}>{group.students}</Badge></div>
              <p className='mt-2 text-xs text-muted-foreground'>{groupText(group, labels).course}</p>
              <div className='mt-3 flex items-center justify-between text-xs'><span className='text-muted-foreground'>{labels.locale === 'en' ? 'Teacher' : 'O‘qituvchi'}</span><span className='font-semibold'>{group.teacher}</span></div>
            </button>
          ))}
        </CardContent>
      </Card>

      <div className='mb-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]'>
        <Card>
          <CardHeader><CardTitle>{groupText(currentGroup, labels).name}</CardTitle><CardDescription>{labels.locale === 'en' ? 'Score distribution for the selected group' : 'Tanlangan guruh baholarining taqsimoti'}</CardDescription></CardHeader>
          <CardContent className='space-y-4'>
            {defaultScores.map(({ student, score }, index) => (
              <div key={student}>
                <div className='mb-2 flex items-center gap-3 text-sm'><span className='w-32 truncate font-medium'>{student}</span><div className='h-2 flex-1 rounded-full bg-muted'><div className={`h-full rounded-full ${score >= 90 ? 'bg-emerald-500' : score >= 70 ? 'bg-primary' : 'bg-amber-500'}`} style={{ width: `${score}%` }} /></div><span className='w-10 text-right font-bold'>{score}%</span></div>
                {index === 0 && <p className='ms-32 text-[11px] text-muted-foreground'>{labels.locale === 'en' ? 'Top current result' : 'Hozirgi eng yuqori natija'}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className='bg-gradient-to-br from-amber-500/[0.08] via-card to-primary/[0.05]'>
          <CardHeader><CardTitle>{labels.locale === 'en' ? 'Group snapshot' : 'Guruh ko‘rinishi'}</CardTitle><CardDescription>{labels.locale === 'en' ? 'Fast signals before entering grades.' : 'Baholashdan oldingi tezkor ko‘rsatkichlar.'}</CardDescription></CardHeader>
          <CardContent className='space-y-3'>
            <div className='rounded-2xl border bg-background/70 p-4'><p className='text-xs text-muted-foreground'>{labels.locale === 'en' ? 'Top learner' : 'Top o‘quvchi'}</p><p className='mt-1 font-bold'>{topStudent.student}</p><p className='mt-1 text-sm text-amber-600'>{topStudent.score}%</p></div>
            <div className='grid grid-cols-2 gap-3'><div className='rounded-2xl border bg-background/70 p-4'><p className='text-xs text-muted-foreground'>{labels.locale === 'en' ? '90+ scores' : '90+ baholar'}</p><p className='mt-1 text-2xl font-bold text-emerald-600'>{excellent}</p></div><div className='rounded-2xl border bg-background/70 p-4'><p className='text-xs text-muted-foreground'>{labels.locale === 'en' ? 'Needs support' : 'Qo‘llab-quvvatlash'}</p><p className='mt-1 text-2xl font-bold text-amber-600'>{needsSupport}</p></div></div>
          </CardContent>
        </Card>
      </div>

      <div className='mb-4 flex flex-wrap gap-2'><Button variant='outline' onClick={exportGrades} className='cursor-pointer'><Download className='me-2 size-4' />CSV</Button><Button variant='outline' onClick={printGrades} className='cursor-pointer'>{labels.locale === 'en' ? 'Print / PDF' : 'Chop etish / PDF'}</Button></div>
      <Card>
        <CardHeader className='border-b bg-gradient-to-r from-primary/[0.07] to-transparent'><div className='flex items-center justify-between gap-3'><div><CardTitle>{labels.locale === 'en' ? 'Gradebook' : 'Baholash jurnali'}</CardTitle><CardDescription>{labels.locale === 'en' ? 'Teacher:' : 'O‘qituvchi:'} {currentGroup.teacher} · {labels.avg}: {average}%</CardDescription></div><Badge>{currentGroup.students} {labels.students.toLowerCase()}</Badge></div></CardHeader>
        <CardContent className='space-y-2 pt-4'>
          {defaultScores.map(({ student, score }) => (
            <div key={student} className='grid gap-3 rounded-xl border p-3 transition-colors hover:bg-muted/20 sm:grid-cols-[1fr_120px_100px] sm:items-center'>
              <div className='flex items-center gap-3'><span className='flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary'>{student.split(' ').map((n) => n[0]).join('').slice(0,2)}</span><div><p className='text-sm font-semibold'>{student}</p><p className='text-xs text-muted-foreground'>{student === topStudent.student ? (labels.locale === 'en' ? 'Top current result' : 'Eng yuqori natija') : `${labels.avg}: ${score}%`}</p></div></div>
              <Input value={scores[student] ?? String(score)} onChange={(event) => setScores((current) => ({ ...current, [student]: event.target.value.replace(/[^0-9]/g, '').slice(0, 3) }))} type='text' inputMode='numeric' aria-label={`${student} ${labels.score}`} />
              <Button size='sm' variant='outline' className='cursor-pointer' onClick={() => saveGrade(student)}><Save className='me-2 size-4' />{labels.save}</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
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
      <div className='relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/[0.10] via-card to-emerald-500/[0.06] p-6 shadow-sm'>
        <div className='pointer-events-none absolute -end-12 -top-20 size-52 rounded-full bg-primary/10 blur-3xl' />
        <div className='relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.18em] text-primary'>SFERA IT ACADEMY</p>
            <h1 className='mt-2 text-2xl font-bold tracking-tight md:text-3xl'>{title}</h1>
            <p className='mt-1 max-w-2xl text-sm text-muted-foreground'>{description}</p>
          </div>
          <div className='rounded-2xl border bg-background/75 px-4 py-3 text-xs shadow-sm'>
            <p className='font-semibold'>{english ? 'Teacher workspace' : 'O‘qituvchi ish maydoni'}</p>
            <p className='mt-1 text-muted-foreground'>{english ? 'Profile and account identity' : 'Profil va hisob ma’lumotlari'}</p>
          </div>
        </div>
      </div>
      <div className='grid gap-4 sm:grid-cols-3'>
        <Card><CardContent className='p-4'><p className='text-xs text-muted-foreground'>{english ? 'Account' : 'Hisob'}</p><p className='mt-1 font-semibold'>{english ? 'Active' : 'Faol'}</p></CardContent></Card>
        <Card><CardContent className='p-4'><p className='text-xs text-muted-foreground'>{english ? 'Workspace' : 'Ish maydoni'}</p><p className='mt-1 font-semibold'>{english ? 'Teacher' : 'O‘qituvchi'}</p></CardContent></Card>
        <Card><CardContent className='p-4'><p className='text-xs text-muted-foreground'>{english ? 'Security' : 'Xavfsizlik'}</p><p className='mt-1 font-semibold text-emerald-600'>{english ? 'Protected' : 'Himoyalangan'}</p></CardContent></Card>
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
function TeacherStat({
  icon: Icon,
  title,
  value,
  detail,
}: {
  icon: typeof UsersRound
  title: string
  value: string
  detail?: string
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
        {detail && (
          <p className='mt-1 text-xs text-muted-foreground'>{detail}</p>
        )}
      </CardContent>
    </Card>
  )
}
