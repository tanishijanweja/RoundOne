# RUNBOOK

## Prerequisites

- [Bun](https://bun.sh) v1.3.7+
- [Docker](https://docker.com) (for PostgreSQL)
- [Turbo](https://turbo.build) (optional, for monorepo orchestration)

## Quick Start

```bash
# Install dependencies (from root)
bun install

# Start PostgreSQL via Docker
docker run -d \
  --name roundone-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=roundone \
  -p 5432:5432 \
  postgres:16

# Generate Prisma client
bunx prisma generate --schema=apps/backend/prisma/schema.prisma

# Run migrations
bunx prisma db push --schema=apps/backend/prisma/schema.prisma
```

## Running the Apps

### All apps (from root)

```bash
bun run dev
```

### Backend only (port 3001)

```bash
cd apps/backend
bun run index.ts
```

### Frontend only

```bash
cd apps/frontend
bun run dev
```

## Docker for PostgreSQL

The project requires a PostgreSQL database. Run it with Docker:

```bash
docker run -d \
  --name roundone-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=roundone \
  -p 5432:5432 \
  -v pgdata:/var/lib/postgresql/data \
  postgres:16
```

Stop and remove:

```bash
docker stop roundone-postgres && docker rm roundone-postgres
```

## Environment Variables

Key env vars (see `.env` files):

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (e.g. `postgres://postgres:postgres@localhost:5432/roundone`) |
| `GEMINI_API_KEY` | Google Gemini API key |
| `DEEPGRAM_API_KEY` | Deepgram API key |
| `PROXY_URL` | Proxy for external requests (optional) |

## Tech Stack

- **Runtime:** Bun
- **Monorepo:** Turborepo
- **Backend:** Express + Prisma + PostgreSQL
- **Frontend:** React 19 + Tailwind CSS
- **Database:** PostgreSQL (via Docker)
