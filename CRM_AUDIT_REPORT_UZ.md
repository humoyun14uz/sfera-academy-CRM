# Education CRM — Rollar bo‘yicha audit hisoboti

## Umumiy xulosa

Loyiha **build va lint jihatidan ishlaydi**, ammo hozirgi holatda u production CRM emas, balki frontend demo/prototipga yaqin. Eng katta muammo ma’lumotlar, autentifikatsiya va permissionlarning brauzer/localStorage ichida qolayotganidir. Shu sababli refresh, boshqa qurilma yoki boshqa foydalanuvchi bilan ma’lumotlar yo‘qoladi yoki aralashib ketadi. Finance va Student payment oqimlarida esa haqiqiy server/gateway bo‘lmasa ham to‘lov muvaffaqiyatli bo‘lgandek ko‘rsatiladi.

## Shu iteratsiyada tuzatilgan muammolar

| Tuzatish | Natija |
|---|---|
| Academy Reports permission mapping | Sidebardagi `reports.read` va route guard endi bir xil ishlaydi; Manager ko‘rinadigan Reports havolasini bosganda noto‘g‘ri 403 olmaydi. |
| Teacher CSV export lint xatolari | Keraksiz escape belgilar olib tashlandi. |
| Academy CSV export lint xatolari | Keraksiz escape belgilar olib tashlandi. |
| Buzilgan cookie sabab startup crash | Cookie qiymatlari encode/decode qilinadi va JSON parse xatosida auth cookie’lar tozalanadi. |
| Noma’lum role xavfi | Noma’lum role endi avtomatik Student permissionlariga ega bo‘lmaydi; permission tekshiruvida deny-by-default ishlaydi. |
| Vite dev server | `localhost:5173` uchun host, port va strictPort aniq sozlangan. |
| Student delete/add oqimi | O‘chirish brauzer alerti o‘rniga ichki modalga o‘tkazilgan, telefon inputida harflar filtrlanadi. |

## Admin / Super Admin

**Aniqlangan muammolar:**

1. Admin va Super Admin bir xil barcha permissionlarga ega. Role tayinlash, sozlamalar, finance va boshqa xavfli amallar uchun alohida matritsa yo‘q.
2. Auth token va user/role ma’lumotlari oddiy client cookie’da saqlanadi; bu server-side security boundary emas.
3. `/users/manage` sahifasidagi Create user, Edit va Manage access tugmalari ko‘rinadi, lekin to‘liq workflow bermaydi.
4. User management 500 ta seeded user bilan bitta paginatsiyasiz ro‘yxat sifatida ishlaydi.
5. `Foydalanuvchilar` va `Rollar va huquqlar` bir xil `/users/manage` manziliga olib boradi.
6. Settings bo‘limlari sidebar’da takrorlangan va canonical information architecture yo‘q.

**Yetishmaydi:** real user lifecycle, invitation, role editor, access approval, deactivation/reactivation, audit log, search/filter/pagination, password reset, session/device boshqaruvi va MFA.

## Manager

**Aniqlangan muammolar:**

1. Lead/ariza ma’lumotlari component state’da; refreshdan keyin yo‘qoladi.
2. Lead conversion faqat statusni `Enrolled` qiladi; student profile, enrollment, group membership va payment yaratmaydi.
3. Trial scheduling dialogidagi sana, vaqt, teacher, room va note saqlanmaydi.
4. Lead delete/status ishlari display name asosida bajariladi; bir xil ismli leadlar birga o‘zgarib ketishi mumkin.
5. Manager Reports havolasida permission mismatch bor edi — tuzatildi.
6. Manager course/group/teacher lifecycle bo‘yicha to‘liq huquqqa ega emas, lekin bu mahsulot qarori bilan belgilanmagan.
7. Dashboard KPI’lar hard-coded yoki random bo‘lib, real biznes ko‘rsatkichi sifatida ishonchli emas.

**Yetishmaydi:** lead CRUD, trial calendar, transaction-safe conversion, student transfer/withdrawal, group lifecycle, teacher assignment, attendance correction, real reports va export.

## Teacher

**Aniqlangan muammolar:**

1. Guruhlar, studentlar, darslar va schedule asosan hard-coded.
2. Attendance defaultda hamma studentni absent qilib ko‘rsatadi; lesson/date/record persistence yo‘q.
3. Attendance save faqat toast chiqaradi.
4. Grade student nomi bilan saqlanadi; group, assignment, lesson va student ID yo‘q.
5. Assignment’larda draft/published/closed workflow, submission va grading yo‘q.
6. Group query parametri studentlar sahifasida filter qilinmaydi.
7. Dashboard’dagi attendance toggle va assignment checklist dedicated sahifalarni takrorlaydi.
8. Teacher lint xatolari tuzatildi; umumiy lintda endi error yo‘q.

**Yetishmaydi:** backend group/student/lesson API, attendance statuslari (present/late/excused), notes, assignment publish, submission, grading history, student detail va scoped ownership.

## Student

**Aniqlangan muammolar:**

1. Student child route’lari Student role va ownership bilan to‘liq himoyalanmagan; parent route faqat `dashboard.read` tekshiradi.
2. Payment sahifasi Ali Valiyev, STU-2026-042, G-14 kabi hard-coded ma’lumotlarni ko‘rsatadi.
3. Pay tugmasi gateway/API’siz invoice’ni Paid qiladi.
4. Group sahifasida boshqa studentlarning attendance, score va Telegram ma’lumotlari ortiqcha ko‘rsatiladi.
5. Attendance, grades, tasks, schedule va dashboard ko‘rsatkichlari o‘zaro mos emas.
6. Material download, calendar download, attendance export va grade PDF tugmalari real fayl yaratmaydi.
7. Assignment submission saqlanmaydi va file upload ishlamaydi.
8. Uzbek/English tarjima to‘liq emas.

**Yetishmaydi:** student-scoped backend API, protected file upload, real submission, attendance dispute/excuse, teacher contact, online lesson join, invoice/receipt/contract ownership va real export.

## Finance

**Aniqlangan muammolar:**

1. Payment/debt CRUD faqat React state’da; refreshdan keyin o‘zgarishlar yo‘qoladi.
2. Payment edit’da group qiymati yig‘iladi, ammo saqlanmaydi.
3. ID `current.length + 1` asosida yaratiladi; delete’dan keyin duplicate ID yuzaga kelishi mumkin.
4. Payment method foizlari jami 108% bo‘lib chiqadi.
5. Dashboard’dagi income va chart raqamlari o‘zaro mos emas.
6. Verify/reject/refund/reconciliation/audit trail yo‘q.
7. Debt settlement partial payment va reversal’siz all-or-nothing ishlaydi.
8. Finance student view’da balance summasi yo‘q va statuslar parity asosida belgilanadi.
9. Student payment moduli Finance payment modulidan uzilgan va boshqa hard-coded billing modelga ega.

**Yetishmaydi:** yagona invoice/payment/debt/receipt modeli, verify/reject/refund, partial settlement, payment gateway webhook, idempotency, reconciliation, date-range reports va server-side totals.

## Ortiqcha yoki birlashtirilishi kerak bo‘lgan qismlar

1. `/users` va `/users/manage` canonical vazifalari aniqlashtirilsin.
2. Sidebar’dagi takroriy `System`, `StudentSystem`, `FinanceSystem` settings qismlari birlashtirilsin.
3. Teacher global sidebar va feature TopNav’dan bittasi asosiy navigation bo‘lsin.
4. Student dashboard faqat backend-derived summary va actionable linklarni ko‘rsatsin.
5. Finance va Student payment bitta billing domenidan role-specific projection olsin.
6. Group member view defaultda peer score, attendance va Telegram handle’ni ko‘rsatmasin.

## Ustuvor ishlab chiqish rejasi

### P0 — Xavfsizlik va ma’lumot yaxlitligi

Server/API auth boundary, secure session, token expiry/revocation, server-side RBAC, ownership/academy scope, Admin/Super Admin farqi va audit log. Client permission faqat UX filter bo‘lib qolsin.

### P1 — Yagona data model

Immutable ID’lar: `userId`, `studentId`, `leadId`, `groupId`, `lessonId`, `assignmentId`, `enrollmentId`, `invoiceId`, `paymentId`. Lead conversion transaction, enrollment/group membership va billing bog‘lanishi.

### P2 — Manager va account workflowlari

User management, lead CRUD, trial scheduling, conversion, group/teacher assignment, student transfer, real reports va export.

### P3 — Teacher va Student

Backend attendance, assignment/submission/grading, student-scoped portal, protected files, schedule/calendar, grades va payment receipt.

### P4 — Finance va UX

Verification, refund, partial settlement, reconciliation, date-range reporting, responsive tables, loading/empty/error/unsaved states va Uzbek/English parity.

### P5 — Sifat nazorati

RBAC/ownership/e2e testlar, payment idempotency testlari, conversion testlari, lint/typecheck/build CI, security review va staging pilot.

## Mahsulot qarori talab qiladigan savollar

1. Admin va Super Admin o‘rtasida qaysi aniq permissionlar farq qiladi?
2. Manager course/group/teacher lifecycle’da write huquqiga egami?
3. Teacher attendance va grade’ni to‘g‘ridan-to‘g‘ri o‘zgartiradimi yoki approval kerakmi?
4. Student peer attendance/score/Telegram ma’lumotlarini ko‘rishi kerakmi?
5. Finance refund, delete, verify va debt settlement siyosati qanday bo‘ladi?
6. Academy, Finance va Student billing bitta invoice modelidan foydalanadimi?
7. Qaysi dashboard KPI va report authoritative hisoblanadi?

## Keyingi bosqich uchun yagona prompt

> Education CRM’ni production-ready full-stack tizimga aylantir. Avval backend/API va database data modelini yarat: users, roles, permissions, academy scope, students, leads, courses, groups, enrollments, lessons, attendance, assignments, submissions, grades, invoices, payments, debts, receipts va audit logs. Har bir endpointda server-side authentication, role/action authorization, ownership/academy scope, immutable IDs, validation, transaction, error handling va audit event bo‘lsin. Admin/Super Admin/Manager/Teacher/Student/Finance permission matritsasini alohida belgila va deny-by-default qil. Keyin mavjud frontendni shu API’ga ulang: hard-coded/random/localStorage ma’lumotlarni olib tashla, barcha mutationlarni serverga yubor, loading/empty/error/unsaved/conflict states qo‘sh, responsive va Uzbek/English UI qil. Manager uchun lead CRUD, trial scheduling, lead conversion transaction, enrollment/group/teacher assignment va reports; Teacher uchun lesson-scoped attendance, assignments, submissions va grades; Student uchun ownership-protected course/group/schedule/attendance/tasks/grades/payments; Finance uchun invoice/payment verification, partial debt settlement, refund/reconciliation, receipts va date-range reports workflowlarini to‘liq ishlat. Har bir role route va action uchun unit/integration/e2e test yoz. Ishni P0 security, P1 data model, P2 Manager, P3 Teacher/Student, P4 Finance/UX bosqichlarida bajar va har bosqichdan keyin build, lint, typecheck va test natijasini ko‘rsat.

## Tekshiruv natijasi

- `pnpm build` — muvaffaqiyatli.
- `pnpm lint` — **0 error**, 12 ta Fast Refresh warning.
- `localhost:5173` Vite dev server — ishlayapti.
- Backend/API bo‘lmagani sabab production security va persistence muammolari hali to‘liq hal qilinmagan.


## Ushbu iteratsiyada qo‘shilgan amaliy kod patchlari

1. Barcha Student child route’lariga `requireRole('Student')` qo‘shildi: payments, grades, attendance, schedule, tasks, course va group sahifalariga boshqa rollar to‘g‘ridan-to‘g‘ri kira olmaydi.
2. Teacher, Finance va Academy noma’lum section/module qiymatlarini noto‘g‘ri sahifaga fallback qilish o‘rniga 404/Not Found holatiga o‘tkazildi.
3. Dashboard analytics chart’dagi `Math.random()` olib tashlandi; preview har safar turlicha ko‘rinadigan random KPI endi deterministik demo data bilan ishlaydi.
4. Student payment tugmasi backend/gateway yo‘q paytda invoice’ni soxta `Paid` qilmaydi; foydalanuvchiga demo rejimida haqiqiy to‘lov tasdiqlanmasligi haqida xabar beradi.
5. Student payment telefon va karta inputlariga format tekshiruvi qo‘shildi.
6. Frontend lint’dagi avvalgi Teacher/Academy CSV escape xatolari tuzatildi.

## Yakuniy tekshiruv

- `pnpm lint` — 0 error, 12 ta Fast Refresh warning.
- `pnpm build` — muvaffaqiyatli.
- Test suite alohida browser test konfiguratsiyasiga ega; production backend mavjud bo‘lmagani sabab end-to-end security/persistence testlari backend integratsiyasidan keyin majburiy qayta yozilishi kerak.
- Qolayotgan asosiy muammolar: server-side API/database, payment gateway, real persistence, ownership isolation va backend audit log. Frontend patchlari bu talablarni o‘rnini bosmaydi.
