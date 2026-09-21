import { Loader } from 'lucide-react'
import { useLanguage } from '@/context/language-provider'
import { cn } from '@/lib/utils'
import { FormControl } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type SelectDropdownProps = {
  onValueChange?: (value: string) => void
  defaultValue: string | undefined
  placeholder?: string
  isPending?: boolean
  items: { label: string; value: string }[] | undefined
  disabled?: boolean
  className?: string
  isControlled?: boolean
}

export function SelectDropdown({
  defaultValue,
  onValueChange,
  isPending,
  items,
  placeholder,
  disabled,
  className = '',
  isControlled = false,
}: SelectDropdownProps) {
  const { language } = useLanguage()
  const defaultState = isControlled
    ? { value: defaultValue, onValueChange }
    : { defaultValue, onValueChange }
  return (
    <Select {...defaultState}>
      <FormControl>
        <SelectTrigger disabled={disabled} className={cn('h-10 w-full rounded-lg border-border/70 bg-background/80 px-3 shadow-sm transition-all hover:border-primary/50 focus:ring-2 focus:ring-primary/20 data-[state=open]:border-primary data-[state=open]:ring-2 data-[state=open]:ring-primary/20', className)}>
          <SelectValue placeholder={placeholder ?? (language === 'en' ? 'Select an option' : 'Variantni tanlang')} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {isPending ? (
          <SelectItem disabled value='loading' className='h-14'>
            <div className='flex items-center justify-center gap-2'>
              <Loader className='h-5 w-5 animate-spin' />
              {'  '}
              {language === 'en' ? 'Loading...' : 'Yuklanmoqda...'}
            </div>
          </SelectItem>
        ) : (
          items?.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}
