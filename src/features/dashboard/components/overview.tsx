import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useLanguage } from '@/context/language-provider'
import { loadCourses } from '@/features/courses/data'

const monthNames = [
  'Yan',
  'Fev',
  'Mar',
  'Apr',
  'May',
  'Iyun',
  'Iyul',
  'Avg',
  'Sen',
  'Okt',
  'Noy',
  'Dek',
]

const formatMillions = (value: number) => `${Math.round(value / 1000000)} mln`

export function Overview() {
  const { language, t } = useLanguage()
  const english = language === 'en'
  const courses = loadCourses()
  const chartData = monthNames.map((name, index) => ({
    total: courses.reduce(
      (sum, course) =>
        sum +
        course.students.reduce((studentSum, student) => {
          const paymentMonth = Number(student.lastPaymentDate.slice(5, 7)) - 1
          return studentSum + (paymentMonth === index ? student.paidAmount : 0)
        }, 0),
      0
    ),
    name: english
      ? [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ][index]
      : name,
  }))
  return (
    <ResponsiveContainer width='100%' height={320}>
      <BarChart
        data={chartData}
        margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
      >
        <CartesianGrid vertical={false} strokeDasharray='3 3' opacity={0.35} />
        <XAxis
          dataKey='name'
          stroke='var(--muted-foreground)'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--muted-foreground)' }}
        />
        <YAxis
          stroke='var(--muted-foreground)'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatMillions}
          width={48}
          tick={{ fill: 'var(--muted-foreground)' }}
        />
        <Tooltip
          cursor={{ fill: 'var(--muted)', opacity: 0.35 }}
          position={{ y: 4 }}
          wrapperStyle={{ zIndex: 1000 }}
          content={({ active, payload, label }) =>
            active && payload?.length ? (
              <div
                style={{
                  minWidth: 160,
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--card)',
                  padding: '10px 12px',
                  color: 'var(--card-foreground)',
                  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.22)',
                }}
              >
                <p style={{ margin: 0, fontWeight: 700 }}>{label}</p>
                <p
                  style={{
                    margin: '4px 0 0',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  {t('income')}:
                  <strong style={{ color: 'var(--card-foreground)' }}>
                    {Number(payload[0].value).toLocaleString('uz-UZ')} so‘m
                  </strong>
                </p>
              </div>
            ) : null
          }
        />
        <Bar
          dataKey='total'
          fill='var(--primary)'
          radius={[5, 5, 0, 0]}
          maxBarSize={34}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
