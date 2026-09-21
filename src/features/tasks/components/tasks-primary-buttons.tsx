import { Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/context/language-provider'
import { useTasks } from './tasks-provider'

export function TasksPrimaryButtons() {
  const { setOpen } = useTasks()
  const { language } = useLanguage()
  const english = language === 'en'
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('import')}
      >
        <span>{english ? 'Import' : 'Import qilish'}</span> <Download size={18} />
      </Button>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>{english ? 'Create' : 'Yaratish'}</span> <Plus size={18} />
      </Button>
    </div>
  )
}
