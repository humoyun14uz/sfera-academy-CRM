import { Module } from '@nestjs/common'
import { DatabaseModule } from './modules/database/database.module'
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module'
import { AuthModule } from './modules/auth/auth.module'
import { AcademiesModule } from './modules/academies/academies.module'
import { CoursesModule } from './modules/courses/courses.module'
import { GroupsModule } from './modules/groups/groups.module'
import { StudentsModule } from './modules/students/students.module'
import { EnrollmentsModule } from './modules/enrollments/enrollments.module'
import { AttendanceModule } from './modules/attendance/attendance.module'
import { GradesModule } from './modules/grades/grades.module'
import { LeadsModule } from './modules/leads/leads.module'
import { FinanceModule } from './modules/finance/finance.module'
import { NotificationsModule } from './modules/notifications/notifications.module'
import { ManagerModule } from './modules/manager/manager.module'
import { TeacherModule } from './modules/teacher/teacher.module'
import { TasksModule } from './modules/tasks/tasks.module'
import { ReportsModule } from './modules/reports/reports.module'

@Module({
  imports: [
    DatabaseModule,
    AuditLogsModule,
    AuthModule,
    AcademiesModule,
    CoursesModule,
    GroupsModule,
    StudentsModule,
    EnrollmentsModule,
    AttendanceModule,
    GradesModule,
    LeadsModule,
    FinanceModule,
    NotificationsModule,
    ManagerModule,
    TeacherModule,
    TasksModule,
    ReportsModule,
  ],
})
export class AppModule {}
