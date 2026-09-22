import { Languages } from 'lucide-react'
import { useLanguage, type Language } from '@/context/language-provider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <Select
      value={language}
      onValueChange={(value) => setLanguage(value as Language)}
    >
      <SelectTrigger
        aria-label={t('language')}
        size='sm'
        className='h-9 w-9 min-w-9 justify-center gap-2 rounded-lg border border-border/70 bg-background/80 px-0 shadow-sm transition-colors hover:border-primary/50 hover:bg-accent/60 focus:ring-2 focus:ring-primary/20 sm:w-auto sm:min-w-28 sm:justify-start sm:px-2.5'
      >
        <Languages
          className='size-4 shrink-0 text-primary'
          aria-hidden='true'
        />
        <SelectValue className='hidden sm:inline' />
      </SelectTrigger>
      <SelectContent
        align='end'
        className='min-w-36 rounded-xl border-border/80 p-1 shadow-xl'
      >
        <SelectItem value='en' className='rounded-lg py-2'>
          {t('english')}
        </SelectItem>
        <SelectItem value='uz' className='rounded-lg py-2'>
          {t('uzbek')}
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
