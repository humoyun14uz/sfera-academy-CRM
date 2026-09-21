import * as React from 'react'
import { Check, ChevronDown, CircleHelp, Clock3, X } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export type AttendanceStatusKey = 'present' | 'late' | 'absent' | 'excused'

export interface AttendanceStatusConfig {
  key: AttendanceStatusKey
  labelUz: string
  labelEn: string
  descriptionUz: string
  descriptionEn: string
  Icon: React.ComponentType<{ className?: string }>
  // Shape & Color styling for the checkbox button
  shapeClass: string
  containerClass: string
  activeItemClass: string
  badgeDotClass: string
  iconColorClass: string
}

export const ATTENDANCE_STATUS_CONFIGS: Record<
  AttendanceStatusKey,
  AttendanceStatusConfig
> = {
  present: {
    key: 'present',
    labelUz: 'Kelgan',
    labelEn: 'Present',
    descriptionUz: 'Darsda to‘liq qatnashdi',
    descriptionEn: 'Attended the full lesson',
    Icon: Check,
    shapeClass: 'rounded-xl', // Yumaloqlangan to'rtburchak
    containerClass:
      'border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 hover:border-emerald-500/60 shadow-emerald-500/10 shadow-xs ring-emerald-500/20',
    activeItemClass:
      'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold',
    badgeDotClass: 'bg-emerald-500 shadow-emerald-500/50',
    iconColorClass: 'text-emerald-600 dark:text-emerald-400',
  },
  late: {
    key: 'late',
    labelUz: 'Kechikkan',
    labelEn: 'Late',
    descriptionUz: 'Darsga kechikib keldi',
    descriptionEn: 'Arrived late to class',
    Icon: Clock3,
    shapeClass: 'rounded-md', // Kvadrat-burchakli
    containerClass:
      'border-amber-500/40 bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25 hover:border-amber-500/60 shadow-amber-500/10 shadow-xs ring-amber-500/20',
    activeItemClass:
      'bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold',
    badgeDotClass: 'bg-amber-500 shadow-amber-500/50',
    iconColorClass: 'text-amber-600 dark:text-amber-400',
  },
  absent: {
    key: 'absent',
    labelUz: 'Kelmagan',
    labelEn: 'Absent',
    descriptionUz: 'Sababsiz darsga kelmadi',
    descriptionEn: 'Missed class without excuse',
    Icon: X,
    shapeClass: 'rounded-lg', // Burchakliroq shakl
    containerClass:
      'border-rose-500/40 bg-rose-500/15 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25 hover:border-rose-500/60 shadow-rose-500/10 shadow-xs ring-rose-500/20',
    activeItemClass:
      'bg-rose-500/10 text-rose-700 dark:text-rose-300 font-semibold',
    badgeDotClass: 'bg-rose-500 shadow-rose-500/50',
    iconColorClass: 'text-rose-600 dark:text-rose-400',
  },
  excused: {
    key: 'excused',
    labelUz: 'Sababli',
    labelEn: 'Excused',
    descriptionUz: 'Oldindan ogohlantirilgan/sababli',
    descriptionEn: 'Excused absence with notice',
    Icon: CircleHelp,
    shapeClass: 'rounded-full', // To'liq doira (krugliy)
    containerClass:
      'border-sky-500/40 bg-sky-500/15 text-sky-600 dark:text-sky-400 hover:bg-sky-500/25 hover:border-sky-500/60 shadow-sky-500/10 shadow-xs ring-sky-500/20',
    activeItemClass:
      'bg-sky-500/10 text-sky-700 dark:text-sky-300 font-semibold',
    badgeDotClass: 'bg-sky-500 shadow-sky-500/50',
    iconColorClass: 'text-sky-600 dark:text-sky-400',
  },
}

interface AttendanceStatusCheckboxProps {
  value?: AttendanceStatusKey
  onChange: (status: AttendanceStatusKey) => void
  studentName?: string
  locale?: 'uz' | 'en'
  disabled?: boolean
  className?: string
  size?: 'sm' | 'default' | 'lg'
}

export function AttendanceStatusCheckbox({
  value = 'present',
  onChange,
  studentName,
  locale = 'uz',
  disabled = false,
  className,
  size = 'default',
}: AttendanceStatusCheckboxProps) {
  const [open, setOpen] = React.useState(false)
  const isEn = locale === 'en'

  const currentConfig =
    ATTENDANCE_STATUS_CONFIGS[value] ?? ATTENDANCE_STATUS_CONFIGS.present
  const CurrentIcon = currentConfig.Icon

  const sizeClasses = {
    sm: 'size-7 text-xs',
    default: 'size-9 text-sm',
    lg: 'size-11 text-base',
  }[size]

  const iconSizes = {
    sm: 'size-3.5',
    default: 'size-4',
    lg: 'size-5',
  }[size]

  const handleSelect = (nextKey: AttendanceStatusKey) => {
    if (nextKey === value) {
      setOpen(false)
      return
    }
    onChange(nextKey)
    setOpen(false)

    const nextConfig = ATTENDANCE_STATUS_CONFIGS[nextKey]
    const label = isEn ? nextConfig.labelEn : nextConfig.labelUz
    const message = studentName
      ? isEn
        ? `${studentName}: marked as ${label}`
        : `${studentName}: ${label} deb belgilandi`
      : isEn
        ? `Attendance set to ${label}`
        : `Davomat holati: ${label}`

    toast.success(message)
  }

  const currentLabel = isEn ? currentConfig.labelEn : currentConfig.labelUz

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger
            disabled={disabled}
            aria-label={`${studentName ? `${studentName} — ` : ''}${currentLabel}`}
            className={cn(
              'group relative inline-flex items-center justify-center border font-medium transition-all duration-200 outline-none select-none',
              'focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1',
              'active:scale-95 disabled:pointer-events-none disabled:opacity-50',
              currentConfig.shapeClass,
              currentConfig.containerClass,
              sizeClasses,
              className
            )}
          >
            <CurrentIcon
              className={cn(
                iconSizes,
                'stroke-[2.2] transition-transform duration-200 group-hover:scale-110',
                currentConfig.iconColorClass
              )}
            />
            {/* Subtle corner indicator for dropdown availability */}
            <span
              className={cn(
                'absolute -right-0.5 -bottom-0.5 flex size-2.5 items-center justify-center rounded-full bg-background/90 text-muted-foreground shadow-xs ring-1 ring-border/50 transition-opacity group-hover:opacity-100',
                open ? 'opacity-100' : 'opacity-60'
              )}
            >
              <ChevronDown className='size-1.5' />
            </span>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side='top' className='text-xs font-medium'>
          <span>{currentLabel}</span>
          <span className='ms-1.5 text-[10px] opacity-75'>
            {isEn ? '(Click to change)' : '(O‘zgartirish uchun bosing)'}
          </span>
        </TooltipContent>
      </Tooltip>

      <DropdownMenuContent
        align='start'
        sideOffset={6}
        className='w-56 rounded-2xl border-border/70 p-1.5 shadow-xl backdrop-blur-md'
      >
        <DropdownMenuLabel className='px-2.5 py-1.5 text-[11px] font-bold tracking-wider text-muted-foreground uppercase'>
          {isEn ? 'Set attendance status' : 'Davomat holatini tanlang'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className='my-1 bg-border/50' />

        {(['present', 'late', 'absent', 'excused'] as const).map((key) => {
          const itemConfig = ATTENDANCE_STATUS_CONFIGS[key]
          const ItemIcon = itemConfig.Icon
          const isSelected = key === value
          const itemLabel = isEn ? itemConfig.labelEn : itemConfig.labelUz
          const itemDesc = isEn
            ? itemConfig.descriptionEn
            : itemConfig.descriptionUz

          return (
            <DropdownMenuItem
              key={key}
              onClick={() => handleSelect(key)}
              className={cn(
                'flex cursor-pointer items-center justify-between gap-2.5 rounded-xl px-2.5 py-2 transition-all',
                isSelected ? itemConfig.activeItemClass : 'hover:bg-muted/70'
              )}
            >
              <div className='flex items-center gap-2.5'>
                <span
                  className={cn(
                    'flex size-7 items-center justify-center border transition-transform duration-150',
                    itemConfig.shapeClass,
                    itemConfig.containerClass
                  )}
                >
                  <ItemIcon
                    className={cn(
                      'size-3.5 stroke-[2.2]',
                      itemConfig.iconColorClass
                    )}
                  />
                </span>
                <div className='flex flex-col'>
                  <span className='text-xs leading-tight font-semibold'>
                    {itemLabel}
                  </span>
                  <span className='text-[10px] leading-tight text-muted-foreground'>
                    {itemDesc}
                  </span>
                </div>
              </div>

              {isSelected && (
                <span
                  className={cn(
                    'size-2 rounded-full shadow-xs',
                    itemConfig.badgeDotClass
                  )}
                />
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
