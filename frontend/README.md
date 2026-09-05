# Frontend (Next.js app)

This is the Next.js frontend for the Mini Transaction Ledger project. See
the [repository root README](../README.md) for the full project
description, architecture, and setup instructions (including Docker
Compose).

## Quick reference

```bash
pnpm install
pnpm dev      # http://localhost:3001
pnpm build
pnpm start    # run the production build
pnpm lint
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_BACKEND_URL` to
wherever the backend API is running before starting the dev server.
