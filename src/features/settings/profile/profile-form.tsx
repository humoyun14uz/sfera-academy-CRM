import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/context/language-provider'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          if (auth.user) {
            auth.setUser({ ...auth.user, name: data.username, email: data.email })
          }
          showSubmittedData(data)
        })}
        className='space-y-8'
      >
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{english ? 'Username' : 'Foydalanuvchi nomi'}</FormLabel>
              <FormControl>
                <Input placeholder='shadcn' {...field} />
              </FormControl>
              <FormDescription>
                {english ? 'This is your public display name. You can change it once every 30 days.' : 'Bu profilingizda ko‘rinadigan nom. Uni 30 kunda bir marta o‘zgartirishingiz mumkin.'}
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={english ? 'Select a verified email to display' : 'Tasdiqlangan emailni tanlang'} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='m@example.com'>m@example.com</SelectItem>
                  <SelectItem value='m@google.com'>m@google.com</SelectItem>
                  <SelectItem value='m@support.com'>m@support.com</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {english ? 'You can manage verified email addresses in your ' : 'Tasdiqlangan email manzillarini '}
                <Link to='/'>{english ? 'email settings' : 'email sozlamalarida'}</Link>{english ? '.' : ' boshqarishingiz mumkin.'}
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
                  placeholder={english ? 'Tell us a little bit about yourself' : 'O‘zingiz haqingizda qisqacha yozing'}
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {english ? 'You can mention other users and organizations.' : 'Boshqa foydalanuvchi va tashkilotlarni eslatib o‘tishingiz mumkin.'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && 'sr-only')}>
                    {english ? 'URLs' : 'Havolalar'}
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && 'sr-only')}>
                    {english ? 'Add links to your website, blog, or social media profiles.' : 'Veb-sayt, blog yoki ijtimoiy tarmoq profilingiz havolalarini qo‘shing.'}
                  </FormDescription>
                  <FormControl className={cn(index !== 0 && 'mt-1.5')}>
                    <Input {...field} />
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
            className='mt-2'
            onClick={() => append({ value: '' })}
          >
            {english ? 'Add URL' : 'Havola qo‘shish'}
          </Button>
        </div>
        <Button type='submit'>{english ? 'Update profile' : 'Profilni yangilash'}</Button>
      </form>
    </Form>
  )
}
