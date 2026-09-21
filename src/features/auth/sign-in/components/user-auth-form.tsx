import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const formSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Gmail manzilingizni kiriting.')
    .regex(emailRegex, 'To‘g‘ri Gmail manzilini kiriting.'),
  password: z
    .string()
    .min(1, 'Parolingizni kiriting.')
    .min(7, 'Parol kamida 7 ta belgidan iborat bo‘lishi kerak.'),
})
interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const navigate = useNavigate()
  const { auth } = useAuthStore()
  const { t } = useLanguage()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  })
  function onSubmit(data: z.infer<typeof formSchema>) {
    const email = data.email.toLowerCase()
    const accounts = [
      {
        email: (import.meta.env.VITE_ADMIN_EMAIL || 'admin@gmail.com')
          .trim()
          .toLowerCase(),
        password: import.meta.env.VITE_ADMIN_PASSWORD || 'SferaAdmin@2026',
        name: import.meta.env.VITE_ADMIN_NAME || 'Super Admin',
        role: 'Super Admin',
      },
      {
        email: (import.meta.env.VITE_MANAGER_EMAIL || 'manager@gmail.com')
          .trim()
          .toLowerCase(),
        password: import.meta.env.VITE_MANAGER_PASSWORD || 'SferaManager@2026',
        name: import.meta.env.VITE_MANAGER_NAME || 'Manager',
        role: 'Manager',
      },
      {
        email: (import.meta.env.VITE_TEACHER_EMAIL || 'teacher@gmail.com')
          .trim()
          .toLowerCase(),
        password: import.meta.env.VITE_TEACHER_PASSWORD || 'SferaTeacher@2026',
        name: import.meta.env.VITE_TEACHER_NAME || 'O‘qituvchi',
        role: 'Teacher',
      },
      {
        email: (import.meta.env.VITE_FINANCE_EMAIL || 'finance@gmail.com')
          .trim()
          .toLowerCase(),
        password: import.meta.env.VITE_FINANCE_PASSWORD || 'SferaFinance@2026',
        name: import.meta.env.VITE_FINANCE_NAME || 'Moliya xodimi',
        role: 'Finance',
      },
      {
        email: (import.meta.env.VITE_STUDENT_EMAIL || 'student@gmail.com')
          .trim()
          .toLowerCase(),
        password: import.meta.env.VITE_STUDENT_PASSWORD || 'SferaStudent@2026',
        name: import.meta.env.VITE_STUDENT_NAME || 'Ali Valiyev',
        role: 'Student',
      },
    ]
    const account = accounts.find(
      (candidate) =>
        candidate.email === email && candidate.password === data.password
    )
    if (!account) {
      form.setError('root', { message: t('invalidCredentials') })
      return
    }
    const mockUser = {
      accountNo:
        account.role === 'Teacher'
          ? 'TEA001'
          : account.role === 'Finance'
            ? 'FIN001'
            : account.role === 'Student'
              ? 'STU001'
              : 'ACC001',
      name: account.name,
      email: account.email,
      role: [account.role],
      exp: 4102444799999,
    }
    auth.setUser(mockUser)
    auth.setAccessToken('mock-access-token')
    const panelNames: Record<string, string> = {
      'Super Admin': 'Super Admin',
      Admin: 'Admin',
      Manager: 'Manager',
      Teacher: t('teacher'),
      Finance: t('finance'),
      Student: t('student'),
    }
    const panelLabel = panelNames[account.role] ?? account.role
    toast.success(
      `${t('welcomeBack')}, ${panelLabel} ${t('dashboard').toLowerCase()}`
    )
    navigate({
      to:
        account.role === 'Teacher'
          ? '/teacher'
          : account.role === 'Finance'
            ? '/finance'
            : redirectTo || '/',
      replace: true,
    })
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-4', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem className='space-y-1.5'>
              <FormLabel className='text-sm leading-5 font-semibold text-slate-800'>
                {t('email')}
              </FormLabel>
              <FormControl>
                <div className='group relative'>
                  <Mail className='pointer-events-none absolute start-4 top-1/2 size-[17px] -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-600' />
                  <Input
                    type='email'
                    autoComplete='username'
                    placeholder='name@example.com'
                    className='h-11 rounded-lg border-slate-200 bg-slate-50/50 ps-11 shadow-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10'
                    {...field}
                  />
                </div>
              </FormControl>
              <div className='min-h-1'>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative space-y-1.5'>
              <div className='flex items-center justify-between gap-2 leading-5'>
                <FormLabel className='text-sm font-semibold text-slate-800'>
                  {t('password')}
                </FormLabel>
                <Link
                  to='/forgot-password'
                  className='text-xs font-semibold text-emerald-700 transition-colors hover:text-emerald-800'
                >
                  {t('forgotPasswordQuestion')}
                </Link>
              </div>
              <FormControl>
                <div className='group relative'>
                  <LockKeyhole className='pointer-events-none absolute start-4 top-1/2 z-10 size-[17px] -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-600' />
                  <PasswordInput
                    autoComplete='current-password'
                    placeholder='********'
                    className='w-full'
                    inputClassName='h-11 rounded-lg border-slate-200 bg-slate-50/50 ps-11 shadow-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10'
                    {...field}
                  />
                </div>
              </FormControl>
              <div className='min-h-1'>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <div className='-mt-2 min-h-0' aria-live='polite'>
          {form.formState.errors.root?.message && (
            <p className='text-sm text-destructive' role='alert'>
              {form.formState.errors.root.message}
            </p>
          )}
        </div>
        <Button
          type='submit'
          className='-mt-1 h-11 rounded-lg bg-[#047857] text-[15px] font-bold shadow-[0_12px_24px_-10px_rgba(5,120,87,0.8)] transition-all hover:bg-[#036b4e] hover:shadow-[0_16px_28px_-10px_rgba(5,120,87,0.9)]'
        >
          <span>{t('signIn')}</span>
          <ArrowRight className='size-4' />
        </Button>
        <div className='relative flex items-center py-0.5'>
          <div className='h-px flex-1 bg-slate-100' />
          <span className='px-3 text-[11px] font-medium text-slate-400'>
            {t('continueWith')}
          </span>
          <div className='h-px flex-1 bg-slate-100' />
        </div>
        <Link
          to='/sign-up'
          className='flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-emerald-700 shadow-none transition-all hover:border-emerald-200 hover:bg-emerald-50/50'
        >
          {t('signUp')}
        </Link>
      </form>
    </Form>
  )
}
