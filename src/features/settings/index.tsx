import { Outlet } from '@tanstack/react-router'
import { Monitor, Bell, Palette, Wrench, UserCog } from 'lucide-react'
import { useLanguage } from '@/context/language-provider'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { SidebarNav } from './components/sidebar-nav'

const sidebarNavItems = (english: boolean) => [
  {
    title: english ? 'Profile' : 'Profil',
    href: '/settings',
    icon: <UserCog size={18} />,
  },
  {
    title: english ? 'Account' : 'Hisob',
    href: '/settings/account',
    icon: <Wrench size={18} />,
  },
  {
    title: english ? 'Appearance' : 'Ko‘rinish',
    href: '/settings/appearance',
    icon: <Palette size={18} />,
  },
  {
    title: english ? 'Notifications' : 'Bildirishnomalar',
    href: '/settings/notifications',
    icon: <Bell size={18} />,
  },
  {
    title: english ? 'Display' : 'Displey',
    href: '/settings/display',
    icon: <Monitor size={18} />,
  },
]

export function Settings() {
  const { language } = useLanguage()
  const english = language === 'en'
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main fixed>
        <div className='relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/[0.12] via-card to-sky-500/[0.08] p-5 shadow-sm sm:p-6'>
          <div className='pointer-events-none absolute -end-10 -top-16 size-44 rounded-full bg-primary/10 blur-2xl' />
          <div className='relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <p className='mb-2 text-xs font-semibold tracking-[0.18em] text-primary uppercase'>
                SFERA IT Academy CRM
              </p>
              <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
                {english ? 'Settings & workspace' : 'Sozlamalar va ish maydoni'}
              </h1>
              <p className='mt-1 text-sm text-muted-foreground'>
                {english
                  ? 'Manage your account, appearance, notifications, and workspace preferences.'
                  : 'Hisob, ko‘rinish, bildirishnomalar va ish maydoni sozlamalarini boshqaring.'}
              </p>
            </div>
            <div className='flex items-center gap-2 rounded-xl border bg-background/70 px-3 py-2 text-xs font-medium'>
              <span className='size-2 rounded-full bg-emerald-500' />
              {english ? 'Workspace protected' : 'Ish maydoni himoyalangan'}
            </div>
          </div>
        </div>
        <Separator className='my-4 lg:my-6' />
        <div className='flex min-h-0 flex-1 flex-col space-y-2 md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <aside className='top-0 shrink-0 lg:sticky lg:w-1/5'>
            <SidebarNav items={sidebarNavItems(english)} />
          </aside>
          <div className='flex w-full min-w-0 p-1'>
            <Outlet />
          </div>
        </div>
      </Main>
    </>
  )
}
