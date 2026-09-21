import { type SVGProps } from 'react'
import { Root as Radio, Item } from '@radix-ui/react-radio-group'
import { CircleCheck, RotateCcw, Settings } from 'lucide-react'
import { IconDir } from '@/assets/custom/icon-dir'
import { IconLayoutCompact } from '@/assets/custom/icon-layout-compact'
import { IconLayoutDefault } from '@/assets/custom/icon-layout-default'
import { IconLayoutFull } from '@/assets/custom/icon-layout-full'
import { IconSidebarFloating } from '@/assets/custom/icon-sidebar-floating'
import { IconSidebarInset } from '@/assets/custom/icon-sidebar-inset'
import { IconSidebarSidebar } from '@/assets/custom/icon-sidebar-sidebar'
import { IconThemeDark } from '@/assets/custom/icon-theme-dark'
import { IconThemeLight } from '@/assets/custom/icon-theme-light'
import { cn } from '@/lib/utils'
import { useDirection } from '@/context/direction-provider'
import { type Collapsible, useLayout } from '@/context/layout-provider'
import { useTheme } from '@/context/theme-provider'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useSidebar } from './ui/sidebar'

export function ConfigDrawer() {
  const { language } = useLanguage()
  const english = language === 'en'
  const { setOpen } = useSidebar()
  const { resetDir } = useDirection()
  const { resetTheme } = useTheme()
  const { resetLayout } = useLayout()

  const handleReset = () => {
    setOpen(true)
    resetDir()
    resetTheme()
    resetLayout()
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size='icon'
          variant='ghost'
          aria-label={english ? 'Open theme settings' : 'Ko‘rinish sozlamalarini ochish'}
          className='rounded-full'
        >
          <Settings aria-hidden='true' />
        </Button>
      </SheetTrigger>
      <SheetContent className='flex flex-col'>
        <SheetHeader className='pb-0 text-start'>
          <SheetTitle>{english ? 'Theme Settings' : 'Ko‘rinish sozlamalari'}</SheetTitle>
          <SheetDescription>
            {english ? 'Adjust the appearance and layout to suit your preferences.' : 'Ko‘rinish va joylashuvni xohishingizga moslang.'}
          </SheetDescription>
        </SheetHeader>
        <div className='space-y-6 overflow-y-auto px-4'>
          <ThemeConfig />
          <SidebarConfig />
          <LayoutConfig />
          <DirConfig />
        </div>
        <SheetFooter className='gap-2'>
          <Button
            variant='destructive'
            onClick={handleReset}
            aria-label={english ? 'Reset all settings to default values' : 'Barcha sozlamalarni standart holatga qaytarish'}
          >
            {english ? 'Reset' : 'Qayta tiklash'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function SectionTitle({
  title,
  showReset = false,
  onReset,
  resetAriaLabel,
  className,
}: {
  title: string
  showReset?: boolean
  onReset?: () => void
  /** Shown on the small per-section reset (RotateCcw) for accessibility and tests. */
  resetAriaLabel?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground',
        className
      )}
    >
      {title}
      {showReset && onReset && (
        <Button
          type='button'
          size='icon'
          variant='secondary'
          className='size-4 rounded-full'
          onClick={onReset}
          aria-label={resetAriaLabel}
        >
          <RotateCcw className='size-3' />
        </Button>
      )}
    </div>
  )
}

function RadioGroupItem({
  item,
  isTheme = false,
}: {
  item: {
    value: string
    label: string
    icon: (props: SVGProps<SVGSVGElement>) => React.ReactElement
  }
  isTheme?: boolean
}) {
  return (
    <Item
      value={item.value}
      className={cn('group outline-none', 'transition duration-200 ease-in')}
      aria-label={`Select ${item.label.toLowerCase()}`}
      aria-describedby={`${item.value}-description`}
    >
      <div
        className={cn(
          'relative rounded-[6px] ring-[1px] ring-border',
          'group-data-[state=checked]:shadow-2xl group-data-[state=checked]:ring-primary',
          'group-focus-visible:ring-2'
        )}
        role='img'
        aria-hidden='false'
        aria-label={`${item.label} option preview`}
      >
        <CircleCheck
          className={cn(
            'size-6 fill-primary stroke-white',
            'group-data-[state=unchecked]:hidden',
            'absolute top-0 right-0 translate-x-1/2 -translate-y-1/2'
          )}
          aria-hidden='true'
        />
        <item.icon
          className={cn(
            !isTheme &&
              'fill-primary stroke-primary group-data-[state=unchecked]:fill-muted-foreground group-data-[state=unchecked]:stroke-muted-foreground'
          )}
          aria-hidden='true'
        />
      </div>
      <div
        className='mt-1 text-xs'
        id={`${item.value}-description`}
        aria-live='polite'
      >
        {item.label}
      </div>
    </Item>
  )
}

function ThemeConfig() {
  const { defaultTheme, theme, setTheme } = useTheme()
  const english = useLanguage().language === 'en'
  return (
    <div>
      <SectionTitle
        title={english ? 'Theme' : 'Mavzu'}
        showReset={theme !== defaultTheme}
        onReset={() => setTheme(defaultTheme)}
        resetAriaLabel={english ? 'Reset theme preference to default' : 'Mavzu sozlamasini standartga qaytarish'}
      />
      <Radio
        value={theme}
        onValueChange={setTheme}
        className='grid w-full max-w-md grid-cols-2 gap-4'
        aria-label={english ? 'Select theme preference' : 'Mavzu sozlamasini tanlang'}
        aria-describedby='theme-description'
      >
        {[
          {
            value: 'light',
            label: english ? 'Light' : 'Yorug‘',
            icon: IconThemeLight,
          },
          {
            value: 'dark',
            label: english ? 'Dark' : 'Qorong‘i',
            icon: IconThemeDark,
          },
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} isTheme />
        ))}
      </Radio>
      <div id='theme-description' className='sr-only'>
        {english ? 'Choose between light mode or dark mode' : 'Yorug‘ yoki qorong‘i rejimni tanlang'}
      </div>
    </div>
  )
}

function SidebarConfig() {
  const { defaultVariant, variant, setVariant } = useLayout()
  const english = useLanguage().language === 'en'
  return (
    <div className='max-md:hidden'>
      <SectionTitle
        title={english ? 'Sidebar' : 'Yon panel'}
        showReset={defaultVariant !== variant}
        onReset={() => setVariant(defaultVariant)}
        resetAriaLabel={english ? 'Reset sidebar style to default' : 'Yon panel uslubini standartga qaytarish'}
      />
      <Radio
        value={variant}
        onValueChange={setVariant}
        className='grid w-full max-w-md grid-cols-3 gap-4'
        aria-label={english ? 'Select sidebar style' : 'Yon panel uslubini tanlang'}
        aria-describedby='sidebar-description'
      >
        {[
          {
            value: 'inset',
            label: english ? 'Inset' : 'Ichki',
            icon: IconSidebarInset,
          },
          {
            value: 'floating',
            label: english ? 'Floating' : 'Suzuvchi',
            icon: IconSidebarFloating,
          },
          {
            value: 'sidebar',
            label: english ? 'Sidebar' : 'Yon panel',
            icon: IconSidebarSidebar,
          },
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
      <div id='sidebar-description' className='sr-only'>
        {english ? 'Choose between inset, floating, or standard sidebar layout' : 'Ichki, suzuvchi yoki standart yon panel ko‘rinishini tanlang'}
      </div>
    </div>
  )
}

function LayoutConfig() {
  const { open, setOpen } = useSidebar()
  const { defaultCollapsible, collapsible, setCollapsible } = useLayout()
  const english = useLanguage().language === 'en'

  const radioState = open ? 'default' : collapsible

  return (
    <div className='max-md:hidden'>
      <SectionTitle
        title={english ? 'Layout' : 'Joylashuv'}
        showReset={radioState !== 'default'}
        onReset={() => {
          setOpen(true)
          setCollapsible(defaultCollapsible)
        }}
        resetAriaLabel={english ? 'Reset layout options to default' : 'Joylashuvni standartga qaytarish'}
      />
      <Radio
        value={radioState}
        onValueChange={(v) => {
          if (v === 'default') {
            setOpen(true)
            return
          }
          setOpen(false)
          setCollapsible(v as Collapsible)
        }}
        className='grid w-full max-w-md grid-cols-3 gap-4'
        aria-label={english ? 'Select layout style' : 'Joylashuv uslubini tanlang'}
        aria-describedby='layout-description'
      >
        {[
          {
            value: 'default',
            label: english ? 'Default' : 'Standart',
            icon: IconLayoutDefault,
          },
          {
            value: 'icon',
            label: english ? 'Compact' : 'Ixcham',
            icon: IconLayoutCompact,
          },
          {
            value: 'offcanvas',
            label: english ? 'Full layout' : 'To‘liq joylashuv',
            icon: IconLayoutFull,
          },
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
      <div id='layout-description' className='sr-only'>
        {english ? 'Choose between default expanded, compact icon-only, or full layout mode' : 'Kengaytirilgan, faqat ikonka yoki to‘liq joylashuv rejimini tanlang'}
      </div>
    </div>
  )
}

function DirConfig() {
  const { defaultDir, dir, setDir } = useDirection()
  const english = useLanguage().language === 'en'
  return (
    <div>
      <SectionTitle
        title={english ? 'Direction' : 'Yo‘nalish'}
        showReset={defaultDir !== dir}
        onReset={() => setDir(defaultDir)}
        resetAriaLabel={english ? 'Reset text direction to default' : 'Matn yo‘nalishini standartga qaytarish'}
      />
      <Radio
        value={dir}
        onValueChange={setDir}
        className='grid w-full max-w-md grid-cols-3 gap-4'
        aria-label={english ? 'Select site direction' : 'Sayt yo‘nalishini tanlang'}
        aria-describedby='direction-description'
      >
        {[
          {
            value: 'ltr',
            label: english ? 'Left to Right' : 'Chapdan o‘ngga',
            icon: (props: SVGProps<SVGSVGElement>) => (
              <IconDir dir='ltr' {...props} />
            ),
          },
          {
            value: 'rtl',
            label: english ? 'Right to Left' : 'O‘ngdan chapga',
            icon: (props: SVGProps<SVGSVGElement>) => (
              <IconDir dir='rtl' {...props} />
            ),
          },
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
      <div id='direction-description' className='sr-only'>
        {english ? 'Choose between left-to-right or right-to-left site direction' : 'Saytning chapdan o‘ngga yoki o‘ngdan chapga yo‘nalishini tanlang'}
      </div>
    </div>
  )
}
