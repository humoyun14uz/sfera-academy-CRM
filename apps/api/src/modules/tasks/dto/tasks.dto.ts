import { ApiProperty } from '@nestjs/swagger'

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  COMPLETED = 'completed',
}

export enum TaskCategory {
  ADMINISTRATION = 'administration',
  ACADEMIC = 'academic',
  FINANCE = 'finance',
  TECHNICAL = 'technical',
  COMMUNICATION = 'communication',
}

export class CreateTaskDto {
  @ApiProperty({ example: 'Prepare monthly report' })
  title!: string

  @ApiProperty({ example: 'Generate and send monthly financial report to management' })
  description!: string

  @ApiProperty({ enum: TaskPriority, example: TaskPriority.HIGH })
  priority!: TaskPriority

  @ApiProperty({ enum: TaskCategory, example: TaskCategory.FINANCE })
  category!: TaskCategory

  @ApiProperty({ example: '2026-09-30T23:59:59Z' })
  dueDate!: string

  @ApiProperty({ example: ['1', '2'], required: false })
  assignees?: string[]

  @ApiProperty({ example: '1', required: false })
  groupId?: string
}

export class UpdateTaskDto {
  @ApiProperty({ example: 'Prepare monthly report', required: false })
  title?: string

  @ApiProperty({ example: 'Generate and send monthly financial report to management', required: false })
  description?: string

  @ApiProperty({ enum: TaskPriority, example: TaskPriority.HIGH, required: false })
  priority?: TaskPriority

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.IN_PROGRESS, required: false })
  status?: TaskStatus

  @ApiProperty({ enum: TaskCategory, example: TaskCategory.FINANCE, required: false })
  category?: TaskCategory

  @ApiProperty({ example: '2026-09-30T23:59:59Z', required: false })
  dueDate?: string

  @ApiProperty({ example: ['1', '2'], required: false })
  assignees?: string[]

  @ApiProperty({ example: '1', required: false })
  groupId?: string
}

export class TaskDto {
  @ApiProperty({ example: '1' })
  id!: string

  @ApiProperty({ example: 'Prepare monthly report' })
  title!: string

  @ApiProperty({ example: 'Generate and send monthly financial report to management' })
  description!: string

  @ApiProperty({ enum: TaskPriority, example: TaskPriority.HIGH })
  priority!: TaskPriority

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.IN_PROGRESS })
  status!: TaskStatus

  @ApiProperty({ enum: TaskCategory, example: TaskCategory.FINANCE })
  category!: TaskCategory

  @ApiProperty({ example: '2026-09-30T23:59:59Z' })
  dueDate!: string

  @ApiProperty({ example: ['1', '2'] })
  assignees!: string[]

  @ApiProperty({ example: '1', required: false })
  groupId?: string

  @ApiProperty({ example: '2026-09-25T10:00:00Z' })
  createdAt!: string

  @ApiProperty({ example: '2026-09-25T12:00:00Z' })
  updatedAt!: string

  @ApiProperty({ example: 'Manager' })
  createdBy!: string
}