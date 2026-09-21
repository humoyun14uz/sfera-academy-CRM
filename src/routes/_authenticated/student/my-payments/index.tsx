import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  Download,
  FileText,
  Landmark,
  Phone,
  Receipt,
  ShieldCheck,
  Smartphone,
} from 'lucide-react'
import { toast } from 'sonner'
import { requireRole } from '@/lib/route-guard'
import { useLanguage } from '@/context/language-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Search as GlobalSearch } from '@/components/search'

export const Route = createFileRoute('/_authenticated/student/my-payments/')({
  beforeLoad: () => requireRole('Student'),
  component: MyPaymentsPage,
})

type Invoice = {
  id: string
  month: string
  amount: string
  date: string
  method: string
  status: 'paid' | 'pending'
}

const PAYMENT_METHODS = [
  {
    id: 'payme',
    label: 'Payme',
    desc: 'Payme ilovasi orqali',
    icon: Smartphone,
    color: 'text-blue-600',
    bg: 'bg-blue-500/10',
  },
  {
    id: 'click',
    label: 'Click',
    desc: 'Click ilovasi orqali',
    icon: Phone,
    color: 'text-green-600',
    bg: 'bg-green-500/10',
  },
  {
    id: 'bank',
    label: "Bank o'tkazmasi",
    desc: 'Hisobdan hisob raqamga',
    icon: Landmark,
    color: 'text-purple-600',
    bg: 'bg-purple-500/10',
  },
]

const invoices = [
  {
    id: 'INV-2026-081',
    month: '1-oy (Mart 2026)',
    amount: '1,200,000 UZS',
    date: '02-Mart 2026',
    method: 'Payme',
    status: 'paid',
  },
  {
    id: 'INV-2026-082',
    month: '2-oy (Aprel 2026)',
    amount: '1,200,000 UZS',
    date: '04-Aprel 2026',
    method: 'Click Up',
    status: 'paid',
  },
  {
    id: 'INV-2026-083',
    month: '3-oy (May 2026)',
    amount: '1,200,000 UZS',
    date: '03-May 2026',
    method: 'Payme',
    status: 'paid',
  },
  {
    id: 'INV-2026-084',
    month: '4-oy (Iyun 2026)',
    amount: '1,200,000 UZS',
    date: '01-Iyun 2026',
    method: 'Bank o‘tkazmasi',
    status: 'paid',
  },
  {
    id: 'INV-2026-085',
    month: '5-oy (Iyul 2026)',
    amount: '1,200,000 UZS',
    date: '05-Iyul 2026',
    method: 'Click Up',
    status: 'paid',
  },
  {
    id: 'INV-2026-086',
    month: '6-oy (Avgust 2026)',
    amount: '1,200,000 UZS',
    date: 'Kutilmoqda',
    method: 'Payme / Click',
    status: 'pending',
  },
] as Invoice[]

function MyPaymentsPage() {
  const { language } = useLanguage()
  const english = language === 'en'
  const [invoicesList] = useState<Invoice[]>(invoices)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showContractModal, setShowContractModal] = useState(false)
  const [selectedPayMethod, setSelectedPayMethod] = useState('payme')
  const [phoneNumber, setPhoneNumber] = useState('+998 90 123 45 67')
  const [cardNumber, setCardNumber] = useState('8600 •••• •••• 4589')
  const [paymentDone, setPaymentDone] = useState(false)

  const totalCost = 7200000
  const paidCost = invoicesList
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, _inv) => sum + 1200000, 0)
  const remainingCost = totalCost - paidCost
  const paidPercent = Math.round((paidCost / totalCost) * 100)

  function openReceipt(inv: Invoice) {
    setSelectedInvoice(inv)
    setShowReceiptModal(true)
  }

  function openPayment(inv: Invoice) {
    setSelectedInvoice(inv)
    setSelectedPayMethod('click')
    setPaymentDone(false)
    setShowPaymentModal(true)
  }

  function handlePay() {
    if (!selectedInvoice) return
    if (
      selectedPayMethod === 'click' &&
      !/^\+?998\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/.test(phoneNumber.trim())
    ) {
      toast.error('Telefon raqamini +998 90 123 45 67 formatida kiriting.')
      return
    }
    if (
      selectedPayMethod === 'payme' &&
      cardNumber.replace(/\D/g, '').length < 16
    ) {
      toast.error('Karta raqami 16 ta raqamdan iborat bo‘lishi kerak.')
      return
    }
    toast.info('To‘lov gateway/API ulanmaguncha demo rejimida tasdiqlanmaydi.')
  }

  return (
    <>
      <Header fixed>
        <div className='flex items-center gap-2'>
          <h1 className='text-lg font-semibold tracking-tight'>
            {english ? 'My payments' : 'To‘lovlarim'}
          </h1>
          <Badge
            variant='outline'
            className='border-green-300 bg-green-50 text-green-600 dark:bg-green-950'
          >
            Moliya holati: Barqaror
          </Badge>
        </div>
        <div className='ms-auto flex items-center gap-2'>
          <GlobalSearch className='me-auto sm:me-0' />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='space-y-6'>
        {/* Yuqori Billing Kartochkalari */}
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <Card className='shadow-sm'>
            <CardContent className='pt-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs text-muted-foreground'>
                    Kurs umumiy qiymati
                  </p>
                  <p className='mt-0.5 text-xl font-bold'>7,200,000 UZS</p>
                </div>
                <div className='rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400'>
                  <CircleDollarSign className='size-5' />
                </div>
              </div>
              <p className='mt-3 text-[11px] text-muted-foreground'>
                6 oylik to‘liq dastur (shartnoma asosida)
              </p>
            </CardContent>
          </Card>

          <Card className='shadow-sm'>
            <CardContent className='pt-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs text-muted-foreground'>
                    To‘langan summa
                  </p>
                  <p className='mt-0.5 text-xl font-bold text-green-600 dark:text-green-400'>
                    {paidCost.toLocaleString()} UZS
                  </p>
                </div>
                <div className='rounded-lg bg-green-500/10 p-2 text-green-600 dark:text-green-400'>
                  <CheckCircle2 className='size-5' />
                </div>
              </div>
              <Progress
                value={paidPercent}
                className='mt-3 h-1.5 [&>div]:bg-green-500'
              />
              <p className='mt-2 text-[11px] text-muted-foreground'>
                Jami kursning {paidPercent}% to‘landi
              </p>
            </CardContent>
          </Card>

          <Card className='shadow-sm'>
            <CardContent className='pt-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs text-muted-foreground'>Qoldiq to‘lov</p>
                  <p className='mt-0.5 text-xl font-bold text-amber-600 dark:text-amber-400'>
                    {remainingCost > 0
                      ? `${remainingCost.toLocaleString()} UZS`
                      : 'To‘liq to‘langan 🎉'}
                  </p>
                </div>
                <div className='rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400'>
                  <AlertCircle className='size-5' />
                </div>
              </div>
              <p className='mt-3 text-[11px] text-muted-foreground'>
                {remainingCost > 0
                  ? 'To‘lov muddati: 15-Sentabr 2026'
                  : 'Qarzdorlik mavjud emas'}
              </p>
            </CardContent>
          </Card>

          <Card className='shadow-sm'>
            <CardContent className='pt-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs text-muted-foreground'>
                    Oylik to‘lov stavkasi
                  </p>
                  <p className='mt-0.5 text-xl font-bold'>1,200,000 UZS</p>
                </div>
                <div className='rounded-lg bg-purple-500/10 p-2 text-purple-600 dark:text-purple-400'>
                  <CreditCard className='size-5' />
                </div>
              </div>
              <p className='mt-3 text-[11px] text-muted-foreground'>
                Har oyning 1–5 sanasida
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Shartnoma ma'lumoti banneri */}
        <Card className='border-primary/20 bg-muted/20 shadow-sm'>
          <CardContent className='flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-3'>
              <div className='rounded-xl bg-primary/10 p-2.5 text-primary'>
                <ShieldCheck className='size-6' />
              </div>
              <div className='space-y-0.5'>
                <h4 className='text-sm font-semibold'>
                  Talabalik shartnomasi: № SF-2026/089
                </h4>
                <p className='text-xs text-muted-foreground'>
                  Sfera IT Academy & Ali Valiyev · Kuchga kirgan sana: 01-Mart
                  2026
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                className='gap-1.5 text-xs'
                onClick={() => setShowContractModal(true)}
              >
                <FileText className='size-3.5' /> Shartnomani ko‘rish va yuklash
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* To'lovlar tarixi jadvali */}
        <Card className='shadow-sm'>
          <CardHeader>
            <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <CardTitle className='flex items-center gap-2 text-base'>
                  <Receipt className='size-4 text-primary' />
                  To‘lovlar va kvitansiyalar tarixi
                </CardTitle>
                <CardDescription>
                  Barcha to‘langan oylar va tasdiqlangan cheklar
                </CardDescription>
              </div>
              <Button
                variant='outline'
                size='sm'
                className='w-fit gap-1.5 text-xs'
                onClick={() => window.print()}
              >
                <Download className='size-3.5' /> Barcha cheklarni yuklash
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className='divide-y rounded-lg border bg-background text-xs'>
              {invoicesList.map((inv) => (
                <div
                  key={inv.id}
                  className='flex flex-col gap-3 p-3.5 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between'
                >
                  <div className='flex items-center gap-3'>
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
                        inv.status === 'paid'
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      <CreditCard className='size-4' />
                    </div>
                    <div>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-semibold'>
                          {inv.month}
                        </span>
                        <span className='font-mono text-[10px] text-muted-foreground'>
                          ({inv.id})
                        </span>
                      </div>
                      <p className='text-xs text-muted-foreground'>
                        {inv.status === 'paid'
                          ? `To‘lov usuli: ${inv.method} · Sana: ${inv.date}`
                          : 'To‘lov kutilmoqda'}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center justify-between gap-5 sm:justify-end'>
                    <div className='text-start sm:text-end'>
                      <p className='text-sm font-bold'>{inv.amount}</p>
                      <p className='text-[10px] text-muted-foreground'>
                        QQS bilan
                      </p>
                    </div>

                    {inv.status === 'paid' ? (
                      <div className='flex items-center gap-2'>
                        <Badge className='bg-green-500 text-[11px] text-white hover:bg-green-600'>
                          To‘langan ✓
                        </Badge>
                        <Button
                          variant='outline'
                          size='sm'
                          className='h-7 gap-1.5 px-2.5 text-xs'
                          onClick={() => openReceipt(inv)}
                        >
                          <Receipt className='size-3' /> Chek
                        </Button>
                      </div>
                    ) : (
                      <div className='flex items-center gap-2'>
                        <Badge
                          variant='outline'
                          className='border-amber-400 bg-amber-50 text-[11px] text-amber-600 dark:bg-amber-950'
                        >
                          Kutilmoqda
                        </Badge>
                        <Button
                          size='sm'
                          className='h-7 px-3 text-xs font-semibold'
                          onClick={() => openPayment(inv)}
                        >
                          To‘lash
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Main>

      {/* ===== SHARTNOMA MODALI ===== */}
      <Dialog open={showContractModal} onOpenChange={setShowContractModal}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <ShieldCheck className='size-4 text-primary' />
              Talabalik ta’lim shartnomasi
            </DialogTitle>
          </DialogHeader>

          <div className='space-y-4 rounded-lg border bg-muted/20 p-4 text-xs'>
            <div className='flex items-center justify-between border-b pb-2'>
              <span className='text-sm font-semibold'>
                Shartnoma № SF-2026/089
              </span>
              <Badge
                variant='outline'
                className='border-green-400 text-green-600'
              >
                Kuchda
              </Badge>
            </div>
            <div className='space-y-2 text-muted-foreground'>
              <p>
                <strong className='text-foreground'>Ta’lim muassasasi:</strong>{' '}
                "Sfera IT Academy" MChJ
              </p>
              <p>
                <strong className='text-foreground'>Talaba:</strong> Ali Valiyev
                (ID: STU-2026-042)
              </p>
              <p>
                <strong className='text-foreground'>O‘quv yo‘nalishi:</strong>{' '}
                Frontend Dasturlash (G-14 guruh)
              </p>
              <p>
                <strong className='text-foreground'>Muddati:</strong> 6 oy
                (01-Mart 2026 — 31-Avgust 2026)
              </p>
              <p>
                <strong className='text-foreground'>
                  Umumiy shartnoma summasi:
                </strong>{' '}
                7,200,000 UZS (oyiga 1,200,000 UZS)
              </p>
              <p className='border-t pt-2 text-[11px] italic'>
                Mazkur shartnoma tomonlar o‘rtasida elektron ko‘rinishda
                tuzilgan va qonuniy kuchga ega.
              </p>
            </div>
          </div>

          <DialogFooter className='flex items-center justify-end gap-3'>
            <Button
              variant='outline'
              size='sm'
              className='gap-1.5 text-xs'
              onClick={() => {
                toast.success('Shartnoma PDF formatida yuklab olindi!')
                window.print()
              }}
            >
              <Download className='size-3.5' /> PDF yuklab olish
            </Button>
            <Button size='sm' onClick={() => setShowContractModal(false)}>
              Yopish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== CHEK (KVITANSIYA) MODALI ===== */}
      <Dialog open={showReceiptModal} onOpenChange={setShowReceiptModal}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Receipt className='size-4 text-primary' />
              To‘lov kvitansiyasi (Chek)
            </DialogTitle>
          </DialogHeader>

          {selectedInvoice && (
            <div className='space-y-4'>
              {/* Akademiya bosh sarlavhasi */}
              <div className='border-b py-3 text-center'>
                <div className='mb-1 flex items-center justify-center gap-2'>
                  <div className='flex size-8 items-center justify-center rounded-lg bg-primary'>
                    <Building2 className='size-4 text-primary-foreground' />
                  </div>
                  <span className='text-base font-bold'>Sfera IT Academy</span>
                </div>
                <p className='text-xs text-muted-foreground'>
                  Rasmiy to‘lov kvitansiyasi
                </p>
              </div>

              {/* Kvitansiya tafsilotlari */}
              <div className='space-y-2.5 text-sm'>
                {[
                  { label: 'Kvitansiya raqami', value: selectedInvoice.id },
                  { label: 'To‘lov sanasi', value: selectedInvoice.date },
                  { label: 'Talaba', value: 'Ali Valiyev' },
                  { label: 'Kurs', value: 'Frontend Dasturlash (G-14)' },
                  { label: 'Davr', value: selectedInvoice.month },
                  { label: 'To‘lov usuli', value: selectedInvoice.method },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className='flex items-center justify-between border-b border-dashed border-border/60 py-1 last:border-0'
                  >
                    <span className='text-xs text-muted-foreground'>
                      {label}
                    </span>
                    <span className='text-xs font-medium'>{value}</span>
                  </div>
                ))}

                {/* Summa */}
                <div className='mt-1 flex items-center justify-between rounded-lg bg-muted/40 p-2.5 pt-2'>
                  <span className='text-xs font-semibold'>
                    Jami to‘langan summa:
                  </span>
                  <span className='text-base font-bold text-green-600 dark:text-green-400'>
                    {selectedInvoice.amount}
                  </span>
                </div>
              </div>

              {/* Muhr va tasdiq */}
              <div className='flex items-center justify-center gap-2 border-t pt-2 text-muted-foreground'>
                <CheckCircle2 className='size-4 text-green-500' />
                <span className='text-xs'>
                  Sfera IT Academy CRM tizimi tomonidan tasdiqlangan
                </span>
              </div>
            </div>
          )}

          <DialogFooter className='flex items-center justify-end gap-3'>
            <Button
              variant='outline'
              size='sm'
              className='gap-1.5 text-xs'
              onClick={() => window.print()}
            >
              <Download className='size-3.5' /> Chop etish / Yuklab olish
            </Button>
            <Button size='sm' onClick={() => setShowReceiptModal(false)}>
              Yopish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== TO'LASH MODALI ===== */}
      <Dialog
        open={showPaymentModal}
        onOpenChange={(open) => {
          setShowPaymentModal(open)
          if (!open) setPaymentDone(false)
        }}
      >
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <CreditCard className='size-4 text-primary' />
              {paymentDone
                ? 'To‘lov muvaffaqiyatli amalga oshirildi!'
                : 'To‘lovni amalga oshirish'}
            </DialogTitle>
          </DialogHeader>

          {paymentDone ? (
            <div className='flex flex-col items-center gap-4 py-6 text-center'>
              <div className='flex size-16 items-center justify-center rounded-full bg-green-500/10'>
                <CheckCircle2 className='size-8 text-green-500' />
              </div>
              <div>
                <p className='text-base font-semibold'>
                  To‘lovingiz qabul qilindi!
                </p>
                <p className='mt-1 text-sm text-muted-foreground'>
                  {selectedInvoice?.amount} miqdoridagi to‘lov tizimga
                  muvaffaqiyatli kiritildi.
                </p>
              </div>
              <p className='w-full rounded-lg bg-muted/40 p-2.5 text-xs text-muted-foreground'>
                Holat: <strong className='text-green-600'>To‘langan ✓</strong>{' '}
                deb o‘zgartirildi va chek yaratildi.
              </p>
            </div>
          ) : (
            <div className='space-y-4'>
              {/* To'lov ma'lumotlari */}
              {selectedInvoice && (
                <div className='space-y-1 rounded-lg border bg-muted/30 p-3'>
                  <div className='flex justify-between text-xs'>
                    <span className='text-muted-foreground'>
                      To‘lov maqsadi:
                    </span>
                    <span className='font-medium'>{selectedInvoice.month}</span>
                  </div>
                  <div className='flex justify-between text-xs'>
                    <span className='text-muted-foreground'>Talaba:</span>
                    <span className='font-medium'>Ali Valiyev (G-14)</span>
                  </div>
                  <div className='flex items-center justify-between border-t pt-1.5'>
                    <span className='text-xs font-semibold'>
                      To‘lanadigan summa:
                    </span>
                    <span className='text-base font-bold text-primary'>
                      {selectedInvoice.amount}
                    </span>
                  </div>
                </div>
              )}

              {/* To'lov usuli tanlash */}
              <div className='space-y-2'>
                <p className='text-xs font-semibold tracking-wider text-muted-foreground uppercase'>
                  To‘lov usulini tanlang:
                </p>
                <div className='grid gap-2'>
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      type='button'
                      onClick={() => setSelectedPayMethod(method.id)}
                      className={`flex items-center gap-3 rounded-lg border p-2.5 text-left transition-all ${
                        selectedPayMethod === method.id
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-border hover:border-primary/40 hover:bg-muted/30'
                      }`}
                    >
                      <div
                        className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${method.bg} ${method.color}`}
                      >
                        <method.icon className='size-4' />
                      </div>
                      <div className='flex-1'>
                        <p className='text-sm font-semibold'>{method.label}</p>
                        <p className='text-[11px] text-muted-foreground'>
                          {method.desc}
                        </p>
                      </div>
                      <div
                        className={`flex size-4 items-center justify-center rounded-full border-2 ${
                          selectedPayMethod === method.id
                            ? 'border-primary'
                            : 'border-muted-foreground/30'
                        }`}
                      >
                        {selectedPayMethod === method.id && (
                          <div className='size-2 rounded-full bg-primary' />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tanlangan to'lov tizimiga oid rekvizitlar */}
              {selectedPayMethod === 'click' && (
                <div className='space-y-2 rounded-lg border border-green-500/30 bg-green-500/5 p-3'>
                  <div className='flex items-center gap-2 text-xs font-semibold text-green-700 dark:text-green-400'>
                    <Phone className='size-3.5' /> Click orqali tezkor to‘lov
                  </div>
                  <div>
                    <label className='mb-1 block text-[11px] text-muted-foreground'>
                      Click ulangan telefon raqamingiz:
                    </label>
                    <input
                      type='text'
                      value={phoneNumber}
                      onChange={(e) =>
                        setPhoneNumber(
                          e.target.value.replace(/[^\d+\s()-]/g, '')
                        )
                      }
                      className='w-full rounded-md border bg-background px-2.5 py-1.5 text-xs font-medium'
                      placeholder='+998 90 123 45 67'
                    />
                  </div>
                  <p className='text-[10px] text-muted-foreground'>
                    "To‘lovni tasdiqlash" bosilgandan so‘ng telefoningizga
                    USSD/Push so‘rov yuboriladi.
                  </p>
                </div>
              )}

              {selectedPayMethod === 'payme' && (
                <div className='space-y-2 rounded-lg border border-blue-500/30 bg-blue-500/5 p-3'>
                  <div className='flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400'>
                    <Smartphone className='size-3.5' /> Payme karta raqami
                  </div>
                  <div>
                    <label className='mb-1 block text-[11px] text-muted-foreground'>
                      Uzcard / Humo karta:
                    </label>
                    <input
                      type='text'
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(e.target.value.replace(/[^\d\s•]/g, ''))
                      }
                      className='w-full rounded-md border bg-background px-2.5 py-1.5 font-mono text-xs font-medium'
                      placeholder='8600 •••• •••• ••••'
                    />
                  </div>
                  <p className='text-[10px] text-muted-foreground'>
                    Payme hisobingizdan to‘lov darhol yechiladi va hisob-kitob
                    qilinadi.
                  </p>
                </div>
              )}

              {selectedPayMethod === 'bank' && (
                <div className='space-y-1.5 rounded-lg border border-purple-500/30 bg-purple-500/5 p-3 text-xs'>
                  <div className='flex items-center gap-2 font-semibold text-purple-700 dark:text-purple-400'>
                    <Landmark className='size-3.5' /> Akademiya bank hisob
                    raqami:
                  </div>
                  <div className='space-y-0.5 rounded border bg-background p-2 font-mono text-[11px] select-all'>
                    <p>H/R: 2020 8000 9005 4123 4001</p>
                    <p>MFO: 00444 (Kapitalbank ATB)</p>
                    <p>INN: 308945612</p>
                  </div>
                  <p className='text-[10px] text-muted-foreground'>
                    To‘lov amalga oshirilgach, kvitansiya avtomatik generatsiya
                    qilinadi.
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className='flex items-center justify-end gap-3'>
            {paymentDone ? (
              <Button
                onClick={() => {
                  setShowPaymentModal(false)
                  setPaymentDone(false)
                }}
                className='w-full sm:w-auto'
              >
                Yopish va chekni ko‘rish
              </Button>
            ) : (
              <>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setShowPaymentModal(false)}
                >
                  Bekor qilish
                </Button>
                <Button size='sm' className='gap-1.5' onClick={handlePay}>
                  <CheckCircle2 className='size-3.5' />
                  To‘lovni tasdiqlash
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
