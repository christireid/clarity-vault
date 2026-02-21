# MASTER PROBLEM INDEX

> All problems from all 9 perspectives, deduplicated and clustered.

---

## CLUSTER 1: PRODUCT (The Thing Doesn't Work)

| ID | Problem | Sources | Severity |
|----|---------|---------|----------|
| P-001 | Landing page advertises 6 features, 0 are functional | CEO, Marketing, Troll, Reddit, FirstRun | 10 |
| P-002 | "Create Prompt" button does nothing | FirstRun, PowerUser, Cranky | 10 |
| P-003 | 6 of 7 sidebar nav links lead to 404 | FirstRun, PowerUser | 9 |
| P-004 | Prompts page is static HTML with no data fetching | PowerUser, Cranky, Reddit | 10 |
| P-005 | No onboarding flow after sign-up | FirstRun, GTM | 8 |
| P-006 | No prompt editor component | Cranky, PowerUser | 9 |
| P-007 | Zustand store exists but is never used | Cranky | 5 |
| P-008 | Backend exists but frontend doesn't call it | PowerUser, Cranky, Reddit | 10 |
| P-009 | Empty seed script | Troll, Cranky | 4 |

## CLUSTER 2: CODE QUALITY

| ID | Problem | Sources | Severity |
|----|---------|---------|----------|
| C-001 | 2 TypeScript errors (middleware + JSON type) | CTO, Cranky, Reddit | 9 |
| C-002 | Duplicate validation schemas in 2 files | CTO, Cranky | 6 |
| C-003 | Massive amounts of unused/dead code | Cranky, Troll | 5 |
| C-004 | Inline SVGs instead of lucide-react icons | Cranky | 4 |
| C-005 | Global regex with manual lastIndex reset | CTO, Cranky | 3 |
| C-006 | Reinvented wheels (debounce, date format, ID gen) | Cranky | 3 |
| C-007 | No postinstall script for prisma generate | Cranky | 5 |

## CLUSTER 3: SECURITY

| ID | Problem | Sources | Severity |
|----|---------|---------|----------|
| S-001 | syncFromClerk is unauthenticated public endpoint | CTO, PowerUser | 10 |
| S-002 | 20 npm vulnerabilities (18 high, 1 critical) | CTO, Reddit, PowerUser | 10 |
| S-003 | Clerk middleware TS error - auth may not work | CTO | 9 |
| S-004 | No rate limiting on any endpoint | CTO, PowerUser | 7 |
| S-005 | API keys may be stored as plaintext | CTO | 7 |
| S-006 | No webhook signature verification | CTO | 7 |

## CLUSTER 4: INFRASTRUCTURE

| ID | Problem | Sources | Severity |
|----|---------|---------|----------|
| I-001 | Build fails (Google Fonts + TS errors) | CTO, Cranky | 10 |
| I-002 | CI pipeline would fail | CTO, Cranky | 9 |
| I-003 | Zero tests, no test framework | CTO, Cranky, Reddit | 9 |
| I-004 | No database migrations (using db:push) | CTO | 7 |
| I-005 | No error tracking (Sentry not installed) | CTO | 6 |
| I-006 | Redis declared but unused | CTO, Troll, PowerUser | 4 |
| I-007 | No production deployment config | PowerUser | 6 |

## CLUSTER 5: UX

| ID | Problem | Sources | Severity |
|----|---------|---------|----------|
| U-001 | Zero functional UI beyond landing page | FirstRun, PowerUser | 10 |
| U-002 | Buttons exist but have no handlers | FirstRun | 9 |
| U-003 | Search input doesn't search | FirstRun | 7 |
| U-004 | No loading states (static page) | Cranky | 5 |
| U-005 | No error states | Cranky | 5 |
| U-006 | Only 4 shadcn components installed | Cranky | 4 |

## CLUSTER 6: GTM / DISTRIBUTION

| ID | Problem | Sources | Severity |
|----|---------|---------|----------|
| G-001 | No deployed/live product | CEO, GTM | 10 |
| G-002 | Zero distribution channels | GTM | 9 |
| G-003 | No ICP defined | GTM | 8 |
| G-004 | "View on GitHub" links to github.com root | Marketing, Troll, Reddit | 8 |
| G-005 | No social proof anywhere | Marketing, GTM | 7 |
| G-006 | No content marketing/blog | GTM | 5 |
| G-007 | No SEO (sitemap, robots.txt) | GTM | 4 |

## CLUSTER 7: TRUST / CREDIBILITY

| ID | Problem | Sources | Severity |
|----|---------|---------|----------|
| T-001 | Features claimed on landing page don't exist | Marketing, CEO, Reddit | 10 |
| T-002 | No LICENSE file despite claiming MIT | Marketing, CTO | 6 |
| T-003 | Footer links to /privacy and /terms (404) | Marketing | 5 |
| T-004 | README has placeholder clone URL | Marketing, Troll | 5 |
| T-005 | No CONTRIBUTING.md despite mention | Marketing | 3 |
| T-006 | promptvault.dev likely doesn't exist | Marketing | 4 |

## CLUSTER 8: NARRATIVE / MESSAGING

| ID | Problem | Sources | Severity |
|----|---------|---------|----------|
| N-001 | Repo/package naming conflict (clarity-vault vs prompt-vault) | Marketing, PowerUser, Troll | 7 |
| N-002 | Generic positioning indistinguishable from competitors | GTM, Marketing | 7 |
| N-003 | No founder story or "why this exists" | Marketing | 5 |
| N-004 | Landing page is emotionally dead | Marketing | 5 |
| N-005 | "Comprehensive" positioning = no positioning | GTM | 6 |

## CLUSTER 9: MONETIZATION

| ID | Problem | Sources | Severity |
|----|---------|---------|----------|
| M-001 | Zero billing implementation | CEO | 8 |
| M-002 | No pricing page | GTM, CEO | 6 |
| M-003 | Pricing tiers defined but not enforced | CEO | 5 |

## CLUSTER 10: DIFFERENTIATION

| ID | Problem | Sources | Severity |
|----|---------|---------|----------|
| D-001 | Claimed differentiators aren't unique | Reddit, GTM | 7 |
| D-002 | Feature comparison table is shallow | Reddit | 5 |
| D-003 | No benchmarks or performance claims | Reddit | 4 |
| D-004 | Outdated model names in constants | PowerUser | 4 |

---

## Problem Count by Severity

| Severity | Count |
|----------|-------|
| 10 (Critical) | 10 |
| 9 | 6 |
| 8 | 4 |
| 7 | 7 |
| 6 | 5 |
| 5 | 8 |
| 4 | 6 |
| 3 | 3 |

**Total: 49 distinct problems identified**
