import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { useLanguage } from '@/context/language-provider'
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

const items = ['recents', 'home', 'applications', 'desktop', 'downloads', 'documents'] as const

const displayFormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one item.',
  }),
})

type DisplayFormValues = z.infer<typeof displayFormSchema>

// This can come from your database or API.
const defaultValues: Partial<DisplayFormValues> = {
  items: ['recents', 'home'],
}

export function DisplayForm() {
  const { language } = useLanguage()
  const english = language === 'en'
  const labels: Record<(typeof items)[number], string> = english
    ? { recents: 'Recents', home: 'Home', applications: 'Applications', desktop: 'Desktop', downloads: 'Downloads', documents: 'Documents' }
    : { recents: 'So‘nggi fayllar', home: 'Bosh sahifa', applications: 'Ilovalar', desktop: 'Ish stoli', downloads: 'Yuklamalar', documents: 'Hujjatlar' }
  const form = useForm<DisplayFormValues>({
    resolver: zodResolver(displayFormSchema),
    defaultValues,
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => showSubmittedData(data))}
        className='space-y-8'
      >
        <FormField
          control={form.control}
          name='items'
          render={() => (
            <FormItem>
              <div className='mb-4'>
                <FormLabel className='text-base'>{english ? 'Sidebar' : 'Yon panel'}</FormLabel>
                <FormDescription>
                  {english ? 'Select the items you want to display in the sidebar.' : 'Yon panelda ko‘rsatiladigan bo‘limlarni tanlang.'}
                </FormDescription>
              </div>
              {items.map((item) => (
                <FormField
                  key={item}
                  control={form.control}
                  name='items'
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item}
                        className='flex flex-row items-start'
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className='font-normal'>
                          {labels[item]}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>{english ? 'Update display' : 'Displeyni yangilash'}</Button>
      </form>
    </Form>
  )
}
