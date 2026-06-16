# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Medusa DTC (direct-to-consumer) ecommerce starter. A **Turborepo monorepo** with two apps:

- `apps/backend` (`@dtc/backend`) — Medusa v2 server (admin + Store/Admin REST APIs), runs on port `9000`, admin dashboard at `/app`.
- `apps/storefront` (`@dtc/storefront`) — Next.js 15 App Router storefront, runs on port `8000`.

The two apps are decoupled: the storefront is a pure API consumer that talks to the backend over HTTP via `@medusajs/js-sdk`. There is no shared code package between them.

## Commands

Package manager is **npm** (`packageManager: npm@10.9.3`), despite the README mentioning pnpm. Node >= 20. Turbo orchestrates tasks across both apps from the repo root.

### Root (runs across all apps via turbo)
```bash
npm run dev          # start backend + storefront together
npm run build
npm run lint
npm run test
npm run backend:dev      # only backend
npm run storefront:dev   # only storefront
npm run backend:seed     # seed the backend DB
```

### Backend (`apps/backend`, run from that dir)
```bash
npm run dev          # medusa develop
npm run build        # medusa build
npx medusa db:migrate                          # run migrations
npx medusa user -e admin@test.com -p secret    # create an admin user
npm run test:unit                # unit tests:        src/**/__tests__/**/*.unit.spec.ts
npm run test:integration:http    # HTTP integ tests:  integration-tests/http/*.spec.ts
npm run test:integration:modules # module integ tests: src/modules/*/__tests__/**/*.ts
```
Run a single test: append a Jest pattern, e.g.
```bash
TEST_TYPE=unit NODE_OPTIONS=--experimental-vm-modules npx jest path/to/file.unit.spec.ts
```

### Storefront (`apps/storefront`, run from that dir)
```bash
npm run dev          # next dev --turbopack -p 8000
npm run build
npm run lint         # next lint
npm run analyze      # bundle analysis (ANALYZE=true next build)
```

## Setup essentials

1. Backend needs a Postgres DB. Copy `apps/backend/.env.template` → `.env`, set `DATABASE_URL`, then `npx medusa db:migrate`.
2. Storefront needs a publishable API key from the running backend (Admin → Settings → Publishable API key). Copy `apps/storefront/.env.template` → `.env.local` and set `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`. The storefront **will not start** without it (`check-env-variables.js` hard-exits via `next.config.js`).

Storefront env vars: `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` (required), `NEXT_PUBLIC_MEDUSA_BACKEND_URL` (default `http://localhost:9000`), `NEXT_PUBLIC_DEFAULT_REGION` (default `dk`), `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_STRIPE_KEY` (optional).

## Backend architecture (Medusa v2)

`medusa-config.ts` is the entry config; customization lives under `src/` in Medusa's convention-based folders (each has a README explaining the pattern):

- `src/api/` — custom REST routes. File-based routing: `src/api/store/...` and `src/api/admin/...`, each `route.ts` exports HTTP handlers.
- `src/modules/` — custom commerce modules (services + data models, isolated per Medusa's module architecture).
- `src/workflows/` — Medusa workflows (multi-step orchestrations with compensation).
- `src/subscribers/` — event handlers.
- `src/jobs/` — scheduled jobs.
- `src/links/` — module links (relations across module boundaries).
- `src/admin/` — admin dashboard customizations (widgets/routes) and `src/admin/i18n/`.

Tests use Jest with `@swc/jest`. `jest.config.js` switches `testMatch` based on the `TEST_TYPE` env var (unit / integration:http / integration:modules), so always run via the npm scripts or set `TEST_TYPE` manually.

## Storefront architecture (Next.js App Router)

- **Routing** is locale-prefixed: everything lives under `src/app/[countryCode]/`, split into route groups `(main)` and `(checkout)`. `src/middleware.ts` detects the user's country, caches the region map from `GET /store/regions` (1h TTL), and redirects to the correct `countryCode` prefix. Middleware uses raw `fetch` (not the SDK) because it runs on the Edge runtime.

- **`src/lib/data/*.ts`** is the data access layer — the most important code to understand. Each file (`cart.ts`, `products.ts`, `orders.ts`, `customer.ts`, `regions.ts`, etc.) is a set of `"use server"` server actions / server functions that call the Medusa SDK and handle Next.js cache tags. This is the single boundary through which the UI reaches the backend; add new backend interactions here rather than calling the SDK from components.

- **`src/lib/config.ts`** constructs the shared Medusa SDK client (`sdk`) and wraps `sdk.client.fetch` to inject the `x-medusa-locale` header. Import `sdk` from here, do not instantiate new clients.

- **`src/lib/data/cookies.ts`** centralizes auth/cart/cache helpers: `getAuthHeaders`, `getCartId`/`setCartId`, `getCacheTag`/`getCacheOptions`. Cart ID and JWT live in cookies; cache tags drive `revalidateTag`.

- **`src/modules/<domain>/`** holds the UI, organized by domain (cart, checkout, products, account, order, store, collections, categories, layout, home, common, skeletons). Each module typically has `components/` and `templates/` (templates compose components into page-level views consumed by `src/app/.../page.tsx`).

- **Path aliases** (`tsconfig.json`): `@lib/*` → `src/lib/*`, `@modules/*` → `src/modules/*`.

- Styling: Tailwind CSS with `@medusajs/ui-preset`. Note: `next.config.js` sets `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors` to `true`, so type/lint errors do **not** fail `next build` — run `npm run lint` separately.
