import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { ReportsService } from './reports.service'
import {
  ReportFilterDto,
  AttendanceReportDto,
  FinancialReportDto,
  AcademicReportDto,
  GroupPerformanceDto,
  StudentPerformanceDto,
} from './dto/reports.dto'
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { RolesAllowed } from '../../common/decorators/roles.decorator'

@ApiTags('Reports')
@Controller('reports')
@UseGuards(ClerkAuthGuard, RolesGuard)
@RolesAllowed('Admin', 'Super Admin', 'Manager', 'Finance')
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('attendance')
  @ApiOperation({ summary: 'Generate attendance report' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'groupId', required: false })
  @ApiResponse({ 
    status: 200, 
    description: 'Attendance report generated successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          groupId: { type: 'string', example: '1' },
          groupName: { type: 'string', example: 'React Development' },
          totalStudents: { type: 'number', example: 15 },
          presentCount: { type: 'number', example: 13 },
          absentCount: { type: 'number', example: 2 },
          attendanceRate: { type: 'number', example: 86.7 },
          reportDate: { type: 'string', example: '2026-09-25' }
        }
      }
    }
  })
  async getAttendanceReport(@Query() filters?: ReportFilterDto) {
    return this.reportsService.generateAttendanceReport(filters)
  }

  @Get('financial')
  @ApiOperation({ summary: 'Generate financial report' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiResponse({ 
    status: 200, 
    description: 'Financial report generated successfully',
    schema: {
      type: 'object',
      properties: {
        totalRevenue: { type: 'number', example: 8500000 },
        totalExpenses: { type: 'number', example: 2000000 },
        netProfit: { type: 'number', example: 6500000 },
        pendingPayments: { type: 'number', example: 1500000 },
        overdueDebts: { type: 'number', example: 500000 },
        payingStudents: { type: 'number', example: 45 },
        studentsWithDebt: { type: 'number', example: 23 },
        reportDate: { type: 'string', example: '2026-09-25' }
      }
    }
  })
  async getFinancialReport(@Query() filters?: ReportFilterDto) {
    return this.reportsService.generateFinancialReport(filters)
  }

  @Get('academic')
  @ApiOperation({ summary: 'Generate academic report' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiResponse({ 
    status: 200, 
    description: 'Academic report generated successfully',
    schema: {
      type: 'object',
      properties: {
        totalStudents: { type: 'number', example: 45 },
        totalGroups: { type: 'number', example: 12 },
        totalTeachers: { type: 'number', example: 8 },
        averageGrade: { type: 'number', example: 4.2 },
        averageAttendance: { type: 'number', example: 85 },
        assignmentCompletionRate: { type: 'number', example: 78 },
        graduatedStudents: { type: 'number', example: 23 },
        droppedStudents: { type: 'number', example: 5 },
        reportDate: { type: 'string', example: '2026-09-25' }
      }
    }
  })
  async getAcademicReport(@Query() filters?: ReportFilterDto) {
    return this.reportsService.generateAcademicReport(filters)
  }

  @Get('group-performance')
  @ApiOperation({ summary: 'Generate group performance report' })
  @ApiQuery({ name: 'groupId', required: false })
  @ApiQuery({ name: 'teacherId', required: false })
  @ApiResponse({ 
    status: 200, 
    description: 'Group performance report generated successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          groupId: { type: 'string', example: '1' },
          groupName: { type: 'string', example: 'React Development' },
          teacherName: { type: 'string', example: 'Teacher 1' },
          studentCount: { type: 'number', example: 15 },
          averageGrade: { type: 'number', example: 4.3 },
          attendanceRate: { type: 'number', example: 88 },
          assignmentCompletion: { type: 'number', example: 82 },
          reportDate: { type: 'string', example: '2026-09-25' }
        }
      }
    }
  })
  async getGroupPerformanceReport(@Query() filters?: ReportFilterDto) {
    return this.reportsService.generateGroupPerformanceReport(filters)
  }

  @Get('student-performance')
  @ApiOperation({ summary: 'Generate student performance report' })
  @ApiQuery({ name: 'groupId', required: false })
  @ApiQuery({ name: 'studentId', required: false })
  @ApiResponse({ 
    status: 200, 
    description: 'Student performance report generated successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          studentId: { type: 'string', example: '1' },
          studentName: { type: 'string', example: 'John Doe' },
          groupName: { type: 'string', example: 'React Development' },
          averageGrade: { type: 'number', example: 4.5 },
          attendanceRate: { type: 'number', example: 92 },
          assignmentCompletion: { type: 'number', example: 85 },
          totalPaid: { type: 'number', example: 500000 },
          remainingDebt: { type: 'number', example: 200000 },
          reportDate: { type: 'string', example: '2026-09-25' }
        }
      }
    }
  })
  async getStudentPerformanceReport(@Query() filters?: ReportFilterDto) {
    return this.reportsService.generateStudentPerformanceReport(filters)
  }

  @Get('teacher-performance')
  @ApiOperation({ summary: 'Generate teacher performance report' })
  @ApiQuery({ name: 'teacherId', required: false })
  @ApiResponse({ 
    status: 200, 
    description: 'Teacher performance report generated successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          teacherId: { type: 'string', example: '1' },
          teacherName: { type: 'string', example: 'Teacher 1' },
          totalGroups: { type: 'number', example: 3 },
          totalStudents: { type: 'number', example: 45 },
          averageStudentRating: { type: 'number', example: 4.5 },
          averageAttendance: { type: 'number', example: 88 },
          assignmentCompletionRate: { type: 'number', example: 82 }
        }
      }
    }
  })
  async getTeacherPerformanceReport(@Query('teacherId') teacherId?: string) {
    return this.reportsService.generateTeacherPerformanceReport(teacherId)
  }

  @Get('export')
  @ApiOperation({ summary: 'Export report' })
  @ApiQuery({ name: 'type', required: true, enum: ['attendance', 'financial', 'academic', 'group-performance', 'student-performance'] })
  @ApiResponse({ status: 200, description: 'Report exported successfully' })
  async exportReport(@Query('type') type: string, @Query() filters?: ReportFilterDto) {
    return this.reportsService.exportReport(type, filters)
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get reports summary' })
  @ApiResponse({ 
    status: 200, 
    description: 'Reports summary retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalReports: { type: 'number', example: 5 },
        lastGenerated: { type: 'string', example: '2026-09-25T10:00:00Z' },
        availableReports: {
          type: 'array',
          items: { type: 'string' },
          example: ['attendance', 'financial', 'academic', 'group-performance', 'student-performance']
        }
      }
    }
  })
  async getReportSummary() {
    return this.reportsService.getReportSummary()
  }
}