# REDDIT ROAST

> Perspective: Ruthless Reddit/HN reviewer. Skeptical engineers. Anti-hype.

---

## r/programming Thread: "Prompt Vault - A comprehensive prompt management and LLMOps platform"

---

**u/actual_shipping_dev** (2847 points, 6 hours ago)

I cloned this to check it out. The README says "clone from github.com/yourusername/prompt-vault.git". They didn't even update the template URL. That tells you everything.

---

**u/dependency_auditor** (1923 points)

Running `npm audit`:
```
20 vulnerabilities (1 moderate, 18 high, 1 critical)
```
From a product whose Phase 14 is "Security & Compliance." Chef's kiss.

The critical one? Authorization bypass in Next.js middleware. In a product with authentication as a core feature. You can't make this up.

---

**u/show_me_the_benchmarks** (1456 points)

> "Competitive analysis of 50+ tools"

Where are the benchmarks? Where's the analysis? I see a table with 4 competitors and some checkmarks. That's not analysis. That's a checkbox exercise.

Also, the "unique differentiators" marked with sparkle emoji are:
1. Variable System - PromptLayer has this. Langfuse has this. It's not unique.
2. Memory Management - It's not implemented. Calling an unimplemented feature a differentiator is a new level of vaporware.

---

**u/senior_eng_not_impressed** (1122 points)

Let me get this straight:
- tRPC endpoints exist for prompt CRUD
- The prompts page is a static React component with hardcoded "No prompts yet"
- The "Create Prompt" button has no onClick handler
- The Zustand store for prompt state is defined but never used
- There are 4 shadcn/ui components installed out of 50+

This is a project setup, not a product. Running `create-next-app` + installing some packages + writing a schema is the "hello world" of modern web dev. Calling it a "comprehensive platform" is wild.

---

**u/infra_engineer_pain** (987 points)

Docker compose includes:
- PostgreSQL (used by schema, but no data)
- Redis (declared, zero usage in code)
- Redis Commander (for looking at your empty Redis)
- pgAdmin (for looking at your empty Postgres)

Four services. Zero data. Maximum YAML.

---

**u/actually_shipped_saas** (876 points)

I run a SaaS. Here's what bothers me:

This project has a 980-line implementation strategy document planning 15 phases over 6-8 months. It has pricing tiers defined ($29/$79/Enterprise). It has success metrics ("10,000 users in 12 months").

It does not have:
- A working "create prompt" button
- A single test
- A deployed URL
- A single user

The planning-to-building ratio here is concerning. In my experience, projects with this much upfront planning and this little execution never ship. The planning IS the product - for the developer. It feels productive without producing anything.

---

**u/trpc_user** (654 points)

Using `@trpc/server@11.0.0-rc.446` in a project that isn't even functional yet. Bold choice to build on an RC when you haven't built anything yet. tRPC v10 is stable and well-documented. Why gamble on RC breaking changes when you can't even get the basics working?

---

**u/nextjs_contributor** (543 points)

```typescript
export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});
```

TypeScript error: `Property 'protect' does not exist on type 'ClerkMiddlewareAuth'`

This code doesn't compile. The auth middleware doesn't work. This is the FIRST thing you'd test when setting up Clerk. Ship broken auth protection, then plan 15 phases of features on top of it.

---

**u/the_pragmatist** (432 points)

Honest feedback: the bones aren't terrible. The Prisma schema is well-thought-out. The tRPC router code follows good patterns (workspace access verification, pagination, input validation). The project structure is reasonable.

But it needs to ship SOMETHING. Pick the prompt CRUD page. Wire it up to the existing tRPC endpoints. Get it deployed. Ship it. Then add version history. Then add variables. One feature at a time, fully working.

The path from here to "10,000 users" starts with making the "Create Prompt" button work.

---

**u/no_tests_no_trust** (398 points)

```
Test coverage: 0%
Test framework: not installed
Test directory: doesn't exist
```

But sure, let's plan an "Evaluation Pipeline" for testing LLM outputs when we can't even test our own code.
