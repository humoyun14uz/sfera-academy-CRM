import { Link } from '@tanstack/react-router'
import { ArrowLeft, FileText, LockKeyhole, ShieldCheck } from 'lucide-react'
import { AuthLayout } from './auth-layout'

function LegalPage({ type }: { type: 'privacy' | 'terms' }) {
  const privacy = type === 'privacy'
  return (
    <AuthLayout>
      <div className='flex flex-col gap-6 text-start'>
        <div className='space-y-3'>
          <div className='inline-flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100'>{privacy ? <ShieldCheck className='size-6' /> : <FileText className='size-6' />}</div>
          <p className='text-xs font-bold tracking-[0.2em] text-emerald-700 uppercase'>Sfera IT Academy CRM</p>
          <h2 className='text-2xl font-bold tracking-tight text-slate-950'>{privacy ? 'Maxfiylik siyosati' : 'Foydalanish shartlari'}</h2>
          <p className='text-sm leading-6 text-slate-500'>{privacy ? 'Ma’lumotlaringizni qanday yig‘ish va himoya qilishimiz haqida qisqacha ma’lumot.' : 'CRM tizimidan foydalanish bo‘yicha asosiy qoidalar va mas’uliyatlar.'}</p>
        </div>
        <div className='space-y-4 text-sm leading-6 text-slate-600'>
          <div className='rounded-xl border border-emerald-100 bg-emerald-50/60 p-4'><div className='mb-1 flex items-center gap-2 font-semibold text-slate-900'><LockKeyhole className='size-4 text-emerald-600' />{privacy ? 'Ma’lumotlar xavfsizligi' : 'Tizimdan foydalanish'}</div><p>{privacy ? 'Foydalanuvchi ma’lumotlari faqat akademiya ish jarayonlarini boshqarish, kirishni nazorat qilish va xizmat sifatini yaxshilash uchun ishlatiladi.' : 'Tizimdan faqat akademiya faoliyati doirasida, berilgan rol va ruxsatlar asosida foydalanish kerak.'}</p></div>
          <p>{privacy ? 'Hisob ma’lumotlaringizni uchinchi shaxslarga bermang. Ma’lumotlarni yangilash yoki o‘chirish bo‘yicha administratorga murojaat qilishingiz mumkin.' : 'Kiritilgan ma’lumotlar to‘g‘ri va dolzarb bo‘lishi, maxfiy ma’lumotlar esa himoyalangan holda saqlanishi kerak.'}</p>
          <p className='text-xs text-slate-400'>Oxirgi yangilanish: 10-sentabr, 2026</p>
        </div>
        <Link to='/sign-in' className='inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-emerald-700 transition-all hover:border-emerald-200 hover:bg-emerald-50/50'><ArrowLeft className='me-2 size-4' />Tizimga qaytish</Link>
      </div>
    </AuthLayout>
  )
}

export function PrivacyPolicy() { return <LegalPage type='privacy' /> }
export function TermsOfService() { return <LegalPage type='terms' /> }
