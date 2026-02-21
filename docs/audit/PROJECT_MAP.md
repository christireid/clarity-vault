# PROJECT MAP - Prompt Vault / Clarity Vault

> Generated: 2026-02-21 | Audit Version: 1.0

---

## Identity

- **Repo Name**: clarity-vault (mismatch with product name "Prompt Vault")
- **Package Name**: prompt-vault
- **Version**: 0.1.0
- **License**: Claims MIT, no LICENSE file exists
- **Status**: Pre-alpha scaffolding. Phase 1 of 15-phase plan partially complete.

---

## Tech Stack

| Layer | Technology | Version | Status |
|-------|-----------|---------|--------|
| Framework | Next.js (App Router) | 14.2.5 | OUTDATED - 20 CVEs |
| Language | TypeScript | ^5 | OK but 2 type errors |
| Styling | Tailwind CSS | ^3.4.1 | OK |
| UI Library | shadcn/ui (4 components) | N/A | Minimal |
| Database | PostgreSQL + Prisma | 5.19.0 | Schema only, no migrations |
| Vector DB | pgvector | Extension declared | Not used |
| Auth | Clerk | ^5.0.0 | Configured, middleware broken |
| API | tRPC | 11.0.0-rc.446 | RC version in "production" |
| State | Zustand + React Query | 4.5.4 / 5.51.0 | Configured, unused |
| Cache | Redis | Declared in docker-compose | Zero usage in codebase |
| Payments | Stripe | Env vars only | Zero implementation |
| Monitoring | Sentry + PostHog | Env vars only | Zero implementation |
| File Storage | Cloudflare R2 | Env vars only | Zero implementation |

---

## File Inventory (54 files, excluding node_modules/.git)

### App Routes
| Path | Purpose | Functional? |
|------|---------|-------------|
| `app/page.tsx` | Landing page | Yes - static marketing page |
| `app/layout.tsx` | Root layout with Clerk + providers | Yes |
| `app/providers.tsx` | tRPC + React Query + Toaster | Yes |
| `app/globals.css` | Design system + custom CSS | Yes |
| `app/(auth)/sign-in/` | Clerk sign-in | Boilerplate only |
| `app/(auth)/sign-up/` | Clerk sign-up | Boilerplate only |
| `app/(auth)/layout.tsx` | Auth layout | Exists |
| `app/(dashboard)/layout.tsx` | Dashboard sidebar + nav | Static HTML, no data |
| `app/(dashboard)/prompts/page.tsx` | Main prompts page | **STATIC EMPTY STATE** |
| `app/api/trpc/[trpc]/route.ts` | tRPC API handler | Configured |

### Missing Dashboard Pages (Listed in Sidebar, Don't Exist)
- `/collections` - 404
- `/playground` - 404
- `/analytics` - 404
- `/evaluations` - 404
- `/memory` - 404
- `/settings` - 404
- `/privacy` - 404 (linked in footer)
- `/terms` - 404 (linked in footer)

### Server
| Path | Purpose | Status |
|------|---------|--------|
| `server/api/trpc.ts` | tRPC context + middleware | Has TS error |
| `server/api/root.ts` | Router registry | 2 routers only |
| `server/api/routers/prompt.ts` | Prompt CRUD | Implemented, not connected to UI |
| `server/api/routers/user.ts` | User sync + prefs | **Security vulnerability** |
| `server/db/client.ts` | Prisma singleton | OK |

### Client State
| Path | Purpose | Status |
|------|---------|--------|
| `store/prompt-store.ts` | Prompt UI state | Defined, never used |
| `hooks/use-debounce.ts` | Debounce hook | Defined, never used |
| `hooks/use-local-storage.ts` | localStorage hook | Defined, never used |

### Configuration
| Path | Status |
|------|--------|
| `prisma/schema.prisma` | Comprehensive schema (10 models) |
| `prisma/seed.ts` | **Empty** - does nothing |
| `docker-compose.yml` | Postgres + Redis + dev tools |
| `.github/workflows/ci.yml` | Lint + typecheck + build + prisma validate |
| `.env.example` | Well-documented |
| `tailwind.config.ts` | Custom vault theme |
| `commitlint.config.js` | Conventional commits |

### UI Components (shadcn/ui)
Only 4 components installed:
- `button.tsx`
- `card.tsx`
- `input.tsx`
- `badge.tsx`

### Documentation
| Path | Content |
|------|---------|
| `README.md` | Generic, placeholder GitHub URL |
| `docs/IMPLEMENTATION_STRATEGY.md` | 15-phase, 6-8 month plan |
| `docs/PHASE_1_PROJECT_PLAN.md` | Phase 1 details |

---

## Tests

**Zero tests.** No test framework installed. No __tests__ directory. No test scripts.

---

## Evidence of Users

**None.** No analytics, no user data, no deployments, no production URL, no social proof.

---

## Monetization

**None implemented.** Pricing tiers defined in constants (Free/$29/$79/Enterprise) but zero Stripe integration beyond env vars.

---

## Summary Metrics

| Metric | Value |
|--------|-------|
| Total source files | 54 |
| Lines of code (approx) | ~2,500 |
| TypeScript errors | 2 |
| npm vulnerabilities | 20 (18 high, 1 critical) |
| Test coverage | 0% |
| Functional pages | 2 of 10+ planned |
| API routes implemented | 2 of 10+ planned |
| Features claimed | 6 |
| Features functional | 0 |
