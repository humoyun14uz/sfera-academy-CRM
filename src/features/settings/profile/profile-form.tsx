import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '@/stores/auth-store'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const profileFormSchema = z.object({
  username: z
    .string('Please enter your username.')
    .min(2, 'Username must be at least 2 characters.')
    .max(30, 'Username must not be longer than 30 characters.'),
  email: z.email({
    error: (iss) =>
      iss.input === undefined
        ? 'Please select an email to display.'
        : undefined,
  }),
  bio: z.string().max(160).min(4),
  urls: z
    .array(
      z.object({
        value: z.url('Please enter a valid URL.'),
      })
    )
    .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// This can come from your database or API.
export function ProfileForm() {
  const { language } = useLanguage()
  const english = language === 'en'
  const { auth } = useAuthStore()
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: auth.user?.name || auth.user?.email.split('@')[0] || '',
      email: auth.user?.email || '',
      bio: '',
      urls: [],
    },
    mode: 'onChange',
  })

  const { fields, append } = useFieldArray({
    name: 'urls',
    control: form.control,
  })

  const emailOptions = Array.from(
    new Set(
      [
        auth.user?.email,
        'm@example.com',
        'm@google.com',
        'm@support.com',
      ].filter(Boolean)
    )
  ) as string[]

  const initials = (auth.user?.name || auth.user?.email || 'U')
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          if (auth.user) {
            auth.setUser({
              ...auth.user,
              name: data.username,
              email: data.email,
            })
          }
          showSubmittedData(data)
        })}
        className='space-y-5'
      >
        <div className='relative overflow-hidden rounded-2xl border bg-gradient-to-r from-primary/[0.08] via-background to-violet-500/[0.06] p-5'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-4'>
              <div className='flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-lg font-bold text-primary ring-1 ring-primary/15'>
                {initials}
              </div>
              <div>
                <p className='text-xs font-semibold tracking-[0.16em] text-primary uppercase'>
                  {english ? 'Profile overview' : 'Profil ko‘rinishi'}
                </p>
                <p className='mt-1 text-lg font-bold'>
                  {auth.user?.name || auth.user?.email || 'User'}
                </p>
                <p className='text-sm text-muted-foreground'>
                  {auth.user?.email ||
                    (english ? 'No email connected' : 'Email ulanmagan')}
                </p>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-2 text-center text-xs sm:min-w-[220px]'>
              <div className='rounded-xl border bg-background/75 px-3 py-2'>
                <p className='font-semibold text-emerald-600'>
                  {english ? 'Active' : 'Faol'}
                </p>
                <p className='mt-0.5 text-muted-foreground'>
                  {english ? 'Account' : 'Hisob'}
                </p>
              </div>
              <div className='rounded-xl border bg-background/75 px-3 py-2'>
                <p className='font-semibold text-primary'>
                  {english ? 'Verified' : 'Tasdiqlangan'}
                </p>
                <p className='mt-0.5 text-muted-foreground'>Email</p>
              </div>
            </div>
          </div>
        </div>

        <div className='grid gap-5 xl:grid-cols-[1.1fr_0.9fr]'>
          <Card>
            <CardHeader className='border-b'>
              <CardTitle className='text-base'>
                {english ? 'Personal information' : 'Shaxsiy ma’lumotlar'}
              </CardTitle>
              <CardDescription>
                {english
                  ? 'Keep your main profile information current.'
                  : 'Asosiy profilingiz ma’lumotlarini yangilab turing.'}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-5 pt-5'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {english ? 'Username' : 'Foydalanuvchi nomi'}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='shadcn' {...field} />
                    </FormControl>
                    <FormDescription>
                      {english
                        ? 'Your display name inside the CRM.'
                        : 'CRM ichida ko‘rinadigan profilingiz nomi.'}
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              english
                                ? 'Select a verified email'
                                : 'Tasdiqlangan emailni tanlang'
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {emailOptions.map((email) => (
                          <SelectItem key={email} value={email}>
                            {email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {english
                        ? 'Use a verified address for CRM notifications.'
                        : 'CRM bildirishnomalari uchun tasdiqlangan manzildan foydalaning.'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='bio'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{english ? 'Bio' : 'Tarjimai hol'}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={
                          english
                            ? 'Tell us a little about yourself'
                            : 'O‘zingiz haqingizda qisqacha yozing'
                        }
                        className='min-h-28 resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {english
                        ? 'A short profile summary visible to your team.'
                        : 'Jamoangiz ko‘rishi mumkin bo‘lgan qisqa profil tavsifi.'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='border-b'>
              <CardTitle className='text-base'>
                {english ? 'Professional links' : 'Professional havolalar'}
              </CardTitle>
              <CardDescription>
                {english
                  ? 'Add the links you use with your academy work.'
                  : 'Akademiyadagi ishlaringizda ishlatadigan havolalarni qo‘shing.'}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4 pt-5'>
              {fields.length === 0 && (
                <div className='rounded-2xl border border-dashed p-5 text-center'>
                  <p className='font-medium'>
                    {english ? 'No links yet' : 'Hali havola yo‘q'}
                  </p>
                  <p className='mt-1 text-xs text-muted-foreground'>
                    {english
                      ? 'Add a portfolio, website, or professional social profile.'
                      : 'Portfolio, sayt yoki professional ijtimoiy tarmoq havolasini qo‘shing.'}
                  </p>
                </div>
              )}
              {fields.map((field, index) => (
                <FormField
                  control={form.control}
                  key={field.id}
                  name={`urls.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(index !== 0 && 'sr-only')}>
                        {english ? 'URL' : 'Havola'}
                      </FormLabel>
                      <FormControl className={cn(index !== 0 && 'mt-1.5')}>
                        <Input placeholder='https://...' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='cursor-pointer'
                onClick={() => append({ value: '' })}
              >
                {english ? 'Add link' : 'Havola qo‘shish'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className='flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4 shadow-sm'>
          <div>
            <p className='font-semibold'>
              {english ? 'Profile changes' : 'Profil o‘zgarishlari'}
            </p>
            <p className='text-xs text-muted-foreground'>
              {english
                ? 'Your name and email will be updated across the workspace.'
                : 'Ism va email butun ish maydonida yangilanadi.'}
            </p>
          </div>
          <Button type='submit' className='cursor-pointer'>
            {english ? 'Save profile' : 'Profilni saqlash'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
