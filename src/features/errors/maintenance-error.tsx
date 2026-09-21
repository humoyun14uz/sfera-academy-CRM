import { Button } from '@/components/ui/button'
import { useLanguage } from '@/context/language-provider'

export function MaintenanceError() {
  const { language } = useLanguage()
  const english = language === 'en'
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>503</h1>
        <span className='font-medium'>{english ? 'Website is under maintenance!' : 'Sayt vaqtincha texnik xizmatda!'}</span>
        <p className='text-center text-muted-foreground'>
          {english ? <>The site is not available at the moment. <br />We will be back online shortly.</> : <>Sayt hozircha mavjud emas. <br />Tez orada qayta ishlaydi.</>}
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline'>{english ? 'Learn more' : 'Batafsil'}</Button>
        </div>
      </div>
    </div>
  )
}
