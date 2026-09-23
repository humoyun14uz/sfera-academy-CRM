import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Target, 
  Calendar,
  Building2,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { useLanguage } from '@/context/language-provider'

interface SummaryCardProps {
  title: string
  value: string | number
  description: string
  trend?: {
    value: number
    isPositive: boolean
  }
  icon?: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

interface SummaryCardsProps {
  cards: SummaryCardProps[]
}

export function SummaryCards({ cards }: SummaryCardsProps) {
  const { language } = useLanguage()
  const en = language === 'en'

  const getCardIcon = (variant: string) => {
    switch (variant) {
      case 'success': return <CheckCircle className="size-5 text-emerald-600" />
      case 'warning': return <Clock className="size-5 text-amber-600" />
      case 'danger': return <AlertCircle className="size-5 text-red-600" />
      default: return <Target className="size-5 text-primary" />
    }
  }

  const getCardBg = (variant: string) => {
    switch (variant) {
      case 'success': return 'bg-emerald-500/5 border-emerald-500/20'
      case 'warning': return 'bg-amber-500/5 border-amber-500/20'
      case 'danger': return 'bg-red-500/5 border-red-500/20'
      default: return 'bg-primary/5 border-primary/20'
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index} className={`border ${getCardBg(card.variant || 'default')}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            {card.icon || getCardIcon(card.variant || 'default')}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="flex items-center gap-2 mt-1">
              {card.trend && (
                <div className={`flex items-center text-xs ${
                  card.trend.isPositive ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {card.trend.isPositive ? (
                    <TrendingUp className="size-3 mr-1" />
                  ) : (
                    <TrendingDown className="size-3 mr-1" />
                  )}
                  {Math.abs(card.trend.value)}%
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Pre-built summary card configurations for common use cases
export const useSummaryCards = () => {
  const { language } = useLanguage()
  const en = language === 'en'

  return {
    // Academy Dashboard Cards
    academyCards: [
      {
        title: en ? 'Total Students' : 'Jami O\'quvchilar',
        value: 156,
        description: en ? '+12% from last month' : 'O\'tgan oydan +12%',
        trend: { value: 12, isPositive: true },
        icon: <Users className="size-5 text-blue-600" />,
        variant: 'default'
      },
      {
        title: en ? 'Active Students' : 'Faol O\'quvchilar',
        value: 142,
        description: en ? '91% attendance rate' : '91% davomat foizi',
        trend: { value: 5, isPositive: true },
        icon: <CheckCircle className="size-5 text-emerald-600" />,
        variant: 'success'
      },
      {
        title: en ? 'Monthly Revenue' : 'Oylik Daromad',
        value: '$45,230',
        description: en ? '+8% from last month' : 'O\'tgan oydan +8%',
        trend: { value: 8, isPositive: true },
        icon: <DollarSign className="size-5 text-emerald-600" />,
        variant: 'success'
      },
      {
        title: en ? 'Pending Tasks' : 'Kutilmoqda Vazifalar',
        value: 23,
        description: en ? '5 urgent tasks' : '5 shoshilinch vazifa',
        trend: { value: 15, isPositive: false },
        icon: <Clock className="size-5 text-amber-600" />,
        variant: 'warning'
      }
    ],

    // Company Dashboard Cards
    companyCards: [
      {
        title: en ? 'Active Opportunities' : 'Faol Imkoniyatlar',
        value: 78,
        description: en ? '+3.5% from last month' : 'O\'tgan oydan +3.5%',
        trend: { value: 3.5, isPositive: true },
        icon: <Target className="size-5 text-primary" />,
        variant: 'default'
      },
      {
        title: en ? 'Deals Closed' : 'Yopilgan Bitimlar',
        value: 15,
        description: en ? 'This month' : 'Bu oy',
        trend: { value: 1.2, isPositive: false },
        icon: <CheckCircle className="size-5 text-emerald-600" />,
        variant: 'success'
      },
      {
        title: en ? 'Avg Response Time' : 'O\'rtacha Javob Vaqti',
        value: '4.2d',
        description: en ? '+0.8% from last month' : 'O\'tgan oydan +0.8%',
        trend: { value: 0.8, isPositive: true },
        icon: <Clock className="size-5 text-blue-600" />,
        variant: 'default'
      },
      {
        title: en ? 'Total Revenue' : 'Jami Daromad',
        value: '$128,450',
        description: en ? '+12% from last quarter' : 'O\'tgan chorakdan +12%',
        trend: { value: 12, isPositive: true },
        icon: <DollarSign className="size-5 text-emerald-600" />,
        variant: 'success'
      }
    ],

    // Lead Management Cards
    leadCards: [
      {
        title: en ? 'New Leads' : 'Yangi Arizalar',
        value: 45,
        description: en ? 'This week' : 'Bu hafta',
        trend: { value: 18, isPositive: true },
        icon: <Users className="size-5 text-blue-600" />,
        variant: 'default'
      },
      {
        title: en ? 'Qualified Leads' : 'Tasdiqlangan Arizalar',
        value: 32,
        description: en ? '71% conversion rate' : '71% konvertatsiya foizi',
        trend: { value: 5, isPositive: true },
        icon: <CheckCircle className="size-5 text-emerald-600" />,
        variant: 'success'
      },
      {
        title: en ? 'Hot Leads' : 'Issiq Arizalar',
        value: 12,
        description: en ? 'High priority' : 'Yuqori ustunlik',
        trend: { value: 25, isPositive: true },
        icon: <Target className="size-5 text-orange-600" />,
        variant: 'warning'
      },
      {
        title: en ? 'Lost Leads' : 'Yo\'qolgan Arizalar',
        value: 8,
        description: en ? 'This month' : 'Bu oy',
        trend: { value: 12, isPositive: false },
        icon: <AlertCircle className="size-5 text-red-600" />,
        variant: 'danger'
      }
    ]
  }
}