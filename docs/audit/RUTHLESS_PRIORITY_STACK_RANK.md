# RUTHLESS PRIORITY STACK RANK

> Prioritized using: Impact = (Revenue + Trust + Adoption + Survivability) / Effort

---

## TIER 0: EXISTENTIAL THREATS
> Fix these or the project is dead on arrival.

| Rank | ID | Problem | Impact | Effort |
|------|-----|---------|--------|--------|
| 1 | I-001 | Build is broken (TS errors + font fetch) | 10 | LOW |
| 2 | S-002 | 20 npm vulnerabilities (critical auth bypass) | 10 | LOW |
| 3 | S-001 | syncFromClerk is unauthenticated public endpoint | 10 | LOW |
| 4 | C-001 | TypeScript errors preventing compilation | 10 | LOW |
| 5 | S-003 | Clerk middleware auth may not work | 9 | LOW |

**Rationale**: If the project can't build, has critical CVEs, and an open security hole, nothing else matters. These are all LOW effort fixes.

---

## TIER 1: PRODUCT CREDIBILITY BLOCKERS
> Fix these or no one will take the product seriously.

| Rank | ID | Problem | Impact | Effort |
|------|-----|---------|--------|--------|
| 6 | P-008 | Backend exists but frontend doesn't call it | 10 | MEDIUM |
| 7 | P-002 | "Create Prompt" button does nothing | 10 | MEDIUM |
| 8 | P-004 | Prompts page is static (no data fetching) | 10 | MEDIUM |
| 9 | T-001 | Landing page claims features that don't exist | 10 | LOW |
| 10 | G-004 | "View on GitHub" broken link | 8 | LOW |
| 11 | T-004 | README has placeholder clone URL | 5 | LOW |
| 12 | T-002 | No LICENSE file | 6 | LOW |
| 13 | T-003 | Footer /privacy and /terms links 404 | 5 | LOW |
| 14 | P-003 | 6 sidebar nav items lead to 404 | 9 | LOW |
| 15 | N-001 | Name conflict clarity-vault vs prompt-vault | 7 | LOW |
| 16 | I-002 | CI pipeline would fail | 9 | LOW (fixed by tier 0) |
| 17 | I-003 | Zero tests | 9 | MEDIUM |

**Rationale**: A product that can't perform its core action (create/manage prompts) has zero credibility. Fix the frontend-backend gap, then fix the lies on the landing page.

---

## TIER 2: GROWTH UNLOCKS
> These enable the product to acquire and retain users.

| Rank | ID | Problem | Impact | Effort |
|------|-----|---------|--------|--------|
| 18 | P-005 | No onboarding flow | 8 | MEDIUM |
| 19 | P-006 | No prompt editor component | 9 | HIGH |
| 20 | C-002 | Duplicate validation schemas | 6 | LOW |
| 21 | C-003 | Unused/dead code everywhere | 5 | LOW |
| 22 | C-004 | Inline SVGs instead of lucide-react | 4 | LOW |
| 23 | C-007 | No postinstall for prisma generate | 5 | LOW |
| 24 | D-004 | Outdated model names | 4 | LOW |
| 25 | N-002 | Generic positioning | 7 | MEDIUM |
| 26 | N-004 | Landing page emotionally dead | 5 | MEDIUM |
| 27 | G-005 | No social proof | 7 | HIGH (need users first) |
| 28 | S-004 | No rate limiting | 7 | MEDIUM |

---

## TIER 3: OPTIMIZATION / POLISH
> Nice to have but not blocking.

| Rank | ID | Problem | Impact | Effort |
|------|-----|---------|--------|--------|
| 29 | I-004 | No database migrations | 7 | MEDIUM |
| 30 | I-005 | No error tracking | 6 | MEDIUM |
| 31 | I-006 | Redis declared but unused | 4 | LOW (remove or use) |
| 32 | U-004 | No loading states | 5 | LOW |
| 33 | U-005 | No error states | 5 | LOW |
| 34 | U-006 | Only 4 shadcn components | 4 | LOW |
| 35 | P-009 | Empty seed script | 4 | LOW |
| 36 | C-005 | Global regex pattern | 3 | LOW |
| 37 | C-006 | Reinvented wheels | 3 | LOW |
| 38 | M-001 | Zero billing implementation | 8 | HIGH |
| 39 | M-002 | No pricing page | 6 | MEDIUM |
| 40 | S-005 | API keys plaintext risk | 7 | MEDIUM |
| 41 | G-006 | No content marketing | 5 | HIGH |
| 42 | G-007 | No SEO | 4 | LOW |
| 43 | T-005 | No CONTRIBUTING.md | 3 | LOW |
| 44 | D-001 | Claimed differentiators not unique | 7 | HIGH |
| 45 | I-007 | No production deployment config | 6 | MEDIUM |

---

## EXECUTION ORDER

**Do these IN ORDER, top to bottom. Do not skip.**

### Sprint 1: Make It Build (Items 1-5)
- Fix TypeScript errors
- Update Next.js for CVE fixes
- Fix Google Font dependency
- Secure the syncFromClerk endpoint
- Fix Clerk middleware

### Sprint 2: Make It Work (Items 6-17)
- Wire prompts page to tRPC
- Make Create Prompt functional
- Add placeholder pages for 404 routes
- Fix broken links and README
- Add LICENSE file
- Honest landing page
- Add basic tests

### Sprint 3: Make It Good (Items 18-28)
- Onboarding flow
- Prompt editor
- Code cleanup
- Better positioning/messaging

### Sprint 4: Make It Grow (Items 29+)
- Production infrastructure
- Billing
- Advanced features
