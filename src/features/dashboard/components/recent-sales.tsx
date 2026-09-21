import {
  CalendarCheck2,
  CreditCard,
  GraduationCap,
  Target,
  UsersRound,
} from 'lucide-react'
import { useLanguage } from '@/context/language-provider'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const activities = [
  {
    name: 'Ali Valiyev',
    fallback: 'AV',
    action: 'activityJoined' as const,
    time: 'minutesAgo' as const,
    timeValue: '12',
    icon: GraduationCap,
    color: 'text-sky-600',
  },
  {
    name: 'Madina Karimova',
    fallback: 'MK',
    action: 'activityPaid' as const,
    time: 'minutesAgo' as const,
    timeValue: '28',
    icon: CreditCard,
    color: 'text-emerald-600',
  },
  {
    name: 'Azizbek Toshpulatov',
    fallback: 'AT',
    action: 'activityAttendance' as const,
    time: 'hoursAgo' as const,
    timeValue: '1',
    icon: CalendarCheck2,
    color: 'text-violet-600',
  },
  {
    name: 'Frontend 2-guruh',
    fallback: 'F2',
    action: 'activityNewStudent' as const,
    time: 'hoursAgo' as const,
    timeValue: '2',
    icon: UsersRound,
    color: 'text-amber-600',
  },
  {
    name: 'Dilshod Rahimov',
    fallback: 'DR',
    action: 'activityNewLead' as const,
    time: 'hoursAgo' as const,
    timeValue: '3',
    icon: Target,
    color: 'text-rose-600',
  },
]

export function RecentSales() {
  const { t } = useLanguage()

  return (
    <div className='space-y-5'>
      {activities.map((activity) => {
        const Icon = activity.icon
        return (
          <div
            key={`${activity.name}-${activity.action}`}
            className='flex gap-3'
          >
            <Avatar className='size-9 shrink-0'>
              <AvatarFallback>{activity.fallback}</AvatarFallback>
            </Avatar>
            <div className='min-w-0 flex-1'>
              <p className='text-sm leading-5'>
                <span className='font-semibold'>{activity.name}</span>{' '}
                <span className='text-muted-foreground'>
                  {t(activity.action)}
                </span>
              </p>
              <p className='mt-1 flex items-center gap-1 text-xs text-muted-foreground'>
                <Icon className={`size-3.5 ${activity.color}`} />
                {activity.timeValue} {t(activity.time)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
