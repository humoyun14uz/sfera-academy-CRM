import { Toaster as Sonner, ToasterProps } from 'sonner'
import { useTheme } from '@/context/theme-provider'

export function Toaster({ position = 'bottom-right', ...props }: ToasterProps) {
  const { theme = 'light' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group [&_div[data-content]]:w-full'
      position={position}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}
