# Education Management CRM

Sfera IT Academy uchun rollarga asoslangan, responsive React + TypeScript CRM. Ilova frontend demo/local-storage oqimlari bilan ishlaydi; backend kerak bo‘ladigan joylar kod ichida `BACKEND:` izohi bilan ko‘rsatilgan.

## Ishga tushirish

```bash
pnpm install
pnpm run dev
```

Production build va tekshiruv:

```bash
pnpm run build
pnpm run lint
```

## Asosiy rollar va dashboardlar

| Rol                 | Dashboard/ish maydoni | Asosiy bo‘limlar                                                      |
| ------------------- | --------------------- | --------------------------------------------------------------------- |
| Super Admin / Admin | Bosh dashboard        | Foydalanuvchilar, academy, vazifalar, hisobotlar, sozlamalar          |
| Manager             | Bosh dashboard        | Arizalar, guruhlar, o‘quvchilar, o‘qituvchilar, vazifalar, hisobotlar |
| Teacher             | Teacher workspace     | Guruhlar, jadval, davomat, vazifalar, baholar                         |
| Finance             | Finance workspace     | To‘lovlar, qarzdorlik, moliyaviy hisobotlar                           |
| Student             | Student dashboard     | Kurslar, vazifalar va shaxsiy natijalar                               |

Sidebar nomlari `src/components/layout/app-sidebar.tsx` dagi route nomlari bilan, dashboard redirectlari esa `src/routes/_authenticated/index.tsx` dagi role mapping bilan boshqariladi.

## Hisobotlar va PDF

Academy va Finance hisobotlarida CSV yuklab olish ishlaydi. `Print / PDF` tugmasi brauzerning print oynasini ochadi; u yerdan **Save as PDF** tanlanadi. Teacher baholarida ham CSV va print/PDF oqimi mavjud.

## Validatsiya va ma’lumot saqlash

Tasklar localStorage’da saqlanadi. O‘qituvchi qo‘shish formasida ism, email va telefon regex-validatsiyasi bor. Backend ulanishida shu validatsiyalar serverda ham qayta bajarilishi shart.

## Papkalar

- `src/features/tasks` — vazifalar, kategoriya/status/priority selectlari.
- `src/features/academy-module` — arizalar, guruhlar, o‘qituvchilar, jadval, davomat, moliya va hisobotlar.
- `src/features/teacher` — o‘qituvchi dashboardi, assignment va baholar.
- `src/features/finance` — to‘lov va moliyaviy hisobotlar.
- `src/components/layout` — sidebar, header va responsive layout.

## Muhim eslatma

Real multi-user persistence, authentication va server-side PDF generation uchun backend endpointlar ulanishi kerak. Hozirgi frontend oqimlari backend bo‘lmasa ham foydalanuvchiga xatolik bermasdan local/browser darajasida ishlaydi.
