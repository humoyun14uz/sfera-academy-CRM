import { createFileRoute } from '@tanstack/react-router'
import { AnalyticsDashboard } from '@/features/dashboard/analytics-dashboard'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useLanguage } from '@/context/language-provider'

export const Route = createFileRoute('/_authenticated/analytics')({
  component: AnalyticsPage,
})

function AnalyticsPage() {
  const { language } = useLanguage()
  const en = language === 'en'

  return (
    <>
      <Header>
        <TopNav links={[{ title: en ? 'Analytics' : 'Tahlil', href: '/analytics', isActive: true }]} />
        <Search />
        <ThemeSwitch />
      </Header>
      <Main>
        <AnalyticsDashboard />
      </Main>
    </>
  )
}