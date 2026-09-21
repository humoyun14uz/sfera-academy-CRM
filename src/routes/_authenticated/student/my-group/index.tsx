import { Award, Calendar, CheckCircle2, ChevronRight, CircleDollarSign, Clock, GraduationCap, ListTodo, MessageSquare, TrendingUp, UserCheck } from 'lucide-react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAuthStore } from '@/stores/auth-store'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Search as GlobalSearch } from '@/components/search'
import { useLanguage } from '@/context/language-provider'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCrmStore } from '@/lib/crm-store'

const weeklyActivityData = {
  uz: [
    { day: 'Dush', soat: 2.5 }, { day: 'Sesh', soat: 3.8 }, { day: 'Chor', soat: 4.0 },
    { day: 'Pay', soat: 1.5 }, { day: 'Jum', soat: 3.2 }, { day: 'Shan', soat: 5.0 }, { day: 'Yak', soat: 2.0 },
  ],
  en: [
    { day: 'Mon', soat: 2.5 }, { day: 'Tue', soat: 3.8 }, { day: 'Wed', soat: 4.0 },
    { day: 'Thu', soat: 1.5 }, { day: 'Fri', soat: 3.2 }, { day: 'Sat', soat: 5.0 }, { day: 'Sun', soat: 2.0 },
  ],
}

const gradesHistoryData = [
  { month: 'Mar', ball: 78 },
  { month: 'Apr', ball: 84 },
  { month: 'May', ball: 88 },
  { month: 'Iyun', ball: 91 },
  { month: 'Iyul', ball: 89 },
  { month: 'Avg', ball: 94 },
]

export function StudentDashboard() {
  const { auth: { user } } = useAuthStore()
  const students = useCrmStore((state) => state.students)
  const userName = user?.name || 'Azizbek Karimov'
  const { language } = useLanguage()
  const english = language === 'en'
  const label = (uz: string, en: string) => (english ? en : uz)
  const activityData = weeklyActivityData[english ? 'en' : 'uz']

  const currentStudent =
    students.find((student) => student.name.toLowerCase() === userName.toLowerCase()) ??
    students.find((student) => student.email.includes(userName.toLowerCase().replace(/\s+/g, '.'))) ??
    students[0]

  const attendanceRate = currentStudent?.attendance ?? 87.5
  const averagePerformance = currentStudent?.averageGrade ?? 90
  const totalPaid = currentStudent?.totalPaid ?? 2100000
  const debt = currentStudent?.debt ?? 350000

  return (
    <>
      <Header fixed>
        <div className='flex items-center gap-2'>
          <h1 className='text-lg font-semibold tracking-tight'>{label('Boshqaruv paneli', 'Dashboard')}</h1>
          <Badge variant='outline' className='hidden sm:inline-flex border-primary/30 text-primary'>
            {label('Talaba portali', 'Student portal')}
          </Badge>
        </div>
        <div className='ms-auto flex items-center gap-2'>
          <GlobalSearch className='me-auto sm:me-0' />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='space-y-6'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b'>
          <div className='space-y-1'>
            <div className='flex items-center gap-2.5'>
              <h2 className='text-2xl font-bold tracking-tight'>
                {label(`Xush kelibsiz, ${userName}`, `Welcome, ${userName}`)}
              </h2>
              <Badge variant='secondary' className='text-xs font-normal bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800'>
                ● {label('Faol o‘quvchi', 'Active student')}
              </Badge>
            </div>
            <p className='text-xs sm:text-sm text-muted-foreground flex items-center gap-2'>
              <span>{currentStudent?.course ?? 'Frontend development'}</span>
              <span>•</span>
              <span>{label('G-14 guruhi', 'Group G-14')}</span>
              <span>•</span>
              <span className='text-primary font-medium'>{label('Kuzgi semestr 2026', 'Fall semester 2026')}</span>
            </p>
          </div>

          <div className='flex items-center gap-2.5'>
            <Button
              variant='outline'
              size='sm'
              className='text-xs h-9'
              onClick={() => (window.location.href = '/student/my-schedule')}
            >
              <Calendar className='size-3.5 me-1.5' /> {label('Dars jadvali', 'Class schedule')}
            </Button>
            <Button
              size='sm'
              className='text-xs h-9 gap-1.5'
              onClick={() => (window.location.href = '/student/my-tasks')}
            >
              <ListTodo className='size-3.5' /> {label('Vazifalarim', 'My assignments')}
            </Button>
          </div>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <Card className='shadow-sm hover:shadow-md transition-shadow'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                {label('Davomat ko‘rsatkichi', 'Attendance rate')}
              </CardTitle>
              <div className='rounded-lg bg-green-500/10 p-2 text-green-600 dark:text-green-400'>
                <UserCheck className='size-4' />
              </div>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='text-2xl font-bold'>{attendanceRate}%</div>
              <Progress value={attendanceRate} className='h-2 [&>div]:bg-green-500' />
              <p className='text-xs text-muted-foreground flex items-center justify-between'>
                <span>{label('Mavjud ma’lumotlar asosida', 'Based on current records')}</span>
                <span className='font-medium text-green-600 dark:text-green-400'>{label('A’lo', 'Excellent')}</span>
              </p>
            </CardContent>
          </Card>

          <Card className='shadow-sm hover:shadow-md transition-shadow'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                {label('O‘rtacha o‘zlashtirish', 'Average performance')}
              </CardTitle>
              <div className='rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400'>
                <GraduationCap className='size-4' />
              </div>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='text-2xl font-bold'>{averagePerformance} / 100</div>
              <Progress value={averagePerformance} className='h-2 [&>div]:bg-blue-500' />
              <p className='text-xs text-muted-foreground flex items-center justify-between'>
                <span>{label('Yakuniy ball', 'Final grade')}</span>
                <span className='font-medium text-blue-600 dark:text-blue-400'>{label('Yaxshi', 'Strong')}</span>
              </p>
            </CardContent>
          </Card>

          <Card className='shadow-sm hover:shadow-md transition-shadow'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                {label('Amaliy vazifalar', 'Practical assignments')}
              </CardTitle>
              <div className='rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400'>
                <ListTodo className='size-4' />
              </div>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='text-2xl font-bold'>{Math.min(14, Math.max(8, Math.round(attendanceRate / 6)))} / 16</div>
              <Progress value={Math.min(100, (Math.min(14, Math.max(8, Math.round(attendanceRate / 6))) / 16) * 100)} className='h-2 [&>div]:bg-amber-500' />
              <p className='text-xs text-muted-foreground flex items-center justify-between'>
                <span>{label('Faol topshiriqlar', 'Active assignments')}</span>
                <span className='font-medium text-amber-600 dark:text-amber-400'>{Math.round((attendanceRate / 100) * 100)}%</span>
              </p>
            </CardContent>
          </Card>

          <Card className='shadow-sm hover:shadow-md transition-shadow'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                {label('Oylik to‘lov holati', 'Monthly payment status')}
              </CardTitle>
              <div className='rounded-lg bg-purple-500/10 p-2 text-purple-600 dark:text-purple-400'>
                <CircleDollarSign className='size-4' />
              </div>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='text-2xl font-bold'>{new Intl.NumberFormat('uz-UZ').format(Math.max(0, totalPaid / 100000))}k</div>
              <Progress value={Math.min(100, ((totalPaid - debt) / Math.max(totalPaid, 1)) * 100)} className='h-2 [&>div]:bg-purple-500' />
              <p className='text-xs text-muted-foreground flex items-center justify-between'>
                <span>{label(`Qoldiq: ${new Intl.NumberFormat('uz-UZ').format(debt)} UZS`, `Balance: ${new Intl.NumberFormat('uz-UZ').format(debt)} UZS`)}</span>
                <Badge variant='outline' className='text-[10px] text-green-600 border-green-300'>{label('Faol', 'Active')}</Badge>
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue='overview' className='space-y-4'>
          <div className='flex items-center justify-between'>
            <TabsList className='bg-muted/60 p-1'>
              <TabsTrigger value='overview'>{label('Umumiy ko‘rinish', 'Overview')}</TabsTrigger>
              <TabsTrigger value='analytics'>{label('O‘quv faolligi tahlili', 'Learning activity')}</TabsTrigger>
              <TabsTrigger value='next-steps'>{label('Navbatdagi rejalar', 'Next steps')}</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 lg:grid-cols-7'>
              <Card className='lg:col-span-4 shadow-sm'>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <div>
                      <CardTitle className='text-base'>{label('Haftalik o‘rganish vaqti (soatlarda)', 'Weekly learning time (hours)')}</CardTitle>
                      <CardDescription>{label('Platformadagi va amaliyotdagi sarflangan soatlar', 'Time spent on the platform and practice')}</CardDescription>
                    </div>
                    <Badge variant='secondary'>{label('Jami: 21.5 soat', 'Total: 21.5 hours')}</Badge>
                  </div>
                </CardHeader>
                <CardContent className='pt-2'>
                  <ResponsiveContainer width='100%' height={260}>
                    <BarChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray='3 3' vertical={false} opacity={0.2} />
                      <XAxis dataKey='day' tickLine={false} axisLine={false} fontSize={12} />
                      <YAxis tickLine={false} axisLine={false} fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--popover)',
                          borderColor: 'var(--border)',
                          borderRadius: '8px',
                          color: 'var(--popover-foreground)',
                        }}
                      />
                      <Bar dataKey='soat' fill='var(--primary)' radius={[6, 6, 0, 0]} name={label('Sarflangan soat', 'Hours spent')} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
                <CardFooter className='border-t bg-muted/20 py-3 text-xs text-muted-foreground flex justify-between'>
                  <span>{label('Eng faol kun: Shanba (5.0 soat)', 'Most active day: Saturday (5.0 hours)')}</span>
                  <span className='text-primary font-medium'>{label('O‘rtacha: 3.0 soat/kun', 'Average: 3.0 hours/day')}</span>
                </CardFooter>
              </Card>

              <Card className='lg:col-span-3 shadow-sm flex flex-col justify-between'>
                <CardHeader>
                  <CardTitle className='text-base flex items-center gap-2'>
                    <Calendar className='size-4 text-primary' />
                    {label('Bugungi dars jarayoni', 'Today’s lesson')}
                  </CardTitle>
                  <CardDescription>{label('Dushanba, 8-sentabr 2026', 'Monday, September 8, 2026')}</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3'>
                    <div className='flex items-center justify-between'>
                      <Badge className='bg-primary text-primary-foreground'>{label('Bugun 09:00 – 11:00', 'Today 09:00 – 11:00')}</Badge>
                      <span className='text-xs font-semibold text-primary'>201-auditoriya</span>
                    </div>
                    <div>
                      <h4 className='font-bold text-base'>{label('TypeScript: Generic turlar va patternlar', 'TypeScript: Generic types and patterns')}</h4>
                      <p className='text-xs text-muted-foreground mt-0.5'>{label('G-14 guruhi · Frontend dasturlash', 'Group G-14 · Frontend development')}</p>
                    </div>
                    <div className='flex items-center justify-between pt-2 border-t border-primary/10 text-xs text-muted-foreground'>
                      <span>{label('O‘qituvchi: Abdulloh Karimov', 'Teacher: Abdulloh Karimov')}</span>
                      <Button size='sm' variant='ghost' className='h-7 text-xs px-2 gap-1 text-primary' onClick={() => (window.location.href = '/student/my-schedule')}>
                        {label('Batafsil', 'Details')} <ChevronRight className='size-3' />
                      </Button>
                    </div>
                  </div>

                  <div className='rounded-xl border p-3.5 space-y-2 bg-card'>
                    <div className='flex items-center gap-2'>
                      <div className='size-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary'>
                        AK
                      </div>
                      <div>
                        <p className='text-xs font-semibold'>Abdulloh Karimov ({label('Ustoz', 'Teacher')})</p>
                        <p className='text-[10px] text-muted-foreground'>{label('Kecha, 18:30', 'Yesterday, 18:30')}</p>
                      </div>
                    </div>
                    <p className='text-xs text-muted-foreground italic bg-muted/40 p-2.5 rounded-lg'>
                      "Ali, oxirgi React custom hook topshirig‘ini a’lo darajada yechibsiz. Clean code prinsiplari saqlangan. Bugun Generic mavzusini davom ettiramiz!"
                    </p>
                  </div>
                </CardContent>
                <CardFooter className='border-t pt-3'>
                  <Button variant='outline' size='sm' className='w-full text-xs gap-1.5' onClick={() => (window.location.href = '/student/my-group')}>
                    <MessageSquare className='size-3.5' /> {label('Guruh chatiga o‘tish', 'Open group chat')}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='analytics' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2'>
              <Card className='shadow-sm'>
                <CardHeader>
                  <CardTitle className='text-base flex items-center gap-2'>
                    <TrendingUp className='size-4 text-primary' />
                    {label('Oylik baholar o‘sish dinamikasi', 'Monthly grade trend')}
                  </CardTitle>
                  <CardDescription>{label('Oxirgi 6 oylik o‘rtacha ball ko‘rsatkichi', 'Average score over the last 6 months')}</CardDescription>
                </CardHeader>
                <CardContent className='pt-2'>
                  <ResponsiveContainer width='100%' height={240}>
                    <AreaChart data={gradesHistoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id='colorBall' x1='0' y1='0' x2='0' y2='1'>
                          <stop offset='5%' stopColor='var(--primary)' stopOpacity={0.4} />
                          <stop offset='95%' stopColor='var(--primary)' stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray='3 3' vertical={false} opacity={0.2} />
                      <XAxis dataKey='month' tickLine={false} axisLine={false} fontSize={12} />
                      <YAxis domain={[60, 100]} tickLine={false} axisLine={false} fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--popover)',
                          borderColor: 'var(--border)',
                          borderRadius: '8px',
                          color: 'var(--popover-foreground)',
                        }}
                      />
                      <Area type='monotone' dataKey='ball' stroke='var(--primary)' strokeWidth={2} fillOpacity={1} fill='url(#colorBall)' name={label('Baho', 'Grade')} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className='shadow-sm'>
                <CardHeader>
                  <CardTitle className='text-base flex items-center gap-2'>
                    <Award className='size-4 text-primary' />
                    {label('Akademik yutuqlar va sertifikatlar', 'Academic achievements and certificates')}
                  </CardTitle>
                  <CardDescription>{label('Olingan ko‘nikmalar va darajalar', 'Skills and levels achieved')}</CardDescription>
                </CardHeader>
                <CardContent className='space-y-3.5'>
                  {[
                    { nom: 'HTML5 & Responsive Design', daraja: 'Mastered', ball: 95, icon: CheckCircle2, color: 'text-green-500' },
                    { nom: 'JavaScript ES6+ Core', daraja: 'Mastered', ball: 88, icon: CheckCircle2, color: 'text-green-500' },
                    { nom: 'React & Component Architecture', daraja: 'Advanced', ball: 92, icon: CheckCircle2, color: 'text-blue-500' },
                    { nom: 'TypeScript & Typings', daraja: 'In Progress', ball: 85, icon: Clock, color: 'text-amber-500' },
                  ].map((item) => (
                    <div key={item.nom} className='flex items-center justify-between rounded-lg border p-2.5'>
                      <div className='flex items-center gap-2.5'>
                        <item.icon className={`size-4 ${item.color}`} />
                        <div>
                          <p className='text-xs font-semibold'>{item.nom}</p>
                          <p className='text-[10px] text-muted-foreground'>{item.daraja}</p>
                        </div>
                      </div>
                      <Badge variant='outline' className='font-mono text-xs'>{item.ball}%</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='next-steps' className='space-y-4'>
            <Card className='shadow-sm'>
              <CardHeader>
                <CardTitle className='text-base'>{label('Navbatdagi topshiriqlar va loyihalar', 'Upcoming assignments and projects')}</CardTitle>
                <CardDescription>{label('Yaqin kunlarda topshirilishi kerak bo‘lgan ishlar', 'Work due in the coming days')}</CardDescription>
              </CardHeader>
              <CardContent className='space-y-3'>
                {([
                  { title: 'React Hooks amaliyot vazifasi', muddat: label('10-sentabr', 'September 10'), status: label('Bajarilmoqda', 'In progress'), badge: 'secondary' },
                  { title: 'Portfolio veb-sayti (1-etap)', muddat: label('20-sentabr', 'September 20'), status: label('Yangi', 'New'), badge: 'outline' },
                  { title: 'TypeScript Mini-proyekt', muddat: label('28-sentabr', 'September 28'), status: label('Kutilmoqda', 'Pending'), badge: 'outline' },
                ] as const).map((task) => (
                  <div key={task.title} className='flex items-center justify-between border rounded-lg p-3'>
                    <div className='space-y-0.5'>
                      <p className='text-sm font-medium'>{task.title}</p>
                      <p className='text-xs text-muted-foreground'>{label('Muddat', 'Due')}: {task.muddat}</p>
                    </div>
                    <Badge variant={task.badge}>{task.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
