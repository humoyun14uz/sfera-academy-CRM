import React, { useEffect, useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { tasks as initialTasks } from '../data/tasks'
import { type Task } from '../data/schema'

type TasksDialogType = 'create' | 'update' | 'delete' | 'import'
const TASKS_STORAGE_KEY = 'sfera-crm-tasks'

type TasksContextType = {
  open: TasksDialogType | null
  setOpen: (str: TasksDialogType | null) => void
  currentRow: Task | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Task | null>>
  tasks: Task[]
  createTask: (task: Omit<Task, 'id'>) => Task
  updateTask: (id: string, task: Omit<Task, 'id'>) => void
  deleteTask: (id: string) => void
  deleteTasks: (ids: string[]) => void
  updateTasks: (ids: string[], changes: Partial<Omit<Task, 'id'>>) => void
}

const TasksContext = React.createContext<TasksContextType | null>(null)

function readTasks(): Task[] {
  if (typeof window === 'undefined') return initialTasks as Task[]
  try {
    const saved = window.localStorage.getItem(TASKS_STORAGE_KEY)
    if (!saved) return initialTasks as Task[]
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed : initialTasks as Task[]
  } catch {
    return initialTasks as Task[]
  }
}

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<TasksDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Task | null>(null)
  const [tasks, setTasks] = useState<Task[]>(readTasks)

  useEffect(() => {
    window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const createTask = (task: Omit<Task, 'id'>) => {
    const next: Task = { ...task, id: `TASK-${Date.now()}` }
    setTasks((current) => [next, ...current])
    return next
  }

  const updateTask = (id: string, task: Omit<Task, 'id'>) => {
    setTasks((current) => current.map((item) => item.id === id ? { ...item, ...task, id } : item))
  }

  const deleteTask = (id: string) => {
    setTasks((current) => current.filter((item) => item.id !== id))
  }

  const deleteTasks = (ids: string[]) => {
    const selected = new Set(ids)
    setTasks((current) => current.filter((item) => !selected.has(item.id)))
  }

  const updateTasks = (ids: string[], changes: Partial<Omit<Task, 'id'>>) => {
    const selected = new Set(ids)
    setTasks((current) => current.map((item) => selected.has(item.id) ? { ...item, ...changes } : item))
  }

  return (
    <TasksContext value={{
      open, setOpen, currentRow, setCurrentRow, tasks,
      createTask, updateTask, deleteTask, deleteTasks, updateTasks,
    }}>
      {children}
    </TasksContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTasks = () => {
  const tasksContext = React.useContext(TasksContext)
  if (tasksContext) return tasksContext
  return {
    open: null,
    setOpen: () => undefined,
    currentRow: null,
    setCurrentRow: () => undefined,
    tasks: initialTasks as Task[],
    createTask: (task: Omit<Task, 'id'>) => ({ ...task, id: `TASK-${Date.now()}` }),
    updateTask: () => undefined,
    deleteTask: () => undefined,
    deleteTasks: () => undefined,
    updateTasks: () => undefined,
  }
}

export { TASKS_STORAGE_KEY }
