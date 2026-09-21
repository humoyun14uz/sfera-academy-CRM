import { type ColumnDef } from '@tanstack/react-table'
import { type TranslationKey } from '@/context/language-provider'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { callTypes, roles } from '../data/data'
import { type User } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const getUsersColumns = (t: (key: TranslationKey) => string): ColumnDef<User>[] => [
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
    meta: {
      className: cn('inset-s-0 z-10 rounded-tl-[inherit] max-md:sticky'),
    },
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
    accessorKey: 'username',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('username')} />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36 ps-3'>{row.getValue('username')}</LongText>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'inset-s-6 ps-0.5 max-md:sticky @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    id: 'fullName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('name')} />
    ),
    cell: ({ row }) => {
      const { firstName, lastName } = row.original
      const fullName = `${firstName} ${lastName}`
      const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase()
      return (
        <div className='flex items-center gap-2.5'>
          <Avatar className='size-8 text-xs font-semibold'>
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`} alt={fullName} />
            <AvatarFallback className='bg-primary/10 text-primary'>{initials}</AvatarFallback>
          </Avatar>
          <LongText className='max-w-36'>{fullName}</LongText>
        </div>
      )
    },
    meta: { className: 'w-36' },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('email')} />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>{row.getValue('email')}</div>
    ),
  },
  {
    accessorKey: 'phoneNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('phoneNumber')} />
    ),
    cell: ({ row }) => <div>{row.getValue('phoneNumber')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('status')} />
    ),
    cell: ({ row }) => {
      const { status } = row.original
      const badgeColor = callTypes.get(status)
      return (
        <div className='flex space-x-2'>
          <Badge variant='outline' className={cn('capitalize', badgeColor)}>
            {t(status)}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('role')} />
    ),
    cell: ({ row }) => {
      const { role } = row.original
      const userType = roles.find(({ value }) => value === role)

      if (!userType) {
        return null
      }

      return (
        <div className='flex items-center gap-x-2'>
          {userType.icon && (
            <userType.icon size={16} className='text-muted-foreground' />
          )}
          <span className='text-sm'>
            {t(
              userType.value === 'superadmin'
                ? 'superAdmin'
                : userType.value
            )}
          </span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
