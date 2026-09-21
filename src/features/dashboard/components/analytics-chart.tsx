import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useLanguage } from '@/context/language-provider'

const data = [
  { name: 'Mon', income: 42, students: 28 },
  { name: 'Tue', income: 51, students: 34 },
  { name: 'Wed', income: 68, students: 41 },
  { name: 'Thu', income: 59, students: 38 },
  { name: 'Fri', income: 82, students: 47 },
  { name: 'Sat', income: 76, students: 44 },
  { name: 'Sun', income: 98, students: 52 },
]

export function AnalyticsChart() {
  const { language, t } = useLanguage()
  const days =
    language === 'en'
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha', 'Ya']
  const chartData = data.map((item, index) => ({ ...item, name: days[index] }))

  return (
    <ResponsiveContainer width='100%' height={300}>
      <AreaChart
        data={chartData}
        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
      >
        <CartesianGrid vertical={false} strokeDasharray='3 3' opacity={0.35} />
        <XAxis
          dataKey='name'
          stroke='hsl(var(--muted-foreground))'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='hsl(var(--muted-foreground))'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          formatter={(value, name) => [
            value,
            name === 'income' ? t('income') : t('studentsEnrolled'),
          ]}
          contentStyle={{
            borderRadius: 12,
            borderColor: 'var(--border)',
            background: 'var(--card)',
          }}
        />
        <Legend
          formatter={(value) =>
            value === 'income' ? t('income') : t('studentsEnrolled')
          }
        />
        <Area
          type='monotone'
          dataKey='income'
          name={t('income')}
          stroke='var(--primary)'
          fill='var(--primary)'
          fillOpacity={0.15}
        />
        <Area
          type='monotone'
          dataKey='students'
          name={t('studentsEnrolled')}
          stroke='hsl(var(--muted-foreground))'
          fill='hsl(var(--muted-foreground))'
          fillOpacity={0.1}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
