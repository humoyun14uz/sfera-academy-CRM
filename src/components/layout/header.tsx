import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { LanguageSwitcher } from '@/components/language-switcher'

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export function Header({ className, fixed, children, ...props }: HeaderProps) {
  const [offset, setOffset] = useState(0)

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
        <SidebarTrigger
          variant='outline'
          className='size-8 shrink-0 border-border/70 sm:size-7'
        />
        <div className='flex min-w-0 flex-1 items-center gap-3 sm:gap-4'>
          {children}
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  )
}
