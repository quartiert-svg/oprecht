# Dating Web — Product Specification (MVP)

**Status:** Draft v0.1  
**Owner:** Dating Web (web product)  
**Date:** 26 Sep 2026  
**Scope:** Responsive web app only. Native iOS/Android = Phase 3.  
**Related:** [`openapi.yaml`](./openapi.yaml)

---

## 1. Product summary

A subscription dating service for singles seeking a **serious relationship**. Discovery is **curated**, not swipe-or-browse: a **values/preferences quiz (~30–50 items)** produces a **compatibility score**, and the product suggests **one profile at a time**. Revenue is **freemium**: Basic can register, complete the quiz, build a profile, and Like/Pass on blurred suggestion cards; Premium unlocks clear photos, messaging, who liked / visitors, radius search, and continuous suggestions.

**Non-negotiable:** Original brand name, questionnaire, matching copy, and visual identity. Do **not** reuse dating.be, “dating Principe®”, their questions, or their marketing copy.

### Locked decisions

| Topic | Decision |
| --- | --- |
| Launch market | Belgium |
| Languages | Dutch (NL), French (FR), English (EN) |
| Matching v1 | Simpler values/preferences quiz (~30–50 items); expert psychometrics later |
| Platform | Web first; native apps Phase 3 |
| Brand | **Oprecht** |
| Premium prices | **€12.99 / €29.99 / €79.99** (1 / 3 / 12 mo) |
| Payments | **Mollie** primary; Stripe optional later |
| Basic suggestion cap | **10 / day** |
| Basic messaging | **Send & receive locked** until Premium |
| Soft launch | **Flanders-first** |
| Freemium | Basic: quiz, profile, blurred cards, Like/Pass. Premium: clear photos, unlimited messaging, likes received, visitors, radius results, continuous suggestions |

### Still open

- Brand name and visual identity  
- Price points for 1 / 3 / 12 month Premium  
- Payment provider (Stripe vs Mollie / Bancontact)  
- Exact Basic daily suggestion cap  
- Exact quiz items and scoring weights  
- Auto-renewal / cancellation legal copy (EU)  
- ~~Positioning~~ → **serious long-term, selective/higher-intent niche**

---

## 2. Goals & non-goals

### Goals (MVP)

1. Prove the loop: **register → quiz → profile → scored suggestions → Like/Pass → mutual match → chat → pay**.  
2. Ship a trustworthy Belgian product: GDPR, safety controls, moderation.  
3. Establish shared API contracts the future apps will consume.

### Non-goals (MVP)

- Open member directory / free-text people search  
- Icebreakers, smiles, Match Unlock credits  
- Full ~80-page personality PDF report  
- Favourites as a first-class tab (may stub)  
- SEO magazine / content hub  
- Native apps, selfie verification badge  
- Expert psychometric instrument (Phase 2+)

---

## 3. Personas & jobs

| Persona | Job to be done |
| --- | --- |
| Seeker (Basic) | Understand if this is “for me”; complete quiz; see whether matches feel relevant |
| Seeker (Premium) | Message compatible people; see who engaged; refine area search |
| Moderator / admin | Clear photo and report queues; ban bad actors |
| Visitor (logged out) | Learn method, safety, prices; start registration |

---

## 4. Information architecture (web)

### Public

- Marketing tour: You & dating, Our method, Safety, Service, Prices, FAQ  
- Legal: Terms, Privacy, Cookies  
- Help & Contact  
- Auth: Register, Login, Password reset, Email verify  
- Age gate before continuing registration

### Logged-in (primary tabs)

1. **Suggestions** — curated cards, Like / Pass  
2. **Likes** — received likes (Premium; Basic sees upgrade / blurred per rules)  
3. **Chats** — messenger (send = Premium)  
4. **Visitors** — Premium  
5. **Profile** — own profile, photos, quiz status  

Plus: Search criteria, Settings (membership, personal data, notifications, payment), Report/block flows.

Global: logo, tabs, unread badge on Chats, avatar menu, locale switcher.

---

## 5. Freemium matrix

| Capability | Basic | Premium |
| --- | --- | --- |
| Register, quiz, profile | Yes | Yes |
| Suggestion cards | Yes (blurred photos) | Yes (clear photos) |
| Like / Pass | Yes | Yes |
| Daily suggestion volume | Capped (**10 / day**) | Continuous refresh |
| Radius / area ranking applied | Criteria may be stored; results not radius-ranked | Yes |
| See mutual matches | Yes | Yes |
| Send / receive messages | No (upgrade CTA) | Unlimited |
| Who liked me | No (or upgrade wall) | Yes |
| Profile visitors | No | Yes |
| Clear photos of others | No | Yes |

Entitlements API flags: `clearPhotos`, `messaging`, `likesVisitors`, `radiusSearch`, `continuousSuggestions`.

---

## 6. Milestones

| # | Name | Outcome |
| --- | --- | --- |
| 0 | Foundations | Tour i18n, age gate, auth, consent log, legal footer |
| 1 | Onboarding | Quiz, profile, photos, search criteria → ready for matches |
| 2 | Match & act | Scoring job, suggestion cards, Like/Pass, mutual match, report/block |
| 3 | Chat & paywall | Messenger, Premium checkout, emails, entitlements |
| 4 | Trust & ship | Admin moderation, GDPR export/delete, a11y bar, soft launch |

Suggested calendar (indicative): ~12–13 weeks if one web squad; adjust to capacity.

---

## 7. Functional requirements

### 7.1 Accounts & auth

- Email + password registration with gender, gender sought (women / men / everyone), date of birth (18+ enforced server-side).  
- Password rules: min 8 chars, letters plus digit or special character, must differ from email.  
- Email verification required before messaging and before Premium purchase (quiz/profile may proceed with soft nag).  
- Login, logout, forgot/reset password.  
- JWT (or equivalent) Bearer sessions; HTTPS only.  
- Locale stored on user (`nl` | `fr` | `en`).

### 7.2 Values quiz

- Versioned item set, ~30–50 original questions, localized.  
- Progress savable (`PUT /quiz/answers`); resume later.  
- Submit enqueues scoring; user sees “preparing matches” until scores exist.  
- Retake allowed from settings; warn that compatibility scores will recalculate.  
- No third-party questionnaire IP.

### 7.3 Profile & photos

- Fields: first name, quote, about me, structured facts (region, masked postcode, job, height, education, languages, smoker, pets, marital status, children, wish for children), interest tags.  
- ≥1 photo required for “profile complete”.  
- Upload → `pending` moderation → `approved` / `rejected`.  
- Storage keeps blur + clear derivatives; API returns `urlClear` only for self or Premium viewers.  
- Completeness % optional for MVP UI (Phase 2 meter OK); server still enforces minimum completeness for suggestions.

### 7.4 Search criteria

- Age range (18–89), height range, area (countries/provinces and/or postcode + radius).  
- Soft prefs: children, wish for children, smoker, education (defaults “no strong filter” OK).  
- Radius filter **applied in matching only if** `entitlements.radiusSearch`.

### 7.5 Matching & suggestions

- Batch job (nightly or daily) computes compatibility scores for eligible pairs under hard filters.  
- Score displayed on card (numeric + short verdict/blurb).  
- One-at-a-time UX with Pass / Like; Back/Next through current queue.  
- Basic: daily cap (**10**); when exhausted, empty state + Premium upsell for continuous suggestions.  
- Like/Pass once per pair; undo out of scope.  
- Mutual like → match record + conversation + notifications.

### 7.6 Safety (user)

- Report profile (reason required) → admin queue.  
- Block/hide profile.  
- Delete messages / conversation.  
- In-chat safety notice linking to safety tips.  
- Data minimisation: first names, masked postcode, distance bands.

### 7.7 Messenger

- Two-pane: list + thread.  
- List: avatar, name, preview, unread, badges (`new_match`, `your_turn`).  
- Thread: text, timestamps, read receipts, date separators, mutual-match system line.  
- `POST` message returns **402** without messaging entitlement.  
- Realtime via WebSocket: `message.created`, `message.read`, `match.created`, `unread.updated`.

### 7.8 Billing

- Plans: 1, 3, 12 months.  
- Checkout + customer portal; webhooks idempotent.  
- Entitlements flip within minutes of successful payment.  
- Expiry / failed payment restores Basic limits; history retained.  
- EU auto-renewal and cancellation disclosures (copy TBD).

### 7.9 Notifications

Transactional email (localized): verify email, password reset, new match, new message.  
Preference centre toggles for those + marketing.  
In-app unread badge on Chats.

### 7.10 GDPR

- Consent log (terms, privacy, marketing) with timestamp + policy version.  
- Export (`POST /me/export`) and account deletion (`DELETE /me` with confirm).  
- EU hosting / DPA assumptions documented for engineering.

### 7.11 Admin

- Photo moderation queue (approve/reject).  
- Reports queue (resolve).  
- Ban user.  
- Audit log for moderation actions (NFR).

---

## 8. Acceptance criteria (by milestone)

### Milestone 0 — Foundations

- Tour pages exist in NL, FR, EN with original copy only.  
- Locale switcher persists; critical strings not silently missing.  
- Age gate blocks under-18.  
- Register / login / logout / password reset work.  
- Consent log written on sign-up.  
- Footer links: About, Terms, Privacy, Help, Prices, Safety, Cookies.

### Milestone 1 — Onboarding

- Server blocks suggestions until quiz submitted, minimum profile (incl. ≥1 photo pending or approved), and search criteria saved.  
- Quiz progress persists across sessions.  
- Profile PATCH and photo upload succeed; blur derivative available.  
- Completing onboarding routes to suggestions (or preparing state).

### Milestone 2 — Match & act

- Eligible users receive scored suggestion cards.  
- Like/Pass persist; mutual like creates match + conversation.  
- Basic photos blurred; Premium clear (when entitled).  
- Report creates admin item; block hides user from suggestions and chat entry points.  
- Daily cap enforced for Basic.

### Milestone 3 — Chat & paywall

- Premium user can send messages with read receipts and unread badges.  
- Basic send attempt → upgrade path (402 + UI CTA).  
- Checkout for 1/3/12 months grants entitlements.  
- Portal allows manage/cancel per policy.  
- Match/message emails honor preference toggles.

### Milestone 4 — Trust & ship

- Admin can clear photo and report queues and ban.  
- User can export and delete data.  
- Agreed WCAG 2.1 AA checks pass on auth, onboarding, suggestions, chat, checkout.  
- Soft-launch checklist signed (monitoring, backups, abuse rate limits).

---

## 9. Key user flows

1. **Happy path Premium:** Register → verify → quiz → profile → criteria → suggestions → Like → mutual match → checkout → chat.  
2. **Basic explorer:** Same through Like/Pass; hit photo blur and message paywall → upgrade.  
3. **Report abuse:** From card or chat → reason → confirmation → admin handles.  
4. **Retake quiz:** Settings → warn → retake → scores rebuild → suggestions refresh.  
5. **Cancel Premium:** Portal → confirm → entitlements end at period end (or immediate per legal copy).

---

## 10. Content & i18n

- All product UI, emails, and tour pages in **nl**, **fr**, **en**.  
- `Accept-Language` and user locale; fallback visible to QA (no empty critical chrome).  
- Quiz content versioned; translations ship with same version id.

---

## 11. Non-functional requirements

| Area | Requirement |
| --- | --- |
| Compliance | GDPR; 18+; consent log; export/delete; EU data residency target |
| Accessibility | WCAG 2.1 AA on core flows |
| Performance | Primary pages interactive &lt; 2s on mid-range broadband target |
| Security | TLS, encryption at rest for media/PII as designed, password hashing, rate limits on like/message/report/auth |
| Reliability | Matching job idempotent; billing webhooks idempotent |
| Observability | Error tracking, payment/moderation audit logs |
| Abuse | Rate limits; photo moderation; report pipeline |

---

## 12. Technical architecture (guidance)

| Layer | Suggestion |
| --- | --- |
| Frontend | Next.js + TypeScript, responsive, i18n |
| API | Node (NestJS) or Python (FastAPI/Django), OpenAPI-first |
| DB | PostgreSQL + PostGIS |
| Matching | Batch job + score table |
| Chat realtime | WebSockets or hosted (Stream/Sendbird) |
| Media | S3-compatible + CDN + moderation |
| Payments | **Mollie** (primary); Stripe optional later |
| Email | Postmark or SendGrid |

Authoritative HTTP contract: **`openapi.yaml`**.

### WebSocket (normative events)

| Event | Payload (min) |
| --- | --- |
| `message.created` | message object |
| `message.read` | conversationId, readAt |
| `match.created` | match + conversationId |
| `unread.updated` | totalUnread |

---

## 13. Analytics (MVP events)

`signed_up`, `quiz_started`, `quiz_completed`, `profile_completed`, `suggestion_impression`, `suggestion_like`, `suggestion_pass`, `match_created`, `checkout_started`, `purchase_succeeded`, `message_sent`, `report_submitted`, `paywall_viewed`.

No PII in event props beyond opaque user id.

---

## 14. Phase 2 / 3 backlog (out of MVP)

**Phase 2:** Likes/visitors polish, favourites, trait report UI, icebreaker & smile, interest filter, completeness meter.  
**Phase 3:** Match Unlock credits, native apps + push, verification badge, advice magazine/SEO.

---

## 15. Open questions (product)

1. Brand name and identity direction?  
2. Premium prices (EUR) for 1 / 3 / 12 months?  
3. Stripe vs Mollie?  
4. Basic daily suggestion cap (e.g. 5 / 10 / 20)?  
5. Messaging policy nuance: Basic can **read** existing threads or fully locked? *(Spec default: send and receive locked until Premium.)*  
6. ~~Soft launch region~~ → **Flanders-first**; FR/EN product-ready, market expand later

---

## 16. Document history

| Version | Date | Notes |
| --- | --- | --- |
| 0.1 | 2026-09-26 | Initial full MVP spec from competitive brief + locked decisions + OpenAPI |

