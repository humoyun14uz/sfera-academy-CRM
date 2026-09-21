import { useState, type FormEvent } from 'react'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  DollarSign,
  GraduationCap,
  Plus,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { PermissionGate } from '@/components/permission-gate'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  formatCurrency,
  loadCourses,
  saveCourses,
  type Course,
  type CourseStudent,
  type CourseGroup,
} from './data'

const route = getRouteApi('/_authenticated/apps/$courseId')

export function CourseDetails() {
  const { courseId } = route.useParams()
  const navigate = useNavigate()
  const [courses, setCourses] = useState(() => loadCourses())
  const course = courses.find((item) => item.id === courseId)
  const [enrollmentOpen, setEnrollmentOpen] = useState(false)
  const [groupOpen, setGroupOpen] = useState(false)

  const update = (next: Course[]) => {
    setCourses(next)
    saveCourses(next)
  }

  if (!course) {
    return (
      <>
        <Header>
          <Search className='me-auto' />
          <ThemeSwitch />
          <ProfileDropdown />
        </Header>
        <Main>
          <Card>
            <CardContent className='flex min-h-64 flex-col items-center justify-center gap-3'>
              <h1 className='text-xl font-semibold'>Kurs topilmadi</h1>
              <Button onClick={() => navigate({ to: '/apps' })}>
                Kurslar ro‘yxatiga qaytish
              </Button>
            </CardContent>
          </Card>
        </Main>
      </>
    )
  }

  const addEnrollment = (student: CourseStudent) => {
    const next = courses.map((item) =>
      item.id === course.id
        ? {
            ...item,
            students: [...item.students, student],
            studentsCount: item.studentsCount + 1,
          }
        : item
    )
    update(next)
    setEnrollmentOpen(false)
    toast.success('O‘quvchi kursga muvaffaqiyatli qo‘shildi.')
  }

  const addGroup = (group: CourseGroup) => {
    const next = courses.map((item) =>
      item.id === course.id
        ? {
            ...item,
            groups: [...item.groups, group],
            groupsCount: item.groupsCount + 1,
          }
        : item
    )
    update(next)
    setGroupOpen(false)
    toast.success('Guruh muvaffaqiyatli yaratildi.')
  }

  return (
    <>
      <Header>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>
      <Main>
        <Button
          variant='ghost'
          className='-ms-2 mb-4'
          onClick={() => navigate({ to: '/apps' })}
        >
          <ArrowLeft className='me-2 size-4' /> Kurslarga qaytish
        </Button>
        <div className='flex flex-wrap items-start justify-between gap-4'>
          <div>
            <div className='mb-2 flex items-center gap-2'>
              <p className='text-sm font-medium text-primary'>
                {course.category}
              </p>
              <Badge variant='outline'>
                {course.status === 'active'
                  ? 'Faol'
                  : course.status === 'upcoming'
                    ? 'Boshlanmagan'
                    : course.status === 'completed'
                      ? 'Tugallangan'
                      : 'Arxivlangan'}
              </Badge>
            </div>
            <h1 className='text-3xl font-bold tracking-tight'>{course.name}</h1>
            <p className='mt-1 max-w-2xl text-muted-foreground'>
              {course.description}
            </p>
          </div>
          <div className='flex gap-2'>
            <PermissionGate permission='students.create'>
              <Button onClick={() => setEnrollmentOpen(true)}>
                <Plus className='me-2 size-4' /> O‘quvchi qo‘shish
              </Button>
            </PermissionGate>
            <PermissionGate permission='groups.create'>
              <Button variant='outline' onClick={() => setGroupOpen(true)}>
                <Plus className='me-2 size-4' /> Guruh qo‘shish
              </Button>
            </PermissionGate>
          </div>
        </div>
        <div className='mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <InfoCard
            icon={Users}
            label='O‘quvchilar'
            value={course.studentsCount.toString()}
          />
          <InfoCard
            icon={GraduationCap}
            label='Guruhlar'
            value={course.groupsCount.toString()}
          />
          <InfoCard icon={Clock3} label='Davomiyligi' value={course.duration} />
          <InfoCard
            icon={DollarSign}
            label='Kurs narxi'
            value={formatCurrency(course.price)}
          />
        </div>
        <Tabs defaultValue='overview' className='mt-6'>
          <TabsList className='flex h-auto flex-wrap justify-start gap-1'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='students'>O‘quvchilar</TabsTrigger>
            <TabsTrigger value='groups'>Guruhlar</TabsTrigger>
            <TabsTrigger value='lessons'>Darslar</TabsTrigger>
            <TabsTrigger value='attendance'>Davomat</TabsTrigger>
            <TabsTrigger value='payments'>To‘lovlar</TabsTrigger>
          </TabsList>
          <TabsContent value='overview'>
            <OverviewTab course={course} />
          </TabsContent>
          <TabsContent value='students'>
            <StudentsTab students={course.students} />
          </TabsContent>
          <TabsContent value='groups'>
            <GroupsTab groups={course.groups} />
          </TabsContent>
          <TabsContent value='lessons'>
            <LessonsTab course={course} />
          </TabsContent>
          <TabsContent value='attendance'>
            <AttendanceTab students={course.students} />
          </TabsContent>
          <TabsContent value='payments'>
            <PaymentsTab course={course} />
          </TabsContent>
        </Tabs>
      </Main>
      <EnrollmentDialog
        open={enrollmentOpen}
        onOpenChange={setEnrollmentOpen}
        course={course}
        onSubmit={addEnrollment}
      />
      <GroupDialog
        open={groupOpen}
        onOpenChange={setGroupOpen}
        course={course}
        onSubmit={addGroup}
      />
    </>
  )
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users
  label: string
  value: string
}) {
  return (
    <Card>
      <CardContent className='flex items-center gap-3 p-4'>
        <div className='rounded-lg bg-primary/10 p-2 text-primary'>
          <Icon className='size-5' />
        </div>
        <div>
          <p className='text-xs text-muted-foreground'>{label}</p>
          <p className='font-semibold'>{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function OverviewTab({ course }: { course: Course }) {
  return (
    <div className='mt-4 grid gap-4 lg:grid-cols-2'>
      <Card>
        <CardHeader>
          <CardTitle>Kurs ma’lumotlari</CardTitle>
        </CardHeader>
        <CardContent className='grid gap-4 sm:grid-cols-2'>
          {[
            ['Kategoriya', course.category],
            ['O‘qituvchi', course.teacher],
            ['Davomiyligi', course.duration],
            ['Narxi', formatCurrency(course.price)],
            ['Boshlanish sanasi', course.startDate],
            ['Tugash sanasi', course.endDate],
          ].map(([label, value]) => (
            <div key={label}>
              <p className='text-xs text-muted-foreground'>{label}</p>
              <p className='font-medium'>{value}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Kurs progressi</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <div className='mb-2 flex justify-between text-sm'>
              <span>O‘rtacha progress</span>
              <span className='font-medium'>
                {course.students.length
                  ? Math.round(
                      course.students.reduce(
                        (sum, student) => sum + student.progress,
                        0
                      ) / course.students.length
                    )
                  : 0}
                %
              </span>
            </div>
            <div className='h-2 rounded-full bg-muted'>
              <div
                className='h-2 rounded-full bg-primary'
                style={{
                  width: `${course.students.length ? Math.round(course.students.reduce((sum, student) => sum + student.progress, 0) / course.students.length) : 0}%`,
                }}
              />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-3 text-sm'>
            <div className='rounded-lg border p-3'>
              <p className='text-muted-foreground'>Darslar</p>
              <p className='text-xl font-bold'>{course.lessons.length}</p>
            </div>
            <div className='rounded-lg border p-3'>
              <p className='text-muted-foreground'>Faol guruhlar</p>
              <p className='text-xl font-bold'>
                {
                  course.groups.filter((group) => group.status === 'active')
                    .length
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StudentsTab({ students }: { students: CourseStudent[] }) {
  return (
    <Card className='mt-4'>
      <CardHeader>
        <CardTitle>Kurs o‘quvchilari</CardTitle>
      </CardHeader>
      <CardContent>
        {students.length ? (
          <div className='divide-y'>
            {students.map((student) => (
              <div
                key={student.id}
                className='flex flex-wrap items-center justify-between gap-3 py-3'
              >
                <div>
                  <p className='font-medium'>{student.name}</p>
                  <p className='text-sm text-muted-foreground'>
                    {student.email} · {student.groupName} · {student.teacher}
                  </p>
                </div>
                <div className='flex items-center gap-4 text-sm'>
                  <span>{student.progress}% progress</span>
                  <Badge variant='outline'>
                    {student.paymentStatus === 'paid'
                      ? 'To‘langan'
                      : student.paymentStatus === 'partial'
                        ? 'Qisman to‘langan'
                        : 'To‘lanmagan'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyTab text='Hozircha kursga o‘quvchi biriktirilmagan.' />
        )}
      </CardContent>
    </Card>
  )
}

function GroupsTab({ groups }: { groups: CourseGroup[] }) {
  return (
    <Card className='mt-4'>
      <CardHeader>
        <CardTitle>Kurs guruhlari</CardTitle>
      </CardHeader>
      <CardContent>
        {groups.length ? (
          <div className='grid gap-3 md:grid-cols-2'>
            {groups.map((group) => (
              <div key={group.id} className='rounded-lg border p-4'>
                <div className='flex items-start justify-between'>
                  <div>
                    <p className='font-semibold'>{group.name}</p>
                    <p className='text-sm text-muted-foreground'>
                      {group.teacher}
                    </p>
                  </div>
                  <Badge variant='outline'>
                    {group.status === 'active'
                      ? 'Faol'
                      : group.status === 'upcoming'
                        ? 'Kutilmoqda'
                        : 'Tugagan'}
                  </Badge>
                </div>
                <div className='mt-4 grid grid-cols-2 gap-2 text-sm'>
                  <span>
                    <b>Jadval:</b> {group.schedule}
                  </span>
                  <span>
                    <b>Xona:</b> {group.room}
                  </span>
                  <span>
                    <b>O‘quvchilar:</b> {group.studentsCount}/
                    {group.maxStudents}
                  </span>
                  <span>
                    <b>Sana:</b> {group.startDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyTab text='Hozircha guruhlar mavjud emas.' />
        )}
      </CardContent>
    </Card>
  )
}

function LessonsTab({ course }: { course: Course }) {
  return (
    <Card className='mt-4'>
      <CardHeader>
        <CardTitle>Darslar</CardTitle>
      </CardHeader>
      <CardContent>
        {course.lessons.length ? (
          <div className='divide-y'>
            {course.lessons.map((lesson) => (
              <div
                key={lesson.id}
                className='flex flex-wrap items-center justify-between gap-3 py-3'
              >
                <div>
                  <p className='font-medium'>{lesson.title}</p>
                  <p className='text-sm text-muted-foreground'>
                    {lesson.date} · {lesson.startTime}-{lesson.endTime} ·{' '}
                    {lesson.group}
                  </p>
                </div>
                <Badge variant='outline'>
                  {lesson.status === 'completed'
                    ? 'Tugallangan'
                    : lesson.status === 'upcoming'
                      ? 'Kutilmoqda'
                      : 'Bekor qilingan'}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <EmptyTab text='Hozircha darslar rejalashtirilmagan.' />
        )}
      </CardContent>
    </Card>
  )
}

function AttendanceTab({ students }: { students: CourseStudent[] }) {
  return (
    <Card className='mt-4'>
      <CardHeader>
        <CardTitle>Davomat</CardTitle>
      </CardHeader>
      <CardContent>
        {students.length ? (
          <div className='divide-y'>
            {students.map((student) => (
              <div
                key={student.id}
                className='flex items-center justify-between py-3'
              >
                <div>
                  <p className='font-medium'>{student.name}</p>
                  <p className='text-sm text-muted-foreground'>Bugungi holat</p>
                </div>
                <div className='flex items-center gap-2'>
                  <CheckCircle2 className='size-4 text-emerald-600' />
                  <span className='font-semibold'>{student.attendance}%</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyTab text='Davomat ma’lumotlari mavjud emas.' />
        )}
      </CardContent>
    </Card>
  )
}

function PaymentsTab({ course }: { course: Course }) {
  return (
    <Card className='mt-4'>
      <CardHeader>
        <CardTitle>To‘lovlar</CardTitle>
      </CardHeader>
      <CardContent>
        {course.students.length ? (
          <div className='divide-y'>
            {course.students.map((student) => {
              const remaining = Math.max(course.price - student.paidAmount, 0)
              return (
                <div
                  key={student.id}
                  className='flex flex-wrap items-center justify-between gap-3 py-3'
                >
                  <div>
                    <p className='font-medium'>{student.name}</p>
                    <p className='text-sm text-muted-foreground'>
                      Oxirgi to‘lov: {student.lastPaymentDate}
                    </p>
                  </div>
                  <div className='text-end text-sm'>
                    <p>To‘langan: {formatCurrency(student.paidAmount)}</p>
                    <p className='text-muted-foreground'>
                      Qoldiq: {formatCurrency(remaining)}
                    </p>
                  </div>
                  <Badge variant='outline'>
                    {student.paymentStatus === 'paid'
                      ? 'To‘langan'
                      : student.paymentStatus === 'partial'
                        ? 'Qisman'
                        : 'To‘lanmagan'}
                  </Badge>
                </div>
              )
            })}
          </div>
        ) : (
          <EmptyTab text='To‘lov ma’lumotlari mavjud emas.' />
        )}
      </CardContent>
    </Card>
  )
}

function EmptyTab({ text }: { text: string }) {
  return (
    <div className='py-12 text-center text-sm text-muted-foreground'>
      {text}
    </div>
  )
}

function EnrollmentDialog({
  open,
  onOpenChange,
  course,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (value: boolean) => void
  course: Course
  onSubmit: (student: CourseStudent) => void
}) {
  const [name, setName] = useState('')
  const [groupId, setGroupId] = useState(course.groups[0]?.id || '')
  const [note, setNote] = useState('')
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim() || !groupId) {
      toast.error('O‘quvchi va guruhni tanlang.')
      return
    }
    const group =
      course.groups.find((item) => item.id === groupId) || course.groups[0]
    onSubmit({
      id: `student-${Date.now()}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      groupId: group?.id || 'new',
      groupName: group?.name || 'Yangi guruh',
      teacher: group?.teacher || course.teacher,
      enrollmentDate: new Date().toISOString().slice(0, 10),
      startDate: course.startDate,
      paymentStatus: 'unpaid',
      progress: 0,
      status: 'active',
      paidAmount: 0,
      lastPaymentDate: '-',
      attendance: 100,
    })
    setName('')
    setNote('')
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>O‘quvchini kursga qo‘shish</DialogTitle>
          <DialogDescription>
            {course.name} kursiga yangi enrollment yarating.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='grid gap-4'>
          <div className='grid gap-2'>
            <Label>O‘quvchini qidirish</Label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder='Ali Valiyev'
            />
          </div>
          <div className='grid gap-2'>
            <Label>Guruh</Label>
            <Select value={groupId} onValueChange={setGroupId}>
              <SelectTrigger>
                <SelectValue placeholder='Guruhni tanlang' />
              </SelectTrigger>
              <SelectContent>
                {course.groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name} · {group.teacher}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='grid gap-2'>
            <Label>Izoh</Label>
            <Textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder='Qo‘shimcha izoh...'
            />
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Bekor qilish
            </Button>
            <Button type='submit'>Qo‘shish</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function GroupDialog({
  open,
  onOpenChange,
  course,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (value: boolean) => void
  course: Course
  onSubmit: (group: CourseGroup) => void
}) {
  const [name, setName] = useState('')
  const [teacher, setTeacher] = useState(course.teacher)
  const [schedule, setSchedule] = useState('Du-Chor-Ju 18:00')
  const [room, setRoom] = useState('204')
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) {
      toast.error('Guruh nomini kiriting.')
      return
    }
    onSubmit({
      id: `group-${Date.now()}`,
      name,
      teacher,
      schedule,
      room,
      startDate: course.startDate,
      endDate: course.endDate,
      studentsCount: 0,
      maxStudents: 15,
      status: 'upcoming',
    })
    setName('')
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yangi guruh qo‘shish</DialogTitle>
          <DialogDescription>
            {course.name} kursi uchun guruh yarating.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='grid gap-4'>
          <div className='grid gap-2'>
            <Label>Guruh nomi</Label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder='FR-04'
            />
          </div>
          <div className='grid gap-2'>
            <Label>O‘qituvchi</Label>
            <Input
              value={teacher}
              onChange={(event) => setTeacher(event.target.value)}
            />
          </div>
          <div className='grid gap-2'>
            <Label>Jadval</Label>
            <Input
              value={schedule}
              onChange={(event) => setSchedule(event.target.value)}
            />
          </div>
          <div className='grid gap-2'>
            <Label>Xona</Label>
            <Input
              value={room}
              onChange={(event) => setRoom(event.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Bekor qilish
            </Button>
            <Button type='submit'>Guruh yaratish</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
