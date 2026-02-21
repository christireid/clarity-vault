# CTO RISK REGISTER

> Perspective: Paranoid CTO assessing technical risk.

---

## CRITICAL RISKS

### RISK-001: Security Vulnerability - Unauthenticated User Sync Endpoint
- **Severity**: CRITICAL
- **File**: `server/api/routers/user.ts:90-141`
- **Issue**: `syncFromClerk` is a `publicProcedure` that upserts users and creates workspaces. Any unauthenticated caller can create arbitrary users and workspaces in the database.
- **Comment in code admits it**: "TODO: Move to a dedicated webhook handler with signature verification before deploying to production."
- **Impact**: Complete data integrity compromise. Attacker could flood DB with fake users, create workspaces, or overwrite existing user data via clerkId collision.
- **Fix**: Must be a proper webhook endpoint with Clerk signature verification, NOT a tRPC procedure.

### RISK-002: 20 npm Vulnerabilities Including Critical Auth Bypass
- **Severity**: CRITICAL
- **Issue**: Next.js 14.2.5 has a critical authorization bypass vulnerability (GHSA-f82v-jwr5-mffw) plus 17 additional high-severity CVEs
- **Impact**: Authentication bypass, SSRF, cache poisoning, DoS
- **Fix**: Update Next.js to latest 14.2.x (14.2.35+)

### RISK-003: Build is Broken
- **Severity**: CRITICAL
- **Issue**: TypeScript errors + Google Font network dependency = build fails
- **Impact**: Cannot deploy. CI is red. Any PR merge is blocked.
- **Fix**: Fix 2 TS errors. Use local fonts or system fonts.

---

## HIGH RISKS

### RISK-004: tRPC Uses Release Candidate Version
- **Severity**: HIGH
- **Issue**: `@trpc/*@11.0.0-rc.446` - RC versions have no stability guarantees
- **Impact**: Breaking changes between RC versions. No LTS support. API may change.
- **Mitigation**: Lock version (already done via package-lock), but should migrate to stable when available or pin to v10 stable.

### RISK-005: No Tests
- **Severity**: HIGH
- **Issue**: Zero test files. No test framework installed. No test scripts.
- **Impact**: Every code change is a gamble. No regression detection. Cannot refactor safely.
- **Fix**: Install Vitest, add unit tests for router logic and utils.

### RISK-006: No Database Migrations
- **Severity**: HIGH
- **Issue**: Using `prisma db push` instead of `prisma migrate dev`. No migration history.
- **Impact**: Cannot safely evolve schema in production. No rollback capability. No audit trail.
- **Fix**: Switch to migration-based workflow before any production deployment.

### RISK-007: Middleware TypeScript Error Means Auth May Not Work
- **Severity**: HIGH
- **File**: `middleware.ts:15`
- **Issue**: `auth.protect()` doesn't exist on `ClerkMiddlewareAuth` type
- **Impact**: Auth middleware may silently fail or not compile, leaving routes unprotected.

### RISK-008: No Rate Limiting
- **Severity**: HIGH
- **Issue**: tRPC endpoints have zero rate limiting. Redis is in docker-compose but unused.
- **Impact**: Any endpoint can be hammered. `bulkDelete` with 100 IDs repeated = DB destruction. `syncFromClerk` (public!) = unlimited user creation.

### RISK-009: API Key Storage
- **Severity**: HIGH
- **File**: `prisma/schema.prisma:42-53`
- **Issue**: ApiKey model stores `key` field. If stored as plaintext (no hashing logic exists), this is a credential leak risk.
- **Impact**: Database breach exposes all API keys.
- **Fix**: Store only hashed keys, use prefix for lookup.

---

## MEDIUM RISKS

### RISK-010: No Error Tracking
- **Severity**: MEDIUM
- **Issue**: Sentry DSN is an env var placeholder. No Sentry SDK installed.
- **Impact**: Production errors go unnoticed.

### RISK-011: No Input Sanitization for XSS
- **Severity**: MEDIUM
- **Issue**: Prompt content is stored as raw strings. If rendered as HTML anywhere, XSS is possible.
- **Current mitigation**: React escapes by default. But if `dangerouslySetInnerHTML` is ever used for prompt rendering, it's game over.

### RISK-012: Duplicate Validation Schemas
- **Severity**: MEDIUM
- **Files**: `lib/validations/prompt.ts` and `server/api/routers/prompt.ts`
- **Issue**: Same validation schemas defined in two places. They will drift.
- **Fix**: Single source of truth, import in both places.

### RISK-013: Prisma Query Logging in Development
- **Severity**: MEDIUM
- **File**: `server/db/client.ts:11`
- **Issue**: Logs all queries in development. Could accidentally be left on in production if NODE_ENV isn't set.
- **Impact**: Performance degradation and log pollution.

---

## LOW RISKS

### RISK-014: Global Regex with lastIndex
- **File**: `server/api/routers/prompt.ts:20-36`
- **Issue**: Uses global regex `VARIABLE_PATTERN` with manual `lastIndex = 0` reset. This is fragile and bug-prone with concurrent calls. Actually since Node.js handles each request sequentially within the same event loop tick, this is safe but still a code smell.
- **Fix**: Create new regex per call or use `String.prototype.matchAll()`.

### RISK-015: No CORS Configuration
- **Severity**: LOW (Next.js handles same-origin, but public API would need it)

### RISK-016: Docker Compose Uses Default Passwords
- **File**: `docker-compose.yml`
- **Issue**: `POSTGRES_PASSWORD: password`, `PGADMIN_DEFAULT_PASSWORD: admin`
- **Impact**: Dev-only concern, but copy-paste to production risk.

---

## Technical Debt Summary

| Category | Debt Level |
|----------|-----------|
| Security | CRITICAL |
| Testing | CRITICAL |
| Dependencies | HIGH |
| Build reliability | HIGH |
| Code duplication | MEDIUM |
| Error handling | MEDIUM |
| Observability | HIGH |
| Documentation | MEDIUM |
