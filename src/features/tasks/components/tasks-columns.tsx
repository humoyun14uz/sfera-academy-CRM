import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { labels, priorities, statuses } from '../data/data'
import { type Task } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const getTasksColumns = (english: boolean): ColumnDef<Task>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-0.5'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-0.5'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={english ? 'Task' : 'Vazifa'} />
    ),
    cell: ({ row }) => <div className='w-20'>{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={english ? 'Title' : 'Sarlavha'} />
    ),
    meta: {
      className: 'min-w-[400px]',
      tdClassName: 'ps-4 pe-3',
    },
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label)

      return (
        <div className='flex items-center gap-3 py-1'>
          {label && (
            <Badge variant='outline' className='shrink-0 px-2 py-0.5 text-xs font-medium bg-muted/40'>
              {english ? label.label : label.value === 'bug' ? 'Xato' : label.value === 'feature' ? 'Funksiya' : 'Hujjatlashtirish'}
            </Badge>
          )}
          <span className='font-medium text-foreground text-sm'>{row.getValue('title')}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={english ? 'Status' : 'Holati'} />
    ),
    meta: { className: 'w-36', tdClassName: 'ps-4' },
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue('status')
      )

      if (!status) {
        return null
      }

      return (
        <div className='flex w-36 items-center gap-2 text-xs'>
          {status.icon && (
            <status.icon className='size-4 text-muted-foreground shrink-0' />
          )}
          <span className='whitespace-nowrap'>{english ? status.label : ({ backlog: 'Rejada', todo: 'Bajarilishi kerak', 'in progress': 'Jarayonda', done: 'Bajarilgan', canceled: 'Bekor qilingan' } as Record<string, string>)[status.value]}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={english ? 'Priority' : 'Muhimlik'} />
    ),
    meta: { className: 'w-32', tdClassName: 'ps-3' },
    cell: ({ row }) => {
      const priority = priorities.find(
        (priority) => priority.value === row.getValue('priority')
      )

      if (!priority) {
        return null
      }

      return (
        <div className='flex w-28 items-center gap-2 text-xs'>
          {priority.icon && (
            <priority.icon className='size-4 text-muted-foreground shrink-0' />
          )}
          <span className='whitespace-nowrap'>{english ? priority.label : ({ low: 'Past', medium: 'O‘rta', high: 'Yuqori', critical: 'Juda yuqori' } as Record<string, string>)[priority.value]}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
