import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import academyLogo from '@/assets/sfera-it-academy-logo.png'
import { getCookie } from '@/lib/cookies'
import { useLanguage } from '@/context/language-provider'

type AuthLayoutProps = { children: React.ReactNode }

export function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useLanguage()

  useEffect(() => {
    const root = window.document.documentElement
    const previousTheme = root.classList.contains('dark') ? 'dark' : 'light'
    root.classList.remove('dark')
    root.classList.add('light')
    return () => {
      const savedTheme = (getCookie('vite-ui-theme') as string) || previousTheme
      root.classList.remove('light', 'dark')
      root.classList.add(savedTheme)
    }
  }, [])

  const features = [
    { number: '01', label: t('loginFeatureCourses'), href: '/sign-in#courses', icon: '▰' },
    { number: '02', label: t('loginFeatureStudents'), href: '/sign-in#students', icon: '●' },
    { number: '03', label: t('loginFeatureReports'), href: '/sign-in#reports', icon: '▥' },
  ]

  return (
    <div className='min-h-svh overflow-x-clip bg-[#f2faf4] text-slate-950 lg:grid lg:h-svh lg:min-h-0 lg:grid-cols-2'>
      <section className='relative hidden min-h-0 overflow-hidden bg-[#0d2114] text-white lg:flex lg:flex-col'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(41,169,86,0.22),transparent_26%),radial-gradient(circle_at_82%_12%,rgba(33,140,72,0.16),transparent_22%),radial-gradient(circle_at_78%_88%,rgba(41,169,86,0.13),transparent_28%)]' />
        <div aria-hidden='true' className='absolute -start-16 top-[44%] size-64 -translate-y-1/2 -rotate-12 rounded-[2rem] border-[1.5px] border-[#29a956]/20 bg-[#29a956]/[0.035] shadow-[0_0_55px_rgba(41,169,86,0.08)]' />
        <div className='login-ambient' aria-hidden='true'>
          <span className='login-ambient-square login-ambient-square-1' />
          <span className='login-ambient-square login-ambient-square-2' />
          <span className='login-ambient-square login-ambient-square-3' />
          <span className='login-ambient-square login-ambient-square-4' />
          <span className='login-ambient-square login-ambient-square-5' />
          <span className='login-ambient-square login-ambient-square-6' />
          <span className='login-ambient-square login-ambient-square-7' />
        </div>
        <div className='relative z-10 flex h-full flex-col p-10 xl:px-[4.25rem] xl:py-16'>
          <Link to='/sign-in' className='flex w-fit items-center gap-3 transition-opacity hover:opacity-80'>
            <div className='rounded-2xl bg-white p-2 shadow-[0_0_28px_rgba(41,169,86,0.35)]'>
              <img src={academyLogo} alt={t('appName')} className='size-11 rounded-xl object-cover' />
            </div>
            <div>
              <p className='text-base font-bold tracking-tight'>{t('appName')}</p>
              <p className='text-xs font-semibold tracking-[0.18em] text-emerald-400 uppercase'>{t('workspaceAccess')}</p>
            </div>
          </Link>

          <div className='relative mt-auto max-w-2xl'>
            <div className='mb-6 inline-flex items-center gap-2 rounded-full border border-[#29a956]/45 bg-[#29a956]/10 px-3 py-1.5 text-xs font-semibold text-[#9fd8b0]'>
              <span className='size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]' />
              {t('appName')} CRM
            </div>
            <h1 className='max-w-2xl text-5xl leading-[1.03] font-bold tracking-[-0.05em] text-[#f6fffc] xl:text-6xl'>
              {t('loginHeadlineBefore')} <span className='text-[#67bd80]'>{t('loginHeadlineAccent')}</span> {t('loginHeadlineAfter')}
            </h1>
            <p className='mt-6 max-w-xl text-base leading-7 text-emerald-50/70'>{t('loginSecureAccess')}</p>
            <div className='mt-9 grid max-w-2xl grid-cols-3 gap-3'>
              {features.map((feature) => (
                <a key={feature.number} href={feature.href} className='group rounded-2xl border border-[#176f38]/75 bg-[#102b19]/95 p-4 shadow-[0_16px_42px_rgba(0,0,0,0.24)] transition-all hover:-translate-y-1 hover:border-[#67bd80]/70 hover:bg-[#29a956]/15 focus-visible:ring-2 focus-visible:ring-[#9fd8b0]'>
                  <div className='flex items-start justify-between gap-2'><span className='flex size-9 items-center justify-center rounded-xl bg-[#29a956]/20 text-lg text-[#9fd8b0]'>{feature.icon}</span><span className='text-xs font-bold text-[#67bd80]'>{feature.number}</span></div>
                  <p className='mt-3 text-sm font-semibold text-white'>{feature.label}</p>
                </a>
              ))}
            </div>
          </div>
          <p className='mt-12 text-xs text-emerald-100/50'>© {new Date().getFullYear()} {t('appName')} · {t('loginCopyright')}</p>
        </div>
      </section>

      <section className='relative flex min-h-svh min-w-0 items-center justify-center overflow-y-auto bg-[radial-gradient(circle_at_90%_8%,rgba(41,169,86,0.12),transparent_30%),linear-gradient(135deg,#f5fcfa_0%,#eef8f4_100%)] p-5 sm:p-10 lg:min-h-0 lg:overflow-hidden'>
        <div className='pointer-events-none absolute -end-20 -top-20 size-64 rounded-full border-[20px] border-emerald-100/60' />
        <div className='relative my-auto w-full max-w-[430px] lg:px-1'>
          <div className='mb-8 flex items-center gap-3 lg:hidden'>
            <img src={academyLogo} alt={t('appName')} className='size-11 rounded-xl object-cover shadow-sm ring-1 ring-emerald-100' />
            <div><p className='font-bold'>{t('appName')}</p><p className='text-xs font-medium text-emerald-700'>{t('workspaceAccess')}</p></div>
          </div>
          <div className='relative'>
            <div aria-hidden='true' className='absolute -end-3 -bottom-3 -start-3 top-3 rounded-[1.25rem] border border-emerald-100/70 bg-white/40 shadow-[0_20px_48px_-30px_rgba(41,169,86,0.36)]' />
            <div className='relative rounded-[1.25rem] border border-white/90 bg-white/95 p-5 shadow-[0_24px_70px_-34px_rgba(15,23,42,0.32)] backdrop-blur sm:p-7'>{children}</div>
          </div>
          <p className='mt-5 text-center text-xs text-slate-400'>{t('appName')} · {t('loginFooter')}</p>
        </div>
      </section>
    </div>
  )
}
