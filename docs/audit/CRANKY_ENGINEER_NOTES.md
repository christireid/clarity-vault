# CRANKY ENGINEER NOTES

> Perspective: Senior engineer who has seen it all. Zero patience for anti-patterns.

---

## DX Friction Points

### 1. Can't Build the Project
Clone. Install. Build. This is the minimum bar. `npm run build` fails because:
1. Google Fonts requires network access at build time
2. Two TypeScript errors exist

If a new developer can't `npm run build` after `npm install`, the DX is broken. Period.

**Fix**: Use local fonts or system font stack. Fix TS errors.

### 2. Prisma Generate Required Before Typecheck
`npm run typecheck` fails without `npx prisma generate` first. There's no postinstall script to handle this. New developer will see confusing errors about `@prisma/client` not existing.

**Fix**: Add `"postinstall": "prisma generate"` to package.json scripts.

### 3. No npm Test Script
Running `npm test` does nothing useful. No test framework. No test runner configured.

### 4. CI Would Fail
The GitHub Actions CI pipeline runs typecheck and build. Both would fail. Anyone pushing a PR gets red checks. This demoralizes contributors.

---

## Anti-Patterns

### 1. Duplicate Validation Schemas
`lib/validations/prompt.ts` and `server/api/routers/prompt.ts` define the same Zod schemas independently. They WILL drift. Single source of truth or delete one.

**File 1**: `lib/validations/prompt.ts` - createPromptSchema, updatePromptSchema, createVersionSchema
**File 2**: `server/api/routers/prompt.ts` - exact same schemas, slightly different

### 2. Unused Code Everywhere
- `useDebounce` hook - imported nowhere
- `useLocalStorage` hook - imported nowhere
- `usePromptStore` - imported nowhere
- `formatCurrency()` - used nowhere
- `formatBytes()` - used nowhere
- `generateId()` - used nowhere (nanoid is in deps)
- `slugify()` - used nowhere
- `sleep()` - used nowhere
- `isServer()` - used nowhere
- `KEYBOARD_SHORTCUTS` constant - used nowhere
- `EVALUATION_CRITERIA` constant - used nowhere
- `MEMORY_TYPES` constant - used nowhere
- `CONTEXT_TYPES` constant - used nowhere
- `ALLOWED_FILE_TYPES` constant - used nowhere

Over half the utility code is dead code. It was written speculatively and never connected.

### 3. Inline SVG Icons Everywhere
Dashboard layout has 7 inline SVG icons. Landing page has 6 more. These should be using `lucide-react` (which is already a dependency!) instead of copy-pasting SVG paths.

```tsx
// BAD - current approach (7 copies of this pattern)
<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="..." />
</svg>

// GOOD - what it should be
import { FileText, FolderOpen, Play, BarChart3 } from "lucide-react";
<FileText className="h-5 w-5" />
```

### 4. Static Page Pretending to Be Dynamic
`app/(dashboard)/prompts/page.tsx` is a fully static component. No `useEffect`, no data fetching, no tRPC hooks. The search input doesn't search. The filter button doesn't filter. The create button doesn't create. It's a Figma export.

### 5. Global Regex with Manual lastIndex Reset
```typescript
const VARIABLE_PATTERN = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;
// ...
VARIABLE_PATTERN.lastIndex = 0;
while ((match = VARIABLE_PATTERN.exec(content)) !== null) {
```
Use `String.matchAll()` or create the regex inside the function. Module-level global regex with shared state is a footgun.

### 6. Type Assertions Instead of Type Safety
```typescript
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};
```
This is the standard Prisma pattern, so it gets a pass. But it's representative of a codebase that reaches for `as` instead of proper typing.

---

## Over-Engineering

### 1. The Schema
10 database models for a product that can't create a prompt. The Memory model alone has 15 fields, vector embeddings, importance scoring, session tracking, and expiration. For Phase 1.

### 2. The Docker Setup
4 services (Postgres, Redis, Redis Commander, pgAdmin). For development of a product that uses exactly 1 of those services (Postgres, and only its schema).

### 3. The Implementation Plan
15 phases. 34 weeks. Success metrics. Risk mitigation matrix. Competitive analysis. For a solo project that hasn't shipped a CREATE button.

### 4. env vars for Services Not Used
The .env.example has 30+ environment variables for: Redis, Stripe, Sentry, PostHog, Cloudflare R2, OpenAI, Anthropic, Cohere, Google AI. None of these are used in the code.

---

## Reinventing Wheels

### 1. Custom Debounce Function
`lib/utils.ts` has a `debounce()` function. There's also a `useDebounce` hook. And `lodash` isn't in deps. For the record: the hook approach is correct for React, the utility function is dead code.

### 2. Custom Relative Date Formatter
`formatRelativeDate()` exists in utils. `date-fns` is already a dependency and has `formatDistanceToNow()`.

### 3. Custom ID Generator
`generateId()` uses `Math.random().toString(36)`. `nanoid` is already in the dependencies and is purpose-built for this. And Prisma uses `cuid()` for IDs. Three ID generation strategies, none of them aligned.

---

## What I'd Do

1. Delete all unused code (hooks, utils, constants that nothing references)
2. Fix the 2 TS errors
3. Update Next.js to fix CVEs
4. Wire up the prompts page to tRPC
5. Replace inline SVGs with lucide-react
6. Delete the duplicate validation schemas
7. Add `"postinstall": "prisma generate"` to package.json
8. Add a basic Vitest setup with tests for the prompt router
9. Use local fonts instead of Google Fonts
10. Get the build green
