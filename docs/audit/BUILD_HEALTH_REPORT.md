# BUILD HEALTH REPORT

> Generated: 2026-02-21

---

## Summary

| Check | Status | Details |
|-------|--------|---------|
| `npm install` | WARN | 20 vulnerabilities (18 high, 1 critical), deprecated ESLint v8 |
| `npx prisma generate` | PASS | Client generated successfully |
| `npm run lint` | PASS | No ESLint warnings or errors |
| `npm run typecheck` | FAIL | 2 TypeScript errors |
| `npm run build` | FAIL | Google Font fetch fails + type errors |
| `npm test` | N/A | No test script or framework exists |

---

## TypeScript Errors (2)

### Error 1: Middleware Auth API
```
middleware.ts(15,16): error TS2339: Property 'protect' does not exist on type 'ClerkMiddlewareAuth'.
```
**Root cause**: Clerk SDK v5 API changed. `auth.protect()` is not the correct API.

### Error 2: Prisma JSON Type Mismatch
```
server/api/routers/prompt.ts(575,13): error TS2322: Type 'JsonValue' is not assignable to type 'JsonNull | InputJsonValue | undefined'.
```
**Root cause**: Duplicating prompt with `variables` field from Prisma `JsonValue` type doesn't match expected `InputJsonValue`.

---

## npm Security Audit

### Critical (1)
- **next 14.2.5**: Authorization Bypass in Middleware (GHSA-f82v-jwr5-mffw)

### High (18)
All from **next 14.2.5**:
- Cache Poisoning (GHSA-gp8f-8m3g-qvj9)
- DoS in image optimization (GHSA-g77x-44xx-532m)
- DoS with Server Actions (GHSA-7m27-7ghc-44w9)
- Information exposure in dev server (GHSA-3h52-269p-cp9r)
- Cache Key Confusion (GHSA-g5qg-72qw-gw5v)
- SSRF via middleware redirect (GHSA-4342-x723-ch2f)
- Content Injection in Image Optimization (GHSA-xv57-4mr9-wg8v)
- Race Condition Cache Poisoning (GHSA-qpjv-v59x-3qc4)
- DoS with Server Components (GHSA-mwv6-3258-q52c, GHSA-5j59-xgg2-r9c4)
- Image Optimizer DoS (GHSA-9g9p-9gw9-jx7f)
- HTTP deserialization DoS (GHSA-h25m-26qc-wcjf)

### Moderate (1)
- ESLint dependency (minimatch)

### Fix Available
```bash
npm audit fix --force  # Will install next@14.2.35
```

---

## Deprecated Dependencies

| Package | Issue |
|---------|-------|
| eslint@8.57.1 | "This version is no longer supported" |
| next@14.2.5 | Far behind latest (14.2.35 / 15.x) |
| @trpc/\*@11.0.0-rc.446 | Release candidate in production code |

---

## Build Failure Analysis

### Primary: Google Font Fetch
```
Error [NextFontError]: Failed to fetch font `Inter`.
```
The build requires network access to fetch Google Fonts. In network-restricted environments, this fails completely.

**Fix**: Use `next/font/local` with bundled font files, or configure font-display fallback.

### Secondary: Type Errors
The 2 TypeScript errors would also fail the build in strict mode.

---

## CI/CD Health

The GitHub Actions CI pipeline (`ci.yml`) would fail because:
1. TypeScript errors cause `typecheck` job to fail
2. Build job depends on typecheck, so it would also fail
3. Build job uses dummy env vars which is fine, but type errors block it anyway

**The CI pipeline is red.**

---

## Missing Infrastructure

| Item | Status |
|------|--------|
| Test framework (Jest/Vitest) | NOT INSTALLED |
| Test scripts in package.json | NONE |
| Test directory | DOESN'T EXIST |
| Database migrations | NONE (using db:push only) |
| Docker production config | NONE |
| Health check endpoint | NONE |
| Error tracking (Sentry) | ENV VAR ONLY |
| Analytics (PostHog) | ENV VAR ONLY |
| Rate limiting | NOT IMPLEMENTED |
| Logging infrastructure | Prisma query logs only |
