import { Link } from '@tanstack/react-router'
import { AuthLayout } from '../auth-layout'
import { SignUpForm } from './components/sign-up-form'
import { useLanguage } from '@/context/language-provider'

export function SignUp() {
  const { t } = useLanguage()
  return (
    <AuthLayout>
      <div className='flex flex-col gap-5'>
        <div className='space-y-2 text-start'>
          <div className='flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] text-emerald-700 uppercase'><span className='size-2 rounded-full bg-emerald-500' />{t('workspaceAccess')}</div>
          <h2 className='text-[2rem] leading-[1.08] font-bold tracking-[-0.05em] text-slate-950'>{t('createAccount')}</h2>
          <p className='text-sm leading-6 text-slate-500'>{t('createAccountDescription')}</p>
        </div>
        <SignUpForm />
        <p className='text-center text-xs text-slate-400'>{t('alreadyHaveAccount')} <Link to='/sign-in' className='font-semibold text-emerald-700 hover:text-emerald-800'>{t('signIn')}</Link></p>
        <p className='px-2 text-center text-[11px] leading-5 text-slate-400'>{t('agreementPrefix')} <a href='/terms' className='font-medium underline underline-offset-4 hover:text-emerald-700'>{t('terms')}</a> {t('and')} <a href='/privacy' className='font-medium underline underline-offset-4 hover:text-emerald-700'>{t('privacy')}</a>.</p>
      </div>
    </AuthLayout>
  )
}
