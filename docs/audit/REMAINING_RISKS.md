# REMAINING RISKS

> Issues that were NOT fixed during this remediation and still need attention.

---

## HIGH PRIORITY

### 1. No Tests
Still zero test coverage. No test framework installed. This is the highest remaining risk.
**Next step**: Install Vitest, write tests for prompt router logic and extractVariables.

### 2. Remaining npm Vulnerabilities
16 high-severity vulnerabilities remain from Next.js ecosystem (eslint-config-next, @next/eslint-plugin-next). These require upgrading to Next.js 15+ which is a breaking change.
**Next step**: Plan and execute Next.js 15 migration.

### 3. No Rate Limiting
All tRPC endpoints can be hammered without throttling. Redis is available in docker-compose but unused.
**Next step**: Add tRPC middleware with Redis-based rate limiting.

### 4. No Database Migrations
Still using `prisma db push` instead of `prisma migrate`. No migration history.
**Next step**: Switch to migration-based workflow before any production deployment.

### 5. API Key Storage
The ApiKey model exists but there's no hashing logic for stored keys.
**Next step**: Implement key hashing before the API key feature is built.

### 6. No Error Tracking
No Sentry or equivalent installed.
**Next step**: Add Sentry SDK and configure for production.

---

## MEDIUM PRIORITY

### 7. Prompt Editor
The create form exists but there's no proper prompt editor with variable highlighting, version editing, or diff views.

### 8. No Onboarding Flow
First-time users see an empty prompts page with no guidance.

### 9. tRPC RC Version
Still using `@trpc/*@11.0.0-rc.446`. Should migrate to stable when available.

### 10. Redis Unused
Redis service is in docker-compose but nothing in the codebase uses it. Either add caching/rate limiting or remove it.

### 11. No Production Deployment
No Dockerfile, no deployment config. Not deployed anywhere.

---

## LOW PRIORITY

### 12. Unused Utility Functions
`lib/utils.ts` still has functions like `formatCurrency`, `formatBytes`, `generateId`, `slugify`, `sleep`, `isServer` that are unused. These are harmless but add cognitive load.

### 13. Unused Hooks
`useLocalStorage` is not used anywhere. `useDebounce` is now used by the prompts page.

### 14. SEO
No sitemap.xml, no robots.txt, no structured data.

### 15. Workspace Switcher
Users can't switch between workspaces. The auto-created "Personal" workspace is the only one accessible.
