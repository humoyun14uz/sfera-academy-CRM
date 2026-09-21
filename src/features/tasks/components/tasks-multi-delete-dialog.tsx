'use client'

import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useLanguage } from '@/context/language-provider'
import { useTasks } from './tasks-provider'

type TaskMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

const CONFIRM_WORD = 'DELETE'

export function TasksMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: TaskMultiDeleteDialogProps<TData>) {
  const { language } = useLanguage()
  const english = language === 'en'
  const { deleteTasks } = useTasks()
  const [value, setValue] = useState('')

  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDelete = () => {
    if (value.trim() !== CONFIRM_WORD) {
      toast.error(english ? `Please type "${CONFIRM_WORD}" to confirm.` : `Tasdiqlash uchun "${CONFIRM_WORD}" so‘zini yozing.`)
      return
    }

    deleteTasks(selectedRows.map((row) => (row.original as { id: string }).id))
    onOpenChange(false)
    setValue('')
    table.resetRowSelection()
    toast.success(english ? `Deleted ${selectedRows.length} ${selectedRows.length > 1 ? 'tasks' : 'task'}` : `${selectedRows.length} ta vazifa o‘chirildi.`)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      form='tasks-multi-delete-form'
      disabled={value.trim() !== CONFIRM_WORD}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {english ? 'Delete' : 'O‘chirish'} {selectedRows.length}{' '}
          {english ? (selectedRows.length > 1 ? 'tasks' : 'task') : 'ta vazifa'}
        </span>
      }
      desc={
        <form
          id='tasks-multi-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            handleDelete()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {english ? 'Are you sure you want to delete the selected tasks?' : 'Tanlangan vazifalarni o‘chirishni xohlaysizmi?'} <br />
            {english ? 'This action cannot be undone.' : 'Bu amalni ortga qaytarib bo‘lmaydi.'}
          </p>

          <Label className='my-4 flex flex-col items-start gap-1.5'>
            <span className=''>{english ? `Confirm by typing "${CONFIRM_WORD}":` : `"${CONFIRM_WORD}" so‘zini yozib tasdiqlang:`}</span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={english ? `Type "${CONFIRM_WORD}" to confirm.` : `Tasdiqlash uchun "${CONFIRM_WORD}" yozing.`}
              autoFocus
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>{english ? 'Warning!' : 'Ogohlantirish!'}</AlertTitle>
            <AlertDescription>
              {english ? 'Please be careful, this operation cannot be rolled back.' : 'Ehtiyot bo‘ling, bu amalni ortga qaytarib bo‘lmaydi.'}
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText={english ? 'Delete' : 'O‘chirish'}
      destructive
    />
  )
}
