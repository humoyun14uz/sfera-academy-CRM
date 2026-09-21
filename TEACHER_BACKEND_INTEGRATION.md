# Teacher paneli — backend integratsiya xaritasi

Ushbu hujjat Teacher panelida backend qayerda kerak bo‘lishini ko‘rsatadi. Hozirgi frontend demo ma’lumotlar bilan ishlaydi. Backend ulanishida quyidagi mock ma’lumotlar API yoki tRPC so‘rovlari bilan almashtiriladi.

> **Muhim:** Backend implementatsiyasida mavjud frontend route nomlarini saqlash shart emas. Lekin qaytariladigan ma’lumotlar shakli ushbu hujjatdagi kontraktlarga mos bo‘lishi kerak.

## 1. Teacher autentifikatsiyasi

Frontenddagi vaqtinchalik demo login fayli:

`src/features/auth/sign-in/components/user-auth-form.tsx`

U yerdagi `teacher@gmail.com` va `SferaTeacher@2026` qiymatlari faqat frontend demo uchun qo‘shilgan. Real tizimda bu qism backend autentifikatsiyasi bilan almashtiriladi.

| Kerakli imkoniyat | Tavsiya etiladigan API | Natija |
|---|---|---|
| Login | `POST /api/auth/login` | Access token yoki session cookie |
| Joriy foydalanuvchi | `GET /api/auth/me` | Teacher profili va roli |
| Chiqish | `POST /api/auth/logout` | Session/token bekor qilinadi |
| Parolni yangilash | `PATCH /api/teachers/me/password` | Yangi parol saqlanadi |

Joriy foydalanuvchi javobi kamida quyidagi maydonlarni qaytarsin:

```ts
type CurrentUser = {
  id: string
  accountNo: string
  name: string
  email: string
  phone?: string
  avatarUrl?: string
  role: 'Teacher'
  permissions: string[]
}
```

## 2. Ruxsatlar va role-based access

Frontenddagi RBAC fayli:

`src/lib/rbac.ts`

Teacher roli uchun hozirda `teacher.workspace` permission ishlatiladi. Backend token yoki session tekshiruvida quyidagi ruxsatlar bo‘lishi kerak:

| Permission | Vazifasi |
|---|---|
| `dashboard.read` | Teacher boshqaruv panelini ko‘rish |
| `teacher.workspace` | Teacher bo‘limlariga kirish |
| `teacher.groups.read` | O‘qituvchiga biriktirilgan guruhlarni ko‘rish |
| `teacher.schedule.read` | O‘qituvchi jadvalini ko‘rish |
| `teacher.lessons.read` | Bugungi va yaqin darslarni ko‘rish |
| `teacher.attendance.read` | Davomat ro‘yxatini ko‘rish |
| `teacher.attendance.update` | Davomatni belgilash yoki o‘zgartirish |
| `teacher.students.read` | O‘qituvchiga biriktirilgan o‘quvchilarni ko‘rish |
| `teacher.assignments.read` | Vazifalarni ko‘rish |
| `teacher.assignments.create` | Vazifa yaratish |
| `teacher.assignments.update` | Vazifani tahrirlash yoki yopish |
| `teacher.grades.read` | Baholarni ko‘rish |
| `teacher.grades.update` | O‘quvchi bahosini kiritish yoki yangilash |
| `teacher.profile.read` | O‘z profilini ko‘rish |
| `teacher.profile.update` | O‘z profilini tahrirlash |
| `teacher.settings.update` | O‘z sozlamalarini o‘zgartirish |

Backend har bir so‘rovda `teacherId`ni client yuborgan qiymatga ishonib qabul qilmasin. Teacher identifikatori session yoki token ichidagi foydalanuvchidan olinsin.

## 3. Dashboard

Frontend fayli:

`src/features/teacher/index.tsx`

Hozirgi dashboard quyidagi mock ma’lumotlardan foydalanadi:

- `groups` — guruhlar, kurs, o‘quvchilar soni, vaqt va xona.
- `students` — davomat belgilash uchun o‘quvchilar.
- Vazifa nomlari va holatlari.
- Statistikalar: guruhlar, o‘quvchilar, o‘rtacha baho va vazifalar bajarilishi.

Tavsiya etiladigan endpoint:

```http
GET /api/teacher/dashboard
```

Javob shakli:

```ts
type TeacherDashboardResponse = {
  stats: {
    groupsCount: number
    studentsCount: number
    averageGrade: number
    assignmentCompletion: number
  }
  upcomingLessons: Lesson[]
  todayAttendance: AttendanceRecord[]
  assignments: Assignment[]
}
```

## 4. Mening guruhlarim

Frontend route:

`/teacher/groups`

Tavsiya etiladigan endpointlar:

```http
GET /api/teacher/groups
GET /api/teacher/groups/:groupId
GET /api/teacher/groups/:groupId/students
```

```ts
type TeacherGroup = {
  id: string
  name: string
  courseId: string
  courseName: string
  room?: string
  scheduleSummary?: string
  studentsCount: number
  status: 'active' | 'paused' | 'finished'
}
```

Backend faqat aynan shu Teacherga biriktirilgan guruhlarni qaytarsin.

## 5. Jadvalim va bugungi darslar

Frontend route’lari:

- `/teacher/schedule`
- `/teacher/today`

Tavsiya etiladigan endpointlar:

```http
GET /api/teacher/schedule?from=YYYY-MM-DD&to=YYYY-MM-DD
GET /api/teacher/lessons/today
GET /api/teacher/lessons/:lessonId
```

```ts
type Lesson = {
  id: string
  groupId: string
  groupName: string
  courseName: string
  startsAt: string
  endsAt: string
  room?: string
  meetingUrl?: string
  status: 'planned' | 'started' | 'completed' | 'cancelled'
}
```

Vaqtlar ISO formatda va academy timezone bilan qaytarilishi kerak. Frontend timezone’ni alohida hisoblab yubormasligi uchun backend bir xil timezone siyosatidan foydalansin.

## 6. Davomat

Frontend dashboarddagi demo davomat tugmalari:

`src/features/teacher/index.tsx` ichidagi `attendance` state’i.

Tavsiya etiladigan endpointlar:

```http
GET /api/teacher/lessons/:lessonId/attendance
PUT /api/teacher/lessons/:lessonId/attendance
```

```ts
type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'

type AttendanceRecord = {
  id: string
  lessonId: string
  studentId: string
  studentName: string
  status: AttendanceStatus
  note?: string
  markedAt?: string
  markedBy?: string
}

type UpdateAttendanceRequest = {
  records: Array<{
    studentId: string
    status: AttendanceStatus
    note?: string
  }>
}
```

Davomatni saqlashda backend quyidagilarni tekshirsin:

1. Lesson shu Teacherga tegishlimi.
2. Student shu guruhga biriktirilganmi.
3. Teacher ushbu dars sanasida davomat kiritish huquqiga egami.
4. Bir dars va bir student uchun takroriy attendance yozuvi yaratilmasin.

## 7. O‘quvchilar

Frontend route:

`/teacher/students`

Tavsiya etiladigan endpointlar:

```http
GET /api/teacher/students?page=1&pageSize=20&search=
GET /api/teacher/students/:studentId
```

```ts
type TeacherStudent = {
  id: string
  fullName: string
  phone?: string
  email?: string
  groupIds: string[]
  groupNames: string[]
  attendanceRate: number
  averageGrade?: number
  status: 'active' | 'inactive'
}
```

Teacher o‘quvchining moliyaviy, parol, boshqa guruhlar yoki admin ma’lumotlarini ko‘rmasligi kerak.

## 8. Vazifalar

Frontend route:

`/teacher/assignments`

Tavsiya etiladigan endpointlar:

```http
GET /api/teacher/assignments?groupId=&status=&page=1&pageSize=20
POST /api/teacher/assignments
PATCH /api/teacher/assignments/:assignmentId
DELETE /api/teacher/assignments/:assignmentId
GET /api/teacher/assignments/:assignmentId/submissions
PATCH /api/teacher/submissions/:submissionId
```

```ts
type Assignment = {
  id: string
  groupId: string
  groupName: string
  title: string
  description?: string
  dueAt?: string
  maxScore?: number
  status: 'draft' | 'published' | 'closed'
  submissionsCount: number
}
```

Vazifa yaratishda `teacherId`ni request body’dan emas, authenticated user’dan oling.

## 9. Baholar

Frontend route:

`/teacher/grades`

Tavsiya etiladigan endpointlar:

```http
GET /api/teacher/grades?groupId=&studentId=&page=1&pageSize=20
PUT /api/teacher/grades
```

```ts
type Grade = {
  id: string
  studentId: string
  studentName: string
  groupId: string
  assignmentId?: string
  lessonId?: string
  score: number
  maxScore: number
  comment?: string
  gradedAt: string
}

type UpdateGradeRequest = {
  studentId: string
  groupId: string
  assignmentId?: string
  lessonId?: string
  score: number
  maxScore: number
  comment?: string
}
```

Backend score qiymatini `0 <= score <= maxScore` sharti bilan tekshirsin.

## 10. Profil va sozlamalar

Frontend route’lari:

- `/teacher/profile`
- `/teacher/settings`

Hozirgi frontendda profil va sozlamalar umumiy sahifa sifatida mavjud. Backend ulanishi uchun:

```http
GET /api/teacher/me
PATCH /api/teacher/me
GET /api/teacher/preferences
PATCH /api/teacher/preferences
```

```ts
type TeacherPreferences = {
  language: 'uz' | 'en'
  timezone: string
  emailNotifications: boolean
  lessonReminders: boolean
}
```

## 11. Frontendda almashtiriladigan joylar

| Fayl yoki route | Hozirgi holat | Backend ulanganda |
|---|---|---|
| `src/features/auth/sign-in/components/user-auth-form.tsx` | Demo hisoblar massivida ishlaydi | Login API va session bilan almashtiriladi |
| `src/features/teacher/index.tsx` | `groups`, `students`, `attendance`, assignment qiymatlari mock | Dashboard query va mutation hook’lari ulanadi |
| `/teacher/groups` | Umumiy Teacher sahifasi | Guruhlar ro‘yxati komponenti qo‘shiladi |
| `/teacher/schedule` | Umumiy Teacher sahifasi | Jadval query’si qo‘shiladi |
| `/teacher/today` | Umumiy Teacher sahifasi | Bugungi darslar query’si qo‘shiladi |
| `/teacher/attendance` | Dashboarddagi demo davomat mavjud | Attendance query/mutation bilan almashtiriladi |
| `/teacher/students` | Umumiy Teacher sahifasi | O‘quvchilar jadvali qo‘shiladi |
| `/teacher/assignments` | Umumiy Teacher sahifasi | CRUD forma va topshiriqlar ro‘yxati qo‘shiladi |
| `/teacher/grades` | Umumiy Teacher sahifasi | Baholar jadvali va tahrirlash formasi qo‘shiladi |

## 12. Backend tayyor bo‘lgandan keyingi ulash tartibi

1. Auth endpointlari va `Teacher` roli ishlashini tekshiring.
2. `GET /api/teacher/dashboard` endpointini ulang.
3. Guruhlar va jadval query’larini ulang.
4. Davomat mutation’ini ulang.
5. O‘quvchilar ro‘yxatini ulang.
6. Vazifalar CRUD qismini ulang.
7. Baholarni o‘qish va yangilashni ulang.
8. Profil va sozlamalarni ulang.
9. Har bir endpoint uchun Teacher ownership tekshiruvini yozing.
10. Frontend mock ma’lumotlarini o‘chirib, loading, error va empty state’larni qo‘shing.

## 13. Minimal xavfsizlik talablari

Backend quyidagi qoidalarni majburiy bajarishi kerak:

- Teacher faqat o‘ziga biriktirilgan guruhlarni ko‘rsin.
- Teacher boshqa teacherlarning guruhlariga murojaat qila olmasin.
- Attendance, assignment va grade mutation’larida ownership tekshirilsin.
- `teacherId`, `createdBy` va `markedBy` qiymatlari client’dan olinmasin.
- Har bir update amali audit logga yozilsin.
- O‘quvchi ma’lumotlari pagination va server-side search bilan qaytarilsin.
- API xatolari yagona formatda qaytarilsin.

```ts
type ApiError = {
  code: string
  message: string
  details?: Record<string, unknown>
}
```


## 14. Frontend auditidan keyingi qo‘shimcha markerlar

Teacher frontendidagi vaqtinchalik amallar uchun toast xabarlari qo‘shildi. Bu toastlar backend muvaffaqiyatli javob berganidan keyin ko‘rsatilishi kerak. Hozir demo rejimda ular local state o‘zgarishi bilan ko‘rsatiladi.

| Frontend amal | Hozirgi demo holati | Backendga ulanganda |
|---|---|---|
| Davomatni saqlash | `toast.success` va vaqtinchalik state | `PUT /api/teacher/lessons/:lessonId/attendance`; faqat `2xx` javobdan keyin success toast |
| Baho saqlash | 0–100 validatsiya va `toast.success` | `PUT /api/teacher/grades`; server validatsiyasi ham majburiy |
| Vazifa qo‘shish | Bo‘sh nom, uzunlik va whitespace tekshiruvi; `toast.success` | `POST /api/teacher/assignments`; success toast faqat server javobidan keyin |
| Guruhlar qidiruvi | Frontend filter | Katta ma’lumotda `GET /api/teacher/groups?search=` server-side filter |
| O‘quvchilar qidiruvi | Frontend filter | `GET /api/teacher/students?search=` server-side filter |

## 15. Local storage bo‘yicha xavfsizlik eslatmasi

`src/features/courses/data.ts` va `src/features/tasks/components/tasks-provider.tsx` ichidagi local storage demo ma’lumotlarni saqlash uchun ishlatiladi. U yerga quyidagilarni yozmang:

- access token;
- refresh token;
- parol;
- moliyaviy ma’lumotlar;
- shaxsiy maxfiy ma’lumotlar;
- backend permission yoki ownership qiymatlari.

Real tizimda token uchun xavfsiz, server-side session yoki `HttpOnly`, `Secure`, `SameSite` cookie ishlating. Local storage faqat cache va foydalanuvchi interfeysi afzalliklari uchun ishlatilishi mumkin.

## 16. Toast siyosati

Frontend quyidagi qoidaga amal qilishi kerak:

1. Serverga yuboriladigan amal boshlanganda loading toast yoki tugma loading holati ko‘rsatiladi.
2. Server `2xx` javob qaytarsa success toast ko‘rsatiladi.
3. `4xx` javobda foydalanuvchiga tushunarli error toast ko‘rsatiladi.
4. `401` javobda session tugagani haqida xabar berilib, login sahifasiga yo‘naltiriladi.
5. `403` javobda ruxsat yo‘qligi haqida xabar beriladi.
6. `5xx` javobda ma’lumot saqlanmagani aniq aytiladi.
7. Success toast server javobidan oldin ko‘rsatilmasin.

## 17. Validatsiya siyosati

Frontend tezkor feedback uchun regex va qiymat tekshiruvlaridan foydalanadi. Bu tekshiruvlar backend validatsiyasining o‘rnini bosmaydi. Backend barcha qiymatlarni qayta tekshirishi kerak.

- Vazifa nomi: trim qilinadi, kamida 3 belgi, ko‘pi bilan 120 belgi.
- Baho: faqat raqam, `0` dan `100` gacha.
- Davomat: faqat ruxsat etilgan statuslar.
- ID qiymatlari: client ma’lumotiga ishonilmaydi; server tokenidan ownership tekshiriladi.


## 18. Finance paneli uchun backend integratsiyasi

Finance frontendi hozir demo ma’lumotlar bilan ishlaydi va foydalanuvchiga to‘liq interaktiv feedback beradi. Real ma’lumotlar va moliyaviy xavfsizlik uchun quyidagi tRPC yoki API amallari backendda yozilishi kerak:

| Amal | Tavsiya etiladigan endpoint | Muhim server tekshiruvi |
|---|---|---|
| To‘lov qo‘shish | `POST /api/finance/payments` | Finance permission, student ID, group ID, summa, currency va duplicate payment tekshiruvi |
| To‘lovni tahrirlash | `PATCH /api/finance/payments/:paymentId` | Ownership, audit log va to‘lov statusi qoidalari |
| To‘lovni o‘chirish | `DELETE /api/finance/payments/:paymentId` | Hard delete o‘rniga audit bilan void/reversal ishlatish ma’qul |
| To‘lovlar qidiruvi | `GET /api/finance/payments?search=` | Server-side pagination va permission filter |
| Qarzdorlik ro‘yxati | `GET /api/finance/debts` | Qarzdorlikni server hisoblasin; frontend summasiga ishonilmasin |
| Qarzdorlikni yopish | `POST /api/finance/debts/:studentId/settle` | Haqiqiy to‘lov bilan bog‘lash, settlement audit log va transaction |
| O‘quvchi hisoblari | `GET /api/finance/students` | Guruh, kurs va balansni serverdan qaytarish |
| Hisobot yaratish | `GET /api/finance/reports?type=monthly` | Permission, sana oralig‘i, server-side CSV/XLSX/PDF yaratish |
| Finance sozlamalari | `PATCH /api/profile/preferences` | Faqat current user preference’larini yangilash |

Frontenddagi hisobot yuklash hozir brauzerda oddiy CSV yaratadi. Bu demo va preview uchun mos. Haqiqiy moliyaviy hisobotlarda backend generatsiyasi tavsiya etiladi, chunki balans, qarzdorlik va to‘lovlar faqat serverdagi transaction ma’lumotlariga asoslanishi kerak.

## 19. Role route xavfsizligi

Teacher foydalanuvchisi root Academy dashboardga, Finance foydalanuvchisi esa root Academy dashboardga kirsa, authenticated root route ularni mos ravishda `/teacher` va `/finance` ga yo‘naltiradi. Finance va Teacher route’lari permission guard bilan himoyalangan. Backend ham xuddi shu role va permission tekshiruvlarini qayta bajarishi shart; frontend route guard xavfsizlik chegarasi hisoblanmaydi.
