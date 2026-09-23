import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useLanguage } from '@/context/language-provider'
import { CompanyProfileDialog } from '@/components/ui/company-profile-dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building2, Plus } from 'lucide-react'

interface Company {
  id: string
  name: string
  description: string
  domains: string[]
  location: string
  status: 'active' | 'inactive' | 'pending'
  score: number
  contacts: number
  opportunities: number
  revenue: number
}

export const Route = createFileRoute('/_authenticated/companies')({
  component: CompaniesPage,
})

function CompaniesPage() {
  const { language } = useLanguage()
  const en = language === 'en'
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Mock companies data
  const companies: Company[] = [
    {
      id: '1',
      name: 'Apple',
      description: 'Technology company specializing in consumer electronics',
      domains: ['apple.com', 'icloud.com'],
      location: 'Cupertino, CA',
      status: 'active' as const,
      score: 85,
      contacts: 156,
      opportunities: 78,
      revenue: 128450
    },
    {
      id: '2',
      name: 'Microsoft',
      description: 'Multinational technology corporation',
      domains: ['microsoft.com', 'office.com'],
      location: 'Redmond, WA',
      status: 'active' as const,
      score: 92,
      contacts: 234,
      opportunities: 95,
      revenue: 198760
    },
    {
      id: '3',
      name: 'Google',
      description: 'Internet-related services and products',
      domains: ['google.com', 'youtube.com'],
      location: 'Mountain View, CA',
      status: 'active' as const,
      score: 88,
      contacts: 189,
      opportunities: 82,
      revenue: 156890
    },
    {
      id: '4',
      name: 'Amazon',
      description: 'Multinational technology company',
      domains: ['amazon.com', 'aws.com'],
      location: 'Seattle, WA',
      status: 'active' as const,
      score: 90,
      contacts: 267,
      opportunities: 110,
      revenue: 234560
    },
    {
      id: '5',
      name: 'Tesla',
      description: 'Electric vehicle and clean energy company',
      domains: ['tesla.com'],
      location: 'Austin, TX',
      status: 'active' as const,
      score: 87,
      contacts: 145,
      opportunities: 67,
      revenue: 98760
    }
  ]

  const handleCompanyClick = (company: Company) => {
    setSelectedCompany(company)
    setIsDialogOpen(true)
  }

  const navLinks = [
    { title: en ? 'Companies' : 'Kompaniyalar', href: '/companies', isActive: true },
  ]

  return (
    <>
      <Header>
        <TopNav links={navLinks} />
        <Search />
        <ThemeSwitch />
      </Header>
      <Main>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {en ? 'Companies' : 'Kompaniyalar'}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {en ? 'Manage your company relationships' : 'Kompaniya munosabatlaringizni boshqaring'}
            </p>
          </div>
          <Button>
            <Plus className="mr-2 size-4" />
            {en ? 'Add Company' : 'Kompaniya Qo\'shish'}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <div
              key={company.id}
              onClick={() => handleCompanyClick(company)}
              className="cursor-pointer rounded-lg border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                    <Building2 className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{company.name}</h3>
                    <p className="text-sm text-muted-foreground">{company.location}</p>
                  </div>
                </div>
                <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
                  {company.status === 'active' ? (en ? 'Active' : 'Faol') : (en ? 'Inactive' : 'Nofaol')}
                </Badge>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <span>{company.contacts} {en ? 'contacts' : 'kontakt'}</span>
                <span>•</span>
                <span>{company.opportunities} {en ? 'opportunities' : 'imkoniyat'}</span>
              </div>
            </div>
          ))}
        </div>

        <CompanyProfileDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          company={selectedCompany || companies[0]}
        />
      </Main>
    </>
  )
}