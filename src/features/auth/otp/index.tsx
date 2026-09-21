import { Link } from '@tanstack/react-router'
import { AuthLayout } from '../auth-layout'
import { OtpForm } from './components/otp-form'

export function Otp() {
  return (
    <AuthLayout>
      <div className='flex flex-col gap-4'>
        <div className='space-y-1.5 text-start'>
          <h2 className='text-2xl font-bold tracking-tight text-slate-900'>
            Ikki bosqichli autentifikatsiya
          </h2>
          <p className='text-sm text-slate-500'>
            Tasdiqlash kodini kiriting. <br /> Kod Gmail manzilingizga
            yuborildi.
          </p>
        </div>
        <OtpForm />
        <p className='text-center text-xs text-slate-400'>
          Kodni olmadingizmi?{' '}
          <Link
            to='/sign-in'
            className='font-medium text-emerald-600 underline underline-offset-4 hover:text-emerald-700'
          >
            Yangi kodni qayta yuborish
          </Link>
          .
        </p>
      </div>
    </AuthLayout>
  )
}
