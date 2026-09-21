import { MailPlus, UserPlus } from 'lucide-react'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import { useUsers } from './users-provider'

export function UsersPrimaryButtons() {
  const { t } = useLanguage()
  const { setOpen } = useUsers()
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('invite')}
      >
        <span>{t('inviteUser')}</span> <MailPlus size={18} />
      </Button>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>{t('addUser')}</span> <UserPlus size={18} />
      </Button>
    </div>
  )
}
