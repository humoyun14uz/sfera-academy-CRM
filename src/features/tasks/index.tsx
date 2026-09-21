import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { TasksDialogs } from './components/tasks-dialogs'
import { TasksPrimaryButtons } from './components/tasks-primary-buttons'
import { TasksProvider, useTasks } from './components/tasks-provider'
import { TasksTable } from './components/tasks-table'
import { useLanguage } from '@/context/language-provider'

export function Tasks() {
  const { language } = useLanguage()
  const english = language === 'en'
  return (
    <TasksProvider>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>{english ? 'Tasks' : 'Vazifalar'}</h2>
            <p className='text-muted-foreground'>
              {english ? 'Internal academy management tasks.' : 'Academy ichki boshqaruv vazifalari.'}
            </p>
          </div>
          <TasksPrimaryButtons />
        </div>
        <TasksContent />
      </Main>

      <TasksDialogs />
    </TasksProvider>
  )
}

function TasksContent() {
  const { tasks } = useTasks()
  return <TasksTable data={tasks} />
}
