import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  Plus,
  Trash2,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { can } from '@/lib/rbac'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  loadCourses,
  saveCourses,
  type Course,
  type CourseStudent,
} from '@/features/courses/data'

export function Users() {
  const { language } = useLanguage()
  const english = language === 'en'
  const { auth } = useAuthStore()
  const canDeleteStudent = can(auth.user?.role, 'students.deactivate')
  const [courses, setCourses] = useState(() => loadCourses())
  const academyCourses = useMemo(
    () => courses.filter((course) => course.category === 'Dasturlash'),
    [courses]
  )
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [studentStates, setStudentStates] = useState<Record<string, boolean>>(
    {}
  )
  const [addOpen, setAddOpen] = useState(false)
  const [newStudent, setNewStudent] = useState({ name: '', phone: '' })
  const [studentToDelete, setStudentToDelete] = useState<CourseStudent | null>(
    null
  )

  const selectedStudents = selectedCourse?.students ?? []
  const activeCount = selectedStudents.filter(
    (student) =>
      studentStates[`${selectedCourse?.id}-${student.id}`] ??
      student.status === 'active'
  ).length

  const openCourse = (course: Course) => {
    setSelectedCourse(course)
    setStudentStates({})
  }

  const getActive = (student: CourseStudent) =>
    studentStates[`${selectedCourse?.id}-${student.id}`] ??
    student.status === 'active'

  const toggleStudent = (student: CourseStudent) => {
    if (!selectedCourse) return
    const next = !getActive(student)
    setStudentStates((state) => ({
      ...state,
      [`${selectedCourse.id}-${student.id}`]: next,
    }))
    toast.success(
      next
        ? english
          ? 'Student marked active.'
          : 'O‘quvchi faol deb belgilandi.'
        : english
          ? 'Student marked inactive.'
          : 'O‘quvchi faol emas deb belgilandi.'
    )
  }

  const addStudent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (
      !selectedCourse ||
      !newStudent.name.trim() ||
      !newStudent.phone.trim()
    ) {
      toast.error(
        english
          ? 'Full name and phone number are required.'
          : 'Ism familiya va telefon raqamini kiriting.'
      )
      return
    }

    const student: CourseStudent = {
      id: `student-${Date.now()}`,
      name: newStudent.name.trim(),
      email: `${newStudent.name.trim().toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: newStudent.phone.trim(),
      groupId: selectedCourse.groups[0]?.id ?? 'fr-new',
      groupName: selectedCourse.groups[0]?.name ?? 'Yangi guruh',
      teacher: selectedCourse.teacher,
      enrollmentDate: new Date().toISOString().slice(0, 10),
      startDate: selectedCourse.startDate,
      paymentStatus: 'unpaid',
      progress: 0,
      status: 'active',
      paidAmount: 0,
      lastPaymentDate: '',
      attendance: 0,
    }
    const updatedCourse = {
      ...selectedCourse,
      students: [...selectedCourse.students, student],
      studentsCount: selectedCourse.studentsCount + 1,
    }
    const updatedCourses = courses.map((course) =>
      course.id === updatedCourse.id ? updatedCourse : course
    )
    setCourses(updatedCourses)
    setSelectedCourse(updatedCourse)
    saveCourses(updatedCourses)
    setNewStudent({ name: '', phone: '' })
    setAddOpen(false)
    toast.success(english ? 'Student added.' : 'O‘quvchi qo‘shildi.')
  }

  const deleteStudent = (student: CourseStudent) => {
    if (!selectedCourse || !canDeleteStudent) return
    setStudentToDelete(student)
  }

  const confirmDeleteStudent = () => {
    if (!selectedCourse || !studentToDelete || !canDeleteStudent) return
    const student = studentToDelete
    const updatedCourse = {
      ...selectedCourse,
      students: selectedCourse.students.filter(
        (item) => item.id !== student.id
      ),
      studentsCount: Math.max(0, selectedCourse.studentsCount - 1),
    }
    const updatedCourses = courses.map((course) =>
      course.id === updatedCourse.id ? updatedCourse : course
    )
    setCourses(updatedCourses)
    setSelectedCourse(updatedCourse)
    saveCourses(updatedCourses)
    setStudentToDelete(null)
    toast.success(english ? 'Student deleted.' : 'O‘quvchi o‘chirildi.')
  }

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>
      <Main className='flex flex-1 flex-col gap-6'>
        <div>
          <h1 className='text-2xl font-bold'>
            {english ? 'Students' : 'O‘quvchilar'}
          </h1>
          <p className='text-muted-foreground'>
            {english
              ? 'Choose a course to view all enrolled students and their activity.'
              : 'Barcha o‘quvchilar va ularning faoliyatini ko‘rish uchun kursni tanlang.'}
          </p>
        </div>

        {!selectedCourse ? (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {academyCourses.map((course) => {
              const active = course.students.filter(
                (student) => student.status === 'active'
              ).length
              const total = course.studentsCount
              return (
                <Card
                  key={course.id}
                  className='cursor-pointer transition-shadow hover:shadow-md'
                  onClick={() => openCourse(course)}
                >
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <GraduationCap className='size-5 text-primary' />
                      {course.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='grid grid-cols-3 gap-2 text-center text-sm'>
                      <div>
                        <p className='text-2xl font-bold'>{total}</p>
                        <p className='text-muted-foreground'>
                          {english ? 'Total' : 'Jami'}
                        </p>
                      </div>
                      <div>
                        <p className='text-2xl font-bold text-emerald-600'>
                          {active}
                        </p>
                        <p className='text-muted-foreground'>
                          {english ? 'Active' : 'Faol'}
                        </p>
                      </div>
                      <div>
                        <p className='text-2xl font-bold text-muted-foreground'>
                          {Math.max(0, total - active)}
                        </p>
                        <p className='text-muted-foreground'>
                          {english ? 'Inactive' : 'Faol emas'}
                        </p>
                      </div>
                    </div>
                    <p className='mt-4 text-sm text-muted-foreground'>
                      {course.teacher} · {course.duration}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className='space-y-4'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <Button variant='outline' onClick={() => setSelectedCourse(null)}>
                <ArrowLeft className='me-2 size-4' />
                {english ? 'Back to courses' : 'Kurslarga qaytish'}
              </Button>
              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className='me-2 size-4' />
                    {english ? 'Add student' : 'O‘quvchi qo‘shish'}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {english
                        ? 'Add student to the course'
                        : 'Kursga o‘quvchi qo‘shish'}
                    </DialogTitle>
                  </DialogHeader>
                  <form className='space-y-4' onSubmit={addStudent}>
                    <div className='space-y-2'>
                      <Label htmlFor='student-name'>
                        {english ? 'Full name' : 'Ism familiya'}
                      </Label>
                      <Input
                        id='student-name'
                        value={newStudent.name}
                        onChange={(event) =>
                          setNewStudent({
                            ...newStudent,
                            name: event.target.value,
                          })
                        }
                        placeholder={
                          english
                            ? 'Student full name'
                            : 'O‘quvchi ism familiyasi'
                        }
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='student-phone'>
                        {english ? 'Phone number' : 'Telefon raqami'}
                      </Label>
                      <Input
                        id='student-phone'
                        type='tel'
                        inputMode='tel'
                        value={newStudent.phone}
                        onChange={(event) => {
                          const value = event.target.value
                            .replace(/[^\d+()\s-]/g, '')
                            .replace(/(?!^)\+/g, '')
                          setNewStudent({ ...newStudent, phone: value })
                        }}
                        placeholder='+998 90 123 45 67'
                      />
                    </div>
                    <DialogFooter>
                      <Button type='submit'>
                        {english ? 'Save student' : 'Saqlash'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{selectedCourse.name}</CardTitle>
                <p className='text-sm text-muted-foreground'>
                  {selectedCourse.teacher} · {selectedCourse.duration}
                </p>
              </CardHeader>
              <CardContent className='space-y-5'>
                <div className='grid gap-3 sm:grid-cols-3'>
                  <div className='rounded-lg border p-3'>
                    <p className='text-2xl font-bold'>
                      {selectedCourse.studentsCount}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      {english ? 'Total students' : 'Jami o‘quvchilar'}
                    </p>
                  </div>
                  <div className='rounded-lg border p-3'>
                    <p className='text-2xl font-bold text-emerald-600'>
                      {activeCount}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      {english ? 'Active' : 'Faol'}
                    </p>
                  </div>
                  <div className='rounded-lg border p-3'>
                    <p className='text-2xl font-bold text-muted-foreground'>
                      {Math.max(0, selectedCourse.studentsCount - activeCount)}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      {english ? 'Inactive' : 'Faol emas'}
                    </p>
                  </div>
                </div>

                <div className='overflow-x-auto rounded-lg border'>
                  <div className='grid min-w-[760px] grid-cols-[1.3fr_1fr_0.8fr_0.7fr_0.6fr] gap-3 border-b bg-muted/40 px-4 py-3 text-sm font-semibold'>
                    <span>{english ? 'Full name' : 'Ism familiya'}</span>
                    <span>{english ? 'Phone number' : 'Telefon raqami'}</span>
                    <span>{english ? 'Group' : 'Guruh'}</span>
                    <span>{english ? 'Status' : 'Holati'}</span>
                    <span>{english ? 'Actions' : 'Amallar'}</span>
                  </div>
                  <div className='min-w-[760px] divide-y'>
                    {selectedStudents.map((student) => {
                      const active = getActive(student)
                      return (
                        <div
                          key={student.id}
                          className='grid grid-cols-[1.3fr_1fr_0.8fr_0.7fr_0.6fr] items-center gap-3 px-4 py-3 text-sm'
                        >
                          <span className='font-medium'>{student.name}</span>
                          <span className='text-muted-foreground'>
                            {student.phone ?? '—'}
                          </span>
                          <span>{student.groupName}</span>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='justify-start px-0'
                            onClick={() => toggleStudent(student)}
                          >
                            {active ? (
                              <CheckCircle2 className='me-2 size-4 text-emerald-600' />
                            ) : (
                              <XCircle className='me-2 size-4 text-muted-foreground' />
                            )}
                            {active
                              ? english
                                ? 'Active'
                                : 'Faol'
                              : english
                                ? 'Inactive'
                                : 'Faol emas'}
                          </Button>
                          {canDeleteStudent ? (
                            <Button
                              variant='ghost'
                              size='icon'
                              className='text-destructive hover:bg-destructive/10 hover:text-destructive'
                              onClick={() => deleteStudent(student)}
                              aria-label={
                                english
                                  ? `Delete ${student.name}`
                                  : `${student.name}ni o‘chirish`
                              }
                              title={
                                english
                                  ? 'Delete student'
                                  : 'O‘quvchini o‘chirish'
                              }
                            >
                              <Trash2 className='size-4' />
                            </Button>
                          ) : (
                            <span />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </Main>
      <ConfirmDialog
        open={studentToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setStudentToDelete(null)
        }}
        title={english ? 'Delete student' : 'O‘quvchini o‘chirish'}
        desc={
          english
            ? `Are you sure you want to delete ${studentToDelete?.name ?? 'this student'} from the course?`
            : `${studentToDelete?.name ?? 'Bu o‘quvchi'}ni guruhdan o‘chirishni tasdiqlaysizmi?`
        }
        confirmText={english ? 'Delete' : 'O‘chirish'}
        cancelBtnText={english ? 'Cancel' : 'Bekor qilish'}
        destructive
        handleConfirm={confirmDeleteStudent}
      />
    </>
  )
}
