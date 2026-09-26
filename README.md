# Oprecht

Subscription dating for singles seeking a serious relationship — curated matches from a values quiz (Flanders-first, NL/FR/EN).

## Repo layout

| Path | What |
| --- | --- |
| `web/` | Next.js app (Milestone 0 skeleton) |
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

Open [http://localhost:3000](http://localhost:3000).

## Stack (MVP)

- Frontend: Next.js + TypeScript + Tailwind
- API / matching / chat / Mollie: follow `PRODUCT_SPEC.md` and `openapi.yaml` (not in this skeleton yet)

## Brand

**Oprecht** — honest dating. Soft launch Flanders-first.
