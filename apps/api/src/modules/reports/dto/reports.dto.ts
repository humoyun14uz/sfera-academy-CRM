import { ApiProperty } from '@nestjs/swagger'

export class ReportFilterDto {
  @ApiProperty({ example: '2026-09-01', required: false })
  startDate?: string

  @ApiProperty({ example: '2026-09-30', required: false })
  endDate?: string

  @ApiProperty({ example: '1', required: false })
  groupId?: string

  @ApiProperty({ example: '1', required: false })
  teacherId?: string

  @ApiProperty({ example: 'active', required: false })
  status?: string
}

export class AttendanceReportDto {
  @ApiProperty({ example: '1' })
  groupId!: string

  @ApiProperty({ example: 'React Development' })
  groupName!: string

  @ApiProperty({ example: 15 })
  totalStudents!: number

  @ApiProperty({ example: 13 })
  presentCount!: number

  @ApiProperty({ example: 2 })
  absentCount!: number

  @ApiProperty({ example: 86.7 })
  attendanceRate!: number

  @ApiProperty({ example: '2026-09-25' })
  reportDate!: string
}

export class FinancialReportDto {
  @ApiProperty({ example: 8500000 })
  totalRevenue!: number

  @ApiProperty({ example: 2000000 })
  totalExpenses!: number

  @ApiProperty({ example: 6500000 })
  netProfit!: number

  @ApiProperty({ example: 1500000 })
  pendingPayments!: number

  @ApiProperty({ example: 500000 })
  overdueDebts!: number

  @ApiProperty({ example: 45 })
  payingStudents!: number

  @ApiProperty({ example: 23 })
  studentsWithDebt!: number

  @ApiProperty({ example: '2026-09-25' })
  reportDate!: string
}

export class AcademicReportDto {
  @ApiProperty({ example: 45 })
  totalStudents!: number

  @ApiProperty({ example: 12 })
  totalGroups!: number

  @ApiProperty({ example: 8 })
  totalTeachers!: number

  @ApiProperty({ example: 4.2 })
  averageGrade!: number

  @ApiProperty({ example: 85 })
  averageAttendance!: number

  @ApiProperty({ example: 78 })
  assignmentCompletionRate!: number

  @ApiProperty({ example: 23 })
  graduatedStudents!: number

  @ApiProperty({ example: 5 })
  droppedStudents!: number

  @ApiProperty({ example: '2026-09-25' })
  reportDate!: string
}

export class GroupPerformanceDto {
  @ApiProperty({ example: '1' })
  groupId!: string

  @ApiProperty({ example: 'React Development' })
  groupName!: string

  @ApiProperty({ example: 'Teacher Name' })
  teacherName!: string

  @ApiProperty({ example: 15 })
  studentCount!: number

  @ApiProperty({ example: 4.3 })
  averageGrade!: number

  @ApiProperty({ example: 88 })
  attendanceRate!: number

  @ApiProperty({ example: 82 })
  assignmentCompletion!: number

  @ApiProperty({ example: '2026-09-25' })
  reportDate!: string
}

export class StudentPerformanceDto {
  @ApiProperty({ example: '1' })
  studentId!: string

  @ApiProperty({ example: 'John Doe' })
  studentName!: string

  @ApiProperty({ example: 'React Development' })
  groupName!: string

  @ApiProperty({ example: 4.5 })
  averageGrade!: number

  @ApiProperty({ example: 92 })
  attendanceRate!: number

  @ApiProperty({ example: 85 })
  assignmentCompletion!: number

  @ApiProperty({ example: 500000 })
  totalPaid!: number

  @ApiProperty({ example: 200000 })
  remainingDebt!: number

  @ApiProperty({ example: '2026-09-25' })
  reportDate!: string
}