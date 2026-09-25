import { ApiProperty } from '@nestjs/swagger'

export class TeacherDashboardDto {
  @ApiProperty({ example: 3 })
  totalGroups!: number

  @ApiProperty({ example: 45 })
  totalStudents!: number

  @ApiProperty({ example: 4.2 })
  averageGrade!: number

  @ApiProperty({ example: 78 })
  assignmentCompletionRate!: number

  @ApiProperty({ example: 85 })
  attendanceRate!: number
}

export class TeacherGroupDto {
  @ApiProperty({ example: '1' })
  id!: string

  @ApiProperty({ example: 'React Development' })
  name!: string

  @ApiProperty({ example: 'Monday-Wednesday' })
  schedule!: string

  @ApiProperty({ example: 15 })
  studentCount!: number

  @ApiProperty({ example: 'active' })
  status!: string
}

export class TeacherScheduleDto {
  @ApiProperty({ example: '1' })
  id!: string

  @ApiProperty({ example: 'React Development' })
  groupName!: string

  @ApiProperty({ example: '2026-09-25T10:00:00Z' })
  startTime!: string

  @ApiProperty({ example: '2026-09-25T12:00:00Z' })
  endTime!: string

  @ApiProperty({ example: 'Room 101' })
  room!: string

  @ApiProperty({ example: 'Lesson 1' })
  topic!: string
}

export class AttendanceRecordDto {
  @ApiProperty({ example: '1' })
  studentId!: string

  @ApiProperty({ example: 'John Doe' })
  studentName!: string

  @ApiProperty({ example: 'present' })
  status!: string

  @ApiProperty({ example: '2026-09-25T10:00:00Z' })
  timestamp!: string
}

export class TeacherAssignmentDto {
  @ApiProperty({ example: '1' })
  id!: string

  @ApiProperty({ example: 'Build a React App' })
  title!: string

  @ApiProperty({ example: 'Create a full React application' })
  description!: string

  @ApiProperty({ example: '2026-10-01T23:59:59Z' })
  dueDate!: string

  @ApiProperty({ example: 15 })
  maxPoints!: number

  @ApiProperty({ example: 'pending' })
  status!: string
}

export class TeacherGradeDto {
  @ApiProperty({ example: '1' })
  studentId!: string

  @ApiProperty({ example: 'John Doe' })
  studentName!: string

  @ApiProperty({ example: 4.5 })
  grade!: number

  @ApiProperty({ example: 'Excellent work' })
  feedback!: string
}