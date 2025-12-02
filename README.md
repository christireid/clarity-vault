# Prompt Vault

A comprehensive prompt management and LLMOps platform for teams.

## Features

- **Version Control**: Git-like version control for your prompts
- **Variable System**: Smart variable placeholders with intelligent extraction
- **LLM Playground**: Test prompts against multiple models
- **Evaluation Pipeline**: LLM-as-judge evaluation with custom criteria
- **Team Collaboration**: Workspaces, roles, and sharing
- **Analytics & Insights**: Track usage, costs, and performance

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
- Docker & Docker Compose (for local development)
- A Clerk account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/prompt-vault.git
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

4. Start the local services:
   ```bash
   docker-compose up -d
   ```

5. Initialize the database:
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
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio |

### Project Structure

```
prompt-vault/
├── app/                 # Next.js App Router
├── components/          # React components
├── server/              # Server-side code (tRPC, services)
├── lib/                 # Utilities and helpers
├── hooks/               # Custom React hooks
├── store/               # Zustand stores
├── types/               # TypeScript types
├── config/              # Configuration
├── prisma/              # Database schema and migrations
└── docs/                # Documentation
```

## Documentation

See the [docs](./docs) folder for detailed documentation:

- [Implementation Strategy](./docs/IMPLEMENTATION_STRATEGY.md) - Full implementation plan
- [Phase 1 Plan](./docs/PHASE_1_PROJECT_PLAN.md) - Foundation phase details

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
