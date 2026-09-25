import { Link, useNavigate, useRouter } from '@tanstack/react-router'
import { ArrowLeft, Home, SearchX } from 'lucide-react'
import { AuthLayout } from '@/features/auth/auth-layout'
import { Button } from '@/components/ui/button'

export function NotFoundError() {
  const navigate = useNavigate()
  const { history } = useRouter()

  return (
    <AuthLayout>
      <div className='flex flex-col gap-6 text-start'>
        <div className='space-y-3'>
          <div className='inline-flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100'><SearchX className='size-6' /></div>
          <p className='text-xs font-bold tracking-[0.2em] text-emerald-700 uppercase'>Sfera IT Academy CRM</p>
          <h2 className='text-3xl font-bold tracking-tight text-slate-950'>Sahifa topilmadi</h2>
          <p className='text-sm leading-6 text-slate-500'>Siz qidirayotgan sahifa mavjud emas yoki manzili o‘zgartirilgan.</p>
        </div>
        <div className='flex flex-col gap-3 sm:flex-row'>
          <Button variant='outline' className='h-11 flex-1 rounded-lg border-slate-200 text-slate-700 hover:border-emerald-200 hover:bg-emerald-50/60' onClick={() => history.go(-1)}><ArrowLeft className='me-2 size-4' />Orqaga</Button>
          <Button className='h-11 flex-1 rounded-lg bg-[#29a956] text-[15px] font-bold shadow-[0_12px_24px_-10px_rgba(5,150,105,0.8)] transition-all hover:bg-[#218c48]' onClick={() => navigate({ to: '/' })}><Home className='me-2 size-4' />Bosh sahifa</Button>
        </div>
        <p className='text-center text-xs text-slate-400'>Yordam kerakmi? <Link to='/sign-in' className='font-semibold text-emerald-700 hover:text-emerald-800'>Tizimga kirish</Link></p>
      </div>
    </AuthLayout>
  )
}

export { NotFoundError as NotFound, NotFoundError as ErrorComponent }
