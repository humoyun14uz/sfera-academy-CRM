import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { SelectDropdown } from '@/components/select-dropdown'
import { type Task } from '../data/schema'
import { useTasks } from './tasks-provider'

type TaskMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Task
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  status: z.string().min(1, 'Please select a status.'),
  label: z.string().min(1, 'Please select a label.'),
  priority: z.string().min(1, 'Please choose a priority.'),
})
type TaskForm = z.infer<typeof formSchema>

export function TasksMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: TaskMutateDrawerProps) {
  const isUpdate = !!currentRow
  const { language } = useLanguage()
  const english = language === 'en'
  const { createTask, updateTask } = useTasks()

  const form = useForm<TaskForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      title: '',
      status: '',
      label: '',
      priority: '',
    },
  })

  const onSubmit = (data: TaskForm) => {
    if (currentRow) {
      updateTask(currentRow.id, data)
    } else {
      createTask(data)
    }
    onOpenChange(false)
    form.reset()
    showSubmittedData(
      data,
      currentRow
        ? english
          ? 'Task updated successfully.'
          : 'Vazifa muvaffaqiyatli yangilandi.'
        : english
          ? 'Task created successfully.'
          : 'Vazifa muvaffaqiyatli yaratildi.'
    )
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        form.reset()
      }}
    >
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-start'>
          <SheetTitle>
            {isUpdate
              ? english
                ? 'Update task'
                : 'Vazifani tahrirlash'
              : english
                ? 'Create task'
                : 'Vazifa yaratish'}
          </SheetTitle>
          <SheetDescription>
            {isUpdate
              ? english
                ? 'Update the task information.'
                : 'Vazifa ma’lumotlarini yangilang.'
              : english
                ? 'Add a new task with the necessary information.'
                : 'Kerakli ma’lumotlar bilan yangi vazifa yarating.'}
            {english
              ? ' Click save when you are done.'
              : ' Tugatgach saqlashni bosing.'}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id='tasks-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-6 overflow-y-auto px-4'
          >
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{english ? 'Title' : 'Sarlavha'}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={
                        english ? 'Enter a title' : 'Sarlavhani kiriting'
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{english ? 'Status' : 'Holati'}</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    isControlled
                    onValueChange={field.onChange}
                    placeholder={english ? 'Select status' : 'Holatni tanlang'}
                    items={[
                      {
                        label: english ? 'In Progress' : 'Jarayonda',
                        value: 'in progress',
                      },
                      {
                        label: english ? 'Backlog' : 'Rejada',
                        value: 'backlog',
                      },
                      {
                        label: english ? 'Todo' : 'Bajarilishi kerak',
                        value: 'todo',
                      },
                      {
                        label: english ? 'Canceled' : 'Bekor qilingan',
                        value: 'canceled',
                      },
                      { label: english ? 'Done' : 'Bajarilgan', value: 'done' },
                    ]}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='label'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{english ? 'Category' : 'Kategoriya'}</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    isControlled
                    onValueChange={field.onChange}
                    placeholder={
                      english ? 'Select category' : 'Kategoriyani tanlang'
                    }
                    items={[
                      {
                        label: english ? 'Documentation' : 'Hujjatlashtirish',
                        value: 'documentation',
                      },
                      {
                        label: english ? 'Feature' : 'Funksiya',
                        value: 'feature',
                      },
                      { label: english ? 'Bug' : 'Xato', value: 'bug' },
                    ]}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='priority'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{english ? 'Priority' : 'Muhimlik'}</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    isControlled
                    onValueChange={field.onChange}
                    placeholder={
                      english ? 'Select priority' : 'Muhimlikni tanlang'
                    }
                    items={[
                      {
                        label: english ? 'Critical' : 'Juda yuqori',
                        value: 'critical',
                      },
                      { label: english ? 'High' : 'Yuqori', value: 'high' },
                      { label: english ? 'Medium' : 'O‘rta', value: 'medium' },
                      { label: english ? 'Low' : 'Past', value: 'low' },
                    ]}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline'>{english ? 'Close' : 'Yopish'}</Button>
          </SheetClose>
          <Button form='tasks-form' type='submit'>
            {english ? 'Save changes' : 'Saqlash'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
