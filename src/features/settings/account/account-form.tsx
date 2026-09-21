import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { DatePicker } from '@/components/date-picker'

const languages = [
  { label: 'English', uzLabel: 'Inglizcha', value: 'en' },
  { label: 'Uzbek', uzLabel: 'O‘zbekcha', value: 'uz' },
] as const

const accountFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Please enter your name.')
    .min(2, 'Name must be at least 2 characters.')
    .max(30, 'Name must not be longer than 30 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  dob: z.date('Please select your date of birth.'),
  language: z.enum(['en', 'uz'], 'Please select a language.'),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

// This can come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
  name: '',
}

export function AccountForm() {
  const { auth } = useAuthStore()
  const { language, setLanguage } = useLanguage()
  const english = language === 'en'
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      ...defaultValues,
      name: auth.user?.name || auth.user?.email?.split('@')[0] || '',
      email: auth.user?.email || '',
      dob: new Date(),
      language,
    },
  })

  function onSubmit(data: AccountFormValues) {
    setLanguage(data.language)
    if (auth.user) {
      auth.setUser({ ...auth.user, name: data.name, email: data.email })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{english ? 'Name' : 'Ism'}</FormLabel>
              <FormControl>
                <Input
                  placeholder={english ? 'Your name' : 'Ismingiz'}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {english
                  ? 'This name is displayed on your profile and in emails.'
                  : 'Bu ism profilingizda va email xabarlarida ko‘rsatiladi.'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email' placeholder='name@example.com' {...field} />
              </FormControl>
              <FormDescription>
                {english
                  ? 'This email will be displayed in your admin profile.'
                  : 'Bu email administrator profilingizda ko‘rsatiladi.'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='dob'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>
                {english ? 'Date of birth' : 'Tug‘ilgan sana'}
              </FormLabel>
              <DatePicker selected={field.value} onSelect={field.onChange} />
              <FormDescription>
                {english
                  ? 'Your date of birth is used to calculate your age.'
                  : 'Tug‘ilgan sana yoshingizni hisoblash uchun ishlatiladi.'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='language'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>{english ? 'Language' : 'Til'}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant='outline'
                      role='combobox'
                      className={cn(
                        'w-full max-w-sm justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? languages.find(
                            (item) => item.value === field.value
                          )?.[english ? 'label' : 'uzLabel']
                        : english
                          ? 'Select language'
                          : 'Tilni tanlang'}
                      <CaretSortIcon className='ms-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-[var(--radix-popover-trigger-width)] min-w-52 p-0'>
                  <Command>
                    <CommandInput
                      placeholder={
                        english ? 'Search language...' : 'Tilni qidiring...'
                      }
                    />
                    <CommandEmpty>
                      {english ? 'No language found.' : 'Til topilmadi.'}
                    </CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {languages.map((language) => (
                          <CommandItem
                            value={`${language.label} ${language.uzLabel}`}
                            key={language.value}
                            onSelect={() => {
                              form.setValue('language', language.value, {
                                shouldValidate: true,
                              })
                              setLanguage(language.value)
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                'size-4',
                                language.value === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {english ? language.label : language.uzLabel}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                {english
                  ? 'This language will be used in the dashboard.'
                  : 'Bu til boshqaruv panelida ishlatiladi.'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>
          {english ? 'Update account' : 'Hisobni yangilash'}
        </Button>
      </form>
    </Form>
  )
}
