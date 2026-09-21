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
        className='h-9 min-w-28 gap-2 rounded-lg border border-border/70 bg-background/80 px-2.5 shadow-sm transition-colors hover:border-primary/50 hover:bg-accent/60 focus:ring-2 focus:ring-primary/20'
      >
        <Languages
          className='size-4 shrink-0 text-primary'
          aria-hidden='true'
        />
        <SelectValue />
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
