# Milestone 0 — Engineering tickets

**Goal:** Marketing shell (NL/FR/EN), age gate, auth, consent log, legal footer.  
**Depends on:** Stack choice (Next.js + API per PRODUCT_SPEC); OpenAPI auth + `/me` paths.  
**Out of scope:** Quiz, profile, matching, chat, billing.

---

## Epic M0 — Foundations

### M0-1 · Repo & app skeleton
**Type:** Chore  
**As** engineering **I need** a runnable web + API skeleton **so** feature tickets have a home.  
**AC:**
- Monorepo or dual-repo layout documented in README
- Next.js (TS) app boots; API boots with health `GET /health`
- Shared lint/format/test scripts
- CI runs lint + unit smoke on PR
**Estimate:** M

### M0-2 · Design tokens & layout chrome
**Type:** Frontend  
**AC:**
- Responsive shell: header (logo placeholder, locale switcher, login/register), footer links
- Footer routes exist as pages: About, Terms, Privacy, Help & Contact, Prices, Safety tips, Cookies (placeholder copy OK if marked TBD)
- WCAG: skip link, focus visible, semantic landmarks
**Estimate:** M

### M0-3 · i18n framework (nl / fr / en)
**Type:** Frontend  
**AC:**
- Locale switcher sets `nl` | `fr` | `en` and persists (cookie/local storage)
- All M0 strings routed through i18n; no hard-coded user-facing English in components
- Missing key fails visibly in non-prod (or shows key) so QA can catch gaps
**Estimate:** M

### M0-4 · Marketing tour pages
**Type:** Frontend / Content  
**AC:**
- Pages: You & dating, Our method, Safety, Service, Prices, FAQ — each in nl/fr/en
- Original copy only (no competitor IP); placeholders allowed if flagged `content:draft`
- Prices page states Premium benefits per freemium matrix; amounts show “TBD” until D2 locked
**Estimate:** L

### M0-5 · Age gate
**Type:** Frontend + API  
**AC:**
- Before registration continues, user confirms 18+ (DOB or confirm UX — DOB preferred, matches OpenAPI)
- Server rejects `dateOfBirth` under 18 with clear error code
- Under-18 cannot create an account
**Estimate:** S

### M0-6 · Consent & legal versioning
**Type:** Backend  
**AC:**
- Terms/Privacy documents have `version` ids
- Register stores consent log: user id, terms version, privacy version, marketing bool, timestamp, IP/user-agent hash as designed
- Marketing default false unless opted in
**Estimate:** M

### M0-7 · Register API + UI
**Type:** Full-stack  
**OpenAPI:** `POST /auth/register`  
**AC:**
- Fields: email, password, gender, genderSought, dateOfBirth, locale, consents
- Password rules enforced client + server (min 8, letter + digit/special, ≠ email)
- Duplicate email → 409
- Returns session or verification-needed state per OpenAPI
- UI wired in nl/fr/en with link to Terms/Privacy
**Estimate:** L

### M0-8 · Email verification
**Type:** Full-stack  
**OpenAPI:** `POST /auth/email/verify`  
**AC:**
- Verification email sent on register (provider stub OK in dev)
- Token verify sets `emailVerified`
- Resend with rate limit
- Localized email templates (nl/fr/en)
**Estimate:** M

### M0-9 · Login / logout
**Type:** Full-stack  
**OpenAPI:** `POST /auth/login`, `POST /auth/logout`, `GET /me`  
**AC:**
- Login returns Bearer JWT (and refresh if used)
- Logout invalidates refresh/session server-side
- `/me` returns onboarding flags (all false) + entitlements (all false) + premium.active false
- Wrong credentials → 401 without email enumeration leakage beyond generic message
**Estimate:** M

### M0-10 · Password forgot / reset
**Type:** Full-stack  
**OpenAPI:** `POST /auth/password/forgot`, `POST /auth/password/reset`  
**AC:**
- Forgot always returns 204
- Reset with valid token updates password; invalid/expired → 400
- Localized emails
- Rate limited
**Estimate:** M

### M0-11 · Session hardening
**Type:** Backend  
**AC:**
- HTTPS-only assumptions documented
- Password hashing (argon2/bcrypt)
- Auth rate limits (login, register, forgot)
- CORS and security headers baseline
**Estimate:** M

### M0-12 · Cookies & CMP stub
**Type:** Frontend  
**AC:**
- Cookie notice + link to Cookies page
- Essential vs optional distinction; analytics off until consent (even if analytics ships later)
**Estimate:** S

### M0-13 · Observability baseline
**Type:** Chore  
**AC:**
- Structured request logging on API
- Error tracking hooked (Sentry or equiv.) for web + API
- `GET /health` used by deploy
**Estimate:** S

### M0-14 · Milestone 0 QA checklist
**Type:** QA  
**AC:**
- Checklist executed in nl, fr, and en: tour pages, register, verify, login, logout, reset, age reject, consent rows in DB
- a11y smoke on auth + tour (keyboard, focus, contrast sample)
- Sign-off recorded in PR or release note
**Estimate:** M

---

## Suggested order

```
M0-1 → M0-2 → M0-3 → M0-4
         ↘ M0-5
M0-1 → M0-6 → M0-7 → M0-8 → M0-9 → M0-10 → M0-11
M0-2 → M0-12
M0-1 → M0-13
M0-14 last
```

## Parallelism

- Content (M0-4) can parallel API auth once M0-3 exists.  
- M0-12 parallel with auth UI.  
- M0-13 parallel anytime after M0-1.

## Definition of Done (epic)

- [ ] All M0 tickets Done  
- [ ] Soft-launch blockers for auth/legal closed  
- [ ] No P0/P1 open on auth or consent  
- [ ] Ready to start Milestone 1 (quiz/profile) without rework of session/i18n

## Handoff notes

- Brand/logo: use placeholder until D1.  
- Payment amounts: “TBD” on Prices until D2.  
- Do not implement quiz or suggestions in M0.
