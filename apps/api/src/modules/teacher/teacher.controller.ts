import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger'
import { TeacherService } from './teacher.service'
import {
  TeacherDashboardDto,
  TeacherGroupDto,
  TeacherScheduleDto,
  AttendanceRecordDto,
  TeacherAssignmentDto,
  TeacherGradeDto,
} from './dto/teacher.dto'
import { ClerkAuthGuard } from '../../common/guards/clerk-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { RolesAllowed } from '../../common/decorators/roles.decorator'

@ApiTags('Teacher')
@Controller('teacher')
@UseGuards(ClerkAuthGuard, RolesGuard)
@RolesAllowed('Teacher', 'Admin', 'Super Admin')
@ApiBearerAuth()
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get teacher dashboard statistics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Dashboard statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalGroups: { type: 'number', example: 3 },
        totalStudents: { type: 'number', example: 45 },
        averageGrade: { type: 'number', example: 4.2 },
        assignmentCompletionRate: { type: 'number', example: 78 },
        attendanceRate: { type: 'number', example: 85 }
      }
    }
  })
  async getDashboard(@Query('teacherId') teacherId: string) {
    return this.teacherService.getDashboard(teacherId)
  }

  @Get('groups')
  @ApiOperation({ summary: 'Get teacher groups' })
  @ApiResponse({ 
    status: 200, 
    description: 'Groups retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '1' },
          name: { type: 'string', example: 'React Development' },
          schedule: { type: 'string', example: 'Monday-Wednesday' },
          studentCount: { type: 'number', example: 15 },
          status: { type: 'string', example: 'active' }
        }
      }
    }
  })
  async getGroups(@Query('teacherId') teacherId: string) {
    return this.teacherService.getGroups(teacherId)
  }

  @Get('schedule')
  @ApiOperation({ summary: 'Get teacher schedule' })
  @ApiQuery({ name: 'from', required: false, description: 'Start date' })
  @ApiQuery({ name: 'to', required: false, description: 'End date' })
  @ApiResponse({ 
    status: 200, 
    description: 'Schedule retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '1' },
          groupName: { type: 'string', example: 'React Development' },
          startTime: { type: 'string', example: '2026-09-25T10:00:00Z' },
          endTime: { type: 'string', example: '2026-09-25T12:00:00Z' },
          room: { type: 'string', example: 'Room 101' },
          topic: { type: 'string', example: 'React Hooks' }
        }
      }
    }
  })
  async getSchedule(
    @Query('teacherId') teacherId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.teacherService.getSchedule(teacherId, from, to)
  }

  @Get('lessons/today')
  @ApiOperation({ summary: 'Get today lessons' })
  @ApiResponse({ 
    status: 200, 
    description: 'Today lessons retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '1' },
          groupName: { type: 'string', example: 'React Development' },
          startTime: { type: 'string', example: '2026-09-25T10:00:00Z' },
          endTime: { type: 'string', example: '2026-09-25T12:00:00Z' },
          room: { type: 'string', example: 'Room 101' },
          topic: { type: 'string', example: 'React Hooks' }
        }
      }
    }
  })
  async getTodayLessons(@Query('teacherId') teacherId: string) {
    return this.teacherService.getTodayLessons(teacherId)
  }

  @Get('lessons/:lessonId/attendance')
  @ApiOperation({ summary: 'Get lesson attendance' })
  @ApiParam({ name: 'lessonId', description: 'Lesson ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Attendance retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          studentId: { type: 'string', example: '1' },
          studentName: { type: 'string', example: 'John Doe' },
          status: { type: 'string', example: 'present' },
          timestamp: { type: 'string', example: '2026-09-25T10:00:00Z' }
        }
      }
    }
  })
  async getAttendance(@Param('lessonId') lessonId: string) {
    return this.teacherService.getAttendance(lessonId)
  }

  @Put('lessons/:lessonId/attendance')
  @ApiOperation({ summary: 'Update lesson attendance' })
  @ApiParam({ name: 'lessonId', description: 'Lesson ID' })
  @ApiResponse({ status: 200, description: 'Attendance updated successfully' })
  async updateAttendance(
    @Param('lessonId') lessonId: string,
    @Body() attendanceData: any,
  ) {
    return this.teacherService.updateAttendance(lessonId, attendanceData)
  }

  @Get('students')
  @ApiOperation({ summary: 'Get teacher students' })
  @ApiResponse({ 
    status: 200, 
    description: 'Students retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '1' },
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', example: 'john@example.com' },
          phone: { type: 'string', example: '+998901234567' },
          group: { type: 'string', example: 'React Development' },
          attendanceRate: { type: 'number', example: 92 },
          averageGrade: { type: 'number', example: 4.5 }
        }
      }
    }
  })
  async getStudents(@Query('teacherId') teacherId: string) {
    return this.teacherService.getStudents(teacherId)
  }

  @Get('assignments')
  @ApiOperation({ summary: 'Get teacher assignments' })
  @ApiResponse({ 
    status: 200, 
    description: 'Assignments retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '1' },
          title: { type: 'string', example: 'Build a React App' },
          description: { type: 'string', example: 'Create a full React application' },
          dueDate: { type: 'string', example: '2026-10-01T23:59:59Z' },
          maxPoints: { type: 'number', example: 100 },
          status: { type: 'string', example: 'active' }
        }
      }
    }
  })
  async getAssignments(@Query('teacherId') teacherId: string) {
    return this.teacherService.getAssignments(teacherId)
  }

  @Post('assignments')
  @ApiOperation({ summary: 'Create new assignment' })
  @ApiResponse({ 
    status: 201, 
    description: 'Assignment created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '3' },
        title: { type: 'string', example: 'Build a React App' },
        description: { type: 'string', example: 'Create a full React application' },
        dueDate: { type: 'string', example: '2026-10-01T23:59:59Z' },
        maxPoints: { type: 'number', example: 100 },
        status: { type: 'string', example: 'active' }
      }
    }
  })
  async createAssignment(
    @Query('teacherId') teacherId: string,
    @Body() assignmentData: any,
  ) {
    return this.teacherService.createAssignment(teacherId, assignmentData)
  }

  @Put('assignments/:assignmentId')
  @ApiOperation({ summary: 'Update assignment' })
  @ApiParam({ name: 'assignmentId', description: 'Assignment ID' })
  @ApiResponse({ status: 200, description: 'Assignment updated successfully' })
  async updateAssignment(
    @Param('assignmentId') assignmentId: string,
    @Body() assignmentData: any,
  ) {
    return this.teacherService.updateAssignment(assignmentId, assignmentData)
  }

  @Delete('assignments/:assignmentId')
  @ApiOperation({ summary: 'Delete assignment' })
  @ApiParam({ name: 'assignmentId', description: 'Assignment ID' })
  @ApiResponse({ status: 200, description: 'Assignment deleted successfully' })
  async deleteAssignment(@Param('assignmentId') assignmentId: string) {
    return this.teacherService.deleteAssignment(assignmentId)
  }

  @Get('grades')
  @ApiOperation({ summary: 'Get teacher grades' })
  @ApiQuery({ name: 'groupId', required: false, description: 'Filter by group ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Grades retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          studentId: { type: 'string', example: '1' },
          studentName: { type: 'string', example: 'John Doe' },
          grade: { type: 'number', example: 4.5 },
          feedback: { type: 'string', example: 'Excellent work' }
        }
      }
    }
  })
  async getGrades(
    @Query('teacherId') teacherId: string,
    @Query('groupId') groupId?: string,
  ) {
    return this.teacherService.getGrades(teacherId, groupId)
  }

  @Put('grades')
  @ApiOperation({ summary: 'Update student grade' })
  @ApiResponse({ 
    status: 200, 
    description: 'Grade updated successfully',
    schema: {
      type: 'object',
      properties: {
        studentId: { type: 'string', example: '1' },
        studentName: { type: 'string', example: 'John Doe' },
        grade: { type: 'number', example: 4.5 },
        feedback: { type: 'string', example: 'Excellent work' }
      }
    }
  })
  async updateGrade(
    @Query('teacherId') teacherId: string,
    @Body() gradeData: any,
  ) {
    return this.teacherService.updateGrade(teacherId, gradeData)
  }

  @Get('me')
  @ApiOperation({ summary: 'Get teacher profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'Profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '1' },
        name: { type: 'string', example: 'Teacher Name' },
        email: { type: 'string', example: 'teacher@example.com' },
        phone: { type: 'string', example: '+998901234567' },
        specialization: { type: 'string', example: 'Web Development' },
        experience: { type: 'number', example: 5 },
        groups: { type: 'number', example: 3 },
        students: { type: 'number', example: 45 }
      }
    }
  })
  async getProfile(@Query('teacherId') teacherId: string) {
    return this.teacherService.getProfile(teacherId)
  }

  @Put('me')
  @ApiOperation({ summary: 'Update teacher profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(
    @Query('teacherId') teacherId: string,
    @Body() profileData: any,
  ) {
    return this.teacherService.updateProfile(teacherId, profileData)
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Get teacher preferences' })
  @ApiResponse({ 
    status: 200, 
    description: 'Preferences retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        language: { type: 'string', example: 'uz' },
        timezone: { type: 'string', example: 'Asia/Tashkent' },
        notifications: { type: 'boolean', example: true },
        emailAlerts: { type: 'boolean', example: true }
      }
    }
  })
  async getPreferences(@Query('teacherId') teacherId: string) {
    return this.teacherService.getPreferences(teacherId)
  }

  @Put('preferences')
  @ApiOperation({ summary: 'Update teacher preferences' })
  @ApiResponse({ status: 200, description: 'Preferences updated successfully' })
  async updatePreferences(
    @Query('teacherId') teacherId: string,
    @Body() preferences: any,
  ) {
    return this.teacherService.updatePreferences(teacherId, preferences)
  }
}