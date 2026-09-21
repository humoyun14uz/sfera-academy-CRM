import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  ListTodo,
  MessageSquare,
  Paperclip,
  Search,
  Send,
  UploadCloud,
} from 'lucide-react'
import { IconGithub } from '@/assets/brand-icons'
import { requireRole } from '@/lib/route-guard'
import {
  readSharedAssignments,
  type SharedAssignment,
} from '@/lib/teacher-student-sync'
import { useLanguage } from '@/context/language-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Search as GlobalSearch } from '@/components/search'

export const Route = createFileRoute('/_authenticated/student/my-tasks/')({
  beforeLoad: () => requireRole('Student'),
  component: MyTasksPage,
})

type TaskItem = {
  id: string
  title: string
  module: string
  description: string
  deadline: string
  status: 'pending' | 'in_progress' | 'review' | 'completed'
  score?: number
  feedback?: string
  githubLink?: string
}

const initialTasks: TaskItem[] = [
  {
    id: 'TSK-101',
    title: 'TypeScript Generics va Utility Types amaliyoti',
    module: '4-Modul: TypeScript',
    description:
      'Generic funksiyalar, Record, Pick, Omit va ReturnType utility typelaridan foydalanib type-safe API handler funksiyalarini yozing.',
    deadline: '10-Sentabr, 23:59',
    status: 'in_progress',
    githubLink: 'https://github.com/ali-valiyev/ts-generics-lab',
  },
  {
    id: 'TSK-102',
    title: 'React Custom Hooks: useDebounce va useLocalStorage',
    module: '3-Modul: React.js',
    description:
      'Ikki dona toza va qayta ishlatiluvchi Custom Hook yozing, unit testlari bilan ta’minlang.',
    deadline: '12-Sentabr, 18:00',
    status: 'pending',
  },
  {
    id: 'TSK-098',
    title: 'TanStack Table & Pagination integratsiyasi',
    module: '3-Modul: React.js',
    description:
      'Mijozlar jadvalini server-side qidiruv, saralash va sahifalash bilan birga dasturlang.',
    deadline: '5-Sentabr, 23:59',
    status: 'review',
    githubLink: 'https://github.com/ali-valiyev/react-table-demo',
  },
  {
    id: 'TSK-095',
    title: 'JavaScript ES6+ Asinxron ma’lumotlar bilan ishlash',
    module: '2-Modul: JavaScript',
    description:
      'Fetch API, async/await va xatoliklarni ushlash (try/catch) orqali ob-havo API-ga so‘rov yuboruvchi ilova.',
    deadline: '28-Avgust, 23:59',
    status: 'completed',
    score: 95,
    feedback:
      'A’lo ish! Error handling to‘liq qilingan, kod arxitekturasi juda toza.',
    githubLink: 'https://github.com/ali-valiyev/weather-app-es6',
  },
  {
    id: 'TSK-090',
    title: 'CSS Grid & Responsive Dashboard Layout',
    module: '1-Modul: HTML/CSS',
    description:
      'Figma maketi asosida 100% piksel darajasida aniq moslashuvchan admin paneli karkasini yasash.',
    deadline: '15-Avgust, 23:59',
    status: 'completed',
    score: 90,
    feedback:
      'Mobile ko‘rinishida bir-ikki ortiqcha margin bor, lekin umumiy hisobda a’lo!',
    githubLink: 'https://github.com/ali-valiyev/dashboard-layout-css',
  },
]

function MyTasksPage() {
  const { language } = useLanguage()
  const en = language === 'en'
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null)
  const [submission, setSubmission] = useState('')
  const [attachment, setAttachment] = useState<File | null>(null)
  const [submittedIds, setSubmittedIds] = useState<string[]>([])
  const [teacherTasks, setTeacherTasks] = useState<SharedAssignment[]>([])

  useEffect(() => {
    const sync = () => setTeacherTasks(readSharedAssignments())
    sync()
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  const visibleTasks: TaskItem[] = [
    ...initialTasks,
    ...teacherTasks.map((task) => ({
      ...task,
      status: task.status as TaskItem['status'],
    })),
  ]

  const filteredTasks = visibleTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.module.toLowerCase().includes(searchTerm.toLowerCase())
    if (activeTab === 'all') return matchesSearch
    return matchesSearch && task.status === activeTab
  })

  const completedCount = visibleTasks.filter(
    (t) => t.status === 'completed'
  ).length
  const totalCount = visibleTasks.length
  const overallProgress = Math.round((completedCount / totalCount) * 100)

  return (
    <>
      <Header fixed>
        <div className='flex items-center gap-2'>
          <h1 className='text-lg font-semibold tracking-tight'>
            {en ? 'My assignments' : 'Vazifalarim'}
          </h1>
          <Badge variant='outline' className='border-primary/30 text-primary'>
            {completedCount}/{totalCount} {en ? 'completed' : 'Bajarildi'}
          </Badge>
        </div>
        <div className='ms-auto flex items-center gap-2'>
          <GlobalSearch className='me-auto sm:me-0' />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='space-y-6'>
        {/* Yuqori ko'rsatkich kartochkalari */}
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <Card className='shadow-sm'>
            <CardContent className='pt-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs text-muted-foreground'>
                    {en ? 'Total assignments' : 'Jami vazifalar'}
                  </p>
                  <p className='mt-0.5 text-2xl font-bold'>
                    {totalCount} {en ? '' : 'ta'}
                  </p>
                </div>
                <div className='rounded-lg bg-primary/10 p-2.5 text-primary'>
                  <ListTodo className='size-5' />
                </div>
              </div>
              <div className='mt-3'>
                <div className='mb-1 flex justify-between text-[11px] text-muted-foreground'>
                  <span>
                    {en ? 'Completion' : 'Bajarilish'}: {overallProgress}%
                  </span>
                  <span>
                    {completedCount} {en ? 'completed' : 'ta yopiq'}
                  </span>
                </div>
                <Progress value={overallProgress} className='h-1.5' />
              </div>
            </CardContent>
          </Card>

          <Card className='shadow-sm'>
            <CardContent className='pt-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs text-muted-foreground'>
                    {en ? 'Pending' : 'Bajarilmagan'}
                  </p>
                  <p className='mt-0.5 text-2xl font-bold text-red-600 dark:text-red-400'>
                    {visibleTasks.filter((t) => t.status === 'pending').length}{' '}
                    {en ? '' : 'ta'}
                  </p>
                </div>
                <div className='rounded-lg bg-red-500/10 p-2.5 text-red-600 dark:text-red-400'>
                  <AlertCircle className='size-5' />
                </div>
              </div>
              <p className='mt-4 text-[11px] text-muted-foreground'>
                {en
                  ? 'Due within the next 48 hours'
                  : 'Yaqin 48 soatda topshirish kerak'}
              </p>
            </CardContent>
          </Card>

          <Card className='shadow-sm'>
            <CardContent className='pt-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs text-muted-foreground'>
                    {en ? 'In progress / Review' : 'Jarayonda / Tekshiruvda'}
                  </p>
                  <p className='mt-0.5 text-2xl font-bold text-amber-600 dark:text-amber-400'>
                    {
                      visibleTasks.filter(
                        (t) =>
                          t.status === 'in_progress' || t.status === 'review'
                      ).length
                    }{' '}
                    {en ? '' : 'ta'}
                  </p>
                </div>
                <div className='rounded-lg bg-amber-500/10 p-2.5 text-amber-600 dark:text-amber-400'>
                  <Clock className='size-5' />
                </div>
              </div>
              <p className='mt-4 text-[11px] text-muted-foreground'>
                {en ? 'Under teacher review: 1' : 'Ustoz tekshiruvida: 1 ta'}
              </p>
            </CardContent>
          </Card>

          <Card className='shadow-sm'>
            <CardContent className='pt-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs text-muted-foreground'>
                    {en ? 'Average score' : 'O‘rtacha baho'}
                  </p>
                  <p className='mt-0.5 text-2xl font-bold text-green-600 dark:text-green-400'>
                    92.5 / 100
                  </p>
                </div>
                <div className='rounded-lg bg-green-500/10 p-2.5 text-green-600 dark:text-green-400'>
                  <CheckCircle2 className='size-5' />
                </div>
              </div>
              <p className='mt-4 text-[11px] text-muted-foreground'>
                {en ? 'Maximum score: 100' : 'Maksimal ball: 100 ball'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Qidiruv va Filtr paneli */}
        <div className='flex flex-col items-center justify-between gap-3 sm:flex-row'>
          <div className='relative w-full sm:w-80'>
            <Search className='absolute top-2.5 left-3 size-4 text-muted-foreground' />
            <Input
              placeholder={
                en
                  ? 'Assignment or module name...'
                  : 'Vazifa yoki modul nomi...'
              }
              className='pl-9 text-xs'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='w-full sm:w-auto'
          >
            <TabsList className='grid h-9 grid-cols-4 text-xs'>
              <TabsTrigger value='all'>{en ? 'All' : 'Barchasi'}</TabsTrigger>
              <TabsTrigger value='in_progress'>
                {en ? 'In progress' : 'Jarayonda'}
              </TabsTrigger>
              <TabsTrigger value='review'>
                {en ? 'In review' : 'Tekshiruvda'}
              </TabsTrigger>
              <TabsTrigger value='completed'>
                {en ? 'Completed' : 'Bajarilgan'}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Vazifalar Ro'yxati */}
        <div className='space-y-3.5'>
          {filteredTasks.length === 0 ? (
            <Card className='p-8 text-center text-sm text-muted-foreground'>
              {en
                ? 'No assignments found.'
                : 'Qidiruv bo‘yicha hech qanday vazifa topilmadi.'}
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card
                key={task.id}
                className='shadow-sm transition-colors duration-200 hover:border-primary/30'
              >
                <CardHeader className='py-3.5'>
                  <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='space-y-1'>
                      <div className='flex items-center gap-2'>
                        <span className='font-mono text-xs text-muted-foreground'>
                          {task.id}
                        </span>
                        <span className='text-xs font-semibold text-primary'>
                          {task.module}
                        </span>
                      </div>
                      <CardTitle className='text-base font-bold'>
                        {task.title}
                      </CardTitle>
                    </div>

                    <div className='flex items-center gap-2'>
                      {task.status === 'completed' && (
                        <Badge className='bg-green-500 text-xs text-white hover:bg-green-600'>
                          {en ? 'Completed' : 'Bajarildi'}: {task.score}{' '}
                          {en ? 'points' : 'ball'}
                        </Badge>
                      )}
                      {task.status === 'review' && (
                        <Badge
                          variant='outline'
                          className='border-blue-400 bg-blue-50 text-xs text-blue-600 dark:bg-blue-950'
                        >
                          {en ? 'Under review' : 'Ustoz tekshiruvida'}
                        </Badge>
                      )}
                      {task.status === 'in_progress' && (
                        <Badge variant='secondary' className='text-xs'>
                          {en ? 'In progress' : 'Jarayonda'}
                        </Badge>
                      )}
                      {task.status === 'pending' && (
                        <Badge variant='destructive' className='text-xs'>
                          {en ? 'Pending' : 'Bajarilmagan'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className='space-y-3 py-2 text-xs'>
                  <p className='leading-relaxed text-muted-foreground'>
                    {task.description}
                  </p>

                  {task.feedback && (
                    <div className='flex items-start gap-2 rounded-lg border border-border/50 bg-muted/40 p-3 text-xs'>
                      <MessageSquare className='mt-0.5 size-4 shrink-0 text-primary' />
                      <div>
                        <p className='font-semibold text-foreground'>
                          {en ? 'Teacher feedback:' : 'Ustoz sharhi:'}
                        </p>
                        <p className='mt-0.5 text-muted-foreground italic'>
                          "{task.feedback}"
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className='flex flex-wrap items-center justify-between gap-2 border-t bg-muted/10 py-3 text-xs'>
                  <div className='flex items-center gap-1.5 text-muted-foreground'>
                    <Calendar className='size-3.5' />
                    <span>
                      {en ? 'Due' : 'Muddat'}: <b>{task.deadline}</b>
                    </span>
                  </div>

                  <div className='flex items-center gap-2'>
                    {task.githubLink && (
                      <Button
                        variant='outline'
                        size='sm'
                        className='h-7 gap-1 text-xs'
                        onClick={() => window.open(task.githubLink, '_blank')}
                      >
                        <IconGithub className='size-3.5' />{' '}
                        {en ? 'GitHub code' : 'GitHub Kod'}
                      </Button>
                    )}
                    {task.status !== 'completed' &&
                    !submittedIds.includes(task.id) ? (
                      <Button
                        size='sm'
                        className='h-7 gap-1 text-xs'
                        onClick={() => {
                          setSelectedTask(task)
                          setSubmission('')
                        }}
                      >
                        <UploadCloud className='size-3.5' />{' '}
                        {en ? 'Submit assignment' : 'Vazifani topshirish'}
                      </Button>
                    ) : (
                      <Badge
                        variant='secondary'
                        className='text-[11px] text-green-600'
                      >
                        {submittedIds.includes(task.id)
                          ? en
                            ? '✓ Submitted'
                            : '✓ Yuborildi'
                          : en
                            ? '✓ Approved'
                            : '✓ Tasdiqlangan'}
                      </Badge>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </Main>
      <Dialog
        open={Boolean(selectedTask)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTask(null)
            setAttachment(null)
            setSubmission('')
          }
        }}
      >
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>
              {en ? 'Submit assignment' : 'Vazifani topshirish'}
            </DialogTitle>
            <DialogDescription>{selectedTask?.title}</DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground'>
              {en ? 'Due' : 'Muddat'}:{' '}
              <b className='text-foreground'>{selectedTask?.deadline}</b>
            </div>
            <Textarea
              value={submission}
              onChange={(event) => setSubmission(event.target.value)}
              placeholder={
                en
                  ? 'Add a note or GitHub repository link...'
                  : 'Izoh yoki GitHub repository havolasini kiriting...'
              }
              className='min-h-28 resize-none'
            />
            {attachment ? (
              <div className='flex items-center justify-between rounded-lg border border-primary/40 bg-primary/5 px-4 py-3 text-sm'>
                <div className='flex items-center gap-2 min-w-0'>
                  <Paperclip className='size-4 shrink-0 text-primary' />
                  <span className='truncate font-medium'>{attachment.name}</span>
                  <span className='shrink-0 text-xs text-muted-foreground'>
                    ({(attachment.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <button
                  type='button'
                  className='ms-2 shrink-0 rounded-full p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
                  onClick={() => setAttachment(null)}
                  aria-label='Faylni olib tashlash'
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className='flex cursor-pointer items-center gap-3 rounded-lg border border-dashed p-4 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary'>
                <Paperclip className='size-4' />{' '}
                <span className='min-w-0 truncate'>
                  {en ? 'Attach a file (optional)' : 'Fayl biriktirish (ixtiyoriy)'}
                </span>
                <input
                  type='file'
                  className='sr-only'
                  onChange={(event) => setAttachment(event.target.files?.[0] ?? null)}
                />
              </label>
            )}
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setSelectedTask(null)}>
              {en ? 'Cancel' : 'Bekor qilish'}
            </Button>
            <Button
              disabled={!submission.trim()}
              onClick={() => {
                if (selectedTask)
                  setSubmittedIds((ids) => [...ids, selectedTask.id])
                setSelectedTask(null)
                setAttachment(null)
                setSubmission('')
              }}
            >
              <Send className='me-2 size-4' />
              {en ? 'Submit' : 'Yuborish'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
