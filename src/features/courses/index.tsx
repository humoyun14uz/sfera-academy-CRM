import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Archive,
  ArrowDownAZ,
  ArrowUpAZ,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Edit3,
  Grid2X2,
  List,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { can } from '@/lib/rbac'
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
import { Textarea } from '@/components/ui/textarea'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { PermissionGate } from '@/components/permission-gate'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search as GlobalSearch } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useLanguage } from '@/context/language-provider'
import {
  categories,
  formatCurrency,
  loadCourses,
  saveCourses,
  statusLabel,
  teachers,
  type Course,
  type CourseStatus,
} from './data'

type ViewMode = 'grid' | 'table'
type CourseForm = Pick<
  Course,
  | 'name'
  | 'category'
  | 'description'
  | 'duration'
  | 'price'
  | 'teacher'
  | 'startDate'
  | 'endDate'
  | 'status'
>

const emptyForm: CourseForm = {
  name: '',
  category: 'Dasturlash',
  description: '',
  duration: '3 oy',
  price: 0,
  teacher: teachers[0],
  startDate: '',
  endDate: '',
  status: 'upcoming',
}

const statusColors: Record<CourseStatus, string> = {
  active:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
  upcoming:
    'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300',
  completed:
    'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-300',
  archived:
    'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300',
}

function makeId(name: string) {
  return `${name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')}-${Date.now()}`
}

export function Courses() {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const english = language === 'en'
  const { auth } = useAuthStore()
  const [courses, setCourses] = useState<Course[]>(() => loadCourses())
  const [searchTerm, setSearchTerm] = useState('')
  const [status, setStatus] = useState<'all' | CourseStatus>('all')
  const [category, setCategory] = useState('all')
  const [teacher, setTeacher] = useState('all')
  const [sort, setSort] = useState<'asc' | 'desc'>('asc')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null)
  const [form, setForm] = useState<CourseForm>(emptyForm)

  const filteredCourses = useMemo(
    () =>
      courses
        .filter(
          (course) =>
            !searchTerm ||
            `${course.name} ${course.category} ${course.teacher}`
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
        .filter((course) => status === 'all' || course.status === status)
        .filter((course) => category === 'all' || course.category === category)
        .filter((course) => teacher === 'all' || course.teacher === teacher)
        .sort((a, b) =>
          sort === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
        ),
    [courses, searchTerm, status, category, teacher, sort]
  )

  const stats = useMemo(
    () => ({
      total: courses.filter((course) => course.status !== 'archived').length,
      active: courses.filter((course) => course.status === 'active').length,
      students: courses.reduce((sum, course) => sum + course.studentsCount, 0),
      groups: courses.reduce((sum, course) => sum + course.groupsCount, 0),
    }),
    [courses]
  )

  const updateCourses = (next: Course[]) => {
    setCourses(next)
    saveCourses(next)
  }

  const openCreate = () => {
    setEditingCourse(null)
    setForm(emptyForm)
    setIsFormOpen(true)
  }

  const openEdit = (course: Course) => {
    setEditingCourse(course)
    setForm({
      name: course.name,
      category: course.category,
      description: course.description,
      duration: course.duration,
      price: course.price,
      teacher: course.teacher,
      startDate: course.startDate,
      endDate: course.endDate,
      status: course.status,
    })
    setIsFormOpen(true)
  }

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (
      !form.name.trim() ||
      !form.category ||
      !form.startDate ||
      !form.endDate
    ) {
      toast.error(
        english
          ? 'Course name, category, start date, and end date are required.'
          : 'Kurs nomi, kategoriya, boshlanish va tugash sanasi majburiy.'
      )
      return
    }
    if (editingCourse) {
      updateCourses(
        courses.map((course) =>
          course.id === editingCourse.id ? { ...course, ...form } : course
        )
      )
      toast.success(english ? 'Course updated successfully.' : 'Kurs muvaffaqiyatli yangilandi.')
    } else {
      const next: Course = {
        ...form,
        id: makeId(form.name),
        studentsCount: 0,
        groupsCount: 0,
        students: [],
        groups: [],
        lessons: [],
      }
      updateCourses([next, ...courses])
      toast.success(english ? 'Course created successfully.' : 'Kurs muvaffaqiyatli yaratildi.')
    }
    setIsFormOpen(false)
  }

  const handleDelete = (course: Course) => {
    if (course.studentsCount > 0 || course.groupsCount > 0) {
      toast.warning(
        english
          ? 'This course has students or groups. We recommend archiving it.'
          : 'Bu kursda o‘quvchilar yoki guruhlar mavjud. Kursni arxivlashni tavsiya qilamiz.'
      )
      return
    }
    setDeletingCourse(course)
  }

  const handleArchive = (course: Course) => {
    updateCourses(
      courses.map((item) =>
        item.id === course.id ? { ...item, status: 'archived' } : item
      )
    )
    toast.success(english ? 'Course archived.' : 'Kurs arxivlandi.')
  }

  const setField = <K extends keyof CourseForm>(key: K, value: CourseForm[K]) =>
    setForm((current) => ({ ...current, [key]: value }))
  const canCreate = can(auth.user?.role, 'courses.create')
  const canEdit = can(auth.user?.role, 'courses.update')
  const canDelete = can(auth.user?.role, 'courses.deactivate')

  return (
    <>
      <Header>
        <GlobalSearch className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>
      <Main>
        <div className='flex flex-wrap items-start justify-between gap-4'>
          <div>
            <p className='text-sm font-medium text-primary'>
              SFERA IT Academy CRM
            </p>
            <h1 className='text-2xl font-bold tracking-tight'>
              {english ? 'Courses' : 'Kurslar'}
            </h1>
            <p className='text-muted-foreground'>
              {english
                ? 'Manage academy courses and enroll students.'
                : 'Academy kurslarini boshqarish va o‘quvchilarni kurslarga biriktirish.'}
            </p>
          </div>
          <PermissionGate permission='courses.create'>
            <Button onClick={openCreate}>
              <Plus className='me-2 size-4' />
              {english ? 'Add course' : 'Kurs qo‘shish'}
            </Button>
          </PermissionGate>
        </div>

        <div className='mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          <StatCard
            icon={BookOpen}
            label={english ? 'Total courses' : 'Jami kurslar'}
            value={stats.total}
          />
          <StatCard
            icon={CheckCircle2}
            label={english ? 'Active courses' : 'Faol kurslar'}
            value={stats.active}
            accent='text-emerald-600'
          />
          <StatCard
            icon={Users}
            label={english ? 'Total students' : 'Jami o‘quvchilar'}
            value={stats.students}
            accent='text-blue-600'
          />
          <StatCard
            icon={CalendarDays}
            label={english ? 'Total groups' : 'Jami guruhlar'}
            value={stats.groups}
            accent='text-violet-600'
          />
        </div>

        <Card className='mt-6'>
          <CardContent className='flex flex-col gap-3 p-4 lg:flex-row lg:items-center'>
            <div className='relative min-w-56 flex-1'>
              <Search className='absolute start-3 top-2.5 size-4 text-muted-foreground' />
              <Input
                value={searchTerm}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(event.target.value)
                }
                placeholder={english ? 'Search courses...' : 'Kurs qidirish...'}
                className='ps-9'
              />
            </div>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as typeof status)}
            >
              <SelectTrigger className='w-full lg:w-40'>
                <SelectValue placeholder={english ? 'Status' : 'Holati'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>{english ? 'All statuses' : 'Barcha statuslar'}</SelectItem>
                <SelectItem value='active'>{english ? 'Active' : 'Faol'}</SelectItem>
                <SelectItem value='upcoming'>{english ? 'Upcoming' : 'Boshlanmagan'}</SelectItem>
                <SelectItem value='completed'>{english ? 'Completed' : 'Tugallangan'}</SelectItem>
                <SelectItem value='archived'>{english ? 'Archived' : 'Arxivlangan'}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className='w-full lg:w-40'>
                <SelectValue placeholder={english ? 'Category' : 'Kategoriya'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>{english ? 'All categories' : 'Barcha kategoriyalar'}</SelectItem>
                {categories.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={teacher} onValueChange={setTeacher}>
              <SelectTrigger className='w-full lg:w-44'>
                <SelectValue placeholder={english ? 'Teacher' : 'O‘qituvchi'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>{english ? 'All teachers' : 'Barcha o‘qituvchilar'}</SelectItem>
                {teachers.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant='outline'
              size='icon'
              onClick={() => setSort(sort === 'asc' ? 'desc' : 'asc')}
              title='Saralash'
            >
              {sort === 'asc' ? (
                <ArrowUpAZ className='size-4' />
              ) : (
                <ArrowDownAZ className='size-4' />
              )}
            </Button>
            <div className='flex rounded-md border p-1'>
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size='icon'
                onClick={() => setViewMode('grid')}
                title='Grid view'
              >
                <Grid2X2 className='size-4' />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                size='icon'
                onClick={() => setViewMode('table')}
                title='Table view'
              >
                <List className='size-4' />
              </Button>
            </div>
          </CardContent>
        </Card>

        {filteredCourses.length === 0 ? (
          <EmptyCourses onCreate={openCreate} canCreate={canCreate} english={english} />
        ) : viewMode === 'grid' ? (
          <div className='mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                english={english}
                onOpen={() =>
                  navigate({
                    to: '/apps/$courseId',
                    params: { courseId: course.id },
                  })
                }
                onEdit={canEdit ? () => openEdit(course) : undefined}
                onArchive={canDelete ? () => handleArchive(course) : undefined}
                onDelete={canDelete ? () => handleDelete(course) : undefined}
              />
            ))}
          </div>
        ) : (
          <CourseTable
            courses={filteredCourses}
            onOpen={(course) =>
              navigate({
                to: '/apps/$courseId',
                params: { courseId: course.id },
              })
            }
            onEdit={canEdit ? openEdit : undefined}
            onArchive={canDelete ? handleArchive : undefined}
            onDelete={canDelete ? handleDelete : undefined}
          />
        )}
      </Main>

      <Dialog
        open={!!deletingCourse}
        onOpenChange={(open) => !open && setDeletingCourse(null)}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>
              {english ? 'Delete course?' : 'Kursni o‘chirish?'}
            </DialogTitle>
            <DialogDescription>
              {english
                ? `Are you sure you want to delete “${deletingCourse?.name}”? This action cannot be undone.`
                : `“${deletingCourse?.name}” kursini o‘chirmoqchimisiz? Bu amalni ortga qaytarib bo‘lmaydi.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeletingCourse(null)}>
              {english ? 'Cancel' : 'Bekor qilish'}
            </Button>
            <Button
              variant='destructive'
              onClick={() => {
                if (!deletingCourse) return
                updateCourses(courses.filter((item) => item.id !== deletingCourse.id))
                setDeletingCourse(null)
                toast.success(english ? 'Course deleted.' : 'Kurs o‘chirildi.')
              }}
            >
              {english ? 'Delete' : 'O‘chirish'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CourseFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        editingCourse={editingCourse}
        english={english}
        form={form}
        setField={setField}
        onSubmit={handleFormSubmit}
      />
    </>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent = 'text-primary',
}: {
  icon: typeof BookOpen
  label: string
  value: number
  accent?: string
}) {
  return (
    <Card>
      <CardContent className='flex items-center justify-between p-5'>
        <div>
          <p className='text-sm text-muted-foreground'>{label}</p>
          <p className='mt-2 text-2xl font-bold'>
            {value.toLocaleString('uz-UZ')}
          </p>
        </div>
        <div className={`rounded-lg bg-muted p-3 ${accent}`}>
          <Icon className='size-5' />
        </div>
      </CardContent>
    </Card>
  )
}

function CourseCard({
  course,
  english,
  onOpen,
  onEdit,
  onArchive,
  onDelete,
}: {
  course: Course
  english: boolean
  onOpen: () => void
  onEdit?: () => void
  onArchive?: () => void
  onDelete?: () => void
}) {
  const englishDescriptions: Record<string, string> = {
    'frontend-development': 'Build modern web applications with React and TypeScript.',
    'python-pro': 'Backend development with Python, FastAPI, and databases.',
    'java-backend': 'Professional backend development with Java and Spring Boot.',
    'ai-automation': 'Learn artificial intelligence, automation, and modern AI tools.',
    foundation: 'Introduction to programming, algorithms, and technical thinking.',
    'ui-ux-design': 'Figma, user research, and product design fundamentals.',
  }
  const englishCategory = course.category === 'Dasturlash' ? 'Programming' : course.category === 'Dizayn' ? 'Design' : course.category
  const englishDuration = course.duration.replace(' oy', ' months')
  return (
    <Card
      className='group cursor-pointer transition-shadow hover:shadow-md'
      onClick={onOpen}
    >
      <CardHeader className='flex-row items-start justify-between gap-3'>
        <div className='flex items-center gap-3'>
          <div className='flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary'>
            <BookOpen className='size-5' />
          </div>
          <div>
            <CardTitle className='text-base'>{course.name}</CardTitle>
            <p className='text-xs text-muted-foreground'>
              {english ? englishCategory : course.category}
            </p>
          </div>
        </div>
        <Badge variant='outline' className={statusColors[course.status]}>
          {english
            ? ({
                active: 'Active',
                upcoming: 'Upcoming',
                completed: 'Completed',
                archived: 'Archived',
              }[course.status] ?? course.status)
            : statusLabel(course.status)}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className='line-clamp-2 min-h-10 text-sm text-muted-foreground'>
          {english ? englishDescriptions[course.id] : course.description}
        </p>
        <div className='mt-4 grid grid-cols-2 gap-3 text-sm'>
          <div>
            <p className='text-xs text-muted-foreground'>
              {english ? 'Teacher' : 'O‘qituvchi'}
            </p>
            <p className='truncate font-medium'>{course.teacher}</p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>
              {english ? 'Duration' : 'Davomiyligi'}
            </p>
            <p className='font-medium'>
              {english ? englishDuration : course.duration}
            </p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>
              {english ? 'Students' : 'O‘quvchilar'}
            </p>
            <p className='font-medium'>{course.studentsCount}</p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>
              {english ? 'Groups' : 'Guruhlar'}
            </p>
            <p className='font-medium'>{course.groupsCount}</p>
          </div>
        </div>
        <div className='mt-4 flex items-center justify-between border-t pt-4'>
          <span className='font-semibold'>
            {english
              ? `${new Intl.NumberFormat('en-US').format(course.price)} UZS`
              : formatCurrency(course.price)}
          </span>
          <div
            className='flex gap-1 opacity-0 transition-opacity group-hover:opacity-100'
            onClick={(event) => event.stopPropagation()}
          >
            {onEdit && (
              <Button
                variant='ghost'
                size='icon'
                onClick={onEdit}
                title='Tahrirlash'
              >
                <Edit3 className='size-4' />
              </Button>
            )}
            {onArchive && (
              <Button
                variant='ghost'
                size='icon'
                onClick={onArchive}
                title='Arxivlash'
              >
                <Archive className='size-4' />
              </Button>
            )}
            {onDelete && (
              <Button
                variant='ghost'
                size='icon'
                onClick={onDelete}
                title='O‘chirish'
              >
                <Trash2 className='size-4 text-destructive' />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CourseTable({
  courses,
  onOpen,
  onEdit,
  onArchive,
  onDelete,
}: {
  courses: Course[]
  onOpen: (course: Course) => void
  onEdit?: (course: Course) => void
  onArchive?: (course: Course) => void
  onDelete?: (course: Course) => void
}) {
  return (
    <Card className='mt-6 overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full min-w-225 text-sm'>
          <thead className='border-b bg-muted/40 text-left'>
            <tr>
              {[
                'Kurs',
                'Kategoriya',
                'O‘qituvchi',
                'Guruhlar',
                'O‘quvchilar',
                'Narx',
                'Boshlanish',
                'Status',
                'Amallar',
              ].map((heading) => (
                <th key={heading} className='px-4 py-3 font-medium'>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr
                key={course.id}
                className='cursor-pointer border-b last:border-0 hover:bg-muted/30'
                onClick={() => onOpen(course)}
              >
                <td className='px-4 py-3 font-medium'>{course.name}</td>
                <td className='px-4 py-3'>{course.category}</td>
                <td className='px-4 py-3'>{course.teacher}</td>
                <td className='px-4 py-3'>{course.groupsCount}</td>
                <td className='px-4 py-3'>{course.studentsCount}</td>
                <td className='px-4 py-3'>{formatCurrency(course.price)}</td>
                <td className='px-4 py-3'>{course.startDate}</td>
                <td className='px-4 py-3'>
                  <Badge
                    variant='outline'
                    className={statusColors[course.status]}
                  >
                    {statusLabel(course.status)}
                  </Badge>
                </td>
                <td
                  className='px-4 py-3'
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className='flex gap-1'>
                    {onEdit && (
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => onEdit(course)}
                      >
                        <Edit3 className='size-4' />
                      </Button>
                    )}
                    {onArchive && (
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => onArchive(course)}
                      >
                        <Archive className='size-4' />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => onDelete(course)}
                      >
                        <Trash2 className='size-4 text-destructive' />
                      </Button>
                    )}
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => onOpen(course)}
                    >
                      <MoreHorizontal className='size-4' />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function EmptyCourses({
  onCreate,
  canCreate,
  english,
}: {
  onCreate: () => void
  canCreate: boolean
  english: boolean
}) {
  return (
    <Card className='mt-6'>
      <CardContent className='flex min-h-64 flex-col items-center justify-center gap-3 text-center'>
        <BookOpen className='size-10 text-muted-foreground' />
        <h2 className='text-lg font-semibold'>
          {english ? 'No courses found' : 'Hozircha kurslar mavjud emas'}
        </h2>
        <p className='text-sm text-muted-foreground'>
          {english
            ? 'Change the filters or add the first course.'
            : 'Filtrlarni o‘zgartiring yoki birinchi kursni qo‘shing.'}
        </p>
        {canCreate && (
          <Button onClick={onCreate}>
            <Plus className='me-2 size-4' />
            {english ? 'Add the first course' : 'Birinchi kursni qo‘shish'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

function CourseFormDialog({
  open,
  onOpenChange,
  editingCourse,
  english,
  form,
  setField,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingCourse: Course | null
  english: boolean
  form: CourseForm
  setField: <K extends keyof CourseForm>(key: K, value: CourseForm[K]) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>
            {editingCourse
              ? english ? 'Edit course' : 'Kursni tahrirlash'
              : english ? 'Add new course' : 'Yangi kurs qo‘shish'}
          </DialogTitle>
          <DialogDescription>
            {english
              ? 'Enter course details. Fields marked with an asterisk are required.'
              : 'Kurs ma’lumotlarini kiriting. Yulduzcha bilan belgilangan maydonlar majburiy.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className='grid gap-4 py-2 sm:grid-cols-2'>
          <div className='grid gap-2 sm:col-span-2'>
            <Label htmlFor='course-name'>{english ? 'Course name' : 'Kurs nomi'} *</Label>
            <Input
              id='course-name'
              value={form.name}
              onChange={(event) => setField('name', event.target.value)}
              placeholder='Frontend Development'
            />
          </div>
          <div className='grid gap-2'>
            <Label>{english ? 'Category' : 'Kategoriya'} *</Label>
            <Select
              value={form.category}
              onValueChange={(value) => setField('category', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='grid gap-2'>
            <Label>{english ? 'Teacher' : 'O‘qituvchi'}</Label>
            <Select
              value={form.teacher}
              onValueChange={(value) => setField('teacher', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='grid gap-2'>
            <Label>{english ? 'Duration' : 'Davomiyligi'}</Label>
            <Input
              value={form.duration}
              onChange={(event) => setField('duration', event.target.value)}
              placeholder='4 oy'
            />
          </div>
          <div className='grid gap-2'>
            <Label>{english ? 'Price (UZS)' : 'Narxi (so‘m)'}</Label>
            <Input
              type='number'
              min='0'
              value={form.price}
              onChange={(event) =>
                setField('price', Number(event.target.value))
              }
            />
          </div>
          <div className='grid gap-2'>
            <Label>{english ? 'Start date' : 'Boshlanish sanasi'} *</Label>
            <Input
              type='date'
              value={form.startDate}
              onChange={(event) => setField('startDate', event.target.value)}
            />
          </div>
          <div className='grid gap-2'>
            <Label>{english ? 'End date' : 'Tugash sanasi'} *</Label>
            <Input
              type='date'
              value={form.endDate}
              onChange={(event) => setField('endDate', event.target.value)}
            />
          </div>
          <div className='grid gap-2'>
            <Label>{english ? 'Status' : 'Holat'}</Label>
            <Select
              value={form.status}
              onValueChange={(value) =>
                setField('status', value as CourseStatus)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='active'>{english ? 'Active' : 'Faol'}</SelectItem>
                <SelectItem value='upcoming'>{english ? 'Upcoming' : 'Boshlanmagan'}</SelectItem>
                <SelectItem value='completed'>{english ? 'Completed' : 'Tugallangan'}</SelectItem>
                <SelectItem value='archived'>{english ? 'Archived' : 'Arxivlangan'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='grid gap-2 sm:col-span-2'>
            <Label htmlFor='course-description'>{english ? 'Short description' : 'Qisqa tavsif'}</Label>
            <Textarea
              id='course-description'
              value={form.description}
              onChange={(event) => setField('description', event.target.value)}
              placeholder={english ? 'Brief course description...' : 'Kurs haqida qisqacha ma’lumot...'}
            />
          </div>
          <DialogFooter className='sm:col-span-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              {english ? 'Cancel' : 'Bekor qilish'}
            </Button>
            <Button type='submit'>
              {editingCourse ? (english ? 'Save' : 'Saqlash') : english ? 'Create course' : 'Kurs yaratish'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
