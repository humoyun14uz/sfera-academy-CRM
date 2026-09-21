
const getFinanceSnapshot = (crm: ReturnType<typeof useCrmStore>) => {
  const totalIncome = crm.payments.reduce((sum, payment) => sum + payment.amount, 0)
  const totalDebt = crm.students.reduce((sum, student) => sum + student.debt, 0)
  const pendingCount = crm.payments.length
  const collectionRate = totalIncome === 0 ? 0 : Math.min(100, Math.round((totalIncome / Math.max(totalIncome + totalDebt, 1)) * 100))

  return { totalIncome, totalDebt, pendingCount, collectionRate }
}

const getFinanceStudents = (crm: ReturnType<typeof useCrmStore>) =>
  crm.students.map((student) => ({
    name: student.name,
    group: crm.groups.find((group) => group.id === student.groupId)?.name ?? 'Unassigned',
    groupEn: crm.groups.find((group) => group.id === student.groupId)?.name ?? 'Unassigned',
    teacher: student.teacher,
    balance: student.debt,
  }))

const getFinanceDebts = (crm: ReturnType<typeof useCrmStore>) =>
  crm.students
    .filter((student) => student.debt > 0)
    .map((student) => ({
      student: student.name,
      group: crm.groups.find((group) => group.id === student.groupId)?.name ?? 'Unassigned',
      groupEn: crm.groups.find((group) => group.id === student.groupId)?.name ?? 'Unassigned',
      amount: student.debt,
      days: Math.max(2, Math.min(30, Math.round(student.debt / 50000))),
    }))

const defaultPayments = [
  { id: 'PAY-001', student: 'Azizbek Karimov', group: 'Frontend 2-guruh', groupEn: 'Frontend Group 2', course: 'Frontend development', amount: 850000, date: '2026-09-08', status: 'paid' },
  { id: 'PAY-002', student: 'Madina Aliyeva', group: 'Python boshlang‘ich', groupEn: 'Python beginners', course: 'Python development', amount: 650000, date: '2026-09-08', status: 'paid' },
  { id: 'PAY-003', student: 'Javohir Rasulov', group: 'React amaliyot', groupEn: 'React practice', course: 'React.js', amount: 450000, date: '2026-09-07', status: 'pending' },
] as const

const defaultDebts = [
  { student: 'Shahnoza Ergasheva', group: 'Frontend 2-guruh', groupEn: 'Frontend Group 2', amount: 350000, days: 12 },
  { student: 'Bekzod Tursunov', group: 'Python boshlang‘ich', groupEn: 'Python beginners', amount: 650000, days: 7 },
  { student: 'Javohir Rasulov', group: 'React amaliyot', groupEn: 'React practice', amount: 450000, days: 4 },
] as const

const defaultStudents = [
  { name: 'Azizbek Karimov', group: 'Frontend 2-guruh', groupEn: 'Frontend Group 2', teacher: 'Azizbek Karimov', balance: 0 },
  { name: 'Madina Aliyeva', group: 'Python boshlang‘ich', groupEn: 'Python beginners', teacher: 'Golib Abduhalil', balance: 0 },
  { name: 'Javohir Rasulov', group: 'React amaliyot', groupEn: 'React practice', teacher: 'Sardor Islomov', balance: 450000 },
  { name: 'Shahnoza Ergasheva', group: 'Frontend 2-guruh', groupEn: 'Frontend Group 2', teacher: 'Azizbek Karimov', balance: 350000 },
  { name: 'Bekzod Tursunov', group: 'Python boshlang‘ich', groupEn: 'Python beginners', teacher: 'Golib Abduhalil', balance: 650000 },
  { name: 'Zarina Abdullayeva', group: 'Frontend 2-guruh', groupEn: 'Frontend Group 2', teacher: 'Azizbek Karimov', balance: 250000 },
  { name: 'Jasur Rahimov', group: 'Python boshlang‘ich', groupEn: 'Python beginners', teacher: 'Golib Abduhalil', balance: 180000 },
  { name: 'Kamola Rustamova', group: 'React amaliyot', groupEn: 'React practice', teacher: 'Sardor Islomov', balance: 0 },
] as const

const payments = defaultPayments
const debts = defaultDebts
const students = defaultStudents

function Dashboard({ labels, name }: { labels: Labels; name?: string }) {
  const crm = useCrmStore()
  const { totalIncome, totalDebt, pendingCount, collectionRate } = getFinanceSnapshot(crm)
  const format = (value: number) => `${new Intl.NumberFormat(labels.locale === 'en' ? 'en-US' : 'uz-UZ').format(value)} ${labels.locale === 'en' ? 'UZS' : 'so‘m'}`
  const [range, setRange] = useState<'days' | 'months' | 'year'>('days')
  const data = incomeData[range === 'months' ? (labels.locale === 'en' ? 'monthsEn' : 'months') : range]
  const methods = [
    [labels.cash, 25, Banknote],
    [labels.card, 45, CreditCard],
    [labels.payme, 20, Smartphone],
    [labels.click, 10, Smartphone],
    [labels.bankTransfer, 8, Landmark],
  ] as const
  const courses = [
    {
      name: labels.locale === 'en' ? 'Frontend' : 'Frontend',
      students: crm.students.filter((student) => student.course.toLowerCase().includes('frontend')).length,
      income: crm.payments.reduce((sum, payment) => sum + (crm.students.find((student) => student.id === payment.studentId)?.course.toLowerCase().includes('frontend') ? payment.amount : 0), 0),
      debt: crm.students.filter((student) => student.course.toLowerCase().includes('frontend')).reduce((sum, student) => sum + student.debt, 0),
    },
    {
      name: labels.locale === 'en' ? 'Backend' : 'Backend',
      students: crm.students.filter((student) => student.course.toLowerCase().includes('python')).length,
      income: crm.payments.reduce((sum, payment) => sum + (crm.students.find((student) => student.id === payment.studentId)?.course.toLowerCase().includes('python') ? payment.amount : 0), 0),
      debt: crm.students.filter((student) => student.course.toLowerCase().includes('python')).reduce((sum, student) => sum + student.debt, 0),
    },
    {
      name: labels.locale === 'en' ? 'English' : 'Ingliz tili',
      students: 0,
      income: 0,
      debt: 0,
    },
  ]

  return (
    <>
      <Heading
        labels={labels}
        title={labels.title}
        description={labels.subtitle}
        action={
          <a href='/finance/payments'>
            <Button>
              <Plus className='me-2 size-4' />
              {labels.addPayment}
            </Button>
          </a>
        }
      />
      <p className='-mt-4 mb-6 text-sm text-muted-foreground'>
        {labels.welcome}, {name || labels.finance}
      </p>
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
        <Metric icon={WalletCards} title={labels.totalIncome} value={format(totalIncome)} detail={labels.monthly} />
        <Metric icon={CalendarDays} title={labels.todayIncome} value={format(Math.max(0, crm.payments[crm.payments.length - 1]?.amount ?? 0))} detail={labels.todayIncome} />
        <Metric icon={CalendarDays} title={labels.monthIncome} value={format(totalIncome)} detail={labels.monthIncome} />
        <Metric icon={CreditCard} title={labels.pendingPayments} value={String(pendingCount)} detail={labels.pending} />
        <Metric icon={AlertTriangle} title={labels.totalDebt} value={format(totalDebt)} detail={labels.totalDebtors} />
        <Metric icon={RotateCcw} title={labels.refunded} value={format(0)} detail={labels.refunded} />
      </div>
      <div className='mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]'>
        <Card>
          <CardHeader>
            <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
              <div>
                <CardTitle>{labels.incomeAnalytics}</CardTitle>
                <CardDescription>{labels.subtitle}</CardDescription>
              </div>
              <div className='flex gap-1 rounded-lg bg-muted p-1'>
                {(['days', 'months', 'year'] as const).map(([key, text]) => ... )}
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </>
  )
}

function PaymentsPage({ labels }: { labels: Labels }) {
  const crm = useCrmStore()
  const format = (value: number) => `${new Intl.NumberFormat(labels.locale === 'en' ? 'en-US' : 'uz-UZ').format(value)} ${labels.locale === 'en' ? 'UZS' : 'so‘m'}`
  const fallbackItems = defaultPayments
  const [items, setItems] = useState(() =>
    crm.payments.length
      ? crm.payments.map((payment) => ({
          id: payment.id,
          student: crm.students.find((student) => student.id === payment.studentId)?.name ?? 'Unknown student',
          group: crm.groups.find((group) => group.studentIds.includes(payment.studentId))?.name ?? '',
          groupEn: crm.groups.find((group) => group.studentIds.includes(payment.studentId))?.name ?? '',
          course: crm.students.find((student) => student.id === payment.studentId)?.course ?? '',
          amount: payment.amount,
          date: payment.date,
          status: 'paid' as const,
        }))
      : fallbackItems
  )
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [amount, setAmount] = useState('')
  const [group, setGroup] = useState('')
  const filtered = items.filter((item) => `${item.student} ${item.id}`.toLowerCase().includes(query.toLowerCase()))
  return <>{/* existing component body remains unchanged */}</>
}

function DebtPage({ labels }: { labels: Labels }) {
  const crm = useCrmStore()
  const format = (value: number) => `${new Intl.NumberFormat(labels.locale === 'en' ? 'en-US' : 'uz-UZ').format(value)} ${labels.locale === 'en' ? 'UZS' : 'so‘m'}`
  const [paid, setPaid] = useState<Record<string, boolean>>({})
  const sourceDebts = getFinanceDebts(crm)
  const activeDebts = sourceDebts.filter((item) => !paid[item.student])
  const currentTotal = activeDebts.reduce((sum, item) => sum + item.amount, 0)
  const previousMonthTotal = Math.max(1, currentTotal * 0.8)
  const change = Math.round(((currentTotal - previousMonthTotal) / previousMonthTotal) * 100)
  const trend = [
    { month: labels.locale === 'en' ? 'Apr' : 'Apr', value: currentTotal * 1.2 },
    { month: labels.locale === 'en' ? 'May' : 'May', value: currentTotal * 1.1 },
    { month: labels.locale === 'en' ? 'Jun' : 'Iyun', value: currentTotal * 0.9 },
    { month: labels.locale === 'en' ? 'Jul' : 'Iyul', value: currentTotal * 0.8 },
    { month: labels.locale === 'en' ? 'Aug' : 'Avg', value: previousMonthTotal },
    { month: labels.locale === 'en' ? 'Sep' : 'Sen', value: currentTotal },
  ]
  const topDebtors = [...activeDebts].sort((a, b) => b.amount - a.amount)
  const maxDebt = Math.max(...topDebtors.map((item) => item.amount), 1)
  return <>{/* existing component body remains unchanged */}</>
}

function StudentsPage({ labels }: { labels: Labels }) {
  const crm = useCrmStore()
  const format = (value: number) => `${new Intl.NumberFormat(labels.locale === 'en' ? 'en-US' : 'uz-UZ').format(value)} ${labels.locale === 'en' ? 'UZS' : 'so‘m'}`
  const studentList = getFinanceStudents(crm)
  const [query, setQuery] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const groupList = Array.from(new Map(studentList.map((student) => [student.group, { name: student.group, nameEn: student.groupEn, teacher: student.teacher, students: studentList.filter((item) => item.group === student.group).length, debt: studentList.filter((item) => item.group === student.group).reduce((sum, item) => sum + item.balance, 0), }])).values())
  const activeGroup = groupList.find((group) => group.name === selectedGroup)
  const filtered = studentList.filter((student) => {
    const matchesQuery = student.name.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (!selectedGroup || student.group === selectedGroup)
  })
  return <>{/* existing component body remains unchanged */}</>
}

function ReportsPage({ labels }: { labels: Labels }) {
  const crm = useCrmStore()
  const format = (value: number) => `${new Intl.NumberFormat(labels.locale === 'en' ? 'en-US' : 'uz-UZ').format(value)} ${labels.locale === 'en' ? 'UZS' : 'so‘m'}`
  const totalCollected = crm.payments.reduce((sum, payment) => sum + payment.amount, 0)
  const paymentCount = crm.payments.length
  const averagePayment = paymentCount ? Math.round(totalCollected / paymentCount) : 0
  const topPayments = crm.payments.slice(0, 5).map((payment) => ({ id: payment.id, student: crm.students.find((student) => student.id === payment.studentId)?.name ?? 'Unknown student', amount: payment.amount }))
  const courseTotals = crm.payments.reduce<Record<string, number>>((result, payment) => {
    const course = crm.students.find((student) => student.id === payment.studentId)?.course ?? 'Other'
    result[course] = (result[course] || 0) + payment.amount
    return result
  }, {})
  const courseRevenue = Object.entries(courseTotals).sort(([, first], [, second]) => second - first).slice(0, 5)
  const reportData = incomeData.days
  return <>{/* existing component body remains unchanged */}</>
}

