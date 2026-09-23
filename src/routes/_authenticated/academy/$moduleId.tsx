import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useLanguage } from '@/context/language-provider'
import { useApiStore } from '@/lib/api-store'
import { LeadsScoring } from '@/features/academy-module/leads-scoring'

export const Route = createFileRoute('/_authenticated/academy/$moduleId')({
  component: AcademyModulePage,
})

function AcademyModulePage() {
  const { language } = useLanguage()
  const en = language === 'en'
  const crm = useApiStore()

  // Mock leads data for LeadsScoring
  const leads = crm.applications.map((app, index) => ({
    id: app.id,
    name: app.name,
    company: 'Sfera IT Academy',
    email: `lead${index}@example.com`,
    source: 'Website',
    score: 70 + (index % 30), // Score 70-99 based on index
    status: index % 3 === 0 ? 'new' : index % 3 === 1 ? 'qualified' : 'hot',
    lastActivity: '2 hours ago',
    engagementLevel: index % 2 === 0 ? 'high' : 'medium' as 'high' | 'medium' | 'low'
  }))

  const navLinks = [
    { title: en ? 'Academy' : 'Akademiya', href: '/academy', isActive: false },
    { title: en ? 'Leads' : 'Arizalar', href: '/academy/leads', isActive: true },
  ]

  return (
    <>
      <Header>
        <TopNav links={navLinks} />
        <Search />
        <ThemeSwitch />
      </Header>
      <Main>
        <LeadsScoring leads={leads} />
      </Main>
    </>
  )
}