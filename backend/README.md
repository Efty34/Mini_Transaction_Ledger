# Backend (NestJS API)

This is the NestJS API for the Mini Transaction Ledger project. See the
[repository root README](../README.md) for the full project description,
architecture, and setup instructions (including Docker Compose).

## Quick reference

```bash
pnpm install
pnpm start:dev      # watch mode, http://localhost:3000
pnpm build           # compile to dist/
pnpm start:prod      # run the compiled build
pnpm lint
pnpm test            # unit tests
pnpm test:e2e        # end-to-end tests
```

Copy `.env.example` to `.env` and fill in your PostgreSQL credentials and
JWT secrets before starting the server.
