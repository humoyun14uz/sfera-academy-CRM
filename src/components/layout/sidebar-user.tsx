import { useNavigate } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { getPrimaryRole } from '@/lib/rbac'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function SidebarUser() {
  const navigate = useNavigate()
  const { auth } = useAuthStore()
  const { language } = useLanguage()
  const role = getPrimaryRole(auth.user?.role)
  const profileRoute =
    role === 'Teacher'
      ? '/teacher/profile'
      : role === 'Finance'
        ? '/finance/profile'
        : '/settings'
  const name = auth.user?.name || role
  const email = auth.user?.email || 'name@example.com'

  const handleLogout = () => {
    auth.reset()
    toast.success(
      language === 'en'
        ? 'You have been signed out successfully.'
        : 'Tizimdan muvaffaqiyatli chiqdingiz.'
    )
    navigate({ to: '/sign-in' })
  }

  return (
    <div className='flex w-full items-center gap-1.5 border-t border-sidebar-border pt-2 pb-1 px-1 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-2 group-data-[collapsible=icon]:px-0'>
      <button
        type='button'
        className='flex flex-1 min-w-0 items-center gap-2.5 rounded-lg p-1.5 text-start transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:flex-initial group-data-[collapsible=icon]:p-1 group-data-[collapsible=icon]:justify-center'
        onClick={() => navigate({ to: profileRoute as never })}
        title={language === 'en' ? 'Edit profile' : 'Profilni tahrirlash'}
      >
        <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow-sm transition-transform hover:scale-105'>
          {getInitials(name)}
        </div>
        <div className='min-w-0 flex-1 group-data-[collapsible=icon]:hidden'>
          <p className='truncate text-sm font-medium leading-none'>{name}</p>
          <p className='truncate text-xs text-muted-foreground mt-1'>{email}</p>
        </div>
      </button>
      <Button
        type='button'
        variant='ghost'
        size='icon'
        className='size-8 shrink-0 rounded-lg text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive focus-visible:ring-2 focus-visible:ring-destructive/40'
        onClick={handleLogout}
        aria-label={language === 'en' ? 'Log out' : 'Chiqish'}
        title={language === 'en' ? 'Log out' : 'Chiqish'}
      >
        <LogOut className='size-4' />
      </Button>
    </div>
  )
}
