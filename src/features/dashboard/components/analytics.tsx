import { BarChart3, BookOpenCheck, CircleDollarSign, ClipboardCheck } from 'lucide-react'
import { useLanguage } from '@/context/language-provider'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AnalyticsChart } from './analytics-chart'

const academyMetrics = [
  { key: 'studentStatistics' as const, value: '248', change: '+8.2%', icon: BarChart3 },
  { key: 'attendanceRate' as const, value: '91%', change: '+3.1%', icon: ClipboardCheck },
  { key: 'coursePerformance' as const, value: '87%', change: '+4.6%', icon: BookOpenCheck },
  { key: 'paymentStatistics' as const, value: '58.4M', change: '+12.4%', icon: CircleDollarSign },
]

export function Analytics() {
  const { t } = useLanguage()

  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle>{t('revenueDynamics')}</CardTitle>
          <CardDescription>{t('weeklyAcademyActivity')}</CardDescription>
        </CardHeader>
        <CardContent className='px-3 sm:px-6'>
          <AnalyticsChart />
        </CardContent>
      </Card>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {academyMetrics.map(({ key, value, change, icon: Icon }) => (
          <Card key={key}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>{t(key)}</CardTitle>
              <Icon aria-hidden='true' className='size-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold tabular-nums'>{value}</div>
              <p className='text-xs text-muted-foreground'>
                {change} {t('changeFromLastMonth')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
        <Card className='col-span-1 lg:col-span-4'>
          <CardHeader>
            <CardTitle>{t('groupActivity')}</CardTitle>
            <CardDescription>{t('studentsEnrolled')}</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarList
              items={[
                { name: 'Frontend', value: 86 },
                { name: 'Backend', value: 72 },
                { name: 'AI Automation', value: 54 },
                { name: 'Design', value: 36 },
              ]}
              valueFormatter={(n) => `${n}`}
              barClass='bg-primary'
            />
          </CardContent>
        </Card>
        <Card className='col-span-1 lg:col-span-3'>
          <CardHeader>
            <CardTitle>{t('paymentStatistics')}</CardTitle>
            <CardDescription>{t('outstandingDebt')}</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarList
              items={[
                { name: t('paid'), value: 74 },
                { name: t('partiallyPaid'), value: 18 },
                { name: t('overdue'), value: 8 },
              ]}
              valueFormatter={(n) => `${n}%`}
              barClass='bg-muted-foreground'
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function SimpleBarList({
  items,
  valueFormatter,
  barClass,
}: {
  items: { name: string; value: number }[]
  valueFormatter: (n: number) => string
  barClass: string
}) {
  const max = Math.max(...items.map((item) => item.value), 1)
  return (
    <ul className='space-y-3'>
      {items.map((item) => (
        <li key={item.name} className='flex items-center justify-between gap-3'>
          <div className='min-w-0 flex-1'>
            <div className='mb-1 truncate text-xs text-muted-foreground'>{item.name}</div>
            <div className='h-2.5 w-full rounded-full bg-muted'>
              <div className={`h-2.5 rounded-full ${barClass}`} style={{ width: `${Math.round((item.value / max) * 100)}%` }} />
            </div>
          </div>
          <div className='ps-2 text-xs font-medium tabular-nums'>{valueFormatter(item.value)}</div>
        </li>
      ))}
    </ul>
  )
}
