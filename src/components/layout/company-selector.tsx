import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Building2, Plus, Link as LinkIcon, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/context/language-provider'

interface Company {
  id: string
  name: string
  logo?: string
}

interface CompanySelectorProps {
  companies: Company[]
  currentCompany: Company
  onCompanyChange: (company: Company) => void
  onCreateCompany?: () => void
  onLinkCompany?: () => void
}

export function CompanySelector({ 
  companies, 
  currentCompany, 
  onCompanyChange,
  onCreateCompany,
  onLinkCompany 
}: CompanySelectorProps) {
  const { language } = useLanguage()
  const en = language === 'en'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Building2 className="size-4" />
          <span className="hidden sm:inline">{currentCompany.name}</span>
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>{en ? 'Select Company' : 'Kompaniyani Tanlang'}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {companies.map((company) => (
          <DropdownMenuItem
            key={company.id}
            onClick={() => onCompanyChange(company)}
            className={company.id === currentCompany.id ? 'bg-accent' : ''}
          >
            <Building2 className="mr-2 size-4" />
            {company.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onCreateCompany}>
          <Plus className="mr-2 size-4" />
          {en ? 'Create Company' : 'Kompaniya Yaratish'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLinkCompany}>
          <LinkIcon className="mr-2 size-4" />
          {en ? 'Link Another Company' : 'Boshqa Kompaniyani Bog\'lash'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}