# Sfera Academy CRM — Manager, Finance va Teacher

Ushbu loyiha uchta yuklangan arxivdagi role interfeyslarini bitta React ilovasiga birlashtiradi va GitHub’dagi NestJS backendini shu loyiha ichiga qo‘shadi. GitHub repozitoriyasining frontend qismi olinmagan. Asosiy frontend Manager ZIP’dan olindi; Finance ZIP’dagi moliya va umumiy interfeys o‘zgarishlari qo‘shildi; Teacher ZIP’dagi yangilangan o‘qituvchi paneli saqlandi.

Frontend React, TypeScript, Vite va TanStack Router’da ishlaydi. Backend NestJS, Fastify va PostgreSQL bilan ishlaydi. API endpointlari Swagger’da ko‘rsatiladi.

## Rollar

Manager ish maydoni arizalar, guruhlar, o‘quvchilar, o‘qituvchilar va boshqaruv panelini o‘z ichiga oladi. Finance ish maydoni to‘lovlar, qarzdorlik va moliyaviy hisobotlarni o‘z ichiga oladi. Teacher ish maydoni guruhlar, jadval, davomat, topshiriqlar va baholarni o‘z ichiga oladi. Admin va Student panellari Manager ZIP’dagi holicha qoldirilgan.

## Talablar

Node.js 22 yoki undan yangi versiya, pnpm 11 va PostgreSQL kerak. Ma’lumotlar bazasini `docker compose` orqali ishga tushirish mumkin.

## Mahalliy ishga tushirish

Loyiha ildiz papkasida quyidagi buyruqlarni bajaring:

```bash
pnpm install
cp .env.example .env
docker compose up -d postgres
pnpm db:migrate
pnpm db:seed
```

Keyin ikkita terminal oching. Birinchisida API’ni ishga tushiring:

```bash
pnpm api:dev
```

Ikkinchisida frontendni ishga tushiring:

```bash
pnpm dev
```

Frontend `http://localhost:5173` manzilida ochiladi. Swagger UI `http://localhost:3000/api/docs` manzilida, OpenAPI JSON esa `http://localhost:3000/api/docs-json` manzilida ochiladi.

Vite dev serveri `/api`, `/manager`, `/teacher`, `/tasks` va `/reports` so‘rovlarini `localhost:3000` dagi NestJS serveriga uzatadi. Hosting muhitida `.env` ichidagi `VITE_API_BASE_URL` va `API_PUBLIC_URL` qiymatlarini mos server manzillariga o‘zgartiring.

## Frontend va API integratsiyasi

`.env` ichida `VITE_API_ENABLED=true` qiling va Vite serverini qayta ishga tushiring. Shunda Manager paneli `/manager/dashboard`, Teacher paneli `/teacher/dashboard`, Finance paneli esa `/api/v1/finance/summary` endpointidan ma’lumot olib, ulanish holatini ko‘rsatadi. API so‘rovlari frontenddagi mavjud access tokenni Bearer token sifatida yuboradi.

Mahalliy demo loginlar ishlatilganda frontend development muhitida `test-token-*` tokenlarini yuboradi. Bunday tokenlar backend tomonidan faqat `NODE_ENV=development` holatida qabul qilinadi; production uchun mo‘ljallanmagan. Sinov tokenlari va demo loginlar haqiqiy autentifikatsiya o‘rnini bosmaydi. Production’da Clerk konfiguratsiyasi hamda haqiqiy login oqimini sozlash kerak.

**Muhim:** barcha frontend ekranlari hali to‘liq server ma’lumotiga ko‘chirilmagan. Manager va Teacher API servislarining ayrimlari repozitoriyada `TODO` yoki statik demo javoblar bilan turibdi. Finance summary endpointi esa PostgreSQL’dan akademiya bo‘yicha haqiqiy jamlanmani hisoblaydi. Qolgan ekranlardagi demo va localStorage oqimlari saqlangan.

## Tekshiruv va build

```bash
pnpm build                 # frontend
pnpm api:build             # shared packages + NestJS API
pnpm build:all             # backend va frontend ketma-ket
pnpm lint
```

`pnpm db:generate` Drizzle migration yaratadi. `pnpm db:migrate` mavjud migrationlarni qo‘llaydi. `pnpm db:seed` mahalliy demo rollar, foydalanuvchilar va boshlang‘ich CRM ma’lumotlarini qo‘shadi.

## Tuzilma

- `src/` — Manager ZIP asosidagi React frontend va Finance/Teacher birlashtirilgan interfeyslari.
- `apps/api/` — GitHub repozitoriyasidan olingan NestJS backend.
- `packages/contracts/` — API DTO va Zod kontraktlari.
- `packages/db/` — Drizzle sxemasi, migratsiyalar va seed.
- `src/lib/api-client.ts` — frontenddan API’ga so‘rov yuborish va javob qobig‘ini ochish.

## Eslatmalar

Seed ichidagi ma’lumotlar faqat mahalliy sinov uchun. `.env` faylini ommaviy repozitoriyaga yubormang. Finance API ma’lumotlarini ko‘rish uchun migration va seed bajarilgan, API esa ishga tushgan bo‘lishi shart.

## Manbalar

[1] [pnpm workspace documentation](https://pnpm.io/workspaces "pnpm Workspaces") — monorepo paketlarining workspace sozlamalari.
[2] [NestJS OpenAPI documentation](https://docs.nestjs.com/openapi/introduction "NestJS OpenAPI (Swagger)") — Swagger hujjatlarini yaratish va taqdim etish.
[3] [Drizzle ORM migrations](https://orm.drizzle.team/docs/migrations "Drizzle ORM Migrations") — migrationlarni yaratish va qo‘llash.
