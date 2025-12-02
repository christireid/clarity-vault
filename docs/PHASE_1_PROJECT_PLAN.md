# Phase 1: Foundation & Core Infrastructure - Project Plan

> **Duration:** 2-3 weeks
> **Priority:** P0 - Critical
> **Status:** In Progress

## Overview

Phase 1 establishes the foundational infrastructure for Prompt Vault. This includes the Next.js project setup, database schema, authentication, API layer, and development tooling.

## Prerequisites

- Node.js 18+ installed
- Docker & Docker Compose installed
- PostgreSQL database access (local via Docker or cloud)
- Clerk account for authentication
- Redis instance (local via Docker or Upstash)

## Task Breakdown

### 1. Project Initialization

| Task | Status | Priority |
|------|--------|----------|
| Initialize Next.js 14 with App Router | Pending | P0 |
| Configure TypeScript strict mode | Pending | P0 |
| Set up Tailwind CSS | Pending | P0 |
| Initialize shadcn/ui | Pending | P0 |
| Install core dependencies | Pending | P0 |

### 2. Development Tooling

| Task | Status | Priority |
|------|--------|----------|
| Configure ESLint | Pending | P0 |
| Set up Prettier | Pending | P0 |
| Initialize Husky for git hooks | Pending | P1 |
| Configure commitlint | Pending | P1 |
| Set up lint-staged | Pending | P1 |

### 3. Database & ORM

| Task | Status | Priority |
|------|--------|----------|
| Initialize Prisma | Pending | P0 |
| Create complete database schema | Pending | P0 |
| Set up Prisma client | Pending | P0 |
| Create seed script | Pending | P2 |

### 4. Authentication

| Task | Status | Priority |
|------|--------|----------|
| Install Clerk SDK | Pending | P0 |
| Configure Clerk middleware | Pending | P0 |
| Create auth routes (sign-in, sign-up) | Pending | P0 |
| Set up Clerk webhooks | Pending | P1 |

### 5. API Layer

| Task | Status | Priority |
|------|--------|----------|
| Set up tRPC server | Pending | P0 |
| Configure tRPC client | Pending | P0 |
| Create base router structure | Pending | P0 |
| Set up React Query provider | Pending | P0 |

### 6. Infrastructure

| Task | Status | Priority |
|------|--------|----------|
| Create Docker Compose for dev | Pending | P0 |
| Set up GitHub Actions CI/CD | Pending | P1 |
| Create environment files | Pending | P0 |
| Configure Vercel deployment | Pending | P2 |

### 7. Project Structure

| Task | Status | Priority |
|------|--------|----------|
| Create directory structure | Pending | P0 |
| Set up path aliases | Pending | P0 |
| Create placeholder files | Pending | P1 |

## Detailed Implementation Steps

### Step 1: Next.js Project Initialization

```bash
# Create Next.js project
npx create-next-app@latest prompt-vault \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"

cd prompt-vault

# Install core dependencies
npm install zustand immer @tanstack/react-query zod nanoid date-fns
npm install lucide-react sonner cmdk vaul

# Install shadcn/ui utilities
npm install class-variance-authority clsx tailwind-merge tailwindcss-animate
```

### Step 2: TypeScript Configuration

Update `tsconfig.json` with strict settings:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Step 3: Database Dependencies

```bash
npm install @prisma/client
npm install -D prisma
npx prisma init
```

### Step 4: Authentication Dependencies

```bash
npm install @clerk/nextjs
```

### Step 5: tRPC Dependencies

```bash
npm install @trpc/server @trpc/client @trpc/react-query @trpc/next superjson
```

### Step 6: Development Tooling

```bash
npm install -D prettier eslint-config-prettier
npm install -D husky lint-staged
npm install -D @commitlint/cli @commitlint/config-conventional

npx husky install
```

## Database Schema

See `prisma/schema.prisma` for the complete schema including:

- **User & Authentication**: User, ApiKey models
- **Workspace & Team**: Workspace, WorkspaceMember models
- **Prompts & Version Control**: Prompt, PromptVersion models
- **Context & Attachments**: Context model
- **Collections**: Collection, CollectionItem models
- **Executions & LLM Calls**: Execution model
- **Evaluations**: Evaluation model
- **Memory Management**: Memory model

## Directory Structure

```
prompt-vault/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   ├── sign-up/[[...sign-up]]/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── prompts/
│   │   ├── collections/
│   │   ├── playground/
│   │   ├── analytics/
│   │   ├── evaluations/
│   │   ├── memory/
│   │   └── settings/
│   ├── api/
│   │   ├── trpc/[trpc]/route.ts
│   │   └── webhooks/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── providers.tsx
├── components/
│   ├── ui/
│   ├── layout/
│   ├── prompts/
│   └── shared/
├── server/
│   ├── api/
│   │   ├── root.ts
│   │   ├── trpc.ts
│   │   └── routers/
│   ├── services/
│   └── db/
│       └── client.ts
├── lib/
│   ├── utils.ts
│   ├── constants.ts
│   └── validations/
├── hooks/
├── store/
├── types/
├── config/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── docker-compose.yml
├── .env.example
└── .github/
    └── workflows/
        └── ci.yml
```

## Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/prompt_vault?schema=public"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/prompts
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/prompts
CLERK_WEBHOOK_SECRET=whsec_xxx

# Redis
REDIS_URL=redis://localhost:6379

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Docker Compose Services

```yaml
services:
  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: prompt_vault

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

## CI/CD Pipeline

GitHub Actions workflow for:

1. Lint & type checking
2. Unit tests
3. Prisma schema validation
4. Build verification

## Deliverables Checklist

- [ ] Next.js 14 project with App Router
- [ ] TypeScript strict mode configuration
- [ ] Tailwind CSS with custom design system
- [ ] shadcn/ui components initialized
- [ ] Prisma with PostgreSQL schema
- [ ] tRPC setup with type-safe API
- [ ] Clerk authentication integration
- [ ] Docker Compose for local development
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Environment configuration

## Success Criteria

1. `npm run dev` starts the application without errors
2. Prisma migrations run successfully
3. Authentication flow works (sign-in, sign-up)
4. tRPC endpoints respond correctly
5. All TypeScript compiles without errors
6. ESLint passes with no errors
7. Docker Compose brings up PostgreSQL and Redis

## Notes

- Use pgvector extension for future RAG capabilities
- Keep Prisma schema modular for easy updates
- Follow conventional commits for changelog generation
- Set up Dependabot for dependency updates

---

*Last Updated: December 2024*
