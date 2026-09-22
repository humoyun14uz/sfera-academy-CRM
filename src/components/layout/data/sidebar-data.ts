import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  ListTodo,
  Monitor,
  Palette,
  Settings,
  ShieldCheck,
  Star,
  User,
  UserCog,
  UsersRound,
  WalletCards,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Super Admin',
    email: 'name@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    { name: 'Sfera IT Academy', logo: LayoutDashboard, plan: 'CRM' },
  ],
  navGroups: [
    {
      title: 'Academy',
      items: [
        { title: 'Dashboard', url: '/', icon: LayoutDashboard, permission: 'dashboard.read' },
        { title: 'Arizalar', url: '/academy/leads', icon: ClipboardList, permission: 'leads.read' },
        { title: 'O‘quvchilar', url: '/users', icon: GraduationCap, permission: 'students.read' },
        { title: 'Kurslar', url: '/apps', icon: BookOpen, permission: 'courses.read' },
        { title: 'Guruhlar', url: '/academy/groups', icon: UsersRound, permission: 'groups.read' },
        { title: 'O‘qituvchilar', url: '/academy/teachers', icon: GraduationCap, permission: 'teachers.read' },
        { title: 'Jadval', url: '/academy/schedule', icon: CalendarDays, permission: 'groups.manage_schedule' },
        { title: 'Davomat', url: '/academy/attendance', icon: CheckCircle2, permission: 'students.read' },
        { title: 'Moliya', url: '/academy/finance', icon: Star, permission: 'finance.payments.read' },
        { title: 'Hisobotlar', url: '/academy/reports', icon: BarChart3, permission: 'reports.read' },
      ],
    },
    {
      title: 'Management',
      items: [
        { title: 'Vazifalar', url: '/tasks', icon: ListTodo, permission: 'tasks.read' },
        { title: 'Rollar va huquqlar', url: '/users/manage', icon: ShieldCheck, permission: 'users.assign_role' },
      ],
    },
    {
      title: 'Teacher',
      items: [
        { title: 'Boshqaruv paneli', url: '/teacher', icon: LayoutDashboard, permission: 'dashboard.read' },
        { title: 'Mening guruhlarim', url: '/teacher/groups', icon: UsersRound, permission: 'teacher.workspace' },
        { title: 'Jadvalim', url: '/teacher/schedule', icon: CalendarDays, permission: 'teacher.workspace' },
        { title: 'Bugungi darslar', url: '/teacher/today', icon: BookOpen, permission: 'teacher.workspace' },
        { title: 'Davomat', url: '/teacher/attendance', icon: CheckCircle2, permission: 'teacher.workspace' },
        { title: 'O‘quvchilar', url: '/teacher/students', icon: GraduationCap, permission: 'teacher.workspace' },
        { title: 'Vazifalar', url: '/teacher/assignments', icon: ListTodo, permission: 'teacher.workspace' },
        { title: 'Baholar', url: '/teacher/grades', icon: Star, permission: 'teacher.workspace' },
      ],
    },
    {
      title: 'TeacherSystem',
      items: [
        { title: 'Profilim', url: '/teacher/profile', icon: UserCog, permission: 'teacher.workspace' },
        { title: 'Sozlamalar', url: '/teacher/settings', icon: Settings, permission: 'teacher.workspace' },
      ],
    },
    {
      title: 'Finance',
      items: [
        { title: 'Moliya paneli', url: '/finance', icon: LayoutDashboard, permission: 'finance.workspace' },
        { title: 'To‘lovlar', url: '/finance/payments', icon: CreditCard, permission: 'finance.workspace' },
        { title: 'Qarzdorlik', url: '/finance/debt', icon: WalletCards, permission: 'finance.workspace' },
        { title: 'O‘quvchilar', url: '/finance/students', icon: GraduationCap, permission: 'finance.workspace' },
        { title: 'Hisobotlar', url: '/finance/reports', icon: BarChart3, permission: 'finance.workspace' },
      ],
    },
    {
      title: 'FinanceSystem',
      items: [
        { title: 'Vazifalar', url: '/tasks', icon: ListTodo, permission: 'tasks.read' },
        { title: 'Sozlamalar', url: '/finance/settings', icon: Settings, permission: 'finance.workspace' },
      ],
    },
    {
      title: 'Student',
      items: [
        { title: 'Boshqaruv paneli', url: '/', icon: LayoutDashboard, permission: 'dashboard.read' },
        { title: 'Mening kursim', url: '/student/my-course', icon: BookOpen, permission: 'courses.read' },
        { title: 'Mening guruhim', url: '/student/my-group', icon: UsersRound, permission: 'students.read' },
        { title: 'Jadvalim', url: '/student/my-schedule', icon: CalendarDays, permission: 'students.read' },
        { title: 'Davomatim', url: '/student/my-attendance', icon: CheckCircle2, permission: 'students.read' },
        { title: 'Vazifalarim', url: '/student/my-tasks', icon: ListTodo, permission: 'tasks.read' },
        { title: 'Baholarim', url: '/student/my-grades', icon: Star, permission: 'students.read' },
      ],
    },
    {
      title: 'StudentFinance',
      items: [{ title: 'To‘lovlarim', url: '/student/my-payments', icon: CreditCard, permission: 'students.read' }],
    },
    {
      title: 'System',
      items: [
        {
          title: 'Sozlamalar',
          icon: Settings,
          permission: 'settings.read',
          items: [
            { title: 'Profil', url: '/settings', icon: UserCog, permission: 'settings.read' },
            { title: 'Hisob', url: '/settings/account', icon: User, permission: 'settings.read' },
            { title: 'Ko‘rinish', url: '/settings/appearance', icon: Palette, permission: 'settings.read' },
            { title: 'Bildirishnomalar', url: '/settings/notifications', icon: Bell, permission: 'settings.manage_notifications' },
            { title: 'Ekran', url: '/settings/display', icon: Monitor, permission: 'settings.read' },
          ],
        },
      ],
    },
  ],
}
