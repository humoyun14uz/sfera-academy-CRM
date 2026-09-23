import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { useCrmStore } from '@/lib/crm-store'
import { useNotificationRealtime } from '@/lib/notifications-realtime'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LanguageSwitcher } from '@/components/language-switcher'

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export function Header({ className, fixed, children, ...props }: HeaderProps) {
  const [offset, setOffset] = useState(0)
  useNotificationRealtime()

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    document.addEventListener('scroll', onScroll, { passive: true })
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'header-fixed peer/header sticky top-0 z-50 h-16 w-full min-w-0 shrink-0 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80',
        fixed && 'w-full',
        offset > 10 && fixed ? 'shadow-sm' : 'shadow-none',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'relative mx-0 flex h-16 w-full max-w-none min-w-0 items-center gap-2 px-3 py-3 sm:gap-4 sm:px-4 @7xl/content:mx-0 @7xl/content:max-w-none',
          offset > 10 &&
            fixed &&
            'after:absolute after:inset-0 after:-z-10 after:bg-background/20 after:backdrop-blur-lg'
        )}
      >
        <div className='flex min-w-0 flex-1 items-center gap-3 sm:gap-4'>
          {children}
        </div>
        <div className='ms-auto flex shrink-0 items-center gap-1'>
          <NotificationBell />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}

function NotificationBell() {
  const { language } = useLanguage()
  const notifications = useCrmStore((state) => state.notifications)
  const markNotificationRead = useCrmStore(
    (state) => state.markNotificationRead
  )
  const unread = notifications.filter((notification) => !notification.read)
  const english = language === 'en'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='relative size-9 rounded-xl text-muted-foreground transition-[transform,background-color,color] duration-200 hover:scale-105 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/40'
          aria-label={
            english ? 'Open notifications' : 'Bildirishnomalarni ochish'
          }
        >
          <Bell className='size-[18px]' />
          {unread.length > 0 && (
            <span className='absolute top-1 right-1 flex min-w-4 translate-x-1/4 -translate-y-1/4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] leading-4 font-bold text-white ring-2 ring-background motion-safe:animate-pulse'>
              {unread.length > 9 ? '9+' : unread.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='w-[calc(100vw-1rem)] max-w-96 rounded-2xl p-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95'
      >
        <DropdownMenuLabel className='px-3 py-2'>
          <div className='flex items-center justify-between gap-3'>
            <span>{english ? 'Notifications' : 'Bildirishnomalar'}</span>
            <span className='text-xs font-normal text-muted-foreground'>
              {unread.length} {english ? 'unread' : 'o‘qilmagan'}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {unread.length === 0 ? (
          <div className='px-3 py-8 text-center text-sm text-muted-foreground'>
            {english ? 'You are all caught up.' : 'Barcha xabarlar o‘qilgan.'}
          </div>
        ) : (
          unread.slice(0, 5).map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              asChild
              className='rounded-xl p-0 transition-colors duration-200'
            >
              <a
                href={notification.target ?? '/settings/notifications'}
                onClick={() => markNotificationRead(notification.id)}
                className='flex min-w-0 items-start gap-3 px-3 py-3'
              >
                <span className='mt-1 size-2 shrink-0 rounded-full bg-emerald-500 motion-safe:animate-pulse' />
                <span className='min-w-0'>
                  <span className='block truncate text-sm font-medium'>
                    {notification.title}
                  </span>
                  <span className='mt-1 block text-xs text-muted-foreground'>
                    {new Intl.DateTimeFormat(english ? 'en-US' : 'uz-UZ', {
                      day: 'numeric',
                      month: 'short',
                    }).format(new Date(notification.createdAt))}
                  </span>
                </span>
              </a>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className='rounded-xl'>
          <a
            href='/settings/notifications'
            className='justify-center text-sm font-medium'
          >
            {english ? 'Manage notifications' : 'Bildirishnomalarni boshqarish'}
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
