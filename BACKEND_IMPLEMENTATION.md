# Backend ulash bo‘yicha qo‘llanma

Ushbu frontend hozircha **backendga ulanmagan demo rejimida** ishlaydi. Ma’lumotlar `src/lib/crm-store.ts` orqali Zustand va `localStorage`da saqlanadi. Shu sababli foydalanuvchi oqimlari, davomat holatlari, guruhlar, to‘lovlar va chat UI’lari real interaksiya bilan ishlaydi, ammo ma’lumotlar serverlararo sinxronlanmaydi.

## 1. Autentifikatsiya

`src/features/auth/sign-in/components/user-auth-form.tsx` ichidagi demo hisoblar o‘rniga `POST /api/auth/login` endpointi ulanadi. Endpoint access token va refresh token qaytarsin. Tokenni xavfsiz, `httpOnly` cookie orqali saqlash tavsiya qilinadi. Role qiymatlari `Super Admin`, `Manager`, `Teacher`, `Finance` va `Student` bo‘lib, frontend route guard’lari shu permissionlarga tayanadi.

## 2. CRM ma’lumotlari

`src/lib/crm-store.ts`dagi seed modellar server jadvallariga ko‘chiriladi: `students`, `groups`, `applications`, `payments`, `activities` va `notifications`. Frontenddagi store actionlari quyidagi REST yoki tRPC amallariga mos keladi:

| Frontend oqimi | Tavsiya etiladigan endpoint |
|---|---|
| O‘quvchilar va guruhlar | `GET /api/students`, `GET /api/groups` |
| Ariza statusini o‘zgartirish | `PATCH /api/applications/:id/status` |
| To‘lov yozish | `POST /api/payments` |
| Davomatni saqlash | `POST /api/attendance/sessions/:sessionId/records` |
| Faoliyat jurnali | `GET /api/activities` |
| Bildirishnomalar | `GET/PATCH /api/notifications` |

## 3. Davomat

Teacher davomat ekranida har bir o‘quvchi `present`, `late`, `absent` yoki `excused` holatiga o‘tkaziladi. Backend `attendance_sessions` va `attendance_records` jadvallarini ishlatsin. Har bir record uchun `student_id`, `group_id`, `teacher_id`, `lesson_date`, `status`, `marked_at` va `marked_by` saqlansin. `marked_at` server vaqti bilan yozilishi kerak.

## 4. Guruh chatlari

Chatlar faqat guruh a’zolari orasida ko‘rinsin. Tavsiya etiladigan jadvallar: `group_conversations`, `group_members`, `messages`, `message_attachments`. Real-time tajriba uchun WebSocket yoki Server-Sent Events ishlatish mumkin. Xabar yuborishda `POST /api/groups/:groupId/messages`, yangi xabarlarni olishda WebSocket channel `group:{groupId}` ishlatiladi. Teacher faqat o‘z guruhlariga, student esa o‘z guruhiga kira olishi kerak.

## 5. To‘lovlar

Finance ekranidagi `Recorded` vaqti serverdagi `created_at`dan olinadi. To‘lov endpointi idempotency key qabul qilsin, aks holda takroriy submit ikki marta yozilishi mumkin. `amount`, `method`, `student_id`, `description`, `created_at`, `created_by` va `status` maydonlari majburiy bo‘lsin.

## 6. Frontendga ulash tartibi

`src/lib/crm-store.ts` ichidagi seed o‘rniga React Query query/mutation layer qo‘shiladi. Loading, empty va error holatlari saqlanib qolishi kerak. API xatolari toast orqali foydalanuvchiga ko‘rsatiladi, lekin maxfiy server tafsilotlari UI’da chiqmasin. Backend ulanishidan keyin demo credentiallar va `mock-access-token` production builddan olib tashlanadi.

## 7. Production xavfsizlik tekshiruvi

CORS faqat ruxsat etilgan frontend originlari bilan cheklansin, rate limit va audit log qo‘shilsin, role permission’lar backendda qayta tekshirilsin. Frontend route guard xavfsizlik chegarasi emas; har bir endpoint serverda permission bilan himoyalanishi kerak.
