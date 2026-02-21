# Prompt Vault

A prompt management and version control platform for AI teams.

> **Status**: Early development (alpha). Core prompt CRUD and version control are functional.
> Many features listed in the roadmap are under development.

## What Works Today

- Prompt creation, listing, search, and deletion
- Version control (create versions, track history)
- Variable extraction from `{{placeholder}}` syntax
- User authentication via Clerk
- Workspace-based data isolation
- Dashboard with sidebar navigation

## Roadmap

- [ ] Prompt editor with variable highlighting
- [ ] LLM Playground (multi-model testing)
- [ ] Evaluation pipelines
- [ ] Collections and organization
- [ ] Analytics and usage tracking
- [ ] Memory management
- [ ] Public API
- [ ] Billing / subscriptions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL + Prisma
- **Auth**: Clerk
- **API**: tRPC
- **State**: Zustand + React Query

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (for local database)
- A Clerk account

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd prompt-vault
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Start the local database:
   ```bash
   docker-compose up -d
   ```

5. Push the database schema:
   ```bash
   npm run db:push
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

## Development

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run format` | Format code with Prettier |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Prisma Studio |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
