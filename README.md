# iRun — Runner Operating System

Media, training, community, and commerce for Canadian runners.

**Live:** https://app.irun.ca

## Tech Stack

- **Next.js 15** (App Router, standalone output)
- **TypeScript 5**
- **Drizzle ORM** + PostgreSQL 16
- **Tailwind CSS 4**
- **Docker** (multi-stage Alpine build)

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start PostgreSQL (via Docker)
docker compose -f docker/docker-compose.yml up db -d

# Run database migrations
npm run db:push

# Seed the database
npm run db:seed

# Start dev server
npm run dev
```

Open http://localhost:3000

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type checking |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed admin user |

## Project Structure

```
src/
  app/
    (public)/     # Public pages (/, /articles, /shop, etc.)
    (auth)/       # Login, register
    (dashboard)/  # /account (logged-in runner)
    (admin)/      # /admin/* (iRun OS, role-gated)
  components/     # UI components
  lib/
    db/           # Drizzle schema and client
    auth/         # Session management, password hashing
    permissions/  # RBAC role-permission mapping
    actions/      # Server Actions
    validators/   # Zod schemas
```

## Deployment

Pushes to `main` trigger a GitHub Actions pipeline that builds a Docker image, pushes to `ghcr.io`, and deploys to the VPS via SSH.

See `docker/docker-compose.yml` for the production configuration with Traefik labels.

## Documentation

Full product documentation lives in [Docs/](Docs/).
