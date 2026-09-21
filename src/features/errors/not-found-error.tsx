import { Link, useNavigate, useRouter } from '@tanstack/react-router'
import { useLanguage } from '@/context/language-provider'
import { ArrowLeft, Home, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NotFoundError() {
  const navigate = useNavigate()
  const { history } = useRouter()
  const { language } = useLanguage()
  const english = language === 'en'

  return (
    <div className='flex min-h-svh items-center justify-center bg-background px-6 py-10 text-foreground'>
      <div className='w-full max-w-lg rounded-3xl border bg-card p-7 shadow-xl sm:p-9'>
      <div className='flex flex-col gap-6 text-start'>
        <div className='space-y-3'>
          <div className='inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20'><SearchX className='size-6' /></div>
          <p className='text-xs font-bold tracking-[0.2em] text-primary uppercase'>Sfera IT Academy CRM</p>
          <h2 className='text-3xl font-bold tracking-tight'>{english ? 'Page not found' : 'Sahifa topilmadi'}</h2>
          <p className='text-sm leading-6 text-muted-foreground'>{english ? 'The page you are looking for does not exist or has been moved.' : 'Siz qidirayotgan sahifa mavjud emas yoki manzili o‘zgartirilgan.'}</p>
        </div>
        <div className='flex flex-col gap-3 sm:flex-row'>
          <Button variant='outline' className='h-11 flex-1 cursor-pointer rounded-lg' onClick={() => history.go(-1)}><ArrowLeft className='me-2 size-4' />{english ? 'Go back' : 'Orqaga'}</Button>
          <Button className='h-11 flex-1 cursor-pointer rounded-lg' onClick={() => navigate({ to: '/' })}><Home className='me-2 size-4' />{english ? 'Back to dashboard' : 'Bosh sahifa'}</Button>
        </div>
        <p className='text-center text-xs text-muted-foreground'>{english ? 'Need help?' : 'Yordam kerakmi?'} <Link to='/sign-in' className='font-semibold text-primary hover:underline'>{english ? 'Sign in' : 'Tizimga kirish'}</Link></p>
      </div>
      </div>
    </div>
  )
}

export { NotFoundError as NotFound, NotFoundError as ErrorComponent }
