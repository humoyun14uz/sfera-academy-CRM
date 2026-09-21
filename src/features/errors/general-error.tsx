import { useNavigate, useRouter } from '@tanstack/react-router'
import type { HTMLAttributes } from 'react'
import { useLanguage } from '@/context/language-provider'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type GeneralErrorProps = HTMLAttributes<HTMLDivElement> & {
  minimal?: boolean
}

export function GeneralError({
  className,
  minimal = false,
}: GeneralErrorProps) {
  const navigate = useNavigate()
  const { history } = useRouter()
  const { language } = useLanguage()
  const english = language === 'en'
  return (
    <div className={cn('h-svh w-full', className)}>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2 px-6 text-center'>
        {!minimal && (
          <h1 className='text-[7rem] leading-tight font-bold'>500</h1>
        )}
        <span className='font-medium'>{english ? "Oops! Something went wrong :')" : "Kutilmagan xatolik yuz berdi :')"}</span>
        <p className='text-center text-muted-foreground'>
          {english ? <>We apologize for the inconvenience. <br /> Please try again later.</> : <>Noqulaylik uchun uzr. <br /> Keyinroq qayta urinib ko‘ring.</>}
        </p>
        {!minimal && (
          <div className='mt-6 flex gap-4'>
            <Button variant='outline' className='h-11 cursor-pointer rounded-lg' onClick={() => history.go(-1)}>
              {english ? 'Go back' : 'Orqaga'}
            </Button>
            <Button className='h-11 cursor-pointer rounded-lg' onClick={() => navigate({ to: '/' })}>{english ? 'Back to dashboard' : 'Boshqaruv paneliga'}</Button>
          </div>
        )}
      </div>
    </div>
  )
}
