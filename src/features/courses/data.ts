export type CourseStatus = 'active' | 'upcoming' | 'completed' | 'archived'
export type EnrollmentStatus = 'active' | 'completed' | 'paused' | 'cancelled'
export type PaymentStatus = 'paid' | 'partial' | 'unpaid'
export type GroupStatus = 'active' | 'upcoming' | 'completed'
export type LessonStatus = 'upcoming' | 'completed' | 'cancelled'
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'

export type CourseStudent = {
  id: string
  name: string
  email: string
  phone?: string
  groupId: string
  groupName: string
  teacher: string
  enrollmentDate: string
  startDate: string
  paymentStatus: PaymentStatus
  progress: number
  status: EnrollmentStatus
  paidAmount: number
  lastPaymentDate: string
  attendance: number
}

export type CourseGroup = {
  id: string
  name: string
  teacher: string
  schedule: string
  room: string
  startDate: string
  endDate: string
  studentsCount: number
  maxStudents: number
  status: GroupStatus
}

export type CourseLesson = {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  teacher: string
  group: string
  status: LessonStatus
}

export type Course = {
  id: string
  name: string
  category: string
  description: string
  teacher: string
  duration: string
  studentsCount: number
  groupsCount: number
  price: number
  startDate: string
  endDate: string
  status: CourseStatus
  students: CourseStudent[]
  groups: CourseGroup[]
  lessons: CourseLesson[]
}

const STORAGE_KEY = 'sfera-academy-courses'

export const categories = ['Dasturlash', 'Til', 'Dizayn', 'Marketing']
export const teachers = [
  'Azizbek Karimov',
  'Muhammad Aliyev',
  'Sardor Islomov',
  'Madina Karimova',
  'Quvonchbek',
  'Temurbek',
  'Otabek Naviyev',
  'Ismat',
  'Golib Abduhalil',
]

const additionalFrontendStudents: CourseStudent[] = [
  ['student-sardor', 'Sardor Islomov', '90 111 22 33'],
  ['student-zarina', 'Zarina Abdullayeva', '91 222 33 44'],
  ['student-javohir', 'Javohir Rasulov', '93 333 44 55'],
  ['student-malika', 'Malika Tursunova', '94 444 55 66'],
  ['student-umar', 'Umar Bekmurodov', '95 555 66 77'],
  ['student-dilnoza', 'Dilnoza Qodirova', '97 666 77 88'],
  ['student-aziz', 'Aziz Rahmonov', '98 777 88 99'],
  ['student-shahnoza', 'Shahnoza Ergasheva', '99 888 99 00'],
  ['student-bekzod', 'Bekzod Yoqubov', '90 123 45 67'],
  ['student-nilufar', 'Nilufar Sodiqova', '91 234 56 78'],
  ['student-islom', 'Islom Karimov', '93 345 67 89'],
  ['student-mohira', 'Mohira Xolmatova', '94 456 78 90'],
  ['student-rustam', 'Rustam G‘ulomov', '95 567 89 01'],
  ['student-sevinch', 'Sevinch Ortiqova', '97 678 90 12'],
].map(([id, name, phone], index) => ({
  id,
  name,
  email: `${id}@example.com`,
  phone,
  groupId: index % 2 === 0 ? 'fr-12' : 'fr-02',
  groupName: index % 2 === 0 ? 'FR-12' : 'FR-02',
  teacher: 'Azizbek Karimov',
  enrollmentDate: '2026-01-15',
  startDate: '2026-01-15',
  paymentStatus: 'paid',
  progress: 55 + (index % 5) * 7,
  status: 'active',
  paidAmount: 1500000,
  lastPaymentDate: '2026-03-01',
  attendance: 86 + (index % 10),
}))

const pythonStudents: CourseStudent[] = [
  { id: 'py-1', name: 'Jasur Rahimov', email: 'jasur.rahimov@example.com', phone: '90 123 45 01', groupId: 'py-01', groupName: 'PY-01', teacher: 'Golib Abduhalil', enrollmentDate: '2026-02-01', startDate: '2026-04-01', paymentStatus: 'paid', progress: 45, status: 'active', paidAmount: 1800000, lastPaymentDate: '2026-03-01', attendance: 95 },
  { id: 'py-2', name: 'Dilnoza Karimova', email: 'dilnoza.karimova@example.com', phone: '91 234 56 02', groupId: 'py-01', groupName: 'PY-01', teacher: 'Golib Abduhalil', enrollmentDate: '2026-02-02', startDate: '2026-04-01', paymentStatus: 'paid', progress: 50, status: 'active', paidAmount: 1800000, lastPaymentDate: '2026-03-02', attendance: 92 },
  { id: 'py-3', name: 'Shoxrux Mirzayev', email: 'shoxrux.mirzayev@example.com', phone: '93 345 67 03', groupId: 'py-01', groupName: 'PY-01', teacher: 'Golib Abduhalil', enrollmentDate: '2026-02-05', startDate: '2026-04-01', paymentStatus: 'partial', progress: 40, status: 'active', paidAmount: 900000, lastPaymentDate: '2026-03-05', attendance: 88 },
  { id: 'py-4', name: 'Aziza Yusupova', email: 'aziza.yusupova@example.com', phone: '94 456 78 04', groupId: 'py-01', groupName: 'PY-01', teacher: 'Golib Abduhalil', enrollmentDate: '2026-02-08', startDate: '2026-04-01', paymentStatus: 'paid', progress: 60, status: 'active', paidAmount: 1800000, lastPaymentDate: '2026-03-01', attendance: 96 },
  { id: 'py-5', name: 'Bobur Alimov', email: 'bobur.alimov@example.com', phone: '95 567 89 05', groupId: 'py-01', groupName: 'PY-01', teacher: 'Golib Abduhalil', enrollmentDate: '2026-02-10', startDate: '2026-04-01', paymentStatus: 'paid', progress: 55, status: 'active', paidAmount: 1800000, lastPaymentDate: '2026-03-04', attendance: 90 },
  { id: 'py-6', name: 'Gulzoda Xamidova', email: 'gulzoda.xamidova@example.com', phone: '97 678 90 06', groupId: 'py-01', groupName: 'PY-01', teacher: 'Golib Abduhalil', enrollmentDate: '2026-02-12', startDate: '2026-04-01', paymentStatus: 'partial', progress: 35, status: 'active', paidAmount: 1000000, lastPaymentDate: '2026-03-02', attendance: 85 },
  { id: 'py-7', name: 'Eldor Nurmatov', email: 'eldor.nurmatov@example.com', phone: '98 789 01 07', groupId: 'py-01', groupName: 'PY-01', teacher: 'Golib Abduhalil', enrollmentDate: '2026-02-15', startDate: '2026-04-01', paymentStatus: 'paid', progress: 70, status: 'active', paidAmount: 1800000, lastPaymentDate: '2026-02-28', attendance: 98 },
  { id: 'py-8', name: 'Madinabonu Saidova', email: 'madinabonu.saidova@example.com', phone: '99 890 12 08', groupId: 'py-01', groupName: 'PY-01', teacher: 'Golib Abduhalil', enrollmentDate: '2026-02-18', startDate: '2026-04-01', paymentStatus: 'paid', progress: 65, status: 'active', paidAmount: 1800000, lastPaymentDate: '2026-03-01', attendance: 94 },
  { id: 'py-9', name: 'Otabek Zokirov', email: 'otabek.zokirov@example.com', phone: '90 901 23 09', groupId: 'py-01', groupName: 'PY-01', teacher: 'Golib Abduhalil', enrollmentDate: '2026-02-20', startDate: '2026-04-01', paymentStatus: 'unpaid', progress: 30, status: 'active', paidAmount: 0, lastPaymentDate: '', attendance: 80 },
  { id: 'py-10', name: 'Zulayho Tursunova', email: 'zulayho.tursunova@example.com', phone: '91 012 34 10', groupId: 'py-01', groupName: 'PY-01', teacher: 'Golib Abduhalil', enrollmentDate: '2026-02-22', startDate: '2026-04-01', paymentStatus: 'paid', progress: 58, status: 'active', paidAmount: 1800000, lastPaymentDate: '2026-03-03', attendance: 91 },
]

const javaStudents: CourseStudent[] = [
  { id: 'java-1', name: 'Farrux Toshpulatov', email: 'farrux.t@example.com', phone: '90 222 11 01', groupId: 'java-01', groupName: 'JAVA-01', teacher: 'Golib Abduhalil', enrollmentDate: '2026-01-20', startDate: '2026-04-01', paymentStatus: 'paid', progress: 52, status: 'active', paidAmount: 1800000, lastPaymentDate: '2026-03-01', attendance: 96 },
  { id: 'java-2', name: 'Kamola Rustamova', email: 'kamola.r@example.com', phone: '91 333 22 02', groupId: 'java-01', groupName: 'JAVA-01', teacher: 'Golib Abduhalil', enrollmentDate: '2026-01-22', startDate: '2026-04-01', paymentStatus: 'paid', progress: 64, status: 'active', paidAmount: 1800000, lastPaymentDate: '2026-02-27', attendance: 93 },
  { id: 'java-3', name: 'Javlon Bektemirov', email: 'javlon.b@example.com', phone: '93 444 33 03', groupId: 'java-01', groupName: 'JAVA-01', teacher: 'Golib Abduhalil', enrollmentDate: '2026-01-25', startDate: '2026-04-01', paymentStatus: 'partial', progress: 48, status: 'active', paidAmount: 1000000, lastPaymentDate: '2026-03-02', attendance: 89 },
  { id: 'java-4', name: 'Shahlo Qosimova', email: 'shahlo.q@example.com', phone: '94 555 44 04', groupId: 'java-01', groupName: 'JAVA-01', teacher: 'Golib Abduhalil', enrollmentDate: '2026-01-28', startDate: '2026-04-01', paymentStatus: 'paid', progress: 75, status: 'active', paidAmount: 1800000, lastPaymentDate: '2026-03-01', attendance: 97 },
  { id: 'java-5', name: 'Sardorbek Jo‘rayev', email: 'sardorbek.j@example.com', phone: '95 666 55 05', groupId: 'java-01', groupName: 'JAVA-01', teacher: 'Golib Abduhalil', enrollmentDate: '2026-02-01', startDate: '2026-04-01', paymentStatus: 'paid', progress: 58, status: 'active', paidAmount: 1800000, lastPaymentDate: '2026-03-04', attendance: 90 },
  { id: 'java-6', name: 'Nilufar Umarova', email: 'nilufar.u@example.com', phone: '97 777 66 06', groupId: 'java-01', groupName: 'JAVA-01', teacher: 'Golib Abduhalil', enrollmentDate: '2026-02-04', startDate: '2026-04-01', paymentStatus: 'paid', progress: 68, status: 'active', paidAmount: 1800000, lastPaymentDate: '2026-02-28', attendance: 95 },
  { id: 'java-7', name: 'Mansur Boboyev', email: 'mansur.b@example.com', phone: '98 888 77 07', groupId: 'java-01', groupName: 'JAVA-01', teacher: 'Golib Abduhalil', enrollmentDate: '2026-02-07', startDate: '2026-04-01', paymentStatus: 'partial', progress: 42, status: 'active', paidAmount: 900000, lastPaymentDate: '2026-03-03', attendance: 86 },
  { id: 'java-8', name: 'Feruza Matyoqubova', email: 'feruza.m@example.com', phone: '99 999 88 08', groupId: 'java-01', groupName: 'JAVA-01', teacher: 'Golib Abduhalil', enrollmentDate: '2026-02-10', startDate: '2026-04-01', paymentStatus: 'paid', progress: 70, status: 'active', paidAmount: 1800000, lastPaymentDate: '2026-03-01', attendance: 98 },
  { id: 'java-9', name: 'Davron Sharipov', email: 'davron.s@example.com', phone: '90 111 99 09', groupId: 'java-01', groupName: 'JAVA-01', teacher: 'Golib Abduhalil', enrollmentDate: '2026-02-14', startDate: '2026-04-01', paymentStatus: 'paid', progress: 61, status: 'active', paidAmount: 1800000, lastPaymentDate: '2026-03-02', attendance: 92 },
  { id: 'java-10', name: 'Sabina Vaxobova', email: 'sabina.v@example.com', phone: '91 222 00 10', groupId: 'java-01', groupName: 'JAVA-01', teacher: 'Golib Abduhalil', enrollmentDate: '2026-02-18', startDate: '2026-04-01', paymentStatus: 'unpaid', progress: 35, status: 'active', paidAmount: 0, lastPaymentDate: '', attendance: 82 },
]

const aiAutomationStudents: CourseStudent[] = [
  { id: 'ai-1', name: 'Ulug‘bek Qodirov', email: 'ulugbek.q@example.com', phone: '90 333 44 01', groupId: 'ai-01', groupName: 'AI-01', teacher: 'Otabek Naviyev', enrollmentDate: '2026-02-01', startDate: '2026-04-01', paymentStatus: 'paid', progress: 50, status: 'active', paidAmount: 2000000, lastPaymentDate: '2026-03-01', attendance: 95 },
  { id: 'ai-2', name: 'Sevara Ergasheva', email: 'sevara.e@example.com', phone: '91 444 55 02', groupId: 'ai-01', groupName: 'AI-01', teacher: 'Otabek Naviyev', enrollmentDate: '2026-02-03', startDate: '2026-04-01', paymentStatus: 'paid', progress: 72, status: 'active', paidAmount: 2000000, lastPaymentDate: '2026-02-28', attendance: 98 },
  { id: 'ai-3', name: 'Bekzod Fayzullayev', email: 'bekzod.f@example.com', phone: '93 555 66 03', groupId: 'ai-01', groupName: 'AI-01', teacher: 'Otabek Naviyev', enrollmentDate: '2026-02-06', startDate: '2026-04-01', paymentStatus: 'partial', progress: 44, status: 'active', paidAmount: 1000000, lastPaymentDate: '2026-03-03', attendance: 87 },
  { id: 'ai-4', name: 'Mohira Rahmonova', email: 'mohira.r@example.com', phone: '94 666 77 04', groupId: 'ai-01', groupName: 'AI-01', teacher: 'Otabek Naviyev', enrollmentDate: '2026-02-09', startDate: '2026-04-01', paymentStatus: 'paid', progress: 63, status: 'active', paidAmount: 2000000, lastPaymentDate: '2026-03-02', attendance: 94 },
  { id: 'ai-5', name: 'Nodirbek Salimov', email: 'nodirbek.s@example.com', phone: '95 777 88 05', groupId: 'ai-01', groupName: 'AI-01', teacher: 'Otabek Naviyev', enrollmentDate: '2026-02-12', startDate: '2026-04-01', paymentStatus: 'paid', progress: 80, status: 'active', paidAmount: 2000000, lastPaymentDate: '2026-03-01', attendance: 99 },
  { id: 'ai-6', name: 'Diyora Xusanova', email: 'diyora.x@example.com', phone: '97 888 99 06', groupId: 'ai-01', groupName: 'AI-01', teacher: 'Otabek Naviyev', enrollmentDate: '2026-02-15', startDate: '2026-04-01', paymentStatus: 'paid', progress: 57, status: 'active', paidAmount: 2000000, lastPaymentDate: '2026-02-27', attendance: 91 },
  { id: 'ai-7', name: 'Sherzod Murodov', email: 'sherzod.m@example.com', phone: '98 999 00 07', groupId: 'ai-01', groupName: 'AI-01', teacher: 'Otabek Naviyev', enrollmentDate: '2026-02-18', startDate: '2026-04-01', paymentStatus: 'partial', progress: 38, status: 'active', paidAmount: 1000000, lastPaymentDate: '2026-03-04', attendance: 86 },
  { id: 'ai-8', name: 'Rayhona Sobirova', email: 'rayhona.s@example.com', phone: '99 000 11 08', groupId: 'ai-01', groupName: 'AI-01', teacher: 'Otabek Naviyev', enrollmentDate: '2026-02-21', startDate: '2026-04-01', paymentStatus: 'paid', progress: 69, status: 'active', paidAmount: 2000000, lastPaymentDate: '2026-03-01', attendance: 96 },
  { id: 'ai-9', name: 'Anvar Turg‘unov', email: 'anvar.t@example.com', phone: '90 123 22 09', groupId: 'ai-01', groupName: 'AI-01', teacher: 'Otabek Naviyev', enrollmentDate: '2026-02-24', startDate: '2026-04-01', paymentStatus: 'paid', progress: 61, status: 'active', paidAmount: 2000000, lastPaymentDate: '2026-03-02', attendance: 93 },
  { id: 'ai-10', name: 'Shoira Ne’matova', email: 'shoira.n@example.com', phone: '91 234 33 10', groupId: 'ai-01', groupName: 'AI-01', teacher: 'Otabek Naviyev', enrollmentDate: '2026-02-27', startDate: '2026-04-01', paymentStatus: 'unpaid', progress: 32, status: 'active', paidAmount: 0, lastPaymentDate: '', attendance: 81 },
]

const foundationStudents: CourseStudent[] = [
  { id: 'fd-1', name: 'Shohruh Bekmirzayev', email: 'shohruh.b@example.com', phone: '90 444 55 01', groupId: 'fd-01', groupName: 'FD-01', teacher: 'Azizbek Karimov', enrollmentDate: '2026-02-05', startDate: '2026-04-01', paymentStatus: 'paid', progress: 60, status: 'active', paidAmount: 700000, lastPaymentDate: '2026-03-01', attendance: 94 },
  { id: 'fd-2', name: 'Gulruh Islomova', email: 'gulruh.i@example.com', phone: '91 555 66 02', groupId: 'fd-01', groupName: 'FD-01', teacher: 'Azizbek Karimov', enrollmentDate: '2026-02-07', startDate: '2026-04-01', paymentStatus: 'paid', progress: 75, status: 'active', paidAmount: 700000, lastPaymentDate: '2026-03-02', attendance: 98 },
  { id: 'fd-3', name: 'Mirjalol Odilov', email: 'mirjalol.o@example.com', phone: '93 666 77 03', groupId: 'fd-01', groupName: 'FD-01', teacher: 'Azizbek Karimov', enrollmentDate: '2026-02-10', startDate: '2026-04-01', paymentStatus: 'paid', progress: 55, status: 'active', paidAmount: 700000, lastPaymentDate: '2026-02-28', attendance: 91 },
  { id: 'fd-4', name: 'Zarnigor Toirova', email: 'zarnigor.t@example.com', phone: '94 777 88 04', groupId: 'fd-01', groupName: 'FD-01', teacher: 'Azizbek Karimov', enrollmentDate: '2026-02-12', startDate: '2026-04-01', paymentStatus: 'partial', progress: 42, status: 'active', paidAmount: 350000, lastPaymentDate: '2026-03-04', attendance: 88 },
  { id: 'fd-5', name: 'Doston Samadov', email: 'doston.s@example.com', phone: '95 888 99 05', groupId: 'fd-01', groupName: 'FD-01', teacher: 'Azizbek Karimov', enrollmentDate: '2026-02-15', startDate: '2026-04-01', paymentStatus: 'paid', progress: 68, status: 'active', paidAmount: 700000, lastPaymentDate: '2026-03-01', attendance: 96 },
  { id: 'fd-6', name: 'Munira Xalilova', email: 'munira.x@example.com', phone: '97 999 00 06', groupId: 'fd-01', groupName: 'FD-01', teacher: 'Azizbek Karimov', enrollmentDate: '2026-02-18', startDate: '2026-04-01', paymentStatus: 'paid', progress: 70, status: 'active', paidAmount: 700000, lastPaymentDate: '2026-03-03', attendance: 95 },
  { id: 'fd-7', name: 'Asadbek Boltayev', email: 'asadbek.b@example.com', phone: '98 000 11 07', groupId: 'fd-01', groupName: 'FD-01', teacher: 'Azizbek Karimov', enrollmentDate: '2026-02-20', startDate: '2026-04-01', paymentStatus: 'paid', progress: 58, status: 'active', paidAmount: 700000, lastPaymentDate: '2026-02-27', attendance: 90 },
  { id: 'fd-8', name: 'Yulduz Nabiyeva', email: 'yulduz.n@example.com', phone: '99 111 22 08', groupId: 'fd-01', groupName: 'FD-01', teacher: 'Azizbek Karimov', enrollmentDate: '2026-02-22', startDate: '2026-04-01', paymentStatus: 'partial', progress: 48, status: 'active', paidAmount: 400000, lastPaymentDate: '2026-03-02', attendance: 87 },
  { id: 'fd-9', name: 'Jahongir G‘aniyev', email: 'jahongir.g@example.com', phone: '90 234 55 09', groupId: 'fd-01', groupName: 'FD-01', teacher: 'Azizbek Karimov', enrollmentDate: '2026-02-25', startDate: '2026-04-01', paymentStatus: 'paid', progress: 64, status: 'active', paidAmount: 700000, lastPaymentDate: '2026-03-01', attendance: 93 },
  { id: 'fd-10', name: 'Kamila Azizova', email: 'kamila.a@example.com', phone: '91 345 66 10', groupId: 'fd-01', groupName: 'FD-01', teacher: 'Azizbek Karimov', enrollmentDate: '2026-02-28', startDate: '2026-04-01', paymentStatus: 'unpaid', progress: 30, status: 'active', paidAmount: 0, lastPaymentDate: '', attendance: 84 },
]

export const initialCourses: Course[] = [
  {
    id: 'frontend-development',
    name: 'Frontend Development',
    category: 'Dasturlash',
    description:
      'Zamonaviy web ilovalar yaratish: HTML, CSS, JavaScript, React va TypeScript.',
    teacher: 'Temurbek',
    duration: '6 oy',
    studentsCount: 16,
    groupsCount: 3,
    price: 1500000,
    startDate: '2026-01-15',
    endDate: '2026-05-15',
    status: 'active',
    students: [
      {
        id: 'student-ali',
        name: 'Ali Valiyev',
        email: 'ali@example.com',
        phone: '90 111 00 01',
        groupId: 'fr-12',
        groupName: 'FR-12',
        teacher: 'Temurbek',
        enrollmentDate: '2026-01-10',
        startDate: '2026-01-15',
        paymentStatus: 'partial',
        progress: 65,
        status: 'active',
        paidAmount: 1000000,
        lastPaymentDate: '2026-03-03',
        attendance: 92,
      },
      {
        id: 'student-madina',
        name: 'Madina Karimova',
        email: 'madina@example.com',
        phone: '91 222 00 02',
        groupId: 'fr-12',
        groupName: 'FR-12',
        teacher: 'Temurbek',
        enrollmentDate: '2026-01-11',
        startDate: '2026-01-15',
        paymentStatus: 'paid',
        progress: 78,
        status: 'active',
        paidAmount: 1500000,
        lastPaymentDate: '2026-02-28',
        attendance: 96,
      },
      ...additionalFrontendStudents,
    ],
    groups: [
      {
        id: 'fr-01',
        name: 'FR-01',
        teacher: 'Temurbek',
        schedule: 'Du-Chor-Ju 18:00',
        room: '204',
        startDate: '2026-01-15',
        endDate: '2026-05-15',
        studentsCount: 12,
        maxStudents: 15,
        status: 'active',
      },
      {
        id: 'fr-02',
        name: 'FR-02',
        teacher: 'Temurbek',
        schedule: 'Se-Pay-Sha 10:00',
        room: '201',
        startDate: '2026-02-01',
        endDate: '2026-06-01',
        studentsCount: 10,
        maxStudents: 15,
        status: 'active',
      },
      {
        id: 'fr-12',
        name: 'FR-12',
        teacher: 'Temurbek',
        schedule: 'Du-Chor-Ju 19:30',
        room: '204',
        startDate: '2026-01-15',
        endDate: '2026-05-15',
        studentsCount: 10,
        maxStudents: 15,
        status: 'active',
      },
    ],
    lessons: [
      {
        id: 'lesson-fr-1',
        title: 'React komponentlari',
        date: '2026-03-10',
        startTime: '18:00',
        endTime: '20:00',
        teacher: 'Temurbek',
        group: 'FR-01',
        status: 'upcoming',
      },
      {
        id: 'lesson-fr-2',
        title: 'TypeScript asoslari',
        date: '2026-03-08',
        startTime: '18:00',
        endTime: '20:00',
        teacher: 'Temurbek',
        group: 'FR-02',
        status: 'completed',
      },
    ],
  },
  {
    id: 'python-pro',
    name: 'Python Backend',
    category: 'Dasturlash',
    description:
      'Python, FastAPI va ma’lumotlar bazasi bilan backend dasturlash.',
    teacher: 'Golib Abduhalil',
    duration: '6 oy',
    studentsCount: 10,
    groupsCount: 1,
    price: 1800000,
    startDate: '2026-04-01',
    endDate: '2026-09-01',
    status: 'active',
    students: pythonStudents,
    groups: [
      {
        id: 'py-01',
        name: 'PY-01',
        teacher: 'Golib Abduhalil',
        schedule: 'Se-Pay-Sha 19:00',
        room: '201',
        startDate: '2026-04-01',
        endDate: '2026-09-01',
        studentsCount: 10,
        maxStudents: 15,
        status: 'active',
      },
    ],
    lessons: [],
  },
  {
    id: 'java-backend',
    name: 'Java Backend',
    category: 'Dasturlash',
    description:
      'Java, Spring Boot va ma’lumotlar bazasi bilan professional backend dasturlash.',
    teacher: 'Golib Abduhalil',
    duration: '6 oy',
    studentsCount: 10,
    groupsCount: 1,
    price: 1800000,
    startDate: '2026-04-01',
    endDate: '2026-10-01',
    status: 'active',
    students: javaStudents,
    groups: [
      {
        id: 'java-01',
        name: 'JAVA-01',
        teacher: 'Golib Abduhalil',
        schedule: 'Du-Chor-Ju 19:00',
        room: '202',
        startDate: '2026-04-01',
        endDate: '2026-10-01',
        studentsCount: 10,
        maxStudents: 15,
        status: 'active',
      },
    ],
    lessons: [],
  },
  {
    id: 'ai-automation',
    name: 'AI Automation',
    category: 'Dasturlash',
    description:
      'Sun’iy intellekt, avtomatlashtirish va zamonaviy AI vositalaridan foydalanish.',
    teacher: 'Otabek Naviyev',
    duration: '4 oy',
    studentsCount: 10,
    groupsCount: 1,
    price: 2000000,
    startDate: '2026-04-01',
    endDate: '2026-08-01',
    status: 'active',
    students: aiAutomationStudents,
    groups: [
      {
        id: 'ai-01',
        name: 'AI-01',
        teacher: 'Otabek Naviyev',
        schedule: 'Du-Chor-Ju 19:30',
        room: '305',
        startDate: '2026-04-01',
        endDate: '2026-08-01',
        studentsCount: 10,
        maxStudents: 15,
        status: 'active',
      },
    ],
    lessons: [],
  },
  {
    id: 'ai-automation-advanced',
    name: 'AI Automation Advanced',
    category: 'Dasturlash',
    description:
      'AI agentlar, avtomatlashtirish tizimlari va murakkab amaliy loyihalar.',
    teacher: 'Ismat',
    duration: '4 oy',
    studentsCount: 0,
    groupsCount: 0,
    price: 2200000,
    startDate: '2026-05-01',
    endDate: '2026-09-01',
    status: 'upcoming',
    students: [],
    groups: [],
    lessons: [],
  },
  {
    id: 'foundation',
    name: 'Foundation',
    category: 'Dasturlash',
    description:
      'Dasturlashga kirish, algoritmlar va texnik fikrlash asoslari.',
    teacher: 'Azizbek Karimov',
    duration: '2 oy',
    studentsCount: 10,
    groupsCount: 1,
    price: 700000,
    startDate: '2026-04-01',
    endDate: '2026-06-01',
    status: 'active',
    students: foundationStudents,
    groups: [
      {
        id: 'fd-01',
        name: 'FD-01',
        teacher: 'Azizbek Karimov',
        schedule: 'Se-Pay-Sha 18:00',
        room: '101',
        startDate: '2026-04-01',
        endDate: '2026-06-01',
        studentsCount: 10,
        maxStudents: 15,
        status: 'active',
      },
    ],
    lessons: [],
  },
  {
    id: 'ui-ux-design',
    name: 'UI/UX Design',
    category: 'Dizayn',
    description: 'Figma, user research va product design asoslari.',
    teacher: 'Muhammad Aliyev',
    duration: '3 oy',
    studentsCount: 24,
    groupsCount: 2,
    price: 1200000,
    startDate: '2025-08-01',
    endDate: '2025-11-01',
    status: 'completed',
    students: [],
    groups: [],
    lessons: [],
  },
]

export function loadCourses(): Course[] {
  if (typeof window === 'undefined') return initialCourses
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return initialCourses
    const saved = JSON.parse(stored) as Course[]
    const withoutEnglish = saved.filter(
      (course) => course.id !== 'english-general'
    )
    const savedIds = new Set(withoutEnglish.map((course) => course.id))
    const missingCourses = initialCourses.filter(
      (course) => !savedIds.has(course.id)
    )
    const teacherUpdates: Record<string, string> = {
      'frontend-development': 'Temurbek',
      'python-pro': 'Golib Abduhalil',
      'java-backend': 'Golib Abduhalil',
      'ai-automation': 'Otabek Naviyev',
    }
    const seedCourseMap = new Map(initialCourses.map((c) => [c.id, c]))
    const migrated = [...withoutEnglish, ...missingCourses].map((course) => {
      const seed = seedCourseMap.get(course.id)
      const students = course.students && course.students.length > 0 ? course.students : (seed?.students ?? [])
      const groups = course.groups && course.groups.length > 0 ? course.groups : (seed?.groups ?? [])
      return {
        ...course,
        ...(teacherUpdates[course.id]
          ? { teacher: teacherUpdates[course.id] }
          : {}),
        ...(course.id === 'frontend-development' ||
        course.id === 'python-pro' ||
        course.id === 'java-backend'
          ? { duration: '6 oy' }
            : course.id === 'foundation'
              ? { duration: '2 oy' }
              : {}),
        students,
        studentsCount: students.length,
        groups,
        groupsCount: groups.length,
      }
    })
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated))
    return migrated
  } catch {
    return initialCourses
  }
}

export function saveCourses(courses: Course[]) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(courses))
  }
}

export function formatCurrency(value: number) {
  return `${new Intl.NumberFormat('uz-UZ').format(value)} so‘m`
}

export function statusLabel(status: CourseStatus) {
  return {
    active: 'Faol',
    upcoming: 'Boshlanmagan',
    completed: 'Tugallangan',
    archived: 'Arxivlangan',
  }[status]
}
