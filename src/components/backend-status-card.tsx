import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type Status = 'disabled' | 'loading' | 'error' | 'connected'

type Props = {
  title: string
  description: string
  status: Status
  statusLabels: Record<Status, string>
  metrics?: Array<{ label: string; value: string | number }>
  errorMessage?: string
}

export function BackendStatusCard({
  title,
  description,
  status,
  statusLabels,
  metrics = [],
  errorMessage,
}: Props) {
  const badgeVariant = status === 'error' ? 'destructive' : 'outline'
  return (
    <Card className='mb-6 border-primary/20 bg-gradient-to-br from-primary/[0.04] via-card to-card'>
      <CardHeader className='flex flex-row items-start justify-between gap-3 pb-3'>
        <div>
          <CardTitle className='text-base'>{title}</CardTitle>
          <CardDescription className='mt-1'>{description}</CardDescription>
        </div>
        <Badge variant={badgeVariant}>{statusLabels[status]}</Badge>
      </CardHeader>
      <CardContent>
        {status === 'loading' ? (
          <p className='text-sm text-muted-foreground'>Ulanmoqda…</p>
        ) : status === 'error' ? (
          <p className='text-sm text-destructive'>{errorMessage}</p>
        ) : status === 'disabled' ? (
          <p className='text-sm text-muted-foreground'>VITE_API_ENABLED=true qilib backend ma’lumotlarini yoqing.</p>
        ) : (
          <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
            {metrics.map((metric) => (
              <div key={metric.label} className='rounded-lg border bg-background/70 px-3 py-2'>
                <p className='text-xs text-muted-foreground'>{metric.label}</p>
                <p className='mt-1 text-lg font-semibold tabular-nums'>{metric.value}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
