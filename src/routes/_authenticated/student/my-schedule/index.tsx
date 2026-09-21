import { createFileRoute } from '@tanstack/react-router'
import { CalendarDays, Clock, Download, MapPin, Timer } from 'lucide-react'
import { requireRole } from '@/lib/route-guard'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Search as GlobalSearch } from '@/components/search'

export const Route = createFileRoute('/_authenticated/student/my-schedule/')({
  beforeLoad: () => requireRole('Student'),
  component: MySchedulePage,
})

const scheduleItems = [
  {
    id: 1,
    day: 'Dushanba',
    date: '8-Sentabr 2026',
    time: '09:00 – 11:00',
    subject: 'Frontend Dasturlash',
    topic: 'TypeScript: Generic turlar va Utility Types',
    room: '201-auditoriya',
    teacher: 'Abdulloh Karimov',
    type: 'offline',
    isToday: true,
  },
  {
    id: 2,
    day: 'Chorshanba',
    date: '10-Sentabr 2026',
    time: '09:00 – 11:00',
    subject: 'Frontend Dasturlash',
    topic: 'React Custom Hooks va Performance Optimizatsiya',
    room: '201-auditoriya',
    teacher: 'Abdulloh Karimov',
    type: 'offline',
    isToday: false,
  },
  {
    id: 3,
    day: 'Juma',
    date: '12-Sentabr 2026',
    time: '09:00 – 11:00',
    subject: 'Frontend Dasturlash',
    topic: 'Zustand & Redux Toolkit State Management',
    room: '201-auditoriya',
    teacher: 'Abdulloh Karimov',
    type: 'offline',
    isToday: false,
  },
  {
    id: 4,
    day: 'Shanba',
    date: '13-Sentabr 2026',
    time: '15:00 – 17:00',
    subject: 'Qo‘shimcha Amaliyot',
    topic: 'Mentor bilan birga kod yozish (Coding Session)',
    room: 'Online (Zoom)',
    teacher: 'Abdulloh Karimov',
    type: 'online',
    isToday: false,
  },
]

const upcomingEvents = [
  {
    title: '4-Modul Oraliq Imtihoni',
    date: '19-Sentabr, 09:00',
    type: 'exam',
    badge: 'Imtihon',
  },
  {
    title: 'Portfolio Capstone Loyiha Taqdimoti',
    date: '30-Sentabr, 10:00',
    type: 'project',
    badge: 'Loyiha',
  },
  {
    title: 'IT Mehnat Yarmarkasi va HR Meetup',
    date: '5-Oktabr, 14:00',
    type: 'event',
    badge: 'Tadbir',
  },
]

function MySchedulePage() {
  const { language } = useLanguage()
  const english = language === 'en'
  const label = (uz: string, en: string) => (english ? en : uz)
  const day = (value: string) =>
    english
      ? ({
          Dushanba: 'Monday',
          Chorshanba: 'Wednesday',
          Juma: 'Friday',
          Shanba: 'Saturday',
        }[value] ?? value)
      : value
  const downloadCalendar = () => {
    const events = scheduleItems
      .map(
        (item) =>
          `BEGIN:VEVENT\nSUMMARY:${item.subject} - ${item.topic}\nDTSTART:20260908T090000\nDTEND:20260908T110000\nLOCATION:${item.room}\nDESCRIPTION:O'qituvchi: ${item.teacher}\nEND:VEVENT`
      )
      .join('\n')
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//EduCRM//Jadval//UZ\nCALSCALE:GREGORIAN\n${events}\nEND:VCALENDAR`
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'educrm-jadval.ics'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => URL.revokeObjectURL(url), 150)
  }
  return (
    <>
      <Header fixed>
        <div className='flex items-center gap-2'>
          <h1 className='text-lg font-semibold tracking-tight'>
            {english ? 'My schedule' : 'Jadvalim'}
          </h1>
          <Badge variant='outline' className='border-primary/30 text-primary'>
            {label('Kuz 2026 Semestr', 'Fall 2026 Semester')}
          </Badge>
        </div>
        <div className='ms-auto flex items-center gap-2'>
          <GlobalSearch className='me-auto sm:me-0' />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='space-y-6'>
        {/* Next Lesson Countdown Hero Card */}
        <Card className='border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-background shadow-sm'>
          <CardContent className='flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-4'>
              <div className='flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md'>
                <Timer className='size-7' />
              </div>
              <div className='space-y-1'>
                <div className='flex items-center gap-2'>
                  <Badge className='bg-primary text-xs text-primary-foreground'>
                    {label('Bugungi dars', 'Today’s lesson')}
                  </Badge>
                  <span className='text-xs text-muted-foreground'>
                    {label(
                      'Boshlanishiga 25 daqiqa qoldi',
                      'Starts in 25 minutes'
                    )}
                  </span>
                </div>
                <h3 className='text-xl font-bold'>
                  TypeScript: Generic turlar va Utility Types
                </h3>
                <p className='text-xs text-muted-foreground'>
                  09:00 – 11:00 · 201-auditoriya · Abdulloh Karimov
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tablar: Haftalik va Muhim sanalar */}
        <Tabs defaultValue='weekly' className='space-y-4'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <TabsList className='bg-muted/60 p-1'>
              <TabsTrigger value='weekly'>
                {label('Haftalik jadval', 'Weekly schedule')}
              </TabsTrigger>
              <TabsTrigger value='exams'>
                {label(
                  'Imtihonlar va muhim sanalar',
                  'Exams and important dates'
                )}
              </TabsTrigger>
            </TabsList>

            <Button
              variant='outline'
              size='sm'
              className='w-fit gap-1.5 text-xs'
              onClick={downloadCalendar}
            >
              <Download className='size-3.5' />{' '}
              {label(
                'Taqvimni yuklab olish (.ics)',
                'Download calendar (.ics)'
              )}
            </Button>
          </div>

          <TabsContent value='weekly' className='space-y-3.5'>
            <div className='grid gap-4 md:grid-cols-2'>
              {scheduleItems.map((item) => (
                <Card
                  key={item.id}
                  className={`shadow-sm transition-all hover:border-primary/40 ${
                    item.isToday
                      ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary/20'
                      : ''
                  }`}
                >
                  <CardHeader className='pb-3'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <Badge
                          variant={item.isToday ? 'default' : 'secondary'}
                          className='text-xs'
                        >
                          {day(item.day)}
                        </Badge>
                        <span className='text-xs text-muted-foreground'>
                          {item.date}
                        </span>
                      </div>
                      <Badge variant='outline' className='text-[10px]'>
                        {item.type === 'online' ? label('Onlayn · Zoom', 'Online · Zoom') : label('Oflayn', 'Offline')}
                      </Badge>
                    </div>
                    <CardTitle className='mt-2 text-base font-bold'>
                      {item.topic}
                    </CardTitle>
                    <CardDescription className='text-xs'>
                      {item.subject}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-2 pb-4 text-xs text-muted-foreground'>
                    <div className='flex items-center gap-2'>
                      <Clock className='size-3.5 text-primary' />
                      <span className='font-medium text-foreground'>
                        {item.time}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <MapPin className='size-3.5 text-primary' />
                      <span>{item.room}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='font-medium text-foreground'>
                        {label('Ustoz:', 'Teacher:')}
                      </span>
                      <span>{item.teacher}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value='exams' className='space-y-4'>
            <Card className='shadow-sm'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-base'>
                  <CalendarDays className='size-4 text-primary' />
                  {label(
                    'Yaqinlashib kelayotgan muhim sanalar',
                    'Upcoming important dates'
                  )}
                </CardTitle>
                <CardDescription>
                  {label(
                    'Modul imtihonlari va diplom himoyasi vaqtlari',
                    'Module exams and diploma defense dates'
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-3'>
                {upcomingEvents.map((ev, i) => (
                  <div
                    key={i}
                    className='flex items-center justify-between rounded-lg border p-3.5'
                  >
                    <div className='space-y-1'>
                      <p className='text-sm font-semibold'>{ev.title}</p>
                      <p className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                        <Clock className='size-3' /> {ev.date}
                      </p>
                    </div>
                    <Badge
                      variant={ev.type === 'exam' ? 'destructive' : 'default'}
                      className='text-xs'
                    >
                      {ev.badge}
                    </Badge>
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
