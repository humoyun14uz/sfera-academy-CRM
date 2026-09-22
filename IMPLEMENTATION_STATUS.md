# IMPLEMENTATION_STATUS.md — Sfera Academy CRM

**Repository:** https://github.com/humoyun14uz/sfera-academy-CRM
**Companion document:** `AUDIT_BASELINE.md` (Phase 0 findings register — read that first)
**Last updated:** 2026-09-22

---

## How to read this document

Every row is labelled with exactly one status:

| Label | Meaning |
|---|---|
| ✅ **VERIFIED** | Written **and executed in this environment**; the exact command and its observed result are recorded below. |
| ⏳ **UNVERIFIED** | Written and type-checked, but **could not be executed here** because this environment has **no Docker** (no PostgreSQL, no Redis). It must be run on a Docker-capable machine before anyone calls it done. |
| ⬜ **NOT STARTED** | Not attempted. |

> **Environment constraint (restated, because it bounds every claim below):**
> Node v24.19.0 and pnpm 11.22.0 are available. **Docker is NOT installed on this machine.**
> Therefore `docker compose up`, `drizzle-kit migrate`, `drizzle-kit studio`, and any NestJS
> integration test that opens a real PostgreSQL connection **cannot be run here**.
> No database-touching feature is marked ✅ in this document.

---

## 1. Executive summary of this work session

The repository arrived **broken, unbuildable and insecure**, with a large but entirely
mock-data-driven frontend and a backend that had *never been compiled*.

This session did **not** add UI. It fixed the foundations that made any real work impossible:

| Metric | On arrival | Now | Status |
|---|---|---|---|
| Frontend build (`pnpm build`) | ❌ `TS1117` — would not build at all | ✅ exit 0 | ✅ VERIFIED |
| Lint (`pnpm lint`) | ❌ 143 problems / **114 errors** | ✅ **0 errors**, 25 warnings, exit 0 | ✅ VERIFIED |
| Backend type-check | ❌ **33 TS errors** (never compiled) | ✅ **0 errors** | ✅ VERIFIED |
| Backend build (`nest build`) | ❌ could not succeed | ✅ `API_BUILD_EXIT=0`, 265 files emitted | ✅ VERIFIED |
| Backend tests (`vitest run`) | unknown (build broken) | ✅ **9/9 passed** | ✅ VERIFIED |
| Database tables | 23, **no migration SQL ever generated** | **35 tables + real 37.7 KB migration SQL** | ✅ VERIFIED (generation) |
| Student invoice isolation | ❌ **every academy invoice leaked** to a Student token | ✅ fail-closed | ⏳ needs DB to E2E-verify |
| Payment double-submit | ❌ duplicates possible | ✅ idempotency key + unique index | ⏳ needs DB to verify |
| Finance date-range report | ❌ range silently ignored | ✅ range honoured server-side | ⏳ needs DB to verify |
| `test-token-*` auth bypass | ❌ worked even with Clerk configured | ✅ refused unless non-production | ✅ VERIFIED (code path) |

**Nothing in the frontend's mock data layer has been removed yet** (students, courses, groups,
attendance, grades, leads, payments, notifications are all still `localStorage`, exactly as the
baseline audit recorded). That is deliberate and is explained in §5.

---

## 2. What was changed, file by file

### 2.1 Build-blocking and tooling defects

| File | Change | Why | Status |
|---|---|---|---|
| `vite.config.ts` | Removed the duplicated `allowedHosts: true` key (kept the explicit allowlist) | `TS1117` made `tsc -b` fail, so the project could not be built. The explicit allowlist is also the safer of the two. | ✅ VERIFIED |
| `vite.config.ts` | Added `test.exclude` for `**/.kilo/**`, `**/dist/**`, `**/coverage/**`, `**/apps/**`, `**/packages/**` | Vitest was executing a **second copy** of the suite from the nested worktree, inflating and corrupting results (the same test file appeared twice). | ✅ VERIFIED |
| `eslint.config.js` | `ignores` now covers `dist`, `**/dist/**`, `node_modules`, `coverage`, `.kilo/worktrees/**`, `src/routeTree.gen.ts` | ESLint was linting the nested worktree, adding a large block of foreign errors against a different copy of the code. | ✅ VERIFIED |
| `eslint.config.js` | New flat-config block for `apps/**` + `packages/**` using `globals.node`; `no-console` relaxed for `seed.ts`/`migrate.ts` and test/config files | Backend is Node, not browser, and CLI scripts legitimately print to stdout. | ✅ VERIFIED |

### 2.2 Backend could not compile at all (finding P0-11)

| File | Change | Why |
|---|---|---|
| `apps/api/tsconfig.json` | `strictNullChecks: false` → **`true`** | **Root cause of 30 of the 33 errors.** drizzle-orm builds `$inferInsert` from conditional/mapped types; with `strictNullChecks` disabled those types collapsed to `never`, so every service reported *"Object literal may only specify known properties, and 'X' does not exist in type ..."*. This flag also moves the backend toward the required TypeScript strict mode. |
| `apps/api/tsconfig.json` | Added `rootDir: "./src"`; removed deprecated `baseUrl` | `nest build` failed with `TS5011` / `TS5101` on TypeScript 6. |
| `apps/api/src/main.ts` | `Logger` imported from `@nestjs/common`, not `@nestjs/core` | `@nestjs/core` does not re-export `Logger` (`TS2305`). |
| `apps/api/src/main.ts` | `console.log`/`console.error` → Nest `Logger` | Satisfies `no-console` and gives level-aware startup logging. |
| `apps/api/src/main.ts` | Narrow, commented cast on `helmet` | `@fastify/helmet` is typed against `fastify@5.11.3` while `@nestjs/platform-fastify` pulls `fastify@5.12.5`, so the signatures are nominally incompatible. A dependency artefact, recorded rather than hidden. |
| `apps/api/src/common/guards/clerk-auth.guard.ts` | `clerkClient.verifyToken(token)` → standalone `verifyToken(token, { secretKey })` from `@clerk/backend` | `ClerkClient` has no `verifyToken` method (`TS2339`). Clerk verification **never worked**. |
| `apps/api/src/modules/attendance/attendance.service.ts` | Typed `const recorded` as `(typeof attendanceRecords.$inferSelect)[]` | The array inferred as `never[]` under `strictNullChecks` (`TS2345`), masking the real shape. |

### 2.3 Security fixes

| Finding | File | Change | Status |
|---|---|---|---|
| **P0-9** Student invoice leak (IDOR) | `finance.controller.ts`, `current-user.decorator.ts`, `scope.guard.ts` | `AuthenticatedUser` now declares an optional `studentId`; `ScopeGuard` populates it; the controller **fails closed** with `403` when a Student has no linked profile instead of falling through to the academy-wide query. | ✅ code verified / ⏳ E2E needs DB |
| **P0-10** `test-token-*` auth bypass | `clerk-auth.guard.ts` | Test tokens are now an explicitly separated branch requiring `NODE_ENV !== 'production'` **and** `ALLOW_TEST_AUTH_TOKENS !== 'false'`, so they can never authenticate a production deployment. Unknown tokens are rejected instead of silently falling through. | ✅ VERIFIED (code path) |

### 2.4 Finance correctness (findings P1-5, P1-6, P1-7)

| File | Change | Why |
|---|---|---|
| `finance.service.ts` | `getFinancialSummary` now **honours** `startDate`/`endDate`, applied to the correct timestamp per fact (invoices by issue time, payments by `paidAt`, refunds by creation time). Invalid or inverted ranges throw `400` instead of silently becoming "all time". | The date-range report Finance depends on previously returned **lifetime totals labelled as a range** — a wrong number presented as a report. `gte`/`lte` were imported but unused, which is precisely the bug. |
| `finance.service.ts` | Added server-side metrics: `outstandingBalance`, `overdueBalance` (derived from `due_date` + real outstanding debt), `netRevenue`, `collectionRate`, and status counts via SQL `filter (where ...)`. | All financial totals must come from the database, never the browser. `overdue` is computed from data rather than trusting a status column to be maintained correctly. |
| `finance.service.ts` | Extracted `performPayment`; added an idempotency fast-path, a replay lookup, and a `23505` (`unique_violation`) catch that returns the winning payment. | **P1-6.** A double submit or client retry now returns the original payment instead of recording a second one. |
| `finance.service.ts` | Invoice numbers come from an atomic per-academy `UPSERT ... RETURNING` counter (`INV-YYYY-NNNNNN`). | **P1-7.** `Date.now()` + `Math.random()` could collide and was not a reliable business reference. |
| `finance.service.ts` | Invoice line items are persisted, and a client-supplied `amount` that disagrees with the item total is **rejected**. | Client-supplied money must never be trusted. |
| `packages/contracts/src/index.ts` | `createInvoiceSchema` gained `currency` (literal `'UZS'`) and `items`; `recordPaymentSchema` gained `idempotencyKey`; `invoiceItemSchema` added. | Currency validation and idempotency enforced at the shared contract boundary. |

### 2.5 Database schema (finding P1-4)

`packages/db/src/schema/index.ts` — **23 → 35 tables**. Added the 11 required models that were
missing, plus one supporting table:

`user_roles`, `teachers`, `schedules`, `lead_events`, `invoice_items`, `payment_allocations`,
`debts`, `receipts`, `notifications`, `notification_preferences`, `files`, `invoice_counters`.

Hardening applied to existing tables:

| Table | Change | Why |
|---|---|---|
| `invoices` | `invoice_number` was **globally** `.unique()`, now unique **per academy** (`invoice_number_academy_unique`); the global unique index was removed | The global constraint made it structurally impossible for a second academy to issue `INV-2026-000001` — a latent multi-tenancy failure. |
| `invoices` | Added `created_by`, `updated_at`, `invoices_due_date_idx` | Audit trail + report performance. |
| `payments` | Added `idempotencyKey` + `payment_idempotency_unique (academy_id, idempotency_key)` | Database-level enforcement of P1-6, not merely a service-level check. |
| `payments` | Added `verifiedBy`, `verifiedAt`, `source`, `updatedAt`, `payments_paid_at_idx`; expanded the status vocabulary to `pending/paid/partially_paid/overdue/refunded/cancelled` | Required finance audit fields; the `paid_at` index supports the new range reports. |
| `receipts`, `notification_preferences`, `files`, `schedules`, `teachers` | Unique/index coverage for per-academy receipt numbers, `(user, category)` preferences, storage keys, weekly slots and `(academy, user)` | Prevents duplicate receipts, duplicate preferences, duplicate file keys and duplicate schedule slots. |

**Generated migration SQL — ✅ VERIFIED.**
`pnpm --filter @sfera/db generate` →
`[✓] Your SQL migration file ➜ drizzle\0000_broad_vance_astro.sql` (37,714 bytes, plus
`meta/0000_snapshot.json`). Before this session `packages/db/drizzle/` did not exist, so **no
migration had ever been produced**.

---

## 3. Exact commands and observed results

All commands were run from the repository root on Windows / PowerShell.

| # | Command | Exit | Observed result |
|---|---|---|---|
| 1 | `pnpm exec tsc -b --force` | 0 | clean (after the `TS1117` fix) |
| 2 | `pnpm build` | **0** | `✓ 3996 modules transformed`, `✓ built in 4.88s` |
| 3 | `pnpm lint` | **0** | `✖ 25 problems (0 errors, 25 warnings)` — was `143 problems (114 errors)` |
| 4 | `pnpm --filter @sfera/db build` | **0** | `tsc` clean |
| 5 | `pnpm --filter @sfera/contracts build` | **0** | `tsc` clean |
| 6 | `pnpm --filter @sfera/api exec tsc --noEmit -p tsconfig.json` | **0** | no output — was **33 errors** |
| 7 | `pnpm --filter @sfera/api build` | **0** | `API_BUILD_EXIT=0`, `dist/main.js` present, 265 files emitted |
| 8 | `pnpm --filter @sfera/api test` | **0** | `Test Files 2 passed (2)`, `Tests 9 passed (9)` |
| 9 | `pnpm --filter @sfera/db generate` | **0** | `35 tables`, `drizzle\0000_broad_vance_astro.sql` |
| 10 | `pnpm test` | see §3.1 | 5 unit test files pass (36 tests); **15 browser component test files fail** with ~15 s Radix timeouts (pre-existing, documented as P1-8) |

### 3.1 Frontend test suite — still failing, and why

Running the frontend suite with the **corrected scope** confirms the nested-worktree duplication is
gone (no `.kilo/worktrees/**` file appears any more). The honest result:

**Pure unit tests — all pass:**

| File | Tests |
|---|---|
| `src/hooks/use-table-url-state.test.ts` | 17 ✅ |
| `src/lib/handle-server-error.test.ts` | 7 ✅ |
| `src/stores/auth-store.test.ts` | 5 ✅ |
| `src/lib/utils.test.ts` | 5 ✅ |
| `src/lib/cookies.test.ts` | 2 ✅ |

**Browser component tests — all 15 files fail**, each test timing out at ~15 000 ms:

`src/components/confirm-dialog.test.tsx`, `password-input.test.tsx`, `sign-out-dialog.test.tsx`,
`src/context/search-provider.test.tsx`,
`src/features/auth/{sign-in,sign-up,otp,forgot-password}/**/*.test.tsx`,
`src/features/tasks/components/{tasks-mutate-drawer,tasks-import-dialog,tasks-multi-delete-dialog}.test.tsx`,
`src/features/users/components/{users-action-dialog,users-delete-dialog,users-invite-dialog,users-multi-delete-dialog}.test.tsx`.

This is finding **P1-8 / P3-2**: Radix portal + animation waits under
`vitest --browser.headless` never resolve. These are **real failures, not environment noise**, and
they sit on demo dialogs that read and write `localStorage` and fire `toast.success(...)` with no
server confirmation — precisely the behaviour Phase 6 deletes.

They are therefore left **failing and fully visible**. They are not skipped, not silenced, and not
rewritten as throwaway tests for code that is scheduled for removal. Fixing them properly means
asserting against the real API after the migration, which is Phase 6/8 work.

---

## 4. What was NOT done, and the honest reason

| Item | Status | Reason |
|---|---|---|
| Apply migrations to a live PostgreSQL | ⬜ NOT STARTED | **Docker is not installed here.** `docker compose up` cannot run. The SQL is generated and ready; it needs one command on a Docker-capable machine. |
| Run Drizzle seed | ⬜ NOT STARTED | Depends on the migration above. |
| Start the NestJS API against a real DB | ⬜ NOT STARTED | Depends on the migration above. |
| Verify P0-9 (student isolation) with a real Student token | ⏳ UNVERIFIED | Requires a running API + seeded DB. The code path is fixed and fail-closed, but the end-to-end proof needs the database. |
| Verify payment idempotency / partial payments | ⏳ UNVERIFIED | Same reason. Unit-testing it without a transaction-capable DB would be testing a mock, which the project rules forbid. |
| Frontend migration off `localStorage` | ⬜ NOT STARTED | **Deliberate gating** — see §5. |
| Lighthouse desktop + mobile | ⬜ NOT STARTED | Measuring the *mock-data* frontend would produce numbers that say nothing about the real application. Lighthouse is scheduled for Phase 7, after pages read real API data. Reserving it also avoids presenting a green score for a UI whose numbers are fabricated. |
| Playwright E2E + viewport matrix | ⬜ NOT STARTED | Same gating: E2E assertions belong against a real API. |
| Rate limiting, Pino wiring, Sentry, BullMQ, R2/S3 uploads | ⬜ NOT STARTED | Phase 1/second half of Phase 2. The dependencies (`nestjs-pino`, `pino-http`, `pino-pretty`) are already declared but were never imported — recorded as finding P1-10. |
| GitHub Actions CI | ⬜ NOT STARTED | Phase 8. |

---

## 5. Why the frontend was deliberately left on mock data

The brief forbids replacing real functionality with fake behaviour and forbids hiding errors. It
also forbids claiming a feature works when it only mutates React state or `localStorage`.

Converting the frontend to API calls **before** the database exists would produce exactly the
failure mode the brief prohibits: pages calling an API that has never been migrated, seeded or
started, wrapped in loading and error states that hide the fact that nothing is real. That is a
worse outcome than an honest mock, because it *looks* finished.

The gating order is therefore:

1. Schema + migration — **done, SQL generated**.
2. Apply migration + seed + start API on a Docker-capable machine.
3. Verify the backend guards against a real database (P0-9, idempotency, date ranges).
4. Reunify the role/permission vocabulary between `src/lib/rbac.ts` (5 roles, 55 permissions) and
   `packages/contracts` (6 roles, 44 permissions, different names) — **finding P1-2, still open and
   the single biggest blocker for a correct RBAC UI.** See §6.
5. Then migrate pages to TanStack Query, deleting each `localStorage` store as its page moves.

`localStorage` business stores **are still present**, unchanged, and are listed in
`AUDIT_BASELINE.md` §3.1. Nothing in the frontend displays a value that pretends to come from the
database.

---

## 6. Highest-value next work (in order)

### 6.1 Unify roles and permissions — finding P1-2 (do this first)

This is the **biggest single blocker** for correct role experiences. Today the two halves of the
system cannot agree on what a permission is called:

* `src/lib/rbac.ts` — 5 roles (`Super Admin`, `Manager`, `Teacher`, `Finance`, `Student`),
  55 permissions including `students.assign_group`, `payments.read`, `settings.manage_crm`,
  `teacher.workspace`, `finance.workspace`.
* `packages/contracts/src/index.ts` — **6** roles (**adds `Admin`**), 44 permissions including
  `enrollments.*`, `lessons.*`, `assignments.*`, `grades.*`, `finance.invoices.read`,
  `audit_logs.read` — none of which the frontend model can express.

Consequences that are already real:

* The required **ADMIN** role has no representation in the frontend at all (finding P1-3), so its
  distinct workspace cannot be built.
* A backend guard can deny an action the UI believes is granted, and vice versa.
* `UserRoles`/`role-permissions` seeding writes `packages/contracts` codes that the frontend's
  `can()` function has never heard of.

**Recommended approach:** make `@sfera/contracts` the single source of truth, add the missing
permission vocabulary the frontend legitimately needs (`students.assign_group`,
`groups.manage_students`, `leads.manage_trial`, `settings.*`, `teacher.workspace`,
`finance.workspace`, `courses.manage_price`, …) to `ALL_PERMISSIONS`, add `Admin` to the frontend
`ROLES` union, then make `src/lib/rbac.ts` *derive* its tables from the contracts package instead of
duplicating them. Delete `ADMINISTRATOR_PERMISSIONS = PERMISSIONS` (which currently grants the
frontend Super Admin everything by accident rather than by design).

### 6.2 Run the database on a Docker-capable machine

```bash
docker compose up -d
pnpm --filter @sfera/db migrate
pnpm --filter @sfera/db seed
pnpm --filter @sfera/api start:dev
curl http://localhost:3000/api/docs          # Swagger
```

Then add integration tests proving, against real PostgreSQL:
payment rollback on failure, duplicate-payment prevention via idempotency key, partial payment →
`partially_paid` → `paid` transitions, refund adjusting `paidAmount`/`debtAmount`, and
**Student token → only own invoices**.

### 6.3 Then continue the phases

| Phase | Remaining work |
|---|---|
| 1 | Health/readiness/liveness endpoints, Pino wiring, rate limiting, env validation at boot, CORS tightening. |
| 2 | Finish auth: enrol/Clerk webhook → `users`; academy + resource scope tests; remove `test-token-*` from all non-test configs. |
| 3–5 | Teachers, schedules, lessons, leads/`lead_events`, attendance, assignments/submissions/grades/`grade_history`, then finance endpoints for `invoice_items`, `payment_allocations`, `debts`, `receipts`. |
| 6 | Frontend migration: typed API client, per-module query/mutation hooks, delete `crm-store`, `features/courses/data.ts`, `tasks-provider`, `teacher-student-sync`, and the **hard-coded `revenueSeries`** in `features/dashboard/index.tsx`. |
| 7 | Lighthouse desktop/mobile (Performance 90+, A11y 95+, Best Practices 95+, SEO 90+), viewport matrix 320→1440, bundle reduction (0.9 MB of demo screenshots, 56 kB gzip unused Clerk, 163 kB gzip `user-management`), error boundaries, debounced search, server-side pagination. |
| 8 | `pnpm build`, `pnpm lint`, `pnpm test`, `pnpm format:check`, migrations, backend integration tests, Playwright E2E, Lighthouse ×2, GitHub Actions CI. |

---

## 7. Repository hygiene actions still required

| Item | Finding | Recommendation |
|---|---|---|
| Nested worktree `.kilo/worktrees/helix-healer/` | P1-1 | Remove it from the working tree. It is a foreign copy of the project that inflates file counts, lint output and test results. It has been **excluded** from lint/test scope, but it should not be there. |
| Untracked backend | P0-7 | `apps/`, `packages/`, `docker-compose.yml` are still untracked. They should be committed so the backend is not lost. |
| `__screenshots__` directories in `src/**` | P2-6 | Move to a gitignored artifacts directory. |
| `.env.example` deprecated `VITE_*` credentials | P0-4 | Kept and clearly marked DEPRECATED because deleting them now would break the only working login. Remove in Phase 6. |
| Backend `noImplicitAny: false`, `strict: true` not enabled | — | `strictNullChecks` is now on (which fixed the build). Fully enabling `strict` is recommended next; `noImplicitAny` currently lets 13 `any`s through (lint warnings). |

---

## 8. Bottom line

The repository went from **not building, not compiling, and leaking student financial data** to:

* frontend build **green**,
* lint **0 errors** (from 114),
* backend **compiling, building and passing its tests for the first time**,
* **35 tables** with **real migration SQL** that did not exist before,
* three concrete security/correctness bugs fixed with comments explaining each root cause,
* and an honest, itemised account of everything still outstanding.

The frontend is **still a mock-data application**, and this document says so plainly. It will stay
that way until the database is applied and the role model is unified — at which point Phase 6 can
proceed safely and the mock stores can be deleted for real.