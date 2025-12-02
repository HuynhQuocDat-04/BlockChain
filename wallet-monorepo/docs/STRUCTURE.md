# Crypto Wallet Monorepo Structure

A scalable layout for a web crypto wallet with frontend, backend, and database.

```
wallet-monorepo/
├─ apps/
│  └─ frontend/              # React/Vite site (UI)
├─ services/
│  └─ api/                   # Backend API (REST/GraphQL)
├─ db/
│  └─ prisma/                # DB schema/migrations (e.g., Prisma)
├─ shared/
│  ├─ types/                 # Shared TypeScript types/interfaces
│  └─ utils/                 # Cross-cutting utilities (validation, format)
├─ infra/
│  └─ docker/                # Docker compose, infra configs
├─ scripts/                  # Dev/CI helper scripts
├─ .env.example              # Root envs (compose, common vars)
└─ README.md                 # Overview & quick start
```

Notes
- Keep frontend fully client-side, talking to `services/api` via HTTPS.
- Database migrations in `db/prisma`; run from API service during deploy.
- Share DTOs and validation schemas in `shared/types` to avoid drift.
- Use `infra/docker/compose.yml` for local dev orchestration (db + api + frontend proxy if desired).
