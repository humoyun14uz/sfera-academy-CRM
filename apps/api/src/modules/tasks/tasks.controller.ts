import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger'
import { TasksService } from './tasks.service'
import { CreateTaskDto, UpdateTaskDto, TaskDto, TaskStatus, TaskPriority, TaskCategory } from './dto/tasks.dto'
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { RolesAllowed } from '../../common/decorators/roles.decorator'

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(ClerkAuthGuard, RolesGuard)
@RolesAllowed('Admin', 'Super Admin', 'Manager', 'Teacher')
@ApiBearerAuth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks with optional filters' })
  @ApiQuery({ name: 'status', required: false, enum: TaskStatus })
  @ApiQuery({ name: 'priority', required: false, enum: TaskPriority })
  @ApiQuery({ name: 'category', required: false, enum: TaskCategory })
  @ApiQuery({ name: 'assigneeId', required: false })
  @ApiQuery({ name: 'groupId', required: false })
  @ApiResponse({ 
    status: 200, 
    description: 'Tasks retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '1' },
          title: { type: 'string', example: 'Prepare monthly report' },
          description: { type: 'string', example: 'Generate and send monthly financial report to management' },
          priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'], example: 'high' },
          status: { type: 'string', enum: ['todo', 'in_progress', 'review', 'completed'], example: 'in_progress' },
          category: { type: 'string', enum: ['administration', 'academic', 'finance', 'technical', 'communication'], example: 'finance' },
          dueDate: { type: 'string', example: '2026-09-30T23:59:59Z' },
          assignees: { type: 'array', items: { type: 'string' }, example: ['1', '2'] },
          groupId: { type: 'string', example: '1' },
          createdAt: { type: 'string', example: '2026-09-25T10:00:00Z' },
          updatedAt: { type: 'string', example: '2026-09-25T12:00:00Z' },
          createdBy: { type: 'string', example: 'Manager' }
        }
      }
    }
  })
  async findAll(@Query() filters?: any) {
    return this.tasksService.findAll(filters)
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get task statistics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Task statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 5 },
        byStatus: {
          type: 'object',
          properties: {
            todo: { type: 'number', example: 2 },
            inProgress: { type: 'number', example: 1 },
            review: { type: 'number', example: 1 },
            completed: { type: 'number', example: 1 }
          }
        },
        byPriority: {
          type: 'object',
          properties: {
            low: { type: 'number', example: 1 },
            medium: { type: 'number', example: 2 },
            high: { type: 'number', example: 1 },
            urgent: { type: 'number', example: 1 }
          }
        },
        overdue: { type: 'number', example: 1 }
      }
    }
  })
  async getStatistics() {
    return this.tasksService.getTaskStatistics()
  }

  @Get('my-tasks')
  @ApiOperation({ summary: 'Get tasks assigned to current user' })
  @ApiQuery({ name: 'userId', required: true })
  @ApiResponse({ 
    status: 200, 
    description: 'My tasks retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '1' },
          title: { type: 'string', example: 'Prepare monthly report' },
          description: { type: 'string', example: 'Generate and send monthly financial report to management' },
          priority: { type: 'string', example: 'high' },
          status: { type: 'string', example: 'in_progress' },
          category: { type: 'string', example: 'finance' },
          dueDate: { type: 'string', example: '2026-09-30T23:59:59Z' },
          assignees: { type: 'array', items: { type: 'string' }, example: ['1', '2'] },
          groupId: { type: 'string', example: '1' },
          createdAt: { type: 'string', example: '2026-09-25T10:00:00Z' },
          updatedAt: { type: 'string', example: '2026-09-25T12:00:00Z' },
          createdBy: { type: 'string', example: 'Manager' }
        }
      }
    }
  })
  async getMyTasks(@Query('userId') userId: string) {
    return this.tasksService.getMyTasks(userId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Task retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '1' },
        title: { type: 'string', example: 'Prepare monthly report' },
        description: { type: 'string', example: 'Generate and send monthly financial report to management' },
        priority: { type: 'string', example: 'high' },
        status: { type: 'string', example: 'in_progress' },
        category: { type: 'string', example: 'finance' },
        dueDate: { type: 'string', example: '2026-09-30T23:59:59Z' },
        assignees: { type: 'array', items: { type: 'string' }, example: ['1', '2'] },
        groupId: { type: 'string', example: '1' },
        createdAt: { type: 'string', example: '2026-09-25T10:00:00Z' },
        updatedAt: { type: 'string', example: '2026-09-25T12:00:00Z' },
        createdBy: { type: 'string', example: 'Manager' }
      }
    }
  })
  async findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id)
  }

  @Post()
  @ApiOperation({ summary: 'Create new task' })
  @ApiResponse({ 
    status: 201, 
    description: 'Task created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '3' },
        title: { type: 'string', example: 'Prepare monthly report' },
        description: { type: 'string', example: 'Generate and send monthly financial report to management' },
        priority: { type: 'string', example: 'high' },
        status: { type: 'string', example: 'todo' },
        category: { type: 'string', example: 'finance' },
        dueDate: { type: 'string', example: '2026-09-30T23:59:59Z' },
        assignees: { type: 'array', items: { type: 'string' }, example: ['1', '2'] },
        groupId: { type: 'string', example: '1' },
        createdAt: { type: 'string', example: '2026-09-25T10:00:00Z' },
        updatedAt: { type: 'string', example: '2026-09-25T12:00:00Z' },
        createdBy: { type: 'string', example: 'Manager' }
      }
    }
  })
  async create(@Body() createTaskDto: CreateTaskDto, @Query('createdBy') createdBy: string) {
    return this.tasksService.create(createTaskDto, createdBy)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto)
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update task status' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiQuery({ name: 'status', enum: TaskStatus })
  @ApiResponse({ status: 200, description: 'Task status updated successfully' })
  async updateStatus(@Param('id') id: string, @Query('status') status: TaskStatus) {
    return this.tasksService.updateTaskStatus(id, status)
  }

  @Put(':id/assign')
  @ApiOperation({ summary: 'Assign task to users' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task assigned successfully' })
  async assignTask(@Param('id') id: string, @Body('assigneeIds') assigneeIds: string[]) {
    return this.tasksService.assignTask(id, assigneeIds)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.tasksService.remove(id)
  }
}