import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLanguage } from '@/context/language-provider'
import { MailPlus, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SelectDropdown } from '@/components/select-dropdown'
import { roles } from '../data/data'

const formSchema = z.object({
  email: z.email({
    error: (iss) =>
      iss.input === '' ? 'Please enter an email to invite.' : undefined,
  }),
  role: z.string().min(1, 'Role is required.'),
  desc: z.string().optional(),
})

type UserInviteForm = z.infer<typeof formSchema>

type UserInviteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersInviteDialog({
  open,
  onOpenChange,
}: UserInviteDialogProps) {
  const { language } = useLanguage()
  const english = language === 'en'
  const form = useForm<UserInviteForm>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', role: '', desc: '' },
  })

  const onSubmit = (values: UserInviteForm) => {
    form.reset()
    void values
    toast.success(english ? 'Invitation sent successfully.' : 'Taklif muvaffaqiyatli yuborildi.')
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-start'>
          <DialogTitle className='flex items-center gap-2'>
            <MailPlus /> {english ? 'Invite student' : 'O‘quvchini taklif qilish'}
          </DialogTitle>
          <DialogDescription>
            {english
              ? 'Send an email invitation to add a student to the academy.'
              : 'O‘quvchini akademiyaga qo‘shish uchun email orqali taklif yuboring.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='user-invite-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='example@gmail.com'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{english ? 'Role' : 'Roli'}</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder={english ? 'Select a role' : 'Rolni tanlang'}
                    items={roles.filter((role) => role.value === 'student').map(({ label, value }) => ({
                      label,
                      value,
                    }))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='desc'
              render={({ field }) => (
                <FormItem className=''>
                  <FormLabel>{english ? 'Note (optional)' : 'Izoh (ixtiyoriy)'}</FormLabel>
                  <FormControl>
                    <Textarea
                      className='resize-none'
                      placeholder={english ? 'Add a note (optional)' : 'Izoh yozing (ixtiyoriy)'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className='gap-y-2'>
          <DialogClose asChild>
            <Button variant='outline'>{english ? 'Cancel' : 'Bekor qilish'}</Button>
          </DialogClose>
          <Button type='submit' form='user-invite-form'>
            {english ? 'Invite' : 'Taklif qilish'} <Send />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
