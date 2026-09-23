import { useState } from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  Download,
  Filter
} from 'lucide-react'
import { useLanguage } from '@/context/language-provider'
import { SummaryCards, useSummaryCards } from '@/components/ui/summary-cards'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b']

export function AnalyticsDashboard() {
  const { language } = useLanguage()
  const en = language === 'en'
  const [timeRange, setTimeRange] = useState('30d')
  const { academyCards } = useSummaryCards()

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 12000, target: 10000 },
    { month: 'Feb', revenue: 15000, target: 12000 },
    { month: 'Mar', revenue: 18000, target: 15000 },
    { month: 'Apr', revenue: 22000, target: 18000 },
    { month: 'May', revenue: 28000, target: 22000 },
    { month: 'Jun', revenue: 32000, target: 25000 },
  ]

  const studentGrowthData = [
    { month: 'Jan', new: 15, active: 120 },
    { month: 'Feb', new: 22, active: 135 },
    { month: 'Mar', new: 18, active: 148 },
    { month: 'Apr', new: 25, active: 165 },
    { month: 'May', new: 20, active: 180 },
    { month: 'Jun', new: 28, active: 198 },
  ]

  const courseDistribution = [
    { name: en ? 'Web Development' : 'Web Dasturlash', value: 35 },
    { name: en ? 'Mobile Apps' : 'Mobil Ilovalar', value: 25 },
    { name: en ? 'Data Science' : 'Data Science', value: 20 },
    { name: en ? 'UI/UX Design' : 'UI/UX Dizayn', value: 12 },
    { name: en ? 'DevOps' : 'DevOps', value: 8 },
  ]

  const funnelData = [
    { stage: en ? 'Leads' : 'Arizalar', count: 500 },
    { stage: en ? 'Qualified' : 'Tasdiqlangan', count: 350 },
    { stage: en ? 'Trial' : 'Sinov', count: 280 },
    { stage: en ? 'Enrolled' : 'Qabul qilingan', count: 198 },
    { stage: en ? 'Active' : 'Faol', count: 180 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {en ? 'Analytics Dashboard' : 'Tahlil Dashboardi'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {en ? 'Comprehensive analytics and performance metrics' : 'Keng qamrovli tahlil va unumdorlik metrikalari'}
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">{en ? 'Last 7 days' : 'Oxirgi 7 kun'}</SelectItem>
              <SelectItem value="30d">{en ? 'Last 30 days' : 'Oxirgi 30 kun'}</SelectItem>
              <SelectItem value="90d">{en ? 'Last 90 days' : 'Oxirgi 90 kun'}</SelectItem>
              <SelectItem value="1y">{en ? 'Last year' : 'Oxirgi yil'}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 size-4" />
            {en ? 'Filters' : 'Filterlar'}
          </Button>
          <Button variant="outline">
            <Download className="mr-2 size-4" />
            {en ? 'Export' : 'Eksport'}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards cards={academyCards} />

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="size-5 text-emerald-600" />
              {en ? 'Revenue Trends' : 'Daromad Trendlari'}
            </CardTitle>
            <CardDescription>
              {en ? 'Monthly revenue vs target' : 'Oylik daromad vs maqsad'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      `$${value.toLocaleString()}`,
                      name === 'revenue' ? (en ? 'Revenue' : 'Daromad') : (en ? 'Target' : 'Maqsad')
                    ]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    fill="url(#revenueGradient)"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#64748b" 
                    strokeDasharray="5 5"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Student Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5 text-blue-600" />
              {en ? 'Student Growth' : 'O\'quvchi O\'sishi'}
            </CardTitle>
            <CardDescription>
              {en ? 'New enrollments and active students' : 'Yangi qabullar va faol o\'quvchilar'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      value,
                      name === 'new' ? (en ? 'New Students' : 'Yangi O\'quvchilar') : (en ? 'Active Students' : 'Faol O\'quvchilar')
                    ]}
                  />
                  <Bar dataKey="new" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="active" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Course Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="size-5 text-purple-600" />
              {en ? 'Course Distribution' : 'Kurs Taqsimoti'}
            </CardTitle>
            <CardDescription>
              {en ? 'Students by course category' : 'Kurs bo\'yicha o\'quvchilar'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={courseDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {courseDistribution.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {courseDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="size-3 rounded-full" 
                      style={{ backgroundColor: COLORS[courseDistribution.indexOf(item) % COLORS.length] }}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Funnel Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5 text-primary" />
              {en ? 'Conversion Funnel' : 'Konvertatsiya Voronkasi'}
            </CardTitle>
            <CardDescription>
              {en ? 'Lead to student conversion pipeline' : 'Arizadan o\'quvchigacha konvertatsiya'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal />
                  <XAxis type="number" />
                  <YAxis dataKey="stage" type="category" width={100} />
                  <Tooltip formatter={(value) => value} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2 text-center">
              {funnelData.map((item) => (
                <div key={item.stage} className="rounded-lg bg-muted/50 p-2">
                  <div className="text-lg font-bold">{item.count}</div>
                  <div className="text-xs text-muted-foreground truncate">{item.stage}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}