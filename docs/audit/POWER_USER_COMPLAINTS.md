# POWER USER COMPLAINTS

> Perspective: Hostile power user with high standards, deep technical expectations, zero patience

---

## Initial Assessment

I just wasted 5 minutes signing up for a product that doesn't exist. Here are my complaints, in order of severity:

---

## 1. The Product Doesn't Do Anything

I'm a "prompt management platform" that can't manage prompts. The only page that loads (`/prompts`) shows an empty state with non-functional buttons. This isn't a product. It's a React component.

---

## 2. The Backend Exists But the Frontend Doesn't

I can see from the codebase that there are tRPC endpoints for CRUD operations on prompts, version creation, filtering, etc. None of this is connected to the UI. The prompts page is a hardcoded static component with zero data fetching.

This means someone built the backend but never bothered to wire it up. Classic "code as entertainment" pattern.

---

## 3. The Schema is Over-Engineered for Phase 1

The Prisma schema has 10 models with full relational structure for: Users, Workspaces, Prompts, Versions, Contexts, Collections, Executions, Evaluations, Memories, and API Keys.

But only 2 tRPC routers exist (prompt + user). This schema is a wishlist, not an implementation plan. It creates massive migration debt before a single user exists.

---

## 4. Security is an Afterthought

- `syncFromClerk` is a public endpoint that creates users and workspaces with zero authentication. The code literally has a TODO comment admitting this. If this were deployed, I could create unlimited users.
- Clerk middleware has a TypeScript error, meaning auth protection may not compile.
- No rate limiting anywhere. I could DDoS the tRPC endpoints trivially.

---

## 5. No Tests, No Confidence

Zero tests. No test framework installed. If I were to contribute to this codebase, I'd have zero confidence that my changes don't break existing functionality. Because there IS no existing functionality to break.

---

## 6. Dependency Choices are Concerning

- **tRPC 11 RC**: Using a release candidate for the API layer. Brave or reckless.
- **Next.js 14.2.5**: Has a CRITICAL authorization bypass CVE. In a security-focused product. The irony.
- **20 npm vulnerabilities**: 18 high, 1 critical. This would fail any enterprise security review.
- **Redis in docker-compose but unused**: Why is it there? Aspirational infrastructure.
- **pgvector extension declared but unused**: Same.

---

## 7. Model Names are Outdated

The constants file lists `claude-3-5-sonnet-20241022`, `claude-3-opus-20240229`, `gpt-4o`, etc. These are frozen in late 2024. For a product claiming to support LLM providers, keeping model lists current is table stakes.

---

## 8. The Planning Docs Are a Red Flag

Almost 1000 lines of implementation strategy. 15 phases. 6-8 month timeline. Competitive analysis of "50+ tools" (no evidence). Success metrics of "10,000 users in 12 months."

The ratio of planning to execution is approximately 10:1. This is a warning sign I've seen in projects that never ship.

---

## 9. There's No Way to Self-Host

The landing page implies this is a SaaS product. But the docker-compose suggests self-hosting. The IMPLEMENTATION_STRATEGY mentions self-hosting as "Future." There's no Dockerfile for production. No deployment guide. No helm chart. No clear hosting story at all.

---

## 10. Name Identity Crisis

The repo is `clarity-vault`. The package is `prompt-vault`. The landing page says "Prompt Vault". The site config references `promptvault.dev`. Pick a name.

---

## Summary

This isn't a product I would use, recommend, or contribute to in its current state. The gap between ambition and execution is vast. Ship something, anything, that actually works end-to-end before adding more schemas and planning documents.
