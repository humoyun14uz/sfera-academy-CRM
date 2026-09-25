import { Injectable } from '@nestjs/common'
import { CreateTaskDto, UpdateTaskDto, TaskDto, TaskStatus, TaskPriority, TaskCategory } from './dto/tasks.dto'

@Injectable()
export class TasksService {
  // Mock data storage - replace with actual database
  private tasks: TaskDto[] = [
    {
      id: '1',
      title: 'Prepare monthly report',
      description: 'Generate and send monthly financial report to management',
      priority: TaskPriority.HIGH,
      status: TaskStatus.IN_PROGRESS,
      category: TaskCategory.FINANCE,
      dueDate: '2026-09-30T23:59:59Z',
      assignees: ['1', '2'],
      groupId: '1',
      createdAt: '2026-09-25T10:00:00Z',
      updatedAt: '2026-09-25T12:00:00Z',
      createdBy: 'Manager',
    },
    {
      id: '2',
      title: 'Update course materials',
      description: 'Update React course materials for new cohort',
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      category: TaskCategory.ACADEMIC,
      dueDate: '2026-10-05T23:59:59Z',
      assignees: ['3'],
      groupId: '2',
      createdAt: '2026-09-25T11:00:00Z',
      updatedAt: '2026-09-25T11:00:00Z',
      createdBy: 'Admin',
    },
  ]

  async findAll(filters?: {
    status?: TaskStatus
    priority?: TaskPriority
    category?: TaskCategory
    assigneeId?: string
    groupId?: string
  }): Promise<TaskDto[]> {
    let filteredTasks = [...this.tasks]

    if (filters?.status) {
      filteredTasks = filteredTasks.filter(task => task.status === filters.status)
    }
    if (filters?.priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === filters.priority)
    }
    if (filters?.category) {
      filteredTasks = filteredTasks.filter(task => task.category === filters.category)
    }
    if (filters?.assigneeId) {
      filteredTasks = filteredTasks.filter(task => task.assignees.includes(filters.assigneeId!))
    }
    if (filters?.groupId) {
      filteredTasks = filteredTasks.filter(task => task.groupId === filters.groupId)
    }

    return filteredTasks
  }

  async findOne(id: string): Promise<TaskDto> {
    const task = this.tasks.find(t => t.id === id)
    if (!task) {
      throw new Error('Task not found')
    }
    return task
  }

  async create(createTaskDto: CreateTaskDto, createdBy: string): Promise<TaskDto> {
    const newTask: TaskDto = {
      id: (this.tasks.length + 1).toString(),
      ...createTaskDto,
      assignees: createTaskDto.assignees || [],
      status: TaskStatus.TODO,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy,
    }
    this.tasks.push(newTask)
    return newTask
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<TaskDto> {
    const taskIndex = this.tasks.findIndex(t => t.id === id)
    if (taskIndex === -1) {
      throw new Error('Task not found')
    }

    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updateTaskDto,
      updatedAt: new Date().toISOString(),
    }

    return this.tasks[taskIndex]
  }

  async remove(id: string): Promise<void> {
    const taskIndex = this.tasks.findIndex(t => t.id === id)
    if (taskIndex === -1) {
      throw new Error('Task not found')
    }
    this.tasks.splice(taskIndex, 1)
  }

  async getTaskStatistics(): Promise<any> {
    const total = this.tasks.length
    const byStatus = {
      todo: this.tasks.filter(t => t.status === TaskStatus.TODO).length,
      inProgress: this.tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
      review: this.tasks.filter(t => t.status === TaskStatus.REVIEW).length,
      completed: this.tasks.filter(t => t.status === TaskStatus.COMPLETED).length,
    }
    const byPriority = {
      low: this.tasks.filter(t => t.priority === TaskPriority.LOW).length,
      medium: this.tasks.filter(t => t.priority === TaskPriority.MEDIUM).length,
      high: this.tasks.filter(t => t.priority === TaskPriority.HIGH).length,
      urgent: this.tasks.filter(t => t.priority === TaskPriority.URGENT).length,
    }
    const overdue = this.tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== TaskStatus.COMPLETED).length

    return {
      total,
      byStatus,
      byPriority,
      overdue,
    }
  }

  async getMyTasks(userId: string): Promise<TaskDto[]> {
    return this.tasks.filter(task => task.assignees.includes(userId))
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<TaskDto> {
    return this.update(id, { status })
  }

  async assignTask(id: string, assigneeIds: string[]): Promise<TaskDto> {
    return this.update(id, { assignees: assigneeIds })
  }
}