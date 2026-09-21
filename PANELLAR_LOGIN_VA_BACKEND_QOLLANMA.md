# Sfera IT Academy CRM — panellar, loginlar va backend qo‘llanmasi

## 1. Qo‘llanmaning maqsadi

Ushbu hujjat loyihadagi barcha panellar uchun frontendda mavjud demo kirish ma’lumotlarini, har bir rolning vazifasini, hozirgi frontend holatini va real backend qayerda kerak bo‘lishini ko‘rsatadi. Hozirgi login mexanizmi demo rejimda ishlaydi. Demo rejimda ma’lumotlar frontend kodida yoki vaqtinchalik local state’da turadi. Ishlab chiqarish muhitida foydalanuvchi, parol, ruxsatlar va biznes ma’lumotlari backend orqali boshqarilishi shart.

> **Muhim xavfsizlik eslatmasi:** Quyidagi parollar faqat ushbu lokal/demo frontend uchun berilgan. Ularni haqiqiy serverda, ochiq Git repository’da yoki production muhitida ishlatmang. Backend yozilganda bu demo loginlar olib tashlanishi va barcha parollar hash ko‘rinishida saqlanishi kerak.

## 2. Loyiha panellari va rollari

| Rol | Panel manzili | Asosiy vazifasi | Hozirgi holati |
|---|---|---|---|
| **Super Admin** | `/` | Akademiya, foydalanuvchilar, kurslar, guruhlar, o‘qituvchilar va CRM sozlamalarini boshqarish | Frontend demo va role-based yo‘naltirish mavjud |
| **Manager** | `/` | Kundalik akademiya boshqaruvi, guruhlar, o‘quvchilar, jadval va operatsion nazorat | Frontend demo va role-based yo‘naltirish mavjud |
| **Teacher** | `/teacher` | Guruhlar, jadval, darslar, davomat, o‘quvchilar, vazifalar va baholar | Frontend demo ma’lumotlari bilan ishlaydi |
| **Finance** | `/finance` | To‘lovlar, qarzdorlik, o‘quvchilar moliyaviy holati va hisobotlar | Frontend demo ma’lumotlari bilan ishlaydi |

Super Admin va Manager uchun login muvaffaqiyatli bo‘lganda frontend odatda asosiy `/` dashboard manziliga yo‘naltiradi. Teacher `/teacher`, Finance esa `/finance` manziliga yo‘naltiriladi.

## 3. Demo Gmail va parollar

Demo credentiallar quyidagi faylda joylashgan:

```text
src/features/auth/sign-in/components/user-auth-form.tsx
```

| Rol | Demo Gmail | Demo parol | Frontenddagi ism | Hisob turi |
|---|---|---|---|---|
| Super Admin | `admin@gmail.com` | `SferaAdmin@2026` | Super Admin | Demo |
| Manager | `manager@gmail.com` | `SferaManager@2026` | Manager | Demo |
| Teacher | `teacher@gmail.com` | `SferaTeacher@2026` | O‘qituvchi | Demo |
| Finance | `finance@gmail.com` | `SferaFinance@2026` | Moliya xodimi | Demo |

Agar loyiha `.env` faylidan quyidagi o‘zgaruvchilarni topsa, ular fallback qiymatlarni almashtiradi:

```env
VITE_ADMIN_EMAIL=
VITE_ADMIN_PASSWORD=
VITE_ADMIN_NAME=
VITE_MANAGER_EMAIL=
VITE_MANAGER_PASSWORD=
VITE_MANAGER_NAME=
VITE_TEACHER_EMAIL=
VITE_TEACHER_PASSWORD=
VITE_TEACHER_NAME=
VITE_FINANCE_EMAIL=
VITE_FINANCE_PASSWORD=
VITE_FINANCE_NAME=
```

`VITE_*` o‘zgaruvchilari frontend build tarkibiga kirib qolishi mumkin. Shuning uchun ular **maxfiy credential saqlash uchun yaroqsiz**. Real parol va secret qiymatlarni faqat backend environment variable’larida saqlang.

## 4. Hozirgi demo login qanday ishlaydi

Hozirgi frontend login kiritilgan Gmail va parolni lokal demo accountlar ro‘yxati bilan solishtiradi. Mos kelgan account uchun frontend user obyektini yaratadi, `mock-access-token` qiymatini auth store’ga yozadi va rolga qarab dashboardga yo‘naltiradi.

Tegishli kod joylari:

| Fayl | Vazifasi |
|---|---|
| `src/features/auth/sign-in/components/user-auth-form.tsx` | Demo accountlar, login tekshiruvi va role redirect |
| `src/stores/auth-store.ts` | Frontend user va access token holati |
| `src/lib/rbac.ts` | Frontend permission va rol ro‘yxati |
| `src/lib/route-guard.ts` | Authenticated route tekshiruvi |
| `src/routes/_authenticated/index.tsx` | Rolga qarab asosiy dashboardga yo‘naltirish |

Real tizimda `mock-access-token` ishlatilmasin. Uning o‘rniga server session yoki `HttpOnly; Secure; SameSite` cookie ishlating.

## 5. Umumiy backend autentifikatsiyasi

Barcha rollar uchun bitta umumiy autentifikatsiya qatlami bo‘lishi kerak. Tavsiya etiladigan endpointlar quyidagilar:

| Amal | Endpoint | Backend vazifasi |
|---|---|---|
| Kirish | `POST /api/auth/login` | Gmail va parolni tekshiradi, session yaratadi |
| Joriy foydalanuvchi | `GET /api/auth/me` | Foydalanuvchi, rol va permissionlarni qaytaradi |
| Chiqish | `POST /api/auth/logout` | Session yoki refresh tokenni bekor qiladi |
| Parolni unutish | `POST /api/auth/forgot-password` | Bir martalik tiklash havolasini yuboradi |
| Parolni tiklash | `POST /api/auth/reset-password` | Token orqali yangi parol o‘rnatadi |
| Parolni almashtirish | `PATCH /api/auth/password` | Joriy parolni tekshirib yangi parol saqlaydi |
| Emailni tasdiqlash | `POST /api/auth/verify-email` | Tasdiqlash tokenini tekshiradi |

Minimal joriy foydalanuvchi javobi:

```ts
type CurrentUser = {
  id: string
  accountNo: string
  name: string
  email: string
  phone?: string
  avatarUrl?: string
  role: 'Super Admin' | 'Manager' | 'Teacher' | 'Finance'
  permissions: string[]
}
```

Backend `role` qiymatini client yuborgan ma’lumotdan qabul qilmasin. Rol ma’lumotlar bazasidan va authenticated session’dan olinsin.

## 6. Super Admin backend talablari

Super Admin butun akademiya ma’lumotlariga kengroq kirish huquqiga ega bo‘ladi. Frontendda asosiy dashboard, foydalanuvchilar, kurslar, guruhlar, o‘qituvchilar va sozlamalar mavjud.

| Modul | Tavsiya etiladigan endpointlar | Backendda bajariladigan ish |
|---|---|---|
| Dashboard | `GET /api/admin/dashboard` | KPI, kurslar, guruhlar, o‘quvchilar va tushum statistikasi |
| Foydalanuvchilar | `GET/POST /api/admin/users` | Foydalanuvchi ro‘yxati va yaratish |
| Foydalanuvchi | `GET/PATCH/DELETE /api/admin/users/:userId` | Profil, rol, status va bloklash |
| Kurslar | `GET/POST /api/admin/courses` | Kurslarni ko‘rish va yaratish |
| Kurs tahriri | `PATCH/DELETE /api/admin/courses/:courseId` | Kursni o‘zgartirish yoki arxivlash |
| Guruhlar | `GET/POST /api/admin/groups` | Guruh yaratish va ro‘yxatini ko‘rish |
| Guruh tahriri | `PATCH/DELETE /api/admin/groups/:groupId` | Guruh, xona, jadval va statusni boshqarish |
| O‘qituvchi biriktirish | `POST /api/admin/groups/:groupId/teachers` | Guruhga o‘qituvchi biriktirish |
| O‘quvchi biriktirish | `POST /api/admin/groups/:groupId/students` | O‘quvchini guruhga qo‘shish yoki chiqarish |
| Akademiya sozlamalari | `GET/PATCH /api/admin/settings` | Til, timezone, bildirishnoma va CRM sozlamalari |
| Audit | `GET /api/admin/audit-logs` | Muhim amallarni kim va qachon bajarganini ko‘rsatish |

Super Admin uchun backend permission misollari:

```text
admin.workspace
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
teachers.read
teachers.create
teachers.update
finance.read
reports.read
settings.manage_academy
settings.manage_crm
```

## 7. Manager backend talablari

Manager kundalik operatsion boshqaruvni bajaradi. Managerga Super Adminga tegishli xavfli amallar, masalan, boshqa admin yaratish yoki tizim ownership’ini o‘zgartirish, berilmasligi kerak.

| Modul | Tavsiya etiladigan endpointlar | Ruxsat namunasi |
|---|---|---|
| Dashboard | `GET /api/manager/dashboard` | `dashboard.read` |
| Guruhlar | `GET/POST/PATCH /api/manager/groups` | `groups.read`, `groups.create`, `groups.update` |
| O‘quvchilar | `GET/POST/PATCH /api/manager/students` | `students.read`, `students.create`, `students.update` |
| Kurslar | `GET /api/manager/courses` | `courses.read` |
| Jadval | `GET/POST/PATCH /api/manager/schedule` | `groups.manage_schedule` |
| O‘qituvchilar | `GET /api/manager/teachers` | `teachers.read`, `teachers.assign_group` |
| Davomat nazorati | `GET /api/manager/attendance` | `attendance.read` |
| To‘lovlar | `GET /api/manager/payments` | `finance.read` |
| Hisobotlar | `GET /api/manager/reports` | `reports.read` |

Manager uchun backend har bir guruh, o‘quvchi yoki o‘qituvchi ID’sining akademiya doirasida mavjudligini tekshirishi kerak. Client yuborgan ID’ga ko‘r-ko‘rona ishonmang.

## 8. Teacher paneli

Teacher sidebar bo‘limlari quyidagicha:

```text
TEACHER
├── Ta’lim
│   ├── Boshqaruv paneli
│   ├── Mening guruhlarim
│   ├── Jadvalim
│   ├── Bugungi darslar
│   ├── Davomat
│   ├── O‘quvchilar
│   ├── Vazifalar
│   └── Baholar
└── Tizim
    ├── Profilim
    └── Sozlamalar
```

### 8.1 Teacher endpointlari

| Bo‘lim | Endpoint | Izoh |
|---|---|---|
| Dashboard | `GET /api/teacher/dashboard` | Guruhlar, o‘quvchilar, o‘rtacha baho va vazifalar statistikasi |
| Guruhlar | `GET /api/teacher/groups` | Faqat shu Teacherga biriktirilgan guruhlar |
| Guruh tafsiloti | `GET /api/teacher/groups/:groupId` | Guruh, kurs, xona va jadval |
| Guruh o‘quvchilari | `GET /api/teacher/groups/:groupId/students` | Shu guruhdagi o‘quvchilar |
| Jadval | `GET /api/teacher/schedule?from=&to=` | Sana oralig‘idagi jadval |
| Bugungi darslar | `GET /api/teacher/lessons/today` | Bugungi darslar |
| Dars tafsiloti | `GET /api/teacher/lessons/:lessonId` | Dars va guruh ma’lumoti |
| Davomatni ko‘rish | `GET /api/teacher/lessons/:lessonId/attendance` | Davomat yozuvlari |
| Davomatni saqlash | `PUT /api/teacher/lessons/:lessonId/attendance` | Present, absent, late yoki excused qiymatlari |
| O‘quvchilar | `GET /api/teacher/students?page=&pageSize=&search=` | Pagination va server-side qidiruv |
| O‘quvchi tafsiloti | `GET /api/teacher/students/:studentId` | Teacher ko‘rishi mumkin bo‘lgan profil |
| Vazifalar | `GET /api/teacher/assignments` | Guruh va status bo‘yicha filter |
| Vazifa yaratish | `POST /api/teacher/assignments` | Yangi vazifa yaratish |
| Vazifa tahriri | `PATCH /api/teacher/assignments/:assignmentId` | Vazifani o‘zgartirish |
| Vazifa o‘chirish | `DELETE /api/teacher/assignments/:assignmentId` | Vazifani o‘chirish yoki arxivlash |
| Topshiriqlar | `GET /api/teacher/assignments/:assignmentId/submissions` | O‘quvchi topshiriqlari |
| Baholar | `GET /api/teacher/grades` | Guruh yoki o‘quvchi bo‘yicha baholar |
| Baho saqlash | `PUT /api/teacher/grades` | Score va izohni saqlash |
| Profil | `GET/PATCH /api/teacher/me` | Teacher profilini ko‘rish va tahrirlash |
| Sozlamalar | `GET/PATCH /api/teacher/preferences` | Til, timezone va bildirishnomalar |

Teacher backend’da quyidagi tekshiruvlar majburiy:

1. Teacher faqat o‘ziga biriktirilgan guruhni ko‘rsin.
2. Teacher boshqa o‘qituvchining darsiga davomat kirita olmasin.
3. O‘quvchi shu guruhga tegishli ekanligi tekshirilsin.
4. `teacherId`, `createdBy` va `markedBy` client’dan olinmasin.
5. Baho `0 <= score <= maxScore` sharti bilan tekshirilsin.
6. Vazifa tahriri va o‘chirilishi faqat vazifani yaratgan yoki guruhga biriktirilgan Teacherga ruxsat etilsin.

## 9. Finance paneli

Finance sidebar bo‘limlari quyidagicha:

```text
FINANCE
├── Moliya
│   ├── Moliya paneli
│   ├── To‘lovlar
│   ├── Qarzdorlik
│   ├── O‘quvchilar
│   └── Hisobotlar
└── Tizim
    ├── Vazifalar
    └── Sozlamalar
```

### 9.1 Finance endpointlari

| Bo‘lim | Endpoint | Izoh |
|---|---|---|
| Moliya dashboardi | `GET /api/finance/dashboard` | Tushum, qarzdorlik, to‘lov usullari va kurslar statistikasi |
| To‘lovlar | `GET /api/finance/payments?page=&pageSize=&search=` | To‘lovlar ro‘yxati |
| To‘lov qo‘shish | `POST /api/finance/payments` | Ism, familiya, o‘quvchi, guruh, summa, sana va usul |
| To‘lov tahriri | `PATCH /api/finance/payments/:paymentId` | Mavjud to‘lovni o‘zgartirish |
| To‘lov o‘chirish | `DELETE /api/finance/payments/:paymentId` | Faqat kuchli ruxsat bilan; yaxshisi void yoki refund statusi |
| To‘lovni qaytarish | `POST /api/finance/payments/:paymentId/refund` | Qaytarilgan to‘lovni audit bilan saqlash |
| Qarzdorlik | `GET /api/finance/debts?page=&pageSize=&search=` | Barcha qarzdorlar, summa, kun va guruh nomi |
| Qarzni yopish | `POST /api/finance/debts/:studentId/settle` | Qarzdorlik to‘langanini serverda tasdiqlash |
| Finance o‘quvchilari | `GET /api/finance/students` | O‘quvchi, guruh, to‘lov va qarzdorlik holati |
| Hisobot | `GET /api/finance/reports?type=monthly` | Oylik tushum hisoboti |
| Qarzdorlik hisoboti | `GET /api/finance/reports?type=debt` | Qarzdorlik hisoboti |
| O‘quvchi to‘lov hisoboti | `GET /api/finance/reports?type=students` | O‘quvchilar to‘lov hisoboti |
| Hisobot yuklash | `GET /api/finance/reports/:reportId/download` | Server yaratgan CSV yoki PDF fayl |
| Sozlamalar | `GET/PATCH /api/finance/preferences` | Finance xodimi tili, timezone va bildirishnomalari |

To‘lov qo‘shish request namunasi:

```ts
type CreatePaymentRequest = {
  studentId: string
  firstName: string
  lastName: string
  groupId: string
  amount: number
  method: 'cash' | 'card' | 'click' | 'payme' | 'bank_transfer'
  paidAt: string
  note?: string
}
```

Finance backend quyidagilarni tekshirishi kerak:

1. O‘quvchi va guruh mavjudligini tekshirish.
2. O‘quvchi shu guruhga tegishli ekanligini tekshirish.
3. Summa musbat va currency qoidalariga mos ekanligini tekshirish.
4. Bir xil payment request takroran yuborilsa, idempotency key orqali dublikat yaratmaslik.
5. To‘lov, refund va qarz yopilishi audit logga yozilishi.
6. Finance xodimi parol, security token yoki admin ma’lumotlarini ko‘rmasligi.
7. Hisobotlar serverda hisoblanishi; frontenddagi vaqtinchalik CSV faqat demo rejimda ishlatilishi.

## 10. Frontendda backend bilan almashtiriladigan joylar

| Fayl | Hozirgi frontend holati | Backend ulanganda nima qilinadi |
|---|---|---|
| `src/features/auth/sign-in/components/user-auth-form.tsx` | Demo email va parol massivida tekshiradi | `POST /api/auth/login` ga almashtiriladi |
| `src/stores/auth-store.ts` | Mock user va tokenni saqlaydi | Server session yoki xavfsiz cookie ishlatiladi |
| `src/features/teacher/index.tsx` | Guruh, o‘quvchi, davomat, vazifa va baholar mock | Query va mutation hook’lari ulanadi |
| `src/features/finance/index.tsx` | To‘lov, qarzdorlik va statistika demo state’da | Finance API query va mutation’lari ulanadi |
| `src/features/tasks/components/tasks-provider.tsx` | Vazifalarni localStorage’da saqlaydi | `GET/POST/PATCH/DELETE /api/tasks` ishlatiladi |
| `src/features/courses/data.ts` | Kurslarni localStorage’da saqlashi mumkin | Kurs API va server database ishlatiladi |
| `src/features/settings` | Sozlamalar UI state’da ishlaydi | Preferences API ga ulanadi |
| Teacher va Finance route’lari | Umumiy page renderer ishlatiladi | Har bir page’ga real query, loading, empty va error state qo‘shiladi |

## 11. LocalStorage va xavfsizlik

Quyidagi ma’lumotlarni localStorage’ga yozmang:

- parol;
- access token;
- refresh token;
- role yoki permissionni belgilovchi asosiy qiymatlar;
- to‘lov karta ma’lumotlari;
- moliyaviy maxfiy ma’lumotlar;
- o‘quvchining ortiqcha shaxsiy ma’lumotlari.

LocalStorage faqat vaqtinchalik UI cache, filter, til yoki ko‘rinish sozlamalari uchun ishlatilishi mumkin. Real auth uchun server-side session yoki `HttpOnly`, `Secure`, `SameSite` cookie ishlating.

## 12. Toast va xatolar siyosati

Frontend toast ko‘rsatishi mumkin, lekin muvaffaqiyatli toast server muvaffaqiyatli javob bergandan keyin chiqishi kerak.

| HTTP holati | Frontend xabari |
|---|---|
| `2xx` | Amal muvaffaqiyatli bajarildi |
| `400` | Kiritilgan ma’lumotni tekshiring |
| `401` | Sessiya tugagan, qayta kiring |
| `403` | Bu amal uchun ruxsatingiz yo‘q |
| `404` | So‘ralgan ma’lumot topilmadi |
| `409` | Ma’lumot avval mavjud yoki takroriy amal bajarildi |
| `422` | Kiritilgan ma’lumot formatga mos emas |
| `5xx` | Serverda xatolik yuz berdi, ma’lumot saqlanmadi |

Tavsiya etiladigan yagona xato format:

```ts
type ApiError = {
  code: string
  message: string
  details?: Record<string, unknown>
}
```

## 13. Backend yozish tartibi

Backendni quyidagi ketma-ketlikda yozish eng xavfsiz yo‘l hisoblanadi:

1. Foydalanuvchi, rol, permission va session jadvallarini yarating.
2. `POST /api/auth/login`, `GET /api/auth/me` va `POST /api/auth/logout` endpointlarini yozing.
3. Super Admin va Manager uchun asosiy user, course, group va student CRUD qismlarini ulang.
4. Teacher uchun dashboard, groups, schedule, attendance, students, assignments va grades endpointlarini ulang.
5. Finance uchun payments, debts, students, reports va preferences endpointlarini ulang.
6. Har bir endpointga server-side role va ownership guard qo‘ying.
7. Frontenddagi mock state’larni API query va mutation’lar bilan almashtiring.
8. Loading, empty, validation, error va success holatlarini tekshiring.
9. Audit log va idempotency himoyasini qo‘shing.
10. Demo credentiallar, `mock-access-token` va frontenddagi fallback parollarni olib tashlang.

## 14. Ishga tushirishdan oldingi yakuniy tekshiruv

| Tekshiruv | Kutiladigan natija |
|---|---|
| Noto‘g‘ri parol | Backend `401` qaytaradi va tushunarli toast chiqadi |
| Teacher boshqa guruhga murojaati | Backend `403` qaytaradi |
| Finance mavjud bo‘lmagan paymentni tahrirlashi | `404` yoki tushunarli `409` qaytadi |
| Bir paymentni ikki marta yuborish | Dublikat yozuv yaratilmaydi |
| Baho 100 dan katta bo‘lishi | Frontend va backend rad etadi |
| O‘chirilgan vazifani qayta ochish | Backend ruxsatni tekshiradi |
| Logout | Session bekor bo‘ladi va protected route yopiladi |
| Til almashtirish | Uzbek tilida Uzbekcha, English tilida English matnlar chiqadi |
| Desktop login | O‘ng panel scrollsiz ko‘rinadi |
| Mobil login | Kontent kerak bo‘lsa scroll qilinadi |

## 15. Xulosa

Hozirgi frontend demo rejimida barcha rollarga kirish uchun yuqoridagi demo Gmail va parollar mavjud. Teacher va Finance panellari UI, role redirect, tarjima, toast, validatsiya va demo interaksiyalar bilan ishlaydi. Lekin ma’lumotlarni haqiqiy saqlash, foydalanuvchini himoyalash, permissionni serverda tekshirish, hisobotlarni ishonchli hisoblash va parollarni xavfsiz saqlash uchun backend majburiy hisoblanadi.

Backend yozilganda eng avvalo autentifikatsiya va session qatlamini, keyin role guard’larni, undan keyin Teacher va Finance biznes endpointlarini ulang. Frontenddagi toast faqat server javobidan keyin success holatida ko‘rsatilsin.

## References

[1]: https://owasp.org/www-project-application-security-verification-standard/ "OWASP Application Security Verification Standard"

[2]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies "MDN HTTP cookies"

[3]: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html "OWASP Password Storage Cheat Sheet"
