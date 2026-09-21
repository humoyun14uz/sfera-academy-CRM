import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, LockKeyhole, Mail, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { sleep, cn } from '@/lib/utils'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

export function SignUpForm({ className, ...props }: React.HTMLAttributes<HTMLFormElement>) {
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useLanguage()
  const formSchema = z.object({ email: z.string().trim().min(1, t('emailRequired')).email(t('emailInvalid')), password: z.string().min(1, t('passwordRequired')).min(7, t('passwordLength')), confirmPassword: z.string().min(1, t('confirmPasswordRequired')) }).refine((data) => data.password === data.confirmPassword, { message: t('passwordMismatch'), path: ['confirmPassword'] })
  const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema), defaultValues: { email: '', password: '', confirmPassword: '' } })
  function onSubmit(data: z.infer<typeof formSchema>) { setIsLoading(true); toast.promise(sleep(700), { loading: t('creatingAccount'), success: () => { setIsLoading(false); return t('accountCreated') }, error: t('accountCreateError') }); void data }
  return <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className={cn('grid gap-3.5', className)} {...props}>
    <FormField control={form.control} name='email' render={({ field }) => <FormItem className='space-y-1.5'><FormLabel className='text-sm font-semibold text-slate-800'>{t('email')}</FormLabel><FormControl><div className='group relative'><Mail className='pointer-events-none absolute start-4 top-1/2 size-[17px] -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600' /><Input type='email' placeholder='name@example.com' className='h-11 rounded-lg border-slate-200 bg-slate-50/50 ps-11 shadow-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10' {...field} /></div></FormControl><FormMessage /></FormItem>} />
    <FormField control={form.control} name='password' render={({ field }) => <FormItem className='space-y-1.5'><FormLabel className='text-sm font-semibold text-slate-800'>{t('password')}</FormLabel><FormControl><div className='group relative'><LockKeyhole className='pointer-events-none absolute start-4 top-1/2 z-10 size-[17px] -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600' /><PasswordInput placeholder='********' className='w-full' inputClassName='h-11 rounded-lg border-slate-200 bg-slate-50/50 ps-11 shadow-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10' {...field} /></div></FormControl><FormMessage /></FormItem>} />
    <FormField control={form.control} name='confirmPassword' render={({ field }) => <FormItem className='space-y-1.5'><FormLabel className='text-sm font-semibold text-slate-800'>{t('confirmPassword')}</FormLabel><FormControl><div className='group relative'><LockKeyhole className='pointer-events-none absolute start-4 top-1/2 z-10 size-[17px] -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600' /><PasswordInput placeholder='********' className='w-full' inputClassName='h-11 rounded-lg border-slate-200 bg-slate-50/50 ps-11 shadow-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10' {...field} /></div></FormControl><FormMessage /></FormItem>} />
    <Button className='mt-1 h-11 rounded-lg bg-[#0aa875] text-[15px] font-bold shadow-[0_12px_24px_-10px_rgba(5,150,105,0.8)] transition-all hover:bg-[#078d63]' disabled={isLoading}>{isLoading ? <Loader2 className='animate-spin' /> : <UserPlus />}<span>{t('createAccount')}</span></Button>
  </form></Form>
}
