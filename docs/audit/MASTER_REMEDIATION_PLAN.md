# MASTER REMEDIATION PLAN

> Executable steps. No vague advice. Every item has exact actions, files, and validation.

---

## SPRINT 1: MAKE IT BUILD

### FIX-001: Fix TypeScript Error - Clerk Middleware
- **File**: `middleware.ts`
- **Action**: Replace `await auth.protect()` with correct Clerk v5 API
- **Code**: Use `auth().protect()` pattern or redirect-based approach
- **Validation**: `npm run typecheck` passes with 0 errors for this file

### FIX-002: Fix TypeScript Error - Prisma JSON Type
- **File**: `server/api/routers/prompt.ts:575`
- **Action**: Cast `variables` to satisfy Prisma's InputJsonValue type
- **Code**: Use `as Prisma.InputJsonValue` or `JSON.parse(JSON.stringify(...))`
- **Validation**: `npm run typecheck` passes

### FIX-003: Fix Google Font Build Failure
- **File**: `app/layout.tsx`
- **Action**: Replace `next/font/google` with system font stack or local font
- **Code**: Use CSS `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **Validation**: `npm run build` no longer fails on font fetch

### FIX-004: Update Next.js for CVE Fixes
- **Action**: `npm install next@14.2.35`
- **Validation**: `npm audit` shows 0 critical/high from Next.js

### FIX-005: Secure syncFromClerk Endpoint
- **File**: `server/api/routers/user.ts`
- **Action**: Change `publicProcedure` to `protectedProcedure` or move to dedicated webhook handler
- **Minimum**: Add a shared secret check or remove entirely and handle user creation in middleware
- **Validation**: Endpoint requires authentication

### FIX-006: Fix Clerk Middleware Auth
- **File**: `middleware.ts`
- **Action**: Use correct Clerk v5 middleware pattern
- **Validation**: Auth routes protect correctly, TypeScript compiles

---

## SPRINT 2: MAKE IT WORK

### FIX-007: Wire Prompts Page to tRPC
- **File**: `app/(dashboard)/prompts/page.tsx`
- **Action**: Convert to client component, add tRPC query hooks, display prompt list
- **Dependencies**: Need workspace ID (from user.me query)
- **Validation**: Prompts page fetches and displays data from API

### FIX-008: Make Create Prompt Button Functional
- **Files**: `app/(dashboard)/prompts/page.tsx`, new dialog component
- **Action**: Add create prompt dialog/form using tRPC mutation
- **Components needed**: Dialog, Form, Textarea (add from shadcn)
- **Validation**: User can create a prompt and see it in the list

### FIX-009: Add Placeholder Pages for 404 Routes
- **Files**: Create page.tsx for: collections, playground, analytics, evaluations, memory, settings
- **Action**: Simple "Coming Soon" placeholder for each
- **Validation**: All sidebar links render a page (no 404s)

### FIX-010: Fix Broken Links
- **File**: `app/page.tsx`
- **Actions**:
  - Remove or fix "View on GitHub" link
  - Remove /privacy and /terms footer links (or create placeholder pages)
- **Validation**: No broken links on landing page

### FIX-011: Fix README
- **File**: `README.md`
- **Actions**:
  - Fix clone URL
  - Remove reference to non-existent contributing guidelines
  - Add honest project status section
- **Validation**: README accurately reflects project

### FIX-012: Add LICENSE File
- **File**: `LICENSE` (new)
- **Action**: Create MIT license file
- **Validation**: File exists at repo root

### FIX-013: Honest Landing Page
- **File**: `app/page.tsx`
- **Action**: Update feature descriptions to reflect actual status
- **Alternative**: Add "Coming Soon" badges to unimplemented features
- **Validation**: No false claims on landing page

### FIX-014: Add postinstall Script
- **File**: `package.json`
- **Action**: Add `"postinstall": "prisma generate"` to scripts
- **Validation**: `npm install` automatically generates Prisma client

### FIX-015: Consolidate Validation Schemas
- **Files**: `server/api/routers/prompt.ts`, `lib/validations/prompt.ts`
- **Action**: Import schemas from `lib/validations/prompt.ts` in router
- **Validation**: Single source of truth, both files reference same schemas

### FIX-016: Replace Inline SVGs with Lucide React
- **Files**: `app/(dashboard)/layout.tsx`, `app/page.tsx`
- **Action**: Replace all inline SVG icons with lucide-react components
- **Validation**: Same visual result, cleaner code

### FIX-017: Clean Up Dead Code
- **Files**: Multiple (utils, constants, hooks)
- **Action**: Remove unused functions, constants, and exports
- **Keep**: Only code that is actually imported/used
- **Validation**: No unused exports flagged by TypeScript/ESLint

### FIX-018: Fix Variable Extraction Pattern
- **File**: `server/api/routers/prompt.ts`
- **Action**: Use `String.matchAll()` instead of global regex with lastIndex
- **Validation**: Same behavior, no shared state risk

---

## SPRINT 3: MAKE IT CREDIBLE

### FIX-019: Add Basic Test Setup
- **Action**: Install vitest, create test config, add basic tests
- **Files**: `vitest.config.ts`, `__tests__/` directory
- **Tests to write**: extractVariables, prompt router input validation, utility functions
- **Validation**: `npm test` runs and passes

### FIX-020: Update Model Names
- **File**: `lib/constants.ts`
- **Action**: Update model IDs to current versions
- **Validation**: Model names match current provider offerings

### FIX-021: Add Seed Script Content
- **File**: `prisma/seed.ts`
- **Action**: Add sample prompts, workspace, and user for development
- **Validation**: `npm run db:seed` creates usable dev data

---

## Validation Gate

After all fixes:
1. `npm run typecheck` - 0 errors
2. `npm run lint` - 0 warnings
3. `npm run build` - succeeds (or succeeds with env vars)
4. `npm audit` - 0 critical, 0 high
5. All pages render (no 404s from navigation)
6. Create Prompt button works
7. Prompts list displays data
