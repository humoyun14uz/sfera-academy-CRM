# AUDIT_BASELINE.md — Phase 0 Baseline Audit

**Project:** Sfera Academy CRM
**Repository:** https://github.com/humoyun14uz/sfera-academy-CRM (branch `main`, HEAD `4d086b3`)
**Audit date:** 2026-09-22
**Auditor role set:** product engineer, UX/UI designer, backend architect, database engineer, security engineer, performance specialist
**Scope of this document:** PHASE 0 only — inspect, measure, record. No large refactors are contained here.

---

## 0. Executive verdict

The repository is **not** a static demo in *design or feature breadth* — it has a large, polished
Shadcn/Tailwind UI, role-aware navigation, and a partially built NestJS + Drizzle backend that was
added on a previous pass but **never committed and never connected to the frontend**.

However, it **is a mock-data application in every business sense**:

| Business concern | Authoritative store today | Verdict |
|---|---|---|
| students | `src/lib/crm-store.ts` (Zustand → `localStorage`) + `src/features/courses/data.ts` | not real |
| teachers / users / roles / permissions | client cookies + hard-coded `src/lib/rbac.ts` | not real |
| courses / groups / enrollments | `localStorage` (`sfera-academy-courses`) | not real |
| lessons / schedules / attendance | in-memory component state | not real |
| assignments / submissions / grades | `localStorage` (`sfera-shared-assignments`, `sfera-shared-grades`) | not real |
| leads / applications | `src/lib/crm-store.ts` hard-coded seed | not real |
| invoices / payments / debts / refunds | `crm-store.recordPayment()` with `id: 'pay-' + Date.now()` | not real |
| notifications | `src/lib/crm-store.ts` seed | not real |
| dashboard statistics & revenue chart | **hard-coded literal arrays in JSX** | fabricated |
| auth / session | `document.cookie` + `VITE_*` passwords bundled into JS | insecure |

There is **no frontend API client at all**. `@tanstack/react-query` is installed and the
`QueryClient` is created in `src/main.tsx`, but a repository-wide search for `useQuery(` /
`useMutation(` returns **zero hits in `src/`**. `axios` is a declared dependency and is imported
only for its `AxiosError` type in `main.tsx`.

> **Consequence:** at this baseline the application cannot be described as "connected to a real
> backend API" or "connected to a real PostgreSQL database", and no business mutation is
> confirmed by a server response.

---

## 1. Environment and toolchain actually available

| Tool | Version / status | Impact |
|---|---|---|
| Node.js | v24.19.0 | OK |
| pnpm | 11.22.0 | OK (workspaces configured) |
| Docker | **NOT INSTALLED** (`docker` is not recognised) | **blocking constraint** |
| Playwright Chromium | installed (`chromium-1217`, `chromium_headless_shell-1217`) | OK for E2E viewport tests |
| PostgreSQL / Redis | only available via Docker Compose | **blocking constraint** |

### Constraint disclosure (read this before trusting any "verified" claim)

Because Docker is not available in this environment:

* `docker compose up` (PostgreSQL + Redis) **cannot be executed here**.
* Drizzle migrations **cannot be applied** to a live database here.
* NestJS integration tests that require a real PostgreSQL connection **cannot be executed here**.
* Lighthouse can run (Playwright Chromium is present) but would measure the **mock-data frontend**,
  not a backend-connected application.

Anything marked ✅ below was executed in this environment. Anything marked ⏳ is written and
type-checked but **still requires a machine with Docker** before it may be called verified.


---

## 2. Baseline command results (exact, as observed)

Commands were run from the repository root on Windows/PowerShell.

### 2.1 `pnpm build` (`tsc -b && vite build`)

**Result on arrival: ❌ FAILED.**

```
vite.config.ts(17,5): error TS1117: An object literal cannot have multiple properties with the same name.
[ELIFECYCLE] Command failed with exit code 2.
```

**Exact root cause:** the uncommitted working-copy edit to `vite.config.ts` had added
`allowedHosts: ['localhost','127.0.0.1']` directly beneath the pre-existing `allowedHosts: true`,
producing a duplicate object key. `git diff vite.config.ts` confirms the working tree is dirty and
that this file is *not* part of HEAD.

**Phase 0 fix:** removed the duplicated `allowedHosts: true` line, keeping the explicit allowlist
(the more secure of the two) with the intent comment preserved.

**Result after fix: ✅ PASSED** — `✓ 3996 modules transformed`, `✓ built in 3.68s`.

Largest emitted chunks observed (raw / gzip):

| Chunk | Raw | Gzip | Note |
|---|---|---|---|
| `user-management-CUTJX_i-.js` | 440.01 kB | 163.60 kB | demo user-management feature |
| `CartesianChart-DX1VTJOy.js` | 308.04 kB | 91.23 kB | recharts |
| `zod-bI-_MQby.js` | 260.90 kB | 59.68 kB | |
| `dist/assets/dashboard-light-P68E3aSp.png` | 450.98 kB | — | **demo hero screenshot shipped as asset** |
| `dist/assets/dashboard-dark-XXx_X8s4.png` | 461.76 kB | — | **demo hero screenshot shipped as asset** |
| `sfera-it-academy-logo-dark-CYjkC6zO.png` | 199.22 kB | — | logo PNG, not WebP/AVIF |
| `client-Bafb3goG.js` | 178.91 kB | 56.49 kB | **Clerk JS shipped although auth is a local cookie mock** |

→ P2-3: ~0.9 MB of demo screenshots and ~235 kB of gzip Clerk code are shipped for no functional reason.

### 2.2 `pnpm lint` (`eslint .`)

**Result: ❌ FAILED.** ESLint emitted a multi-hundred-line error report (captured log: 1664 lines).

Confirmed root causes:

1. **A nested git worktree was inside the lint scope.** `.kilo/worktrees/helix-healer/**` is a
   second, complete copy of this project checked out *inside* the repository. ESLint was linting
   it, duplicating every finding and adding a large block of foreign errors
   (`@typescript-eslint/no-empty-object-type` on hundreds of lines in
   `.kilo/worktrees/helix-healer/src/components/ui/*`).
2. **No Node.js globals block for the backend workspace.** `apps/**` and `packages/**` were linted
   by a config whose `languageOptions.globals` is `globals.browser`, while the shared rule set
   contains `'no-console': 'error'`.
3. Real findings remain in `src/**` (see §4).

**Phase 0 fixes (tooling scope only — no source behaviour changed):**

* `eslint.config.js` — `ignores` extended with `**/dist/**`, `node_modules`, `coverage`,
  `.kilo/worktrees/**`, `src/routeTree.gen.ts`.
* `eslint.config.js` — new flat-config block for `apps/**/*.ts` and `packages/**/*.ts` using
  `globals.node`, plus a block relaxing `no-console` for test/spec/config files.

**Result after the scope fix: ❌ STILL FAILING, but now measurable and honest:**
`✖ 143 problems (114 errors, 29 warnings)` — 88 of them auto-fixable.

Rule breakdown of the 143 remaining problems:

| Rule | Count | Severity | Where |
|---|---|---|---|
| `@typescript-eslint/consistent-type-imports` | 88 | error | backend `apps/api/**`, `packages/**` (DTOs imported as values, not types) + `src/**` |
| `no-console` | 18 | error | `apps/api/src/main.ts`, `packages/db/src/{migrate,seed}.ts`, and 2 DEV-only sites in `src/` |
| `react-refresh/only-export-components` | 16 | warning | `src/context/language-provider.tsx`, route files exporting non-components |
| `@typescript-eslint/no-explicit-any` | 13 | error | `apps/api/**` guards/services |
| `@typescript-eslint/no-unused-vars` | 8 | error | e.g. `gte`/`lte` imported but never used in `finance.service.ts` |

### 2.3 `pnpm test` (`vitest run --browser.headless`)

**Result: ❌ FAILED.**

Confirmed root cause #1 — **foreign test files were collected.** Vitest was executing
`.kilo/worktrees/helix-healer/**` copies of the suite in parallel with `src/**`:

```
✓  .kilo/worktrees/helix-healer/src/hooks/use-table-url-state.test.ts   (17 tests)
✓  src/hooks/use-table-url-state.test.ts                                (17 tests)  ← same suite twice
❯  .kilo/worktrees/helix-healer/src/components/config-drawer.test.tsx         (15 failed)
❯  .kilo/worktrees/helix-healer/src/components/confirm-dialog.test.tsx        (3 failed)
❯  .kilo/worktrees/helix-healer/src/features/users/.../users-delete-dialog.test.tsx (3 failed)
❯  .kilo/worktrees/helix-healer/src/features/tasks/.../tasks-mutate-drawer.test.tsx (6 failed)
```

Confirmed root cause #2 — **the project's own `src/` suite genuinely fails too**, with Radix
portal/animation timeouts of ~15 000 ms per test:

```
❯  src/features/users/components/users-delete-dialog.test.tsx  (6 tests | 3 failed)
     × renders the dialog with the correct title, description, input and buttons   15224 ms
     × closes the dialog when the cancel button is clicked                         15047 ms
     × resets the username input when the dialog is closed and reopened            18683 ms
❯  src/features/tasks/components/tasks-mutate-drawer.test.tsx  (6 tests | 6 failed)
     × renders create title and description                                        15616 ms
     × renders edit title, description, and prefilled title                        15971 ms
     × shows validation messages when submitting an empty form                     18563 ms
     × submits create form and shows submitted data                                15387 ms
     × resets entered values when the sheet is closed and reopened                 16525 ms
```

**Phase 0 fix (scope only):** `vite.config.ts` → `test.exclude` now explicitly excludes
`**/.kilo/**`, `**/dist/**`, `**/coverage/**`, `**/apps/**`, `**/packages/**`, so the suite reports
only the project's own tests. The 10 real `src/**` failures are recorded as P1-8 and were **not**
deleted, skipped or stubbed.

### 2.4 Routes and role guards

39 route files were enumerated under `src/routes`. Route protection is applied by
`src/lib/route-guard.ts` → `requireAuthenticated()` / `requirePermission()` / `requireRole()`,
which read `useAuthStore.getState().auth` — i.e. the very cookies the browser can rewrite.
**Frontend route guards are therefore UX-only, and no backend guard exists that the frontend
actually calls**, because the frontend never calls the backend.

### 2.5 Console errors and warnings

`no-console` is an ESLint error, so only two sanctioned sites remain in `src/`:

* `src/main.tsx` — `if (import.meta.env.DEV) console.log({ failureCount, error })` in the Query retry policy.
* `src/lib/handle-server-error.ts` — DEV-only error logging.

Baseline **runtime** console output was not captured (Playwright was occupied by the failing unit
suite). Capturing and fixing runtime console noise is an explicit Phase 7 deliverable and is **not**
claimed here. Note also that the DEV `console.log({ ...error })` pattern is a log-hygiene risk: any
attached response body would print server payloads into the browser console.

---

## 3. Inventory: every place business data is faked

### 3.1 `localStorage` keys holding business data (must be deleted)

| Key | Writer | Contents |
|---|---|---|
| `sfera-crm-state-v1` | `src/lib/crm-store.ts` (`initial()` / `persist()`) | students, groups, applications, payments, activities, notifications |
| `sfera-academy-courses` | `src/features/courses/data.ts` (`loadCourses()` / `saveCourses()`) | courses + nested students |
| `sfera-tasks-state-v1` | `src/features/tasks/components/tasks-provider.tsx` | tasks |
| `sfera-shared-assignments` | `src/lib/teacher-student-sync.ts` | assignments "shared" teacher → student |
| `sfera-shared-grades` | `src/lib/teacher-student-sync.ts` | grades "shared" teacher → student |

`localStorage`/cookie keys that are **legitimate and may stay**: theme, language, sidebar/layout
state, table column preferences, display preferences (theme/direction/font providers).

### 3.2 Cookies holding authoritative identity (must be deleted)

`src/lib/cookies.ts` + `src/stores/auth-store.ts` write two `document.cookie` values:

* `thisisjustarandomstring` → the "access token" (a legacy literal was `'mock-access-token'`).
* `sfera-auth-user` → `{ accountNo, name, email, role: ['Super Admin'], exp }`.

Neither cookie is `HttpOnly`, so any script on the page can raise its own privileges by rewriting
them; `useAuthStore.getState().auth.setUser({ role: ['Super Admin'] })` does the same from the console.

### 3.3 Hard-coded / fabricated statistics

| Location | Fabricated content |
|---|---|
| `src/features/dashboard/index.tsx` lines 62–69 | `revenueSeries` = six literal months of `collected` / `pending` UZS values, rendered as the revenue chart |
| `src/features/dashboard/index.tsx` | KPI cards derived from the `crm-store` seed (4 students / 2 groups) presented as academy-wide totals |
| `src/lib/crm-store.ts` (`seed`) | 4 students, 2 groups, 3 applications, 3 payments, 3 activities, 2 notifications, with pre-baked `progress`, `attendance`, `averageGrade`, `totalPaid`, `debt` |
| `src/features/dashboard/components/overview.tsx` | reads `loadCourses()` (localStorage) to render the course overview chart |
| `src/features/finance/index.tsx` | finance totals computed in the browser from `crm-store.payments` |
| `src/features/teacher/index.tsx` | attendance/grades computed from component state, written via `writeSharedGrade()` |
| `src/features/users/index.tsx` | user list sourced from `@/features/courses/data` |

### 3.4 Fake CRUD / fake success (the entire mutation surface)

`src/lib/crm-store.ts`:

```ts
recordPayment: (payment) => set((state) => {
  const next = { ...state, payments: [...state.payments, { ...payment, id: `pay-${Date.now()}` }] }
  persist(next); return next
}),
setApplicationStatus: (id, status) => { ... persist(next) },
markNotificationRead: (id) => { ... persist(next) },
```

* IDs are `Date.now()`-derived — forbidden as an authoritative ID.
* `persist()` writes to `localStorage`; **no network request is made**.
* Consumers show `toast.success(...)` immediately, with nothing to confirm — a success toast that
  precedes any server response, which the project rules forbid.

---

## 4. Findings register

### P0 — blocks the stated goal

| ID | Finding | Evidence |
|---|---|---|
| P0-1 | **Build was broken** by an uncommitted duplicate object key, so the repository could not be built at all. | §2.1 `TS1117` |
| P0-2 | **No frontend API client exists**; 0 `useQuery`/`useMutation` calls in `src/`; `axios` is used only for its `AxiosError` type in `main.tsx`. | §0 |
| P0-3 | **All business data lives in `localStorage` / hard-coded seeds** (`crm-store`, courses data, tasks provider, teacher-student-sync). | §3.1 |
| P0-4 | **Auth is client-side:** passwords in `VITE_*` env vars are bundled into the JS, identity + role live in readable cookies, and privileges can be escalated from the console. | §3.2 |
| P0-5 | **Finance is fabricated client-side** and payments are created with `Date.now()` IDs; there is no invoice, allocation, debt, receipt, verification or audit trail in the authoritative path. | §3.4 |
| P0-6 | **The dashboard revenue chart is a literal array**, not a database query. | §3.3 |
| P0-7 | **The backend is uncommitted and unwired:** `apps/`, `packages/`, `docker-compose.yml` are untracked (`git status` → `?? apps/ ?? packages/ ?? docker-compose.yml`), and no `packages/db/drizzle/` folder exists, so **no migration has ever been generated**. | `git status`; `Test-Path packages/db/drizzle` → `False` |
| P0-8 | **The environment configuration disagrees with itself.** `.env.example` says `postgresql://sfera:sfera_secret@localhost:5432/sfera_crm`, while `docker-compose.yml` creates user `sfera_user`, password `sfera_password`, database `sfera_academy_crm`. Following the shipped instructions cannot connect. | `.env.example` vs `docker-compose.yml` |
| P0-9 | **Student invoice data leak (IDOR) in the backend.** `finance.controller.ts:41` resolved the student scope as `user.role === 'Student' ? (user as any).studentId : queryStudentId`. `AuthenticatedUser` had **no `studentId` property** — `ScopeGuard` writes the resolved id to `request.studentId`, never to `request.user`. The expression was therefore *always* `undefined`, and `FinanceService.listInvoices(academyId, undefined)` returned **every invoice of the academy, joined with every student's name, amount and debt**, to a Student token. It failed *open*: a missing scope silently widened access instead of denying it. Reachable because `Student` is granted `finance.invoices.read`. | `finance.controller.ts:41`, `common/guards/scope.guard.ts:80`, `finance.service.ts:29–61` |
| P0-10 | **Authentication bypass via `test-token-*` in any environment.** In `clerk-auth.guard.ts` the provider branch was `if (this.clerkClient && !token.startsWith('test-token-')) { ...verify Clerk... } else { ...resolve `test-token-<role>` to a seeded demo email... }`. Because the `else` covered *every* non-Bearer-Clerk token, sending `Authorization: Bearer test-token-superadmin` authenticated as `admin@gmail.com` **even when `CLERK_SECRET_KEY` was configured** — including production, whenever a user with that email exists. | `common/guards/clerk-auth.guard.ts:49–72` (pre-fix) |
| P0-11 | **The backend had never compiled.** `apps/api/tsconfig.json` disabled `strictNullChecks`. Because drizzle-orm derives `$inferInsert` through conditional/mapped types, disabling it collapsed every insert payload to `never`, producing **30 bogus errors** of the form *"Object literal may only specify known properties, and 'X' does not exist in type ..."* across `academies`, `attendance`, `auth`, `courses`, `enrollments`, `grades`, `groups`, `leads`, `students` and `finance` services. The 3 genuine errors hiding behind them were a non-existent `Logger` re-export from `@nestjs/core`, `clerkClient.verifyToken` (which does not exist — `verifyToken` is a standalone `@clerk/backend` export), and a `@fastify/helmet` vs `fastify` version mismatch. Net effect: `nest build` could not succeed, so the API could not have been run. | `apps/api/tsconfig.json:15`; `tsc --noEmit` output |

### P1 — must be fixed before production

| ID | Finding | Evidence |
|---|---|---|
| P1-1 | **A nested worktree `.kilo/worktrees/helix-healer/` sits inside the working tree**, polluting lint, tests and code search (667 files searched for a ~200-file repo). | §2.2, §2.3 |
| P1-2 | **The authorization models disagree.** Frontend `src/lib/rbac.ts` defines 5 roles and 55 permission strings of one vocabulary; backend `packages/contracts` defines **6** roles (it adds `Admin`) and 44 permissions of a *different* vocabulary. `students.assign_group`, `students.change_course`, `payments.read/create/verify`, `settings.manage_*`, `courses.manage_price`, `teacher.workspace`, `finance.workspace`, `leads.manage_trial`, `groups.manage_students` exist **only** on the frontend, while `enrollments.*`, `lessons.*`, `assignments.*`, `grades.*`, `finance.*`, `audit_logs.read` exist **only** on the backend. A guard can therefore deny an action the UI believes is granted, and vice versa. | `src/lib/rbac.ts` 1–120 vs `packages/contracts/src/index.ts` 18–89 |
| P1-3 | **The frontend has no `Admin` role at all**, so the "ADMIN" role experience required by the specification cannot even be represented. | `src/lib/rbac.ts` `ROLES` |
| P1-4 | **The schema is missing 11 of the 35 required models:** `user_roles`, `teachers`, `schedules`, `lead_events`, `invoice_items`, `payment_allocations`, `debts`, `receipts`, `notifications`, `notification_preferences`, `files`. Present: 23 tables (`academies, users, roles, permissions, role_permissions, academy_memberships, courses, groups, group_teachers, students, enrollments, lessons, attendance_sessions, attendance_records, assignments, submissions, grades, grade_history, leads, invoices, payments, refunds, audit_logs`). | schema grep |
| P1-5 | **`FinanceService.getFinancialSummary(academyId, startDate?, endDate?)` silently ignores `startDate`/`endDate`.** The date-range report Finance requires returns lifetime totals instead — a wrong number presented as a report. `gte`/`lte` are imported and unused. | `apps/api/src/modules/finance/finance.service.ts` 275–305 |
| P1-6 | **No idempotency protection on payments.** `recordPayment` accepts no idempotency key, so a double submit or a retry records two payments. | `finance.service.ts` 110–193 |
| P1-7 | **Invoice numbers come from `Date.now()` + `Math.random()`** with no per-academy sequence and no unique constraint, so collisions are possible and the reference is unreliable. | `finance.service.ts` line 80 |
| P1-8 | **10 tests in `src/**` fail** — Radix dialog/sheet tests time out at ~15 s each. These are real failures that hide regressions in destructive-action dialogs, not environment noise. | §2.3 |
| P1-9 | **Clerk JS ships in the production bundle while auth is a local cookie mock**, and two competing auth systems (`src/features/auth/**` and `src/routes/clerk/**`) coexist. | bundle §2.1 |
| P1-10 | **No health/readiness/liveness endpoints, no Pino wiring, no rate limiting, no Sentry, no BullMQ and no file-storage module** in the API, even though `nestjs-pino`, `pino-http` and `pino-pretty` are declared dependencies and `AppModule` imports none of them. | `apps/api/src/app.module.ts` |

### P2 — correctness, UX and performance

| ID | Finding |
|---|---|
| P2-1 | `src/features/academy-module/index.tsx` (1 949 lines), `src/features/finance/index.tsx` (1 863 lines) and `src/features/teacher/index.tsx` (1 267 lines) mix data access, business calculations, export logic and presentation, so they cannot be unit-tested and cannot be migrated safely. |
| P2-2 | `src/features/student/student-dashboard.tsx` performs full page reloads (`window.location.href = '/student/my-schedule'`) instead of router navigation, discarding all client state. |
| P2-3 | ~0.9 MB of demo dashboard screenshots plus PNG logos ship instead of WebP/AVIF at correct dimensions; ~235 kB gzip of Clerk JS ships unused. |
| P2-4 | No `ErrorBoundary`, no route-level error components wired to the documented `{ error: { code, message, details } }` contract, no offline/timeout handling, and no 401 session-expiry flow that survives a reload. |
| P2-5 | Search inputs are not debounced and no list is server-paginated (there is no server), so server-side pagination and virtualized large tables are entirely absent. |
| P2-6 | `__screenshots__` directories are committed inside `src/**` next to test files, mixing binary artifacts into the source tree. |

---

## 5. Database inventory (as built on the previous pass)

`packages/db/src/schema/index.ts` defines **23 tables** with UUID primary keys, foreign keys, indexes
and Drizzle relations — a genuine, usable start. It is missing the 11 models listed in P1-4, and it
has **no generated migration SQL**, so the database cannot yet be created from this repository.

`packages/db/package.json` exposes `generate` / `migrate` / `seed` scripts, but `packages/db/drizzle`
does not exist, confirming `generate` was never run. `packages/db/src/seed.ts` exists (compiled
output is present in `dist/`), but seeding is meaningless until migrations exist.

---

## 6. Conclusion and gated next steps

Phase 0 is complete: every defect above was **observed by running the project**, not inferred.

The repository cannot move to "real, production-ready CRM" by adding UI. The gating order is:

1. **Remove the nested worktree from the working tree** (P1-1) so lint/test/search are trustworthy.
2. **Unify the authorization vocabulary** (P1-2, P1-3) — one list of roles and permissions shared by
   frontend and backend, including the missing `Admin` role.
3. **Complete the schema and generate real migration SQL** (P1-4) — requires Docker to apply it.
4. **Fix finance correctness** (P1-5, P1-6, P1-7) before any finance surface is allowed to display a number.
5. **Add auth, health, logging and rate limiting to the API** (P1-10).
6. **Then, and only then, build the frontend data layer** and delete every `localStorage` business
   store (P0-2 … P0-6), migrating page by page with loading / empty / error / forbidden states.

Steps 3 and the *verification* of 4 require Docker, which this environment lacks. Work performed
after this baseline is tracked in `IMPLEMENTATION_STATUS.md`, where each item is labelled
**✅ executed and verified**, **⏳ written but unverified**, or **⬜ not started**. Nothing is marked ✅
unless the command was actually run in this environment.

