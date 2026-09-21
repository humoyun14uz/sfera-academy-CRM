import { useState } from 'react'
import { Bell, Globe2, KeyRound, LockKeyhole, MonitorCog, Palette, Save, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { Link } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export type RoleSettingsLabels = {
  title: string
  description: string
  language: string
  notifications: string
  notificationsHint: string
  security: string
  securityHint: string
  appearance: string
  appearanceHint: string
  save: string
  saved: string
  enabled?: string
  disabled?: string
  locale?: 'en' | 'uz'
}

export function RoleSettings({ labels }: { labels: RoleSettingsLabels }) {
  const [notifications, setNotifications] = useState(true)
  const [compact, setCompact] = useState(false)
  const save = () => toast.success(labels.saved)

  return (
    <div className='space-y-6'>
      <div className='relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/[0.10] via-card to-violet-500/[0.06] p-6 shadow-sm'>
        <div className='pointer-events-none absolute -end-16 -top-20 size-52 rounded-full bg-primary/10 blur-3xl' />
        <div className='relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.18em] text-primary'>SFERA IT Academy CRM</p>
            <h1 className='mt-2 text-2xl font-bold tracking-tight md:text-3xl'>{labels.title}</h1>
            <p className='mt-1 max-w-2xl text-sm text-muted-foreground'>{labels.description}</p>
          </div>
          <div className='rounded-2xl border bg-background/75 px-4 py-3 text-xs shadow-sm'>
            <div className='flex items-center gap-2 font-semibold'><span className='size-2 rounded-full bg-emerald-500' />{labels.locale === 'en' ? 'Workspace protected' : 'Ish maydoni himoyalangan'}</div>
            <p className='mt-1 text-muted-foreground'>{labels.locale === 'en' ? 'Preferences sync with your account.' : 'Sozlamalar hisobingiz bilan sinxronlanadi.'}</p>
          </div>
        </div>
      </div>

      <div className='grid gap-4 xl:grid-cols-2'>
        <SettingsCard icon={Bell} title={labels.notifications} description={labels.notificationsHint}>
          <div className='flex items-center justify-between rounded-2xl border bg-muted/20 p-4'>
            <div><Label>{notifications ? (labels.enabled ?? '') : (labels.disabled ?? '')}</Label><p className='mt-1 text-xs text-muted-foreground'>{labels.notificationsHint}</p></div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
        </SettingsCard>
        <SettingsCard icon={Palette} title={labels.appearance} description={labels.appearanceHint}>
          <div className='flex items-center justify-between rounded-2xl border bg-muted/20 p-4'>
            <div><Label>{compact ? (labels.enabled ?? '') : (labels.disabled ?? '')}</Label><p className='mt-1 text-xs text-muted-foreground'>{labels.appearanceHint}</p></div>
            <Switch checked={compact} onCheckedChange={setCompact} />
          </div>
        </SettingsCard>
        <SettingsCard icon={Globe2} title={labels.language} description={labels.locale === 'en' ? 'Use the selected language consistently across the workspace.' : 'Tanlangan tilni butun ish maydonida bir xil ishlating.'}>
          <div className='grid gap-3 sm:grid-cols-2'>
            <div className='rounded-2xl border bg-background p-4'><p className='text-xs text-muted-foreground'>{labels.locale === 'en' ? 'Current language' : 'Joriy til'}</p><p className='mt-1 font-semibold'>{labels.locale === 'en' ? 'English' : 'O‘zbekcha'}</p></div>
            <Link to='/settings/appearance' className='rounded-2xl border bg-background p-4 transition-colors hover:border-primary/40 hover:bg-primary/[0.03]'>
              <div className='flex items-center gap-2 font-semibold'><MonitorCog className='size-4 text-primary' />{labels.locale === 'en' ? 'Workspace appearance' : 'Ish maydoni ko‘rinishi'}</div>
              <p className='mt-1 text-xs text-muted-foreground'>{labels.appearanceHint}</p>
            </Link>
          </div>
        </SettingsCard>
        <SettingsCard icon={ShieldCheck} title={labels.security} description={labels.securityHint}>
          <div className='grid gap-3 sm:grid-cols-2'>
            <Link to='/settings/security' className='rounded-2xl border bg-background p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm'>
              <div className='flex items-center gap-2 font-semibold'><LockKeyhole className='size-4 text-primary' />{labels.security}</div>
              <p className='mt-1 text-xs text-muted-foreground'>{labels.locale === 'en' ? 'Password, sessions, two-step verification and active devices.' : 'Parol, sessiyalar, ikki bosqichli himoya va faol qurilmalar.'}</p>
            </Link>
            <div className='rounded-2xl border bg-background p-4'><div className='flex items-center gap-2 font-semibold'><KeyRound className='size-4 text-emerald-600' />{labels.locale === 'en' ? 'Account status' : 'Hisob holati'}</div><p className='mt-1 text-xs text-emerald-600'>{labels.locale === 'en' ? 'No security action required' : 'Xavfsizlik bo‘yicha shoshilinch amal yo‘q'}</p></div>
          </div>
        </SettingsCard>
      </div>

      <div className='flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4 shadow-sm'>
        <div><p className='font-semibold'>{labels.locale === 'en' ? 'Save workspace preferences' : 'Ish maydoni sozlamalarini saqlash'}</p><p className='text-xs text-muted-foreground'>{labels.locale === 'en' ? 'Apply your current notification and appearance preferences.' : 'Bildirishnoma va ko‘rinish bo‘yicha joriy sozlamalarni qo‘llang.'}</p></div>
        <Button className='cursor-pointer' onClick={save}><Save className='me-2 size-4' />{labels.save}</Button>
      </div>
    </div>
  )
}

function SettingsCard({ icon: Icon, title, description, children }: { icon: typeof Bell; title: string; description: string; children: React.ReactNode }) {
  return <Card className='overflow-hidden'><CardHeader className='border-b bg-muted/[0.18]'><CardTitle className='flex items-center gap-2 text-base'><span className='flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary'><Icon className='size-4' /></span>{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader><CardContent className='p-4'>{children}</CardContent></Card>
}
