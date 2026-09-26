# Oprecht

Subscription dating for singles seeking a serious relationship — curated matches from a values quiz (Flanders-first, NL/FR/EN).

## Repo layout

| Path | What |
| --- | --- |
| `web/` | Next.js app (Milestone 0 foundations) |
| `PRODUCT_SPEC.md` | Full MVP product spec |
| `openapi.yaml` | Shared HTTP API contract |
| `OPEN_DECISIONS.md` | Locked product decisions |
| `MILESTONE_0_TICKETS.md` / `MILESTONE_1_TICKETS.md` | Engineering tickets |
| `docs/quiz/` | Quiz content template (D7) |

## Run locally

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (redirects to `/nl`).

API health: [http://localhost:3000/api/health](http://localhost:3000/api/health)

OpenAPI local paths are also available under `/v1/*` (rewritten to `/api/*`).

See [`web/README.md`](./web/README.md) for auth demo storage, env vars, and security notes.

## Stack (MVP)

- Frontend: Next.js 15 + TypeScript + Tailwind + next-intl
- Auth API (M0): Next.js Route Handlers + bcrypt + JWT (file-backed demo store)
- Matching / chat / Mollie: later milestones per `PRODUCT_SPEC.md` and `openapi.yaml`

## Brand

**Oprecht** — honest dating. Soft launch Flanders-first.
