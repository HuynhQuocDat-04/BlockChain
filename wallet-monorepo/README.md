# Wallet Monorepo

Frontend + backend + database structure for a crypto wallet web app.

## Layout
- `apps/frontend`: React UI (you can migrate existing `d:\BlockChain\web-wallet` here later)
- `services/api`: Backend service
- `db/prisma`: Database schema & migrations
- `shared/*`: Shared types and utilities
- `infra/docker`: Docker compose for local infra
- `scripts`: Dev/CI helper scripts

## Next Steps
1. Link or move your current frontend to `apps/frontend`.
2. Scaffold API (Node/TS, NestJS or Express) in `services/api`.
3. Define schema in `db/prisma/schema.prisma`.
4. Wire local dev via `infra/docker/compose.yml`.

See `docs/STRUCTURE.md` for details.
