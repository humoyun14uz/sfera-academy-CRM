import {
  ArrowRight,
  PhoneCall,
  Target,
  UserRoundCheck,
  UsersRound,
} from 'lucide-react'
import { useLanguage } from '@/context/language-provider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const leadItems = [
  { key: 'newLeads' as const, value: 186, icon: Target, color: 'bg-sky-500' },
  {
    key: 'contacted' as const,
    value: 142,
    icon: PhoneCall,
    color: 'bg-violet-500',
  },
  {
    key: 'trialLessons' as const,
    value: 78,
    icon: UsersRound,
    color: 'bg-amber-500',
  },
  {
    key: 'admitted' as const,
    value: 54,
    icon: UserRoundCheck,
    color: 'bg-emerald-500',
  },
]

export function LeadPipeline() {
  const { t } = useLanguage()
  const max = Math.max(...leadItems.map((item) => item.value))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('leadsAndAdmissions')}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-5'>
        {leadItems.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.key} className='space-y-2'>
              <div className='flex items-center justify-between gap-3'>
                <div className='flex min-w-0 items-center gap-2'>
                  <span className='rounded-md bg-muted p-1.5'>
                    <Icon className='size-4 text-muted-foreground' />
                  </span>
                  <span className='truncate text-sm font-medium'>
                    {t(item.key)}
                  </span>
                </div>
                <span className='font-semibold tabular-nums'>{item.value}</span>
              </div>
              <div className='h-2 rounded-full bg-muted'>
                <div
                  className={`h-2 rounded-full ${item.color} transition-all`}
                  style={{ width: `${Math.round((item.value / max) * 100)}%` }}
                />
              </div>
            </div>
          )
        })}
        <div className='flex items-center gap-2 pt-1 text-xs text-muted-foreground'>
          <ArrowRight className='size-3.5' />
          <span>{t('leadConversion')}</span>
        </div>
      </CardContent>
    </Card>
  )
}
