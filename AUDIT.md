# Sfera Academy CRM — Security & Architecture Audit Report

**Date:** 2026-09-22  
**Auditor:** Principal Full-Stack Architect & Security Engineer  
**Repository:** https://github.com/humoyun14uz/sfera-academy-CRM  
**Target Architecture:** Production-Ready, Secure, Multi-Tenant/Academy CRM  

---

## Executive Summary

An exhaustive audit of the **Sfera Academy CRM** repository was conducted. While the application boasts a polished, responsive user interface built on **React 19, TypeScript, Vite, Tailwind CSS (v4), TanStack Router, TanStack Table, React Hook Form, and Shadcn UI**, it currently functions almost entirely as a **client-side frontend demo**.

Crucial business data (students, courses, groups, attendance, grades, tasks, payments, leads, and audit activities) are stored in client-side `localStorage` and synchronous in-memory `Zustand` stores. Authentication is simulated on the client with hard-coded environment variables, roles and permissions are stored in client-manipulable cookies without `HttpOnly` protection, and there is zero server-side authorization or database backing.

The sections below categorize all findings into **P0 (Critical)**, **P1 (High)**, **P2 (Medium)**, and **P3 (Low)** priorities, followed by exact reproduction evidence and baseline audit command results.

---

## Baseline Verification Commands & Status

| Command | Status | Details |
|---|---|---|
| `pnpm build` (`tsc -b && vite build`) | **PASSED** | 0 TypeScript errors, bundle generated cleanly in ~5.85s |
| `pnpm lint` (`eslint .`) | **PASSED (with warnings)** | 0 errors, 16 warnings (`react-refresh/only-export-components`) |
| `pnpm test` (`vitest run --browser.headless`) | **IN PROGRESS / TIMEOUTS** | Pure unit tests (`cookies.test.ts`, `utils.test.ts`, `auth-store.test.ts`, `handle-server-error.test.ts`, `use-table-url-state.test.ts`) pass. Component-level tests running under Playwright Chromium headless suffer from 15-second timeouts on Radix dialog transitions and mounting. |

---

## Findings Matrix

### P0 — Critical Security & Architectural Blockers (Must Fix Immediately Before Production)

#### P0-1: Plaintext Credentials & Client-Side Authentication Bypass
- **Location:** `src/features/auth/sign-in/components/user-auth-form.tsx` (lines 52–117), `.env.example`
- **Issue:** Authentication occurs entirely in the browser. Passwords for `admin@gmail.com` (`SferaAdmin@2026`), `manager@gmail.com` (`SferaManager@2026`), `teacher@gmail.com` (`SferaTeacher@2026`), `finance@gmail.com` (`SferaFinance@2026`), and `student@gmail.com` (`SferaStudent@2026`) are read from `import.meta.env.VITE_*` and bundled directly into production JavaScript assets.
- **Impact:** Any user or attacker can inspect the client JavaScript bundle or browser memory to retrieve administrative credentials. Anyone can spoof authentication without ever communicating with a server.

#### P0-2: Insecure Authoritative Identity & Role Storage in JavaScript-Readable Cookies
- **Location:** `src/stores/auth-store.ts` (lines 4–76), `src/lib/cookies.ts`
- **Issue:** The application stores `AUTH_USER` (`{ email, role: ['Super Admin'], ... }`) and `ACCESS_TOKEN` (`'mock-access-token'`) in browser document cookies via `document.cookie`.
- **Impact:** Cookies lack `HttpOnly`, `Secure`, and `SameSite=Strict/Lax` protections. Any client script, browser console command, or cross-site scripting (XSS) payload can rewrite `document.cookie` or call `useAuthStore.getState().auth.setUser({ role: ['Super Admin'] })` to achieve immediate, full privilege escalation.

#### P0-3: Total Lack of Real Backend Persistence & Authoritative Database
- **Location:**
  - `src/lib/crm-store.ts` (Zustand store syncing to `localStorage.getItem('sfera-crm-state-v1')`)
  - `src/features/courses/data.ts` (`localStorage.getItem('sfera-academy-courses')`)
  - `src/lib/teacher-student-sync.ts` (`localStorage.getItem('sfera-shared-assignments')` and `localStorage.getItem('sfera-shared-grades')`)
  - `src/features/tasks/components/tasks-provider.tsx` (`localStorage.getItem('sfera-tasks-state-v1')`)
- **Issue:** There is no PostgreSQL database or REST API handling authoritative CRM data.
- **Impact:** No multi-user collaboration, no multi-tenant isolation, no data durability across devices or browsers, and data can be wiped or forged at any time by clearing or editing local storage.

#### P0-4: Missing Server-Side Authorization & Scope Isolation
- **Location:** `src/lib/route-guard.ts`, `src/lib/rbac.ts`
- **Issue:** Role checks (`can(auth.user?.role, permission)`) are evaluated exclusively on the frontend router before loading components.
- **Impact:**
  - A Student can forge a request or modify client state to view financial reports, modify attendance, or grade peers.
  - A Teacher is not restricted to assigned groups or lessons on a server level.
  - An Admin or Manager is not restricted to their designated `academyId`.

#### P0-5: Insecure Vite Configuration (`allowedHosts: true`)
- **Location:** `vite.config.ts` (line 15)
- **Issue:** `server: { host: '0.0.0.0', allowedHosts: true }`.
- **Impact:** Disabling host header checks exposes development and containerized instances to DNS rebinding attacks and malicious HTTP host header manipulation.

---

### P1 — High Severity: Data Integrity, Relational Integrity & Business Workflows

#### P1-1: Client-Generated Timestamp Identifiers (`Date.now()`)
- **Location:** `src/lib/crm-store.ts` (line 86: `id: pay-${Date.now()}`)
- **Issue:** Primary keys are generated using `Date.now()` on the client side.
- **Impact:** Prone to ID collisions under concurrent submissions, non-standard, guessable, and unsuitable for relational database foreign keys. Must be replaced with server-generated UUID v4 or cuid2.

#### P1-2: String-Based Relationships Instead of Normalized Foreign Keys
- **Location:** `src/lib/crm-store.ts`, `src/features/courses/data.ts`, `src/features/finance/index.tsx`
- **Issue:** Entities link to each other using display names or arbitrary strings:
  - `student.teacher = 'Temurbek'`
  - `student.course = 'Frontend Development'`
  - `group.teacher = 'Temurbek'`
  - `payment.student = 'Azizbek Karimov'`
- **Impact:** Renaming a teacher, course, or student breaks all historical associations. Impossible to guarantee referential integrity or build normalized database queries.

#### P1-3: Absence of ACID Transactions for Financial & Academic Operations
- **Location:** `src/lib/crm-store.ts` (`recordPayment`, `setApplicationStatus`), `src/features/academy-module/index.tsx`
- **Issue:** Multi-entity operations are performed sequentially in synchronous state mutations without transactional boundaries.
- **Impact:**
  - Converting a Lead into a Student + Group Enrollment can fail midway, creating orphaned records.
  - Recording a Payment without updating the corresponding Invoice status or Student Debt atomically causes financial discrepancies.
  - Recording Attendance without uniqueness constraints allows duplicate attendance records for the same student and lesson session.

#### P1-4: Competing Authentication Systems in the Codebase
- **Location:** `src/features/auth/` (custom mock flow) vs. `src/routes/clerk/` (`@clerk/react` integration)
- **Issue:** The repository contains an isolated demo for Clerk alongside a mock auth system. Neither communicates with a unified backend session or user management table.
- **Impact:** Architectural confusion, redundant dependencies, and inability to enforce a single source of truth for user identities.

#### P1-5: Missing Immutability & Audit Logs for Sensitive Actions
- **Location:** `src/lib/crm-store.ts` (`CrmActivity`)
- **Issue:** Activity logs are stored in client memory as a basic list of strings, easily overwritten or discarded. Grade changes, role reassignments, payment verifications, and attendance edits leave no cryptographically verifiable or immutable audit trails.

---

### P2 — Medium Severity: Architecture, State Management & UX Robustness

#### P2-1: Bypassing TanStack Query for Business Data
- **Location:** Entire `src/features/` directory
- **Issue:** While `@tanstack/react-query` is configured in `src/main.tsx`, components read and mutate data directly via `useCrmStore` (Zustand) and `localStorage`.
- **Impact:** No server caching, no optimistic locking, no automatic background refetching, no stale-time management, and no standardized query error boundaries.

#### P2-2: Massive Monolithic Feature Components
- **Location:**
  - `src/features/academy-module/index.tsx` (1,949 lines)
  - `src/features/finance/index.tsx` (1,863 lines)
  - `src/features/teacher/index.tsx` (1,267 lines)
- **Issue:** Single files contain UI presentation, mock data tables, modal dialogs, business logic calculations, export routines, and filter states.
- **Impact:** High maintenance overhead, difficult unit testing, and elevated risk of regressions during API migration.

#### P2-3: Full Browser Page Reloads Instead of Client-Side Router Navigation
- **Location:** `src/features/student/student-dashboard.tsx` (lines 86, 93)
- **Issue:** Uses `window.location.href = '/student/my-schedule'` instead of TanStack Router's `navigate({ to: '...' })` or `<Link to="..." />`.
- **Impact:** Causes complete DOM teardown, reloads the bundle, and resets client memory state.

#### P2-4: Missing API Empty, Loading, and Server-Side Validation States
- **Location:** All data table views and modal mutation forms
- **Issue:** Forms show immediate client success toasts (`toast.success(...)`) without waiting for backend confirmation or handling 400/401/403/409/422 HTTP responses.

---

### P3 — Low Severity: Code Health, Tooling & Linter Cleanliness

#### P3-1: Fast Refresh Linter Warnings
- **Location:** 16 route and provider files (e.g., `src/context/language-provider.tsx`, `src/routes/_authenticated/academy/$moduleId.tsx`)
- **Issue:** Exporting constants or helper functions alongside React components triggers `react-refresh/only-export-components`.

#### P3-2: Playwright Headless Browser Test Timeouts
- **Location:** `src/features/users/components/users-delete-dialog.test.tsx`, `src/features/auth/sign-in/components/user-auth-form.test.tsx`, etc.
- **Issue:** Vitest browser mode using Playwright Chromium experiences timeouts waiting for Radix UI dialog animations and portaled elements.

---

## Target Architecture Blueprint (Phase 1 Preview)

1. **Backend:** NestJS with Fastify adapter (high throughput, strict TypeScript, modular structure).
2. **Database:** PostgreSQL with Drizzle ORM and Drizzle Kit migrations.
3. **Primary Authentication:** Unified Clerk JWT verification on the backend (matching existing `@clerk/react` in frontend), with user profile, academy membership, roles, and granular permissions stored in PostgreSQL.
4. **Authorization:** Server-side Deny-by-Default RBAC Guard with Academy & Group Scope Interceptors.
5. **State Management:** TanStack Query for all server-backed entities; Zustand strictly reserved for harmless client UI state (theme, sidebar, active tabs).

