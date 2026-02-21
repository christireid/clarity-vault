# CLAIMS VS REALITY

> Forensic comparison of what the project says it does vs. what it actually does.

---

## Landing Page Claims

| # | Claim | Reality | Verdict |
|---|-------|---------|---------|
| 1 | "Version Control: Git-like version control for your prompts" | Schema exists. `createVersion` tRPC endpoint exists. **No UI for version history, no diff view, no rollback, no branching UI.** | MISLEADING |
| 2 | "Variable System: Smart variable placeholders with intelligent extraction" | `extractVariables()` function exists in the prompt router. **No UI for variable highlighting, no variable substitution, no variable fill form.** | MISLEADING |
| 3 | "LLM Playground: Test prompts against multiple models" | **Zero implementation.** No LLM provider adapters, no playground page, no execution logic. Model constants defined but unused. | FALSE |
| 4 | "Evaluation Pipeline: LLM-as-judge evaluation with custom criteria" | **Zero implementation.** Schema exists. No evaluation logic, no judge prompt, no evaluation UI. | FALSE |
| 5 | "Team Collaboration: Workspaces, roles, and sharing" | Schema exists. Workspace membership check in prompt router. **No workspace creation UI, no invite flow, no team management, no workspace switcher.** | MISLEADING |
| 6 | "Analytics & Insights: Track usage, costs, and performance" | **Zero implementation.** No analytics page, no metrics collection, no cost tracking, no charts. | FALSE |

---

## README Claims

| Claim | Reality | Verdict |
|-------|---------|---------|
| "Getting Started" instructions work | `npm install` works. `docker-compose up` requires Docker. `db:push` would work with DB. Build fails (font fetch + type errors). | PARTIALLY FALSE |
| MIT License | **No LICENSE file exists.** | FALSE |
| "Clone from github.com/yourusername/prompt-vault.git" | **Placeholder URL never updated.** | BROKEN |
| "Contributing guidelines" mentioned | **No CONTRIBUTING.md exists.** | FALSE |

---

## Architecture Claims (IMPLEMENTATION_STRATEGY.md)

| Claim | Reality |
|-------|---------|
| 15-phase plan spanning 6-8 months | Phase 1 partially complete. That's it. |
| "Competitive analysis of 50+ tools" | No evidence of any analysis artifacts |
| "Production-grade LLMOps platform" | Pre-alpha scaffolding |
| Service layer (8 services planned) | 0 services implemented |
| Background jobs (BullMQ) | Not installed, not implemented |
| REST API (v1) | Not implemented |
| Webhook handlers | Not implemented |
| File storage (S3/R2) | Not implemented |
| Redis caching | Not implemented (Redis in docker-compose, zero code usage) |

---

## Code Quality Claims

| Claim | Reality |
|-------|---------|
| "TypeScript strict mode" | TypeScript compiles with 2 errors |
| ESLint configured | Passes (lax config, few files to lint) |
| Prettier configured | Configured |
| Husky + lint-staged | Configured |
| commitlint | Configured |
| CI/CD pipeline | Exists, but build would fail on type errors |

---

## Market Positioning Claims

| Claim | Reality |
|-------|---------|
| "Built for teams who take prompt engineering seriously" | No team features work |
| "Start Free" button | No account creation flow beyond Clerk, no workspace auto-creation |
| "View on GitHub" | Links to github.com (root), not actual repo |
| "Prompt Vault Team" as creator | No team evidence |
| Site config points to promptvault.dev | Domain likely doesn't exist |
| OG image at promptvault.dev/og.png | Likely 404 |

---

## Severity Assessment

**3 of 6 headline features are completely FALSE (zero implementation).**
**3 of 6 headline features are MISLEADING (backend scaffolding exists, zero UI).**

This is a marketing page for a product that doesn't exist yet.
