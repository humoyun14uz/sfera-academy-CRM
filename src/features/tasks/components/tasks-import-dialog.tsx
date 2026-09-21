import { z } from 'zod'
import { useState } from 'react'
import { FileSpreadsheet, UploadCloud, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { useLanguage } from '@/context/language-provider'
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

const formSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, {
      message: 'Please upload a file.',
    })
    .refine(
      (files) => ['text/csv'].includes(files?.[0]?.type),
      'Please upload csv format.'
    ),
})

type TaskImportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TasksImportDialog({
  open,
  onOpenChange,
}: TaskImportDialogProps) {
  const { language } = useLanguage()
  const english = language === 'en'
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { file: undefined },
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const onSubmit = () => {
    const file = form.getValues('file')

    if (file && file[0]) {
      const fileDetails = {
        name: file[0].name,
        size: file[0].size,
        type: file[0].type,
      }
      showSubmittedData(fileDetails, language === 'en' ? 'You have imported the following file:' : 'Quyidagi fayl import qilindi:')
    }
    setSelectedFile(null)
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        setSelectedFile(null)
        form.reset()
      }}
    >
      <DialogContent className='gap-2 sm:max-w-sm'>
        <DialogHeader className='text-start'>
          <DialogTitle>{english ? 'Import tasks' : 'Vazifalarni import qilish'}</DialogTitle>
          <DialogDescription>
            {english ? 'Import tasks quickly from a CSV file.' : 'CSV fayldan vazifalarni tez import qiling.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id='task-import-form' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='file'
              render={() => (
                <FormItem className='my-3'>
                  <FormLabel>{english ? 'CSV File' : 'CSV Fayl'}</FormLabel>
                  <FormControl>
                    {selectedFile ? (
                      <div className='flex items-center justify-between rounded-lg border border-primary/40 bg-primary/5 px-3 py-2.5 text-xs'>
                        <div className='flex items-center gap-2 min-w-0'>
                          <FileSpreadsheet className='size-4 shrink-0 text-primary' />
                          <span className='truncate font-medium'>{selectedFile.name}</span>
                          <span className='shrink-0 text-muted-foreground'>
                            ({(selectedFile.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <button
                          type='button'
                          className='ms-2 rounded-full p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
                          onClick={() => {
                            setSelectedFile(null)
                            form.setValue('file', new DataTransfer().files)
                          }}
                        >
                          <X className='size-3.5' />
                        </button>
                      </div>
                    ) : (
                      <label className='flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-muted-foreground/30 p-4 text-center transition-colors hover:border-primary hover:bg-primary/5'>
                        <UploadCloud className='size-6 text-muted-foreground' />
                        <span className='text-xs text-muted-foreground font-medium'>
                          {english ? 'Choose a CSV file' : 'CSV faylni tanlang'}
                        </span>
                        <input
                          type='file'
                          accept='text/csv'
                          className='sr-only'
                          onChange={(e) => {
                            const files = e.target.files
                            if (files && files[0]) {
                              setSelectedFile(files[0])
                              form.setValue('file', files)
                            }
                          }}
                        />
                      </label>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className='gap-2'>
          <DialogClose asChild>
            <Button variant='outline'>{english ? 'Close' : 'Yopish'}</Button>
          </DialogClose>
          <Button type='submit' form='task-import-form' disabled={!selectedFile}>
            {english ? 'Import' : 'Import qilish'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
