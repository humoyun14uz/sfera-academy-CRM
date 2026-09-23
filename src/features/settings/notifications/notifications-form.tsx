import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { useLanguage } from '@/context/language-provider'
import { useAuthStore } from '@/stores/auth-store'
import { getPrimaryRole } from '@/lib/rbac'
import { useCrmStore } from '@/lib/crm-store'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Bell } from 'lucide-react'

const notificationsFormSchema = z.object({
  type: z.enum(['all', 'mentions', 'none'], {
    error: (iss) =>
      iss.input === undefined
        ? 'Please select a notification type.'
        : undefined,
  }),
  mobile: z.boolean().default(false).optional(),
  communication_emails: z.boolean().default(false).optional(),
  social_emails: z.boolean().default(false).optional(),
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
})

const createNotificationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  category: z.enum(['system', 'alert', 'info', 'success']),
  targetRole: z.enum(['all', 'admin', 'manager', 'teacher', 'student', 'finance']),
})

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>
type CreateNotificationValues = z.infer<typeof createNotificationSchema>

// This can come from your database or API.
const defaultValues: Partial<NotificationsFormValues> = {
  communication_emails: false,
  marketing_emails: false,
  social_emails: true,
  security_emails: true,
}

export function NotificationsForm() {
  const { language } = useLanguage()
  const english = language === 'en'
  const user = useAuthStore((state) => state.auth.user)
  const role = getPrimaryRole(user?.role)
  const addNotification = useCrmStore((state) => state.addNotification)
  
  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues,
  })

  const createForm = useForm<CreateNotificationValues>({
    resolver: zodResolver(createNotificationSchema),
    defaultValues: {
      title: '',
      message: '',
      category: 'info',
      targetRole: 'all',
    },
  })

  const canCreateNotifications = role === 'Super Admin' || role === 'Admin' || role === 'Manager'
  const [notificationCounter, setNotificationCounter] = useState(0)

  const handleCreateNotification = (data: CreateNotificationValues) => {
    const newNotification = {
      id: `notif-${notificationCounter}`,
      title: data.title,
      category: data.category,
      read: false,
      createdAt: new Date().toISOString(),
      target: '/settings/notifications',
    }
    
    setNotificationCounter(notificationCounter + 1)
    
    addNotification(newNotification)
    createForm.reset()
    
    if (english) {
      alert('Notification created successfully!')
    } else {
      alert('Bildirishnoma muvaffaqiyatli yaratildi!')
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => showSubmittedData(data))}
          className='space-y-8'
        >
        <FormField
          control={form.control}
          name='type'
          render={({ field }) => (
            <FormItem className='relative space-y-3'>
              <FormLabel>{english ? 'Notify me about...' : 'Quyidagilar haqida xabar bering:'}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className='flex flex-col gap-2'
                >
                  <FormItem className='flex items-center'>
                    <FormControl>
                      <RadioGroupItem value='all' />
                    </FormControl>
                    <FormLabel className='font-normal'>
                      {english ? 'All new messages' : 'Barcha yangi xabarlar'}
                    </FormLabel>
                  </FormItem>
                  <FormItem className='flex items-center'>
                    <FormControl>
                      <RadioGroupItem value='mentions' />
                    </FormControl>
                    <FormLabel className='font-normal'>
                      {english ? 'Direct messages and mentions' : 'Shaxsiy xabarlar va eslatmalar'}
                    </FormLabel>
                  </FormItem>
                  <FormItem className='flex items-center'>
                    <FormControl>
                      <RadioGroupItem value='none' />
                    </FormControl>
                    <FormLabel className='font-normal'>{english ? 'Nothing' : 'Hech narsa'}</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='relative'>
          <h3 className='mb-4 text-lg font-medium'>{english ? 'Email Notifications' : 'Email bildirishnomalari'}</h3>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='communication_emails'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>
                      {english ? 'Communication emails' : 'Muloqot email xabarlari'}
                    </FormLabel>
                    <FormDescription>
                      {english ? 'Receive emails about your account activity.' : 'Hisobingizdagi faollik haqida email oling.'}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='marketing_emails'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>
                      {english ? 'Marketing emails' : 'Marketing email xabarlari'}
                    </FormLabel>
                    <FormDescription>
                      {english ? 'Receive emails about new products, features, and more.' : 'Yangi mahsulotlar, imkoniyatlar va boshqa yangiliklar haqida email oling.'}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='social_emails'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>{english ? 'Social emails' : 'Ijtimoiy email xabarlari'}</FormLabel>
                    <FormDescription>
                      {english ? 'Receive emails for friend requests, follows, and more.' : 'Do‘stlik so‘rovlari, kuzatuvlar va boshqa ijtimoiy faollik haqida email oling.'}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='security_emails'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>{english ? 'Security emails' : 'Xavfsizlik email xabarlari'}</FormLabel>
                    <FormDescription>
                      {english ? 'Receive emails about your account activity and security.' : 'Hisobingiz faolligi va xavfsizligi haqida email oling.'}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name='mobile'
          render={({ field }) => (
            <FormItem className='relative flex flex-row items-start'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel>
                  {english ? 'Use different settings for my mobile devices' : 'Mobil qurilmalarim uchun boshqa sozlamalardan foydalanish'}
                </FormLabel>
                  <FormDescription>
                  {english ? 'You can manage your mobile notifications on the ' : 'Mobil bildirishnomalarni '}
                  <Link
                    to='/settings'
                    className='underline decoration-dashed underline-offset-4 hover:decoration-solid'
                  >
                    {english ? 'mobile settings' : 'mobil sozlamalar'}
                  </Link>{' '}
                  {english ? ' page.' : ' sahifasida boshqarishingiz mumkin.'}
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type='submit'>{english ? 'Update notifications' : 'Bildirishnomalarni yangilash'}</Button>
      </form>
    </Form>

    {/* Notification Creation Form for Admins/Managers */}
    {canCreateNotifications && (
      <Card className='mt-8 border-primary/20'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Bell className='size-5 text-primary' />
            {english ? 'Create New Notification' : 'Yangi Bildirishnoma Yaratish'}
          </CardTitle>
          <CardDescription>
            {english ? 'Send notifications to users in the system' : 'Tizimdagi foydalanuvchilarga bildirishnomalar yuboring'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...createForm}>
            <form
              onSubmit={createForm.handleSubmit(handleCreateNotification)}
              className='space-y-4'
            >
              <FormField
                control={createForm.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{english ? 'Title' : 'Sarlavha'}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={english ? 'Enter notification title...' : 'Bildirishnoma sarlavhasini kiriting...'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createForm.control}
                name='message'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{english ? 'Message' : 'Xabar'}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={english ? 'Enter notification message...' : 'Bildirishnoma xabarini kiriting...'}
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid gap-4 sm:grid-cols-2'>
                <FormField
                  control={createForm.control}
                  name='category'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{english ? 'Category' : 'Kategoriya'}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={english ? 'Select category' : 'Kategoriyani tanlang'} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='system'>{english ? 'System' : 'Tizim'}</SelectItem>
                          <SelectItem value='alert'>{english ? 'Alert' : 'Ogohlantirish'}</SelectItem>
                          <SelectItem value='info'>{english ? 'Info' : 'Ma\'lumot'}</SelectItem>
                          <SelectItem value='success'>{english ? 'Success' : 'Muvaffaqiyat'}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createForm.control}
                  name='targetRole'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{english ? 'Target Role' : 'Maqsad Rol'}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={english ? 'Select target role' : 'Maqsad rolni tanlang'} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='all'>{english ? 'All Users' : 'Barcha Foydalanuvchilar'}</SelectItem>
                          <SelectItem value='admin'>{english ? 'Admins' : 'Adminlar'}</SelectItem>
                          <SelectItem value='manager'>{english ? 'Managers' : 'Managerlar'}</SelectItem>
                          <SelectItem value='teacher'>{english ? 'Teachers' : 'O\'qituvchilar'}</SelectItem>
                          <SelectItem value='student'>{english ? 'Students' : 'O\'quvchilar'}</SelectItem>
                          <SelectItem value='finance'>{english ? 'Finance' : 'Moliya'}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type='submit' className='w-full'>
                <Plus className='me-2 size-4' />
                {english ? 'Create Notification' : 'Bildirishnoma Yaratish'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    )}
    </>
  )
}
