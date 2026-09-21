import { Link } from '@tanstack/react-router'
import academyLogo from '@/assets/sfera-it-academy-logo.png'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/context/language-provider'
import dashboardDark from './assets/dashboard-dark.png'
import dashboardLight from './assets/dashboard-light.png'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn2() {
  const { t } = useLanguage()

  return (
    <div className='relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-120 sm:p-8'>
          <div className='mb-4 flex items-center justify-center'>
            <img
              src={academyLogo}
              alt={t('appName')}
              className='me-2 size-8 rounded-md object-cover'
            />
            <span className='grid text-start'>
              <h1 className='text-xl font-medium'>{t('appName')}</h1>
              <span className='text-xs text-muted-foreground'>
                {t('workspaceAccess')}
              </span>
            </span>
          </div>
        </div>
        <div className='mx-auto flex w-full max-w-sm flex-col justify-center space-y-2'>
          <div className='flex flex-col space-y-2 text-start'>
            <h2 className='text-lg font-semibold tracking-tight'>{t('signIn')}</h2>
            <p className='text-sm text-muted-foreground'>
              {t('signInDescription')} {t('noAccount')}{' '}
              <Link
                to='/sign-up'
                className='text-nowrap underline underline-offset-4 hover:text-primary'
              >
                {t('signUp')}
              </Link>
            </p>
          </div>
          <UserAuthForm />
          <p className='px-8 text-center text-sm text-muted-foreground'>
            {t('agreementPrefix')}{' '}
            <a
              href='/terms'
              className='underline underline-offset-4 hover:text-primary'
            >
              {t('terms')}
            </a>{' '}
            {t('and')}{' '}
            <a
              href='/privacy'
              className='underline underline-offset-4 hover:text-primary'
            >
              {t('privacy')}
            </a>
            .
          </p>
        </div>
      </div>

      <div
        className={cn(
          'relative h-full overflow-hidden bg-muted max-lg:hidden',
          '[&>img]:absolute [&>img]:top-[15%] [&>img]:left-20 [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>img]:object-top-left [&>img]:select-none'
        )}
      >
        <img
          src={dashboardLight}
          className='dark:hidden'
          width={1024}
          height={1151}
          alt={t('appName')}
        />
        <img
          src={dashboardDark}
          className='hidden dark:block'
          width={1024}
          height={1138}
          alt={t('appName')}
        />
      </div>
    </div>
  )
}
