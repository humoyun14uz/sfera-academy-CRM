import { useState } from 'react'
import { BookOpenCheck, CalendarCheck2, GraduationCap, UserRoundCheck } from 'lucide-react'
import { useLanguage } from '@/context/language-provider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const learningItems = [
  { key: 'todaysLessons' as const, value: '24', icon: CalendarCheck2, color: 'text-sky-600 bg-sky-500/10' },
  { key: 'attendance' as const, value: '91%', icon: UserRoundCheck, color: 'text-emerald-600 bg-emerald-500/10' },
  { key: 'activeCourses' as const, value: '12', icon: BookOpenCheck, color: 'text-violet-600 bg-violet-500/10' },
  { key: 'activeTeachers' as const, value: '28', icon: GraduationCap, color: 'text-amber-600 bg-amber-500/10' },
]

const todayLessons = [
  ['Frontend Development', 'FR-02', 'Temurbek', '18:00–19:30'],
  ['Java Backend', 'JAVA-01', 'Golib Abduhalil', '19:00–20:30'],
  ['AI Automation', 'AI-01', 'Otabek Naviyev', '19:30–21:00'],
]

export function LearningProcess() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  return <>
    <Card className='cursor-pointer transition-shadow hover:shadow-md' onClick={() => setOpen(true)}>
      <CardHeader><CardTitle>{t('todaysLearning')}</CardTitle></CardHeader>
      <CardContent className='grid gap-3 sm:grid-cols-2'>{learningItems.map((item) => { const Icon = item.icon; return <div key={item.key} className='flex items-center gap-3 rounded-lg border bg-card p-3'><span className={`rounded-lg p-2 ${item.color}`}><Icon className='size-4' /></span><div className='min-w-0'><p className='truncate text-xs text-muted-foreground'>{t(item.key)}</p><p className='text-xl font-bold tabular-nums'>{item.value}</p></div></div> })}</CardContent>
    </Card>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className='sm:max-w-2xl'><DialogHeader><DialogTitle>{t('todaysLessons')}</DialogTitle></DialogHeader><div className='space-y-2'>{todayLessons.map(([course, group, teacher, time]) => <div key={group} className='grid gap-1 rounded-lg border p-3 text-sm sm:grid-cols-4'><strong>{course}</strong><span>{t('group')}: {group}</span><span>{t('teacherLabel')}: {teacher}</span><span>{time}</span></div>)}</div></DialogContent></Dialog>
  </>
}
