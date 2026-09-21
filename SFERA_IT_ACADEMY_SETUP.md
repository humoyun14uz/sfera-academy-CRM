# Sfera IT Academy admin paneli

## Gmail va parolni almashtirish

Ushbu loyiha hozircha **demo/client-side autentifikatsiya** bilan ishlaydi. Kirish ma’lumotlarini loyiha ildizidagi `.env` faylida belgilang.

1. Loyiha papkasida `.env.example` faylidan nusxa oling:

   ```bash
   cp .env.example .env
   ```

2. `.env` faylini ochib, quyidagi ikki qiymatni o‘zingiznikiga almashtiring:

   ```env
   VITE_ADMIN_EMAIL=your-admin@gmail.com
   VITE_ADMIN_PASSWORD=SferaAdmin@2026
   ```

3. Development serverni qayta ishga tushiring:

   ```bash
   pnpm dev
   ```

4. `/sign-in` sahifasida shu Gmail va parol bilan kiring.

Parol **kamida 7 ta belgidan** iborat bo‘lishi kerak. `.env` fayli o‘zgargandan keyin Vite serverini albatta qayta ishga tushiring. `.env` faylini GitHub yoki boshqa ochiq repositoryga joylamang.

> Muhim: bu sozlama frontend demo uchun mo‘ljallangan. Haqiqiy production tizimida Gmail va parolni frontend `.env` orqali tekshirish xavfsiz emas. Production uchun login tekshiruvini backend/API yoki Clerk kabi autentifikatsiya xizmatiga ko‘chirish kerak.

## Tilni almashtirish

Admin panelga kirgandan keyin yuqori o‘ng tomondagi til tugmasidan **English** yoki **O‘zbekcha** ni tanlang. Tanlangan til cookie orqali saqlanadi va keyingi tashrifda ham qoladi. O‘zbekcha rejimda sidebar bo‘limlari va asosiy login matnlari o‘zbekchaga o‘tadi.

## Branding va devtools

Yuqori chapdagi eski Shadcn Admin team-switcher o‘rniga Sfera IT Academy logotipi, `Sfera IT Academy` nomi va `Administrator` yozuvi qo‘yildi. Pastki o‘ng va pastki chapdagi TanStack Router/React Query dev oynachalari root layoutdan olib tashlandi; shuning uchun localhost development rejimida ham chiqmaydi.

## Ishga tushirish

```bash
pnpm install
pnpm dev
```

Production buildni tekshirish:

```bash
pnpm run build
```

## SFERA IT Academy CRM dashboardi

Dashboard generic SaaS ko‘rinishidan Academy CRM ko‘rinishiga moslashtirildi. Unda jami o‘quvchilar, faol guruhlar, bugungi tushum va qarzdor o‘quvchilar KPI kartalari; leadlar va qabul pipeline’i; bugungi o‘quv jarayoni; oylik daromad grafigi; so‘nggi Academy faoliyati; va tezkor harakatlar bo‘limlari mavjud.

Dashboarddagi raqamlar va activity yozuvlari hozircha **mock/static demo data** hisoblanadi. Backend API hali ulanmagan. `/users` mavjud route’i O‘quvchilar menyusi va O‘quvchi qo‘shish tugmasi uchun ishlatiladi. Lead, guruh va to‘lov route’lari loyihada mavjud bo‘lmagani uchun tegishli tezkor tugmalar hozircha disabled holatda qoldirildi; fake navigation yaratilmagan.

Sidebarning original yopib-ochish mexanizmi saqlandi. Mavjud layout, routing, responsive strukturasi va UI komponentlari qayta ishlatildi; yangi framework yoki keraksiz dependency qo‘shilmadi.

## Administrator RBAC

Mavjud `Administrator` role saqlandi va qayta nomlanmadi. Administrator hozircha eng yuqori role hisoblanadi; `Super Admin` qo‘shilmadi. Permissionlar `src/lib/rbac.ts` ichida markazlashtirilgan. Har bir permission `students.read`, `students.create`, `students.update`, `students.deactivate`, `leads.read`, `leads.create`, `groups.read`, `courses.read`, `teachers.read`, `payments.read`, `payments.create`, `payments.verify`, `users.read`, `users.assign_role`, `users.deactivate`, `settings.read` kabi aniq nomga ega.

`can(role, permission)`, `canAny(...)` va `canAll(...)` helperlari barcha frontend authorization tekshiruvlari uchun tayyorlangan. `PermissionGate` komponenti UI actionlarini role bo‘yicha ko‘rsatish yoki yashirish uchun ishlatiladi. Sidebar itemlarida permission metadata mavjud va `NavGroup` ularni auth-store’dagi role asosida filtrlaydi.

`src/lib/route-guard.ts` ichidagi `requireAuthenticated()` va `requirePermission(...)` helperlari route-level himoya beradi. Oddiy role URLni qo‘lda kiritsa ham route `403` access denied sahifasiga yo‘naltiriladi; faqat sidebarni yashirish bilan cheklanilmagan. Auth user va Administrator role cookie orqali sahifa yangilanganda saqlanadi.

Keyingi rollar uchun katalog tayyor: `Administrator`, `Manager`, `Teacher`, `Accountant`, `Student`. Hozirgi login demo oqimida user `Administrator` sifatida yaratiladi. Real backend/auth provider ulanganda `auth-store`dagi user role backenddan keladigan role bilan almashtiriladi; permission va route guard kodlarini qayta yozish shart bo‘lmaydi.

## Courses CRM

`/apps` route endi App Integrations emas, SFERA IT Academy Courses Management modulidir. Kurslar local repository orqali boshqariladi va keyinchalik API/data layer bilan almashtirish oson bo‘lishi uchun `src/features/courses/data.ts` ichida saqlanadi. Demo kurslar localStorage’ga yoziladi.

Kurslar sahifasida qidirish, status/category/teacher filterlari, sort, grid/table view, kurs yaratish, tahrirlash, arxivlash va delete actionlari ishlaydi. Kurs kartasi `/apps/:courseId` Course Details sahifasiga olib boradi. Details sahifasida Overview, O‘quvchilar, Guruhlar, Darslar, Davomat va To‘lovlar tablari mavjud. Admin/Manager permissionlariga ega foydalanuvchi enrollment va group yaratishi mumkin.

Kursga o‘quvchi qo‘shilganda Student → Course → Group → Teacher relationship local repositoryda saqlanadi. Bu hozir frontend demo repository; backend mavjud bo‘lsa, `loadCourses` va `saveCourses` o‘rniga API repository chaqiruvlarini ulash kerak.

## Sidebar profile va logout

Sidebarning eng pastida auth-store’dagi user ma’lumotlari ko‘rsatiladi: ism, role/email va logout icon. Logout bosilganda `auth.reset()` token va user cookie’larini tozalaydi hamda `/sign-in` sahifasiga qaytaradi. Demo Administrator nomi `.env`dagi `VITE_ADMIN_NAME` orqali boshqariladi; email va parol `VITE_ADMIN_EMAIL` hamda `VITE_ADMIN_PASSWORD` orqali belgilanadi.
