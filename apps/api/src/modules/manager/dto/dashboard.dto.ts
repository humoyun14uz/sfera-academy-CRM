import { ApiProperty } from '@nestjs/swagger'

export class ManagerDashboardStatsDto {
  @ApiProperty({ example: 45 })
  totalStudents!: number

  @ApiProperty({ example: 12 })
  totalGroups!: number

  @ApiProperty({ example: 8 })
  totalTeachers!: number

  @ApiProperty({ example: 23 })
  pendingApplications!: number

  @ApiProperty({ example: 8500000 })
  monthlyRevenue!: number

  @ApiProperty({ example: 1500000 })
  pendingDebts!: number

  @ApiProperty({ example: 87 })
  averageAttendance!: number
}

export class ManagerRecentActivityDto {
  @ApiProperty({ example: '1' })
  id!: string

  @ApiProperty({ example: 'New student registered' })
  description!: string

  @ApiProperty({ example: '2026-09-25T10:30:00Z' })
  timestamp!: string

  @ApiProperty({ example: 'student' })
  type!: string
}