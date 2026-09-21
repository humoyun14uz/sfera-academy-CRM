# Education CRM — backend kerak bo‘ladigan joylar

## 1. Bu qo‘llanma nima uchun kerak?

Ushbu qo‘llanma faqat **backend qayerda kerak bo‘lishini** tushuntiradi. Uni backend yozadigan sherigingizga berishingiz mumkin. Unda murakkab atamalar imkon qadar sodda tilda yozilgan.

Frontend — foydalanuvchi ko‘radigan qism. Backend esa ma’lumotni xavfsiz saqlaydi, loginni tekshiradi, ruxsatlarni nazorat qiladi va frontendga ma’lumot qaytaradi.

> **Eng muhim qoida:** Frontendda ko‘rinadigan har qanday muhim ma’lumot backendda tekshirilishi va saqlanishi kerak. Frontenddagi tekshiruvni foydalanuvchi chetlab o‘tishi mumkin.

## 2. Hozir frontendda nima demo holatda?

Hozir quyidagi qismlarning ayrimlari vaqtinchalik frontend ma’lumotlari bilan ishlaydi:

- login va rolga kirish;
- Teacher dashboard statistikasi;
- Teacher guruhlari va o‘quvchilari;
- davomat;
- vazifalar qo‘shish, tahrirlash va o‘chirish;
- baholarni saqlash;
- Finance to‘lovlari;
- qarzdorlik;
- Finance statistikasi;
- hisobotlar;
- profil va sozlamalar;
- umumiy Tasks va Courses ma’lumotlari.

Bularni haqiqiy tizimga aylantirish uchun frontenddagi vaqtinchalik state yoki localStorage o‘rniga backend API ulanadi.

## 3. Backendning umumiy vazifalari

Backend quyidagi ishlarni bajarishi kerak:

1. Foydalanuvchini ro‘yxatdan o‘tkazish.
2. Login va parolni tekshirish.
3. Foydalanuvchining rolini aniqlash.
4. Har bir rolga tegishli ruxsatlarni tekshirish.
5. Ma’lumotlarni database’ga saqlash.
6. Ma’lumotlarni database’dan olib frontendga yuborish.
7. Kim qaysi guruh, o‘quvchi yoki to‘lovga tegishli ekanini tekshirish.
8. Muhim amallarni audit logga yozish.
9. Parollarni xavfsiz hash qilib saqlash.
10. Xatoliklarni to‘g‘ri HTTP status bilan qaytarish.

## 4. Eng birinchi yoziladigan qism — login va foydalanuvchilar

Frontenddagi demo login fayli:

```text
src/features/auth/sign-in/components/user-auth-form.tsx
```

Hozir frontend demo email va parollarni tekshiradi. Real loyiha uchun bu usul olib tashlanadi.

### Kerakli endpointlar

| Amal | Endpoint | Oddiy tushuntirish |
|---|---|---|
| Ro‘yxatdan o‘tish | `POST /api/auth/register` | Yangi account yaratadi |
| Login | `POST /api/auth/login` | Email va parolni tekshiradi |
| Joriy foydalanuvchi | `GET /api/auth/me` | Hozir kirgan odamni qaytaradi |
| Logout | `POST /api/auth/logout` | Kirish sessiyasini yopadi |
| Parolni unutish | `POST /api/auth/forgot-password` | Parol tiklash havolasini yuboradi |
| Parolni tiklash | `POST /api/auth/reset-password` | Yangi parol o‘rnatadi |
| Parolni almashtirish | `PATCH /api/auth/password` | Eski parolni tekshirib almashtiradi |
| Emailni tasdiqlash | `POST /api/auth/verify-email` | Email tasdiqlanganini tekshiradi |

### Database’da kerak bo‘ladigan User maydonlari

```ts
type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  passwordHash: string
  role: 'Super Admin' | 'Manager' | 'Teacher' | 'Finance'
  status: 'active' | 'blocked' | 'pending'
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}
```

### Muhim xavfsizlik

- Parolni oddiy matn holida saqlamang.
- `bcrypt` yoki `argon2` bilan hash qiling.
- Frontenddagi `mock-access-token`ni production’da ishlatmang.
- Tokenni localStorage’da saqlash o‘rniga `HttpOnly`, `Secure`, `SameSite` cookie ishlating.
- Login xatosida “email topilmadi” yoki “parol xato” deb alohida aytmang. Umumiy xabar qaytaring.
- Juda ko‘p noto‘g‘ri login bo‘lsa vaqtinchalik bloklash yoki rate limit qo‘ying.

## 5. Role va permission backendda tekshirilishi kerak

Frontend sidebarni yashirishi mumkin, lekin bu xavfsizlik emas. Foydalanuvchi API’ni to‘g‘ridan-to‘g‘ri chaqirishi mumkin. Shuning uchun backend har bir endpointda rolni tekshirishi kerak.

### Rollar

- **Super Admin:** barcha asosiy bo‘limlarga keng ruxsat.
- **Manager:** akademiya kundalik boshqaruvi.
- **Teacher:** faqat o‘z guruhlari, darslari va o‘quvchilari.
- **Finance:** to‘lovlar, qarzdorlik va moliyaviy hisobotlar.

### Minimal permissionlar

```text
users.read
users.create
users.update
users.delete
courses.read
courses.create
courses.update
courses.delete
groups.read
groups.create
groups.update
groups.delete
groups.assign_teacher
groups.manage_students
groups.manage_schedule
teachers.read
teachers.create
teachers.update
teachers.assign_group
students.read
students.create
students.update
attendance.read
attendance.update
teacher.workspace
finance.workspace
finance.payments.read
finance.payments.create
finance.payments.update
finance.payments.delete
finance.debts.read
finance.debts.settle
finance.reports.read
settings.read
settings.update
```

> **Oddiy qoida:** Foydalanuvchi tugmani ko‘rmasligi yetarli emas. Backend ham o‘sha amalni bajarishga ruxsati bor-yo‘qligini tekshirishi shart.

## 6. Super Admin uchun backend

Super Adminning asosiy frontend bo‘limlari foydalanuvchilar, kurslar, guruhlar, o‘qituvchilar, o‘quvchilar, jadval, moliya va umumiy sozlamalardir.

### Kerakli endpointlar

| Bo‘lim | Endpointlar |
|---|---|
| Dashboard | `GET /api/admin/dashboard` |
| Foydalanuvchilar ro‘yxati | `GET /api/admin/users` |
| Foydalanuvchi qo‘shish | `POST /api/admin/users` |
| Foydalanuvchi ko‘rish | `GET /api/admin/users/:userId` |
| Foydalanuvchi tahriri | `PATCH /api/admin/users/:userId` |
| Foydalanuvchini bloklash/o‘chirish | `DELETE /api/admin/users/:userId` |
| Kurslar ro‘yxati | `GET /api/admin/courses` |
| Kurs qo‘shish | `POST /api/admin/courses` |
| Kurs tahriri | `PATCH /api/admin/courses/:courseId` |
| Kursni arxivlash | `DELETE /api/admin/courses/:courseId` |
| Guruhlar ro‘yxati | `GET /api/admin/groups` |
| Guruh qo‘shish | `POST /api/admin/groups` |
| Guruh tahriri | `PATCH /api/admin/groups/:groupId` |
| Guruhni yopish | `DELETE /api/admin/groups/:groupId` |
| O‘qituvchi biriktirish | `POST /api/admin/groups/:groupId/teachers` |
| O‘quvchi guruhga qo‘shish | `POST /api/admin/groups/:groupId/students` |
| O‘quvchini guruhdan chiqarish | `DELETE /api/admin/groups/:groupId/students/:studentId` |
| Akademiya sozlamalari | `GET/PATCH /api/admin/settings` |
| Audit log | `GET /api/admin/audit-logs` |

### Super Admin backendda tekshirsin

- Faqat Super Admin boshqa admin yaratishi mumkin.
- Kursni o‘chirishdan oldin unga bog‘langan guruhlar bor-yo‘qligi tekshirilsin.
- Guruh o‘chirilganda o‘quvchi va o‘qituvchi tarixiy ma’lumotlari yo‘qolmasin.
- Haqiqiy o‘chirish o‘rniga `archived` yoki `inactive` status ishlatilgani yaxshi.

## 7. Manager uchun backend

Manager kundalik ishlarni boshqaradi. Managerga Super Adminning barcha huquqlarini bermang.

### Kerakli endpointlar

| Bo‘lim | Endpointlar |
|---|---|
| Dashboard | `GET /api/manager/dashboard` |
| Guruhlarni ko‘rish | `GET /api/manager/groups` |
| Guruh qo‘shish | `POST /api/manager/groups` |
| Guruhni tahrirlash | `PATCH /api/manager/groups/:groupId` |
| O‘quvchilar | `GET /api/manager/students` |
| O‘quvchi qo‘shish | `POST /api/manager/students` |
| O‘quvchi tahriri | `PATCH /api/manager/students/:studentId` |
| Kurslar | `GET /api/manager/courses` |
| O‘qituvchilar | `GET /api/manager/teachers` |
| O‘qituvchini guruhga biriktirish | `POST /api/manager/groups/:groupId/teachers` |
| Jadval | `GET/POST/PATCH /api/manager/schedule` |
| Davomat nazorati | `GET /api/manager/attendance` |
| To‘lovlarni ko‘rish | `GET /api/manager/payments` |
| Hisobotlar | `GET /api/manager/reports` |

Manager boshqa accountlarning rolini o‘zgartira olmasligi va Super Adminni o‘chira olmasligi kerak.

## 8. Teacher uchun backend

Teacher frontend route’lari:

```text
/teacher
/teacher/groups
/teacher/schedule
/teacher/today
/teacher/attendance
/teacher/students
/teacher/assignments
/teacher/grades
/teacher/profile
/teacher/settings
```

### 8.1 Teacher dashboard

Frontend fayli:

```text
src/features/teacher/index.tsx
```

### Kerakli endpoint

```http
GET /api/teacher/dashboard
```

Bu endpoint quyidagilarni qaytarsin:

- Teacherga biriktirilgan guruhlar soni;
- o‘quvchilar soni;
- o‘rtacha baho;
- vazifalar bajarilish foizi;
- yaqin darslar;
- bugungi davomat;
- so‘nggi vazifalar.

### 8.2 Mening guruhlarim

```http
GET /api/teacher/groups
GET /api/teacher/groups/:groupId
GET /api/teacher/groups/:groupId/students
```

Teacher faqat o‘ziga biriktirilgan guruhlarni ko‘rsin. Client `teacherId` yuborsa ham, backend shu qiymatga ishonmasin. Teacher ID session’dan olinsin.

### 8.3 Jadvalim va bugungi darslar

```http
GET /api/teacher/schedule?from=YYYY-MM-DD&to=YYYY-MM-DD
GET /api/teacher/lessons/today
GET /api/teacher/lessons/:lessonId
```

Dars ma’lumotlari:

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

Backend sana va vaqtni bitta timezone bilan qaytarsin. Darsga boshqa Teacher kira olmasin.

### 8.4 Davomat

Frontendda davomat tugmalari vaqtinchalik state bilan ishlaydi. Real saqlash uchun:

```http
GET /api/teacher/lessons/:lessonId/attendance
PUT /api/teacher/lessons/:lessonId/attendance
```

Davomat holatlari:

```text
present — kelgan
absent — kelmagan
late — kechikkan
excused — sababli kelmagan
```

Backend quyidagilarni tekshirsin:

- dars shu Teacherga tegishlimi;
- o‘quvchi shu guruhdami;
- dars sanasi to‘g‘rimi;
- bir o‘quvchi uchun bir darsga ikkinchi davomat yozuvi dublikat bo‘lib qolmayaptimi;
- `markedBy` session’dagi Teacher ID bo‘lsin.

### 8.5 Teacher o‘quvchilari

```http
GET /api/teacher/students?page=1&pageSize=20&search=
GET /api/teacher/students/:studentId
```

Ko‘rsatiladigan ma’lumotlar:

- ism-familiya;
- telefon yoki email;
- guruh nomi;
- davomat foizi;
- o‘rtacha baho;
- active/inactive status.

Teacher o‘quvchining paroli, to‘lov karta ma’lumoti, boshqa maxfiy admin ma’lumotlari yoki boshqa Teacherga tegishli guruhlarini ko‘rmasin.

### 8.6 Teacher vazifalari

Frontendda vazifani qo‘shish, tahrirlash va o‘chirish bor. Real backend:

```http
GET /api/teacher/assignments?groupId=&status=&page=1&pageSize=20
POST /api/teacher/assignments
PATCH /api/teacher/assignments/:assignmentId
DELETE /api/teacher/assignments/:assignmentId
GET /api/teacher/assignments/:assignmentId/submissions
PATCH /api/teacher/submissions/:submissionId
```

Backend quyidagilarni tekshirsin:

- vazifa nomi bo‘sh emasmi;
- nomi kamida 3 va ko‘pi bilan 120 belgimi;
- tanlangan guruh shu Teacherga tegishlimi;
- vazifani aynan shu Teacher tahrirlashyaptimi;
- o‘chirilgan vazifa tarixda qolishi kerakmi;
- `createdBy` client’dan emas, session’dan olinsin.

### 8.7 Teacher baholari

```http
GET /api/teacher/grades?groupId=&studentId=&page=1&pageSize=20
PUT /api/teacher/grades
```

Baho yozuvi:

```ts
type Grade = {
  id: string
  studentId: string
  groupId: string
  assignmentId?: string
  lessonId?: string
  score: number
  maxScore: number
  comment?: string
  gradedAt: string
  gradedBy: string
}
```

Backend `score` qiymatini tekshirsin:

```text
0 <= score <= maxScore
```

Bahoni o‘zgartirish tarixi saqlansa yaxshi bo‘ladi. Kim eski bahoni o‘zgartirgani audit logga yozilsin.

### 8.8 Teacher profili va sozlamalari

```http
GET /api/teacher/me
PATCH /api/teacher/me
GET /api/teacher/preferences
PATCH /api/teacher/preferences
PATCH /api/teacher/me/password
```

Profilga ism, familiya, telefon, avatar va email kiradi. Emailni o‘zgartirishda qayta tasdiqlash talab qilinishi kerak.

Sozlamalarga quyidagilar kiradi:

- til: `uz` yoki `en`;
- timezone;
- email notification;
- dars eslatmalari;
- parol xavfsizligi.

## 9. Finance uchun backend

Finance frontend route’lari:

```text
/finance
/finance/payments
/finance/debts
/finance/students
/finance/reports
/finance/tasks
/finance/settings
```

### 9.1 Finance dashboard

```http
GET /api/finance/dashboard
```

Dashboard quyidagilarni backenddan olishi kerak:

- jami tushum;
- bugungi tushum;
- shu oy tushumi;
- kutilayotgan to‘lovlar;
- jami qarzdorlik;
- qaytarilgan to‘lovlar;
- oxirgi 30 kun, 6 oy yoki 1 yil tushum grafigi;
- naqd, karta, Click, Payme va bank o‘tkazmasi ulushi;
- jami qarzdorlar;
- 1–7 kun kechikkanlar;
- 8–30 kun kechikkanlar;
- 30 kundan ortiq kechikkanlar;
- kurs bo‘yicha o‘quvchi, tushum va qarzdorlik.

Frontendda bu raqamlar demo bo‘lishi mumkin. Haqiqiy raqamlarni backend hisoblasin.

### 9.2 To‘lovlar

```http
GET /api/finance/payments?page=1&pageSize=20&search=
GET /api/finance/payments/:paymentId
POST /api/finance/payments
PATCH /api/finance/payments/:paymentId
DELETE /api/finance/payments/:paymentId
POST /api/finance/payments/:paymentId/refund
```

To‘lov qo‘shishda quyidagilar kerak:

- o‘quvchining ismi;
- o‘quvchining familiyasi;
- o‘quvchi ID’si;
- guruh ID’si;
- guruh nomi backenddan tekshiriladigan ma’lumot;
- summa;
- to‘lov usuli;
- to‘lov sanasi;
- izoh.

To‘lov usullari:

```text
cash — naqd
card — karta
click — Click
payme — Payme
bank_transfer — bank o‘tkazmasi
```

To‘lov backendda saqlanganda:

- o‘quvchi mavjudmi tekshirilsin;
- guruh mavjudmi tekshirilsin;
- o‘quvchi shu guruhga tegishlimi tekshirilsin;
- summa 0 dan katta bo‘lsin;
- pul birligi aniqlangan bo‘lsin;
- takroriy request dublikat to‘lov yaratmasin;
- to‘lovni kim qo‘shgani session’dan olinsin;
- to‘lovni o‘chirish o‘rniga refund yoki void status ishlatilgani yaxshi.

### 9.3 Qarzdorlik

```http
GET /api/finance/debts?page=1&pageSize=20&search=
GET /api/finance/debts/:studentId
POST /api/finance/debts/:studentId/settle
```

Qarzdorlar ro‘yxatida quyidagilar ko‘rinsin:

- ism-familiya;
- guruh nomi;
- qarz summasi;
- kechikkan kunlar;
- oxirgi to‘lov sanasi;
- qarz statusi.

`To‘landi` tugmasi bosilganda frontend faqat toast ko‘rsatmasligi kerak. Backend qarz yopilganini saqlashi kerak. Endpoint serverda qarz summasini tekshirsin va to‘lov tarixini yaratib qo‘ysin.

### 9.4 Finance o‘quvchilari

```http
GET /api/finance/students?page=1&pageSize=20&search=
GET /api/finance/students/:studentId/payments
GET /api/finance/students/:studentId/debts
```

Finance o‘quvchi sahifasida ism, familiya, guruh, jami to‘lov, qarzdorlik va to‘lov tarixini ko‘rishi mumkin. Parol yoki auth token ko‘rsatilmasin.

### 9.5 Finance hisobotlari

```http
GET /api/finance/reports?type=monthly&from=&to=
GET /api/finance/reports?type=debt&from=&to=
GET /api/finance/reports?type=students&from=&to=
GET /api/finance/reports/:reportId/download
```

Hisobot turlari:

- oylik tushum hisoboti;
- qarzdorlik hisoboti;
- o‘quvchi to‘lov hisoboti;
- kurs bo‘yicha tushum;
- to‘lov usuli bo‘yicha statistika;
- qaytarilgan to‘lovlar.

Hozir frontendda CSV faylni browser ichida yaratish mumkin. Bu demo uchun yetarli. Real tizimda hisobotni backend yaratishi kerak, chunki frontend barcha ma’lumotni ko‘rmasligi yoki o‘zgartirib yuborishi mumkin.

### 9.6 Finance sozlamalari

```http
GET /api/finance/preferences
PATCH /api/finance/preferences
PATCH /api/finance/me/password
```

Finance sozlamalarida til, timezone, bildirishnoma, xavfsizlik va ko‘rinish sozlamalari saqlanadi.

### 9.7 Finance vazifalari

Finance sidebaridagi vazifalar umumiy Tasks modulidan foydalansa:

```http
GET /api/tasks?owner=finance
POST /api/tasks
PATCH /api/tasks/:taskId
DELETE /api/tasks/:taskId
```

Agar vazifalar faqat foydalanuvchining brauzerida saqlansa, hozirgi demo usulda localStorage ishlatiladi. Jamoaviy ishlash, boshqa qurilmadan ko‘rish yoki vazifani serverda saqlash kerak bo‘lsa, albatta backend kerak.

## 10. Umumiy o‘quvchi backend modeli

Teacher, Manager va Finance bir xil Student ma’lumotlaridan turli qismini ko‘radi.

```ts
type Student = {
  id: string
  firstName: string
  lastName: string
  phone?: string
  email?: string
  status: 'active' | 'inactive'
  groupIds: string[]
  createdAt: string
  updatedAt: string
}
```

Backend role bo‘yicha ma’lumotni ajratsin:

- Teacher: guruh, davomat va bahoga oid ma’lumot.
- Manager: akademiya operatsiyasiga oid ma’lumot.
- Finance: to‘lov va qarzdorlikka oid ma’lumot.
- Super Admin: kengroq administrativ ma’lumot.

## 11. Courses va umumiy Tasks uchun backend

Frontendda quyidagi joylarda localStorage ishlatilishi mumkin:

```text
src/features/courses/data.ts
src/features/tasks/components/tasks-provider.tsx
```

### Kurslar

```http
GET /api/courses
POST /api/courses
GET /api/courses/:courseId
PATCH /api/courses/:courseId
DELETE /api/courses/:courseId
```

### Vazifalar

```http
GET /api/tasks
POST /api/tasks
GET /api/tasks/:taskId
PATCH /api/tasks/:taskId
DELETE /api/tasks/:taskId
```

Backend kerak bo‘ladi, agar:

- ma’lumot barcha foydalanuvchilarga umumiy bo‘lsa;
- foydalanuvchi boshqa qurilmadan kirsa ham ma’lumot ko‘rinsin desa;
- vazifalar yoki kurslar ruxsat bilan boshqarilsa;
- ma’lumot yo‘qolmasligi kerak bo‘lsa;
- o‘quvchi yoki teacher ma’lumotlari kursga bog‘lansa.

## 12. Bildirishnomalar uchun backend

Teacher darsi, yangi vazifa, to‘lov, qarzdorlik yoki tizim xabarlari uchun:

```http
GET /api/notifications
PATCH /api/notifications/:notificationId/read
POST /api/notifications/read-all
GET/PATCH /api/notification-preferences
```

Email yoki Telegram xabarlari kerak bo‘lsa, backend tashqi xizmat bilan bog‘lanadi. API kalitlarini frontendga yozmang.

## 13. Fayl va avatar yuklash uchun backend

Profil rasmi, vazifa fayli yoki hisobot yuklash kerak bo‘lsa:

```http
POST /api/files/upload
DELETE /api/files/:fileId
GET /api/files/:fileId/download
```

Backend:

- fayl hajmini tekshiradi;
- fayl turini tekshiradi;
- xavfli fayllarni rad etadi;
- faylni private storage’da saqlaydi;
- vaqtinchalik download URL beradi;
- foydalanuvchi bu faylga ruxsatlimi tekshiradi.

## 14. Har bir endpointda bo‘lishi kerak bo‘lgan tekshiruvlar

Har bir backend request’da quyidagi tartib bo‘lsin:

1. User login qilganmi?
2. User account faolmi?
3. Userning roli mosmi?
4. Userda shu permission bormi?
5. So‘ralayotgan ma’lumot mavjudmi?
6. Ma’lumot shu academy yoki guruhga tegishlimi?
7. Request body validmi?
8. Amalni bajarishga ownership bormi?
9. Amal audit logga yoziladimi?
10. Javobda maxfiy ma’lumot chiqib ketmayaptimi?

## 15. Frontend va backend o‘rtasidagi javoblar

Muvaffaqiyatli javob misoli:

```json
{
  "data": {
    "id": "pay_123",
    "status": "paid"
  }
}
```

Xato javob misoli:

```json
{
  "error": {
    "code": "PAYMENT_NOT_FOUND",
    "message": "To‘lov topilmadi"
  }
}
```

Frontend quyidagi holatlarda toast ko‘rsatadi:

| Status | Ma’nosi |
|---|---|
| `200` yoki `201` | Muvaffaqiyat |
| `400` | Ma’lumot noto‘g‘ri |
| `401` | Login kerak yoki sessiya tugagan |
| `403` | Ruxsat yo‘q |
| `404` | Ma’lumot topilmadi |
| `409` | Takroriy yoki ziddiyatli amal |
| `422` | Validatsiya xatosi |
| `500` | Server xatosi |

## 16. Nimalarga backend shart emas?

Quyidagi ishlar faqat foydalanuvchi qurilmasidagi UI holati bo‘lsa, backend shart emas:

- sidebar ochilishi va yopilishi;
- dark/light ko‘rinishni vaqtincha almashtirish;
- modal ochilishi va yopilishi;
- password ko‘rsatish yoki yashirish;
- input ichidagi frontend validatsiya;
- toast chiqishi;
- login sahifasidagi dekorativ to‘rtburchaklar;
- til dropdown’ining vaqtinchalik ishlashi;
- hisobotni demo ma’lumotdan browserda ko‘rsatish.

Lekin bu holatlar database’da saqlanishi, boshqa qurilmada ko‘rinishi yoki jamoaga umumiy bo‘lishi kerak bo‘lsa, backend kerak bo‘ladi.

## 17. Backend yozish tartibi

Sherigingiz quyidagi tartibda ishlasa, ish ancha tushunarli bo‘ladi:

### 1-bosqich: Database

Quyidagi jadvallarni yarating:

```text
users
roles
permissions
user_permissions yoki role_permissions
courses
groups
group_teachers
group_students
lessons
attendance
assignments
submissions
grades
payments
debts
refunds
notifications
user_preferences
audit_logs
files
```

### 2-bosqich: Auth

Login, logout, register, current user, password reset va cookie session’ni yozing.

### 3-bosqich: Admin va Manager

Users, courses, groups, teachers, students va schedule CRUD qismlarini yozing.

### 4-bosqich: Teacher

Dashboard, groups, schedule, attendance, students, assignments, grades, profile va settings qismlarini yozing.

### 5-bosqich: Finance

Dashboard, payments, debts, students, reports, tasks va settings qismlarini yozing.

### 6-bosqich: Xavfsizlik

Role guard, ownership guard, validation, audit log, rate limit va idempotency qo‘shing.

### 7-bosqich: Frontend ulash

Frontenddagi mock state, localStorage va `mock-access-token`ni olib tashlab, API query va mutation’lar bilan almashtiring.

## 18. Backend tayyor bo‘lgandan keyin tekshirish

Backend tayyor bo‘lgach quyidagi holatlarni sinab ko‘ring:

- Noto‘g‘ri parol bilan login.
- Teacher boshqa Teacher guruhini ochishga urinish.
- Finance mavjud bo‘lmagan to‘lovni tahrirlashga urinish.
- Bir xil paymentni ikki marta yuborish.
- 0 yoki manfiy summa yuborish.
- 100 dan katta baho yuborish.
- Boshqa user ID’si bilan profilni o‘zgartirishga urinish.
- Logoutdan keyin protected route’ga kirish.
- Bloklangan user bilan login qilish.
- Manager Super Adminni o‘chirishga urinish.
- O‘quvchini boshqa akademiya guruhiga qo‘shishga urinish.
- Hisobotni ruxsatsiz yuklab olish.
- Teacher boshqa o‘quvchining moliyaviy ma’lumotini ko‘rishga urinish.

## 19. Qisqa xulosa

Backend quyidagi katta qismlarga majburiy kerak:

1. Login, register, logout va parol.
2. Rollar va permissionlar.
3. Super Admin foydalanuvchi, kurs, guruh va academy boshqaruvi.
4. Manager kundalik boshqaruvi.
5. Teacher guruhlari, jadvali, darslari, davomat, o‘quvchilari, vazifalari va baholari.
6. Finance to‘lovlari, qarzdorligi, o‘quvchilari va hisobotlari.
7. Profil va sozlamalarni serverda saqlash.
8. Kurslar va umumiy vazifalarni serverda saqlash.
9. Bildirishnomalar.
10. Fayl va avatar yuklash.
11. Audit log, xavfsizlik va hisobotlarni himoyalash.

Frontendda ishlayotgan tugma yoki toast hali ma’lumot serverga saqlandi degani emas. Real saqlash, xavfsizlik va bir nechta foydalanuvchi bilan ishlash uchun backend javobi kerak.

## References

[1]: https://owasp.org/www-project-application-security-verification-standard/ "OWASP Application Security Verification Standard"

[2]: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html "OWASP Password Storage Cheat Sheet"

[3]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies "MDN HTTP cookies"
