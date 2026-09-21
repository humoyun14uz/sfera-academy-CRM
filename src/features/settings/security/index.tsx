import { useState } from 'react'
import { CheckCircle2, KeyRound, LockKeyhole, MonitorSmartphone, ShieldCheck, Smartphone } from 'lucide-react'
import { toast } from 'sonner'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ContentSection } from '../components/content-section'

export function SettingsSecurity() {
  const { language } = useLanguage()
  const english = language === 'en'
  const [twoStep, setTwoStep] = useState(true)
  const save = () => toast.success(english ? 'Security settings saved.' : 'Xavfsizlik sozlamalari saqlandi.')
  return (
    <ContentSection
      title={english ? 'Security' : 'Xavfsizlik'}
      desc={english ? 'Protect your CRM account, sessions and sign-in methods.' : 'CRM hisobingiz, sessiyalaringiz va kirish usullarini himoyalang.'}
    >
      <div className='space-y-5'>
        <div className='grid gap-4 md:grid-cols-3'>
          <SecurityStat icon={ShieldCheck} title={english ? 'Protection' : 'Himoya'} value={english ? 'Active' : 'Faol'} hint={english ? 'Core account controls' : 'Asosiy hisob himoyasi'} />
          <SecurityStat icon={MonitorSmartphone} title={english ? 'Active sessions' : 'Faol sessiyalar'} value='2' hint={english ? 'Desktop + current browser' : 'Kompyuter + joriy brauzer'} />
          <SecurityStat icon={CheckCircle2} title={english ? 'Security emails' : 'Xavfsizlik emaili'} value={english ? 'On' : 'Yoqilgan'} hint={english ? 'Always enabled' : 'Doim yoqilgan'} />
        </div>
        <Card>
          <CardHeader><CardTitle className='flex items-center gap-2'><KeyRound className='size-5 text-primary' />{english ? 'Change password' : 'Parolni o‘zgartirish'}</CardTitle><CardDescription>{english ? 'Use a strong password that is unique to this account.' : 'Faqat ushbu hisob uchun ishlatiladigan kuchli parol tanlang.'}</CardDescription></CardHeader>
          <CardContent className='grid gap-4 md:grid-cols-3'>
            <div className='space-y-2'><Label>{english ? 'Current password' : 'Joriy parol'}</Label><Input type='password' placeholder='••••••••' /></div>
            <div className='space-y-2'><Label>{english ? 'New password' : 'Yangi parol'}</Label><Input type='password' placeholder='••••••••' /></div>
            <div className='space-y-2'><Label>{english ? 'Confirm password' : 'Parolni tasdiqlang'}</Label><Input type='password' placeholder='••••••••' /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className='flex items-center gap-2'><LockKeyhole className='size-5 text-primary' />{english ? 'Two-step verification' : 'Ikki bosqichli himoya'}</CardTitle><CardDescription>{english ? 'Add an extra verification step when a new sign-in is detected.' : 'Yangi qurilmadan kirishda qo‘shimcha tasdiqlash qatlamini yoqing.'}</CardDescription></CardHeader>
          <CardContent className='flex items-center justify-between gap-4 rounded-2xl border bg-muted/20 p-4'>
            <div><p className='font-semibold'>{twoStep ? (english ? 'Enabled' : 'Yoqilgan') : (english ? 'Disabled' : 'O‘chirilgan')}</p><p className='mt-1 text-xs text-muted-foreground'>{english ? 'Recommended for account protection.' : 'Hisobni himoyalash uchun qo‘shimcha qatlam.'}</p></div>
            <Switch checked={twoStep} onCheckedChange={setTwoStep} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className='flex items-center gap-2'><Smartphone className='size-5 text-primary' />{english ? 'Active devices' : 'Faol qurilmalar'}</CardTitle><CardDescription>{english ? 'Review the devices currently signed in to your CRM account.' : 'Hozir hisobingizga kirgan qurilmalarni ko‘rib chiqing.'}</CardDescription></CardHeader>
          <CardContent className='space-y-3'>
            <Session label={english ? 'Current browser' : 'Joriy brauzer'} detail={english ? 'Chrome · Linux · Today' : 'Chrome · Linux · Bugun'} current english={english} />
            <Session label={english ? 'Desktop session' : 'Kompyuter sessiyasi'} detail={english ? 'KDE Plasma · Earlier today' : 'KDE Plasma · Bugun avval'} english={english} />
          </CardContent>
        </Card>
        <div className='flex justify-end'><Button className='cursor-pointer' onClick={save}>{english ? 'Save security settings' : 'Xavfsizlikni saqlash'}</Button></div>
      </div>
    </ContentSection>
  )
}

function SecurityStat({ icon: Icon, title, value, hint }: { icon: typeof ShieldCheck; title: string; value: string; hint: string }) {
  return <Card><CardContent className='pt-5'><div className='flex items-start justify-between gap-3'><div><p className='text-xs font-medium text-muted-foreground'>{title}</p><p className='mt-1 text-xl font-bold'>{value}</p><p className='mt-1 text-xs text-muted-foreground'>{hint}</p></div><span className='flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary'><Icon className='size-4' /></span></div></CardContent></Card>
}

function Session({ label, detail, current, english }: { label: string; detail: string; current?: boolean; english: boolean }) {
  return <div className='flex items-center gap-3 rounded-2xl border p-4'><span className='flex size-10 items-center justify-center rounded-xl bg-muted'><MonitorSmartphone className='size-4' /></span><div className='min-w-0 flex-1'><p className='font-semibold'>{label}</p><p className='text-xs text-muted-foreground'>{detail}</p></div>{current ? <span className='rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300'>{english ? 'Current' : 'Joriy'}</span> : <Button variant='ghost' size='sm' className='cursor-pointer'>{english ? 'Sign out' : 'Chiqish'}</Button>}</div>
}
