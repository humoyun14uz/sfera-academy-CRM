import { useState } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { getPrimaryRole } from '@/lib/rbac'
import { useLanguage, type TranslationKey } from '@/context/language-provider'
import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { SidebarUser } from './sidebar-user'
import { CompanySelector } from './company-selector'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { t } = useLanguage()
  const user = useAuthStore((state) => state.auth.user)
  const role = getPrimaryRole(user?.role)
  const allowedGroups =
    role === 'Super Admin'
      ? ['Academy', 'Management', 'System', 'Teacher', 'Finance', 'Student']
      : role === 'Admin'
        ? ['Academy', 'Management', 'System']
        : role === 'Manager'
          ? ['Academy', 'Management']
          : role === 'Teacher'
            ? ['Teacher', 'TeacherSystem']
            : role === 'Finance'
              ? ['Finance', 'FinanceSystem']
              : ['Student', 'StudentFinance']

  // Mock company data
  const companies = [
    { id: '1', name: 'Sfera IT Academy' },
    { id: '2', name: 'Conceptzilla' },
    { id: '3', name: 'Shakuro' }
  ]
  
  const [currentCompany, setCurrentCompany] = useState(companies[0])

  const navGroups = sidebarData.navGroups
    .filter((group) => allowedGroups.includes(group.title))
    .map((group) => ({
      ...group,
      title: getGroupTitle(group.title, t),
      items: group.items.map((item) => {
        const { items: nestedItems, ...itemWithoutNestedItems } = item
        return {
          ...itemWithoutNestedItems,
          title: translateTitle(item.title, t),
          ...(nestedItems
            ? {
                items: nestedItems.map((nested) => ({
                  ...nested,
                  title: translateTitle(nested.title, t),
                })),
              }
            : {}),
        }
      }),
    })) as typeof sidebarData.navGroups

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader className='border-b border-sidebar-border px-4'>
        <div className='-mx-2'>
          {(role === 'Super Admin' || role === 'Admin' || role === 'Manager') && (
            <CompanySelector
              companies={companies}
              currentCompany={currentCompany}
              onCompanyChange={setCurrentCompany}
            />
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((props, index) => (
          <div key={props.title}>
            {index > 0 && (
              <div className='my-2 mx-3 h-px bg-sidebar-border/70 group-data-[collapsible=icon]:my-3 group-data-[collapsible=icon]:mx-2' />
            )}
            <NavGroup {...props} />
          </div>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function getGroupTitle(title: string, t: (key: TranslationKey) => string) {
  if (title === 'Academy') return t('academy')
  if (title === 'Management') return 'Boshqaruv'
  if (title === 'Teacher') return t('teacher')
  if (title === 'Finance') return t('finance')
  if (title === 'Student') return t('student')
  if (title === 'StudentFinance') return t('finance')
  return t('system')
}

function translateTitle(title: string, t: (key: TranslationKey) => string) {
  const map: Record<string, string> = {
    'Moliya paneli': t('financeDashboard'),
    'Finance dashboard': t('financeDashboard'),
    'To‘lovlar': t('payments'),
    Payments: t('payments'),
    Qarzdorlik: t('debt'),
    'Outstanding debt': t('debt'),
    'O‘quvchilar': t('students'),
    Students: t('students'),
    Hisobotlar: t('reports'),
    Reports: t('reports'),
    Vazifalar: t('tasks'),
    Tasks: t('tasks'),
    'Boshqaruv paneli': t('dashboard'),
    Dashboard: t('dashboard'),
    'Mening guruhlarim': t('myGroups'),
    'Mening kursim': t('myCourse'),
    'Mening guruhim': t('myGroup'),
    Jadvalim: t('mySchedule'),
    Davomatim: t('myAttendance'),
    Vazifalarim: t('myTasks'),
    Baholarim: t('myGrades'),
    'To‘lovlarim': t('myPayments'),
    'Bugungi darslar': t('todayLessons'),
    Davomat: t('attendance'),
    Baholar: t('grades'),
    Sozlamalar: t('settings'),
    Profil: t('profile'),
    Profilim: t('myProfile'),
    Hisob: t('account'),
    'Ko‘rinish': t('appearance'),
    Bildirishnomalar: t('notifications'),
    Ekran: t('display'),
    Guruhlar: t('groups'),
    Kurslar: t('courses'),
    'O‘qituvchilar': t('teachers'),
    Jadval: t('schedule'),
    Moliya: t('finance'),
    Arizalar: t('applications'),
  }
  return map[title] ?? title
}
