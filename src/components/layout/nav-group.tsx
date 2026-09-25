import { useEffect, useRef, type ReactNode } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { can } from '@/lib/rbac'
import { useLanguage, type TranslationKey } from '@/context/language-provider'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Badge } from '../ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import {
  type NavCollapsible,
  type NavItem,
  type NavLink,
  type NavGroup as NavGroupProps,
} from './types'

const NAV_TITLE_KEYS: Partial<Record<string, TranslationKey>> = {
  General: 'general',
  Academy: 'academy',
  System: 'system',
  Dashboard: 'dashboard',
  Tasks: 'tasks',
  Vazifalar: 'tasks',
  Apps: 'apps',
  Chats: 'chats',
  Users: 'users',
  'O‘quvchilar': 'students',
  Kurslar: 'courses',
  Arizalar: 'applications',
  Guruhlar: 'groups',
  'O‘qituvchilar': 'teachers',
  Jadval: 'schedule',
  Davomat: 'attendance',
  Moliya: 'finance',
  Hisobotlar: 'reports',
  Finance: 'finance',
  Attendance: 'attendance',
  Reports: 'reports',
  Foydalanuvchilar: 'users',
  Yordam: 'support',
  Pages: 'pages',
  Auth: 'auth',
  'Sign In': 'signIn',
  'Sign In (2 Col)': 'signInTwoCol',
  'Sign Up': 'signUp',
  'Forgot Password': 'forgotPassword',
  OTP: 'otp',
  Errors: 'errors',
  Unauthorized: 'unauthorized',
  Forbidden: 'forbidden',
  'Not Found': 'notFound',
  'Internal Server Error': 'internalServerError',
  'Maintenance Error': 'maintenanceError',
  Other: 'other',
  Settings: 'settings',
  Sozlamalar: 'settings',
  Profile: 'profile',
  Profil: 'profile',
  Account: 'account',
  Hisob: 'account',
  Appearance: 'appearance',
  'Ko‘rinish': 'appearance',
  Notifications: 'notifications',
  Bildirishnomalar: 'notifications',
  Display: 'display',
  Ekran: 'display',
  'Help Center': 'helpCenter',
  'Yordam markazi': 'helpCenter',
  'Secured by Clerk': 'securedByClerk',
}

function translateNavTitle(title: string, t: (key: TranslationKey) => string) {
  const key = NAV_TITLE_KEYS[title]
  return key ? t(key) : title
}

export function NavGroup({ title, items }: NavGroupProps) {
  const { state, isMobile } = useSidebar()
  const { t } = useLanguage()
  const { auth } = useAuthStore()
  const href = useLocation({ select: (location) => location.href })
  const visibleItems = items.filter(
    (item) => !item.permission || can(auth.user?.role, item.permission)
  )

  if (!visibleItems.length) return null

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{translateNavTitle(title, t)}</SidebarGroupLabel>
      <SidebarMenu>
        {visibleItems.map((item) => {
          const key = `${item.title}-${item.url}`

          if (!item.items)
            return <SidebarMenuLink key={key} item={item} href={href} />

          if (state === 'collapsed' && !isMobile)
            return (
              <SidebarMenuCollapsedDropdown key={key} item={item} href={href} />
            )

          return <SidebarMenuCollapsible key={key} item={item} href={href} />
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function NavBadge({ children }: { children: ReactNode }) {
  return <Badge className='rounded-full px-1 py-0 text-xs'>{children}</Badge>
}

function SidebarMenuLink({ item, href }: { item: NavLink; href: string }) {
  const { setOpenMobile } = useSidebar()
  const { t } = useLanguage()

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={checkIsActive(href, item)}
        tooltip={translateNavTitle(item.title, t)}
      >
        <Link to={item.url} onClick={() => setOpenMobile(false)}>
          {item.icon && <item.icon />}
          <span>{translateNavTitle(item.title, t)}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function SidebarMenuCollapsible({
  item,
  href,
}: {
  item: NavCollapsible
  href: string
}) {
  const { setOpenMobile } = useSidebar()
  const { t } = useLanguage()
  const { auth } = useAuthStore()
  const visibleSubItems = item.items.filter(
    (subItem) => !subItem.permission || can(auth.user?.role, subItem.permission)
  )
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!checkIsActive(href, item, true)) return
    const content = contentRef.current
    const sidebarContent = content?.closest<HTMLElement>('[data-sidebar="content"]')
    if (!content || !sidebarContent) return
    const frame = requestAnimationFrame(() => {
      const bottom = content.offsetTop + content.offsetHeight
      const visibleBottom = sidebarContent.scrollTop + sidebarContent.clientHeight
      if (bottom > visibleBottom) {
        sidebarContent.scrollTo({ top: bottom - sidebarContent.clientHeight + 16, behavior: 'smooth' })
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [href, item])

  return (
    <Collapsible
      asChild
      defaultOpen={checkIsActive(href, item, true)}
      className='group/collapsible'
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={translateNavTitle(item.title, t)}>
            {item.icon && <item.icon />}
            <span>{translateNavTitle(item.title, t)}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className='ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 rtl:rotate-180' />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent ref={contentRef} className='CollapsibleContent'>
          <SidebarMenuSub>
            {visibleSubItems.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  asChild
                  isActive={checkIsActive(href, subItem)}
                >
                  <Link to={subItem.url} onClick={() => setOpenMobile(false)}>
                    {subItem.icon && <subItem.icon />}
                    <span>{translateNavTitle(subItem.title, t)}</span>
                    {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

function SidebarMenuCollapsedDropdown({
  item,
  href,
}: {
  item: NavCollapsible
  href: string
}) {
  const { t } = useLanguage()
  const { auth } = useAuthStore()
  const visibleSubItems = item.items.filter(
    (subItem) => !subItem.permission || can(auth.user?.role, subItem.permission)
  )

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={translateNavTitle(item.title, t)}
            isActive={checkIsActive(href, item)}
          >
            {item.icon && <item.icon />}
            <span>{translateNavTitle(item.title, t)}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className='ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 rtl:rotate-180' />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='right' align='start' sideOffset={4}>
          <DropdownMenuLabel>
            {translateNavTitle(item.title, t)}{' '}
            {item.badge ? `(${item.badge})` : ''}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {visibleSubItems.map((sub) => (
            <DropdownMenuItem key={`${sub.title}-${sub.url}`} asChild>
              <Link
                to={sub.url}
                className={`${checkIsActive(href, sub) ? 'bg-secondary' : ''}`}
              >
                {sub.icon && <sub.icon />}
                <span className='max-w-52 text-wrap'>
                  {translateNavTitle(sub.title, t)}
                </span>
                {sub.badge && (
                  <span className='ms-auto text-xs'>{sub.badge}</span>
                )}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

function checkIsActive(href: string, item: NavItem, mainNav = false) {
  return (
    href === item.url ||
    href.split('?')[0] === item.url ||
    !!item?.items?.filter((i) => i.url === href).length ||
    (mainNav &&
      href.split('/')[1] !== '' &&
      href.split('/')[1] === item?.url?.split('/')[1])
  )
}
