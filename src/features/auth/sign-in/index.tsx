import { useSearch } from '@tanstack/react-router'
import { useLanguage } from '@/context/language-provider'
import { AuthLayout } from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })
  const { t } = useLanguage()

  return (
    <AuthLayout>
      <div className='flex flex-col gap-6'>
        <div className='space-y-5 text-start'>
          <div className='flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] text-emerald-700 uppercase'>
            <span className='size-2 rounded-full bg-emerald-500' />
            {t('workspaceAccess')}
          </div>
          <div>
            <h2 className='text-[2rem] leading-[1.08] font-bold tracking-[-0.05em] text-slate-950 sm:text-[2.45rem]'>
              {t('loginTitle')}
            </h2>
            <p className='mt-3 max-w-md text-[14px] leading-6 text-slate-500'>
              {t('signInDescription')}
            </p>
          </div>
        </div>
        <UserAuthForm redirectTo={redirect} />
        <p className='text-center text-xs text-slate-400'>{t('noAccount')} <span className='font-semibold text-emerald-700'>{t('signUp')}</span></p>
      </div>
    </AuthLayout>
  )
}
