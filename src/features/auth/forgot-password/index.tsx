import { Link } from '@tanstack/react-router'
import { AuthLayout } from '../auth-layout'
import { ForgotPasswordForm } from './components/forgot-password-form'

export function ForgotPassword() {
  return (
    <AuthLayout>
      <div className='flex flex-col gap-4 sm:min-w-sm'>
        <div className='space-y-1.5 text-start'>
          <h2 className='text-2xl font-bold tracking-tight text-slate-900'>
            Parolni tiklash
          </h2>
          <p className='text-sm text-slate-500'>
            Ro‘yxatdan o‘tgan Gmail manzilingizni kiriting. <br /> Parolingizni
            tiklash uchun sizga havola yuboramiz.
          </p>
        </div>
        <ForgotPasswordForm />
        <p className='text-center text-xs text-slate-400'>
          Hisobingiz yo‘qmi?{' '}
          <Link
            to='/sign-up'
            className='font-medium text-emerald-600 underline underline-offset-4 hover:text-emerald-700'
          >
            Ro‘yxatdan o‘tish
          </Link>
          .
        </p>
      </div>
    </AuthLayout>
  )
}
