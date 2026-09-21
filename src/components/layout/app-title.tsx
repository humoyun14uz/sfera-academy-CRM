import { Link } from '@tanstack/react-router'
import academyDarkLogo from '@/assets/sfera-it-academy-logo-dark.png'
import academyLogo from '@/assets/sfera-it-academy-logo.png'
import { useAuthStore } from '@/stores/auth-store'
import { getPrimaryRole } from '@/lib/rbac'
import { useLanguage } from '@/context/language-provider'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export function AppTitle() {
  const { setOpenMobile } = useSidebar()
  const { t } = useLanguage()
  const { auth } = useAuthStore()
  const roleLabel = getPrimaryRole(auth.user?.role)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='gap-0 py-0 hover:bg-transparent active:bg-transparent'
          asChild
        >
          <div className='flex w-full items-center gap-2'>
            <Link
              to='/'
              onClick={() => setOpenMobile(false)}
              className='flex min-w-0 flex-1 items-center gap-2 text-start text-sm leading-tight'
            >
              <img
                src={academyLogo}
                alt={t('appName')}
                className='size-8 shrink-0 rounded-md object-cover dark:hidden'
              />
              <img
                src={academyDarkLogo}
                alt={t('appName')}
                className='hidden size-8 shrink-0 rounded-md object-cover dark:block'
              />
              <span className='grid min-w-0'>
                <span className='truncate font-bold'>{t('appName')}</span>
                <span className='truncate text-xs text-muted-foreground'>
                  {translateRoleLabel(roleLabel, t)}
                </span>
              </span>
            </Link>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function translateRoleLabel(
  role: ReturnType<typeof getPrimaryRole>,
  t: (key: 'administrator' | 'admin' | 'manager' | 'teacher' | 'finance' | 'student') => string
) {
  if (role === 'Super Admin') return t('administrator')
  const roleKeys = {
    Admin: 'admin',
    Manager: 'manager',
    Teacher: 'teacher',
    Finance: 'finance',
    Student: 'student',
  } as const
  return t(roleKeys[role])
}
