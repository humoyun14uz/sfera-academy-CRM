import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  Star, 
  TrendingUp, 
  Target, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Zap
} from 'lucide-react'
import { useLanguage } from '@/context/language-provider'

interface Lead {
  id: string
  name: string
  company: string
  email: string
  source: string
  score: number
  status: 'new' | 'qualified' | 'hot' | 'converted' | 'lost'
  lastActivity: string
  engagementLevel: 'low' | 'medium' | 'high'
}

interface LeadsScoringProps {
  leads: Lead[]
}

export function LeadsScoring({ leads }: LeadsScoringProps) {
  const { language } = useLanguage()
  const en = language === 'en'

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
      case 'qualified': return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
      case 'hot': return 'bg-orange-500/10 text-orange-700 dark:text-orange-300'
      case 'converted': return 'bg-purple-500/10 text-purple-700 dark:text-purple-300'
      case 'lost': return 'bg-red-500/10 text-red-700 dark:text-red-300'
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-300'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getEngagementIcon = (level: string) => {
    switch (level) {
      case 'high': return <Zap className="size-4 text-emerald-600" />
      case 'medium': return <Clock className="size-4 text-blue-600" />
      case 'low': return <AlertCircle className="size-4 text-red-600" />
      default: return <AlertCircle className="size-4 text-gray-600" />
    }
  }

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    hot: leads.filter(l => l.status === 'hot').length,
    avgScore: Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length)
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="size-4 text-primary" />
              {en ? 'New Leads' : 'Yangi Arizalar'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.new}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {en ? 'Fresh applications' : 'Yangi arizalar'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="size-4 text-emerald-600" />
              {en ? 'Qualified' : 'Tasdiqlangan'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.qualified}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {en ? 'Ready for contact' : 'Aloqa uchun tayyor'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="size-4 text-orange-600" />
              {en ? 'Hot Leads' : 'Issiq Arizalar'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hot}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {en ? 'High priority' : 'Yuqori ustunlik'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="size-4 text-blue-600" />
              {en ? 'Avg Score' : 'O\'rtacha Ball'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(stats.avgScore)}`}>
              {stats.avgScore}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {en ? 'Lead quality score' : 'Ariza sifati balli'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table with Scoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="size-5 text-primary" />
            {en ? 'Leads with Scoring' : 'Ball bilan Arizalar'}
          </CardTitle>
          <CardDescription>
            {en ? 'AI-powered lead scoring and prioritization' : 'AI bilan ball berish va ustunlik belgilash'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="p-3">{en ? 'Customer' : 'Mijoz'}</th>
                  <th className="p-3">{en ? 'Company' : 'Kompaniya'}</th>
                  <th className="p-3">{en ? 'Email' : 'Email'}</th>
                  <th className="p-3">{en ? 'Source' : 'Manba'}</th>
                  <th className="p-3">{en ? 'Score' : 'Ball'}</th>
                  <th className="p-3">{en ? 'Status' : 'Holat'}</th>
                  <th className="p-3">{en ? 'Engagement' : 'Faollashuv'}</th>
                  <th className="p-3">{en ? 'Actions' : 'Harakatlar'}</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-3 font-medium">{lead.name}</td>
                    <td className="p-3">{lead.company}</td>
                    <td className="p-3">{lead.email}</td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-xs">
                        {lead.source}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${getScoreColor(lead.score)}`}>
                          {lead.score}
                        </span>
                        <Progress value={lead.score} className="w-16 h-2" />
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status === 'new' ? (en ? 'New' : 'Yangi') :
                         lead.status === 'qualified' ? (en ? 'Qualified' : 'Tasdiqlangan') :
                         lead.status === 'hot' ? (en ? 'Hot' : 'Issiq') :
                         lead.status === 'converted' ? (en ? 'Converted' : 'Konvertatsiya qilingan') :
                         (en ? 'Lost' : 'Yo\'qolgan')}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {getEngagementIcon(lead.engagementLevel)}
                        <span className="text-xs capitalize">{lead.engagementLevel}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          {en ? 'View' : 'Ko\'rish'}
                        </Button>
                        <Button variant="ghost" size="sm">
                          {en ? 'Contact' : 'Aloqa'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}