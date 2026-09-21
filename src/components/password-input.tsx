import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/context/language-provider'
import { Button } from './ui/button'

type PasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  ref?: React.Ref<HTMLInputElement>
  inputClassName?: string
}

export function PasswordInput({
  className,
  disabled,
  ref,
  inputClassName,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  const { t } = useLanguage()

  return (
    <div className={cn('relative rounded-md', className)}>
      <input
        type={showPassword ? 'text' : 'password'}
        className={cn('flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pe-10 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50', inputClassName)}
        ref={ref}
        disabled={disabled}
        {...props}
      />
      <Button
        type='button'
        size='icon'
        variant='ghost'
        disabled={disabled}
        className='absolute inset-e-1 top-1/2 h-6 w-6 -translate-y-1/2 rounded-md text-muted-foreground'
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
        <span className='sr-only'>
          {showPassword ? t('hidePassword') : t('showPassword')}
        </span>
      </Button>
    </div>
  )
}
