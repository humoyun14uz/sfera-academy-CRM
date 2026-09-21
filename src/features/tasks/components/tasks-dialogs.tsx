import { showSubmittedData } from '@/lib/show-submitted-data'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { TasksImportDialog } from './tasks-import-dialog'
import { TasksMutateDrawer } from './tasks-mutate-drawer'
import { useTasks } from './tasks-provider'
import { useLanguage } from '@/context/language-provider'

export function TasksDialogs() {
  const { open, setOpen, currentRow, setCurrentRow, deleteTask } = useTasks()
  const { language } = useLanguage()
  const english = language === 'en'
  return (
    <>
      <TasksMutateDrawer
        key='task-create'
        open={open === 'create'}
        onOpenChange={(value) => setOpen(value ? 'create' : null)}
      />

      <TasksImportDialog
        key='tasks-import'
        open={open === 'import'}
        onOpenChange={(value) => setOpen(value ? 'import' : null)}
      />

      {currentRow && (
        <>
          <TasksMutateDrawer
            key={`task-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={(value) => {
              setOpen(value ? 'update' : null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key='task-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={(value) => {
              setOpen(value ? 'delete' : null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => {
              deleteTask(currentRow.id)
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
              showSubmittedData(
                currentRow,
                english ? 'The following task has been deleted:' : 'Quyidagi vazifa o‘chirildi:'
              )
            }}
            className='max-w-md'
            title={english ? `Delete this task: ${currentRow.id}?` : `Ushbu vazifa o‘chirilsinmi: ${currentRow.id}?`}
            desc={
              <>
                {english ? 'You are about to delete a task with the ID ' : 'Siz ID raqami '}
                <strong>{currentRow.id}</strong>. <br />
                {english ? 'This action cannot be undone.' : 'Bu amalni ortga qaytarib bo‘lmaydi.'}
              </>
            }
            confirmText={english ? 'Delete' : 'O‘chirish'}
          />
        </>
      )}
    </>
  )
}
