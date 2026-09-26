# Oprecht web (Milestone 0)

Next.js App Router app: marketing shell (nl/fr/en), age gate, auth API stubs, consent log, cookie notice, health endpoint.

## Prerequisites

- Node.js 20+
- npm 10+

## Run locally

```bash
cd web
npm install
cp .env.example .env.local   # optional; defaults work for local demo
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you will be redirected to `/nl` (default locale).

### Useful URLs

| Path | Purpose |
| --- | --- |
| `/nl`, `/fr`, `/en` | Localized home |
| `/nl/register` | Age gate → register |
| `/nl/login` | Login |
| `/api/health` | Health check |
| `/v1/auth/register` | OpenAPI-aligned rewrite → `/api/auth/register` |
| `/api/me` | Current user (Bearer or session cookie) |

## Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run start    # serve production build
npm run lint     # ESLint
```

## Auth storage (M0 demo)

User accounts, consent rows, verify/reset tokens and sessions persist to `web/data/store.json` (gitignored).

**Production needs a real database** (Postgres recommended) and a real mailer. Email verification and password-reset tokens are logged as structured JSON (`email_verify_stub` / `password_reset_stub`) instead of sending mail.

Set `AUTH_SECRET` (or `JWT_SECRET`) to a long random string before any shared deploy. Access tokens are HS256 JWTs (Bearer + httpOnly cookie).

## Consent log

On successful register we store: user id, terms version (`terms-1.0`), privacy version (`privacy-1.0`), marketing bool (default false), timestamp, hashed IP + user-agent.

## Security notes (M0)

- Passwords hashed with bcrypt (cost 12)
- Age 18+ enforced client + server (`underage` error)
- In-memory rate limits on register / login / forgot
- HTTPS-only cookie `secure` flag in production
- No Sentry yet — structured `console` JSON logs only

## Out of scope (later milestones)

Quiz, profile, matching, chat, Mollie billing.
