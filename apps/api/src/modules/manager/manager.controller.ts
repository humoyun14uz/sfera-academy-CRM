import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { ManagerService } from './manager.service'
import { ManagerDashboardStatsDto, ManagerRecentActivityDto } from './dto/dashboard.dto'
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { RolesAllowed } from '../../common/decorators/roles.decorator'

@ApiTags('Manager')
@Controller('manager')
@UseGuards(ClerkAuthGuard, RolesGuard)
@RolesAllowed('Manager', 'Admin', 'Super Admin')
@ApiBearerAuth()
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get manager dashboard statistics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Dashboard statistics retrieved successfully', 
    schema: {
      type: 'object',
      properties: {
        totalStudents: { type: 'number', example: 45 },
        totalGroups: { type: 'number', example: 12 },
        totalTeachers: { type: 'number', example: 8 },
        pendingApplications: { type: 'number', example: 23 },
        monthlyRevenue: { type: 'number', example: 8500000 },
        pendingDebts: { type: 'number', example: 1500000 },
        averageAttendance: { type: 'number', example: 87 }
      }
    }
  })
  async getDashboard() {
    return this.managerService.getDashboardStats()
  }

  @Get('activities')
  @ApiOperation({ summary: 'Get recent activities' })
  @ApiResponse({ 
    status: 200, 
    description: 'Recent activities retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '1' },
          description: { type: 'string', example: 'New student registered' },
          timestamp: { type: 'string', example: '2026-09-25T10:30:00Z' },
          type: { type: 'string', example: 'student' }
        }
      }
    }
  })
  async getActivities() {
    return this.managerService.getRecentActivities()
  }

  @Get('groups/statistics')
  @ApiOperation({ summary: 'Get groups statistics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Groups statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalGroups: { type: 'number', example: 12 },
        activeGroups: { type: 'number', example: 10 },
        completedGroups: { type: 'number', example: 2 },
        averageStudentsPerGroup: { type: 'number', example: 15 }
      }
    }
  })
  async getGroupsStatistics() {
    return this.managerService.getGroupsStatistics()
  }

  @Get('teachers/performance')
  @ApiOperation({ summary: 'Get teachers performance metrics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Teachers performance retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '1' },
          name: { type: 'string', example: 'Teacher 1' },
          groups: { type: 'number', example: 3 },
          students: { type: 'number', example: 45 },
          averageRating: { type: 'number', example: 4.5 }
        }
      }
    }
  })
  async getTeachersPerformance() {
    return this.managerService.getTeachersPerformance()
  }

  @Get('financial/overview')
  @ApiOperation({ summary: 'Get financial overview' })
  @ApiResponse({ 
    status: 200, 
    description: 'Financial overview retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalRevenue: { type: 'number', example: 8500000 },
        totalExpenses: { type: 'number', example: 2000000 },
        netProfit: { type: 'number', example: 6500000 },
        pendingPayments: { type: 'number', example: 1500000 }
      }
    }
  })
  async getFinancialOverview() {
    return this.managerService.getFinancialOverview()
  }
}