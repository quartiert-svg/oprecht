# Milestone 1 — Engineering tickets

**Goal:** Onboarding loop — values quiz → profile (photos, facts, interests) → search criteria → ready for suggestions.  
**Depends on:** Milestone 0 Done (auth, `/me`, i18n, consent).  
**Out of scope:** Matching job, suggestion cards, Like/Pass, chat, billing (M2–M3).  
**Content:** Real quiz items from user (D7); use versioned placeholders until delivered.

---

## Epic M1 — Onboarding

### M1-1 · Onboarding state machine
**Type:** Backend  
**AC:**
- `/me.onboarding` flags: `quizComplete`, `profileComplete`, `searchCriteriaComplete`, `readyForSuggestions`
- Server enforces: suggestions routes return 403 until all three complete (+ scoring may still be pending → preparing state in M2)
- Minimum profile rule documented: firstName, ≥1 photo (pending|approved), quote or aboutMe (pick one mandatory — **default: aboutMe min length 40**), core facts (region, birth year already on account)
**Estimate:** M

### M1-2 · Quiz definition API (versioned)
**Type:** Backend  
**OpenAPI:** `GET /quiz/current`  
**AC:**
- Returns `version`, `itemCount` (30–50), localized `items[]` for `nl` | `fr` | `en`
- Placeholder bank ships for all locales until user content arrives
- Content swap is data-only (new version id), no code deploy required for copy changes
**Estimate:** M

### M1-3 · Quiz progress & submit
**Type:** Backend  
**OpenAPI:** `PUT /quiz/answers`, `POST /quiz/submit`  
**AC:**
- Upsert answers; resume mid-quiz
- Submit requires all items; status `submitted`; enqueue scoring stub (no-op or write empty traits — real scoring in M2)
- Retake endpoint or reuse submit after reset in settings (warn copy in UI ticket)
**Estimate:** M

### M1-4 · Quiz UI flow
**Type:** Frontend  
**AC:**
- Multi-step quiz with progress; save on each step / debounce
- Leave & resume; NL primary, FR/EN available
- Submit → next onboarding step (profile)
- Blocks Suggestions tab until complete
**Estimate:** L

### M1-5 · Profile API
**Type:** Backend  
**OpenAPI:** `GET|PATCH /me/profile`  
**AC:**
- Fields per OpenAPI: quote, aboutMe, facts, interests, visibility
- Validation + i18n error codes
- Masked postcode storage rules (store full securely if needed; expose masked)
**Estimate:** M

### M1-6 · Profile UI
**Type:** Frontend  
**AC:**
- Tabs or sections: Profile / Photos (photos in M1-8) / Quiz status link
- Edit facts + interest tags; save PATCH
- Completeness % optional display (can be simple client calc)
**Estimate:** L

### M1-7 · Media storage pipeline
**Type:** Backend / Infra  
**AC:**
- S3-compatible upload; generate `urlBlur` + `urlClear` derivatives
- Photo entity: `pending` | `approved` | `rejected`; new uploads start `pending`
- `urlClear` only for self on API until Premium (M3 entitlements)
**Estimate:** L

### M1-8 · Photos API + UI
**Type:** Full-stack  
**OpenAPI:** `POST /me/photos`, delete, set primary  
**AC:**
- Upload ≥1 photo required for `profileComplete`
- Primary selection; delete last photo blocked if it would break completeness while in onboarding
- Show pending/rejected states in UI
**Estimate:** M

### M1-9 · Search criteria API + UI
**Type:** Full-stack  
**OpenAPI:** `GET|PUT /me/search-criteria`  
**AC:**
- Age, height, area (BE provinces / postcode + radius UI)
- Soft prefs optional
- Radius stored for all; application deferred to M2 Premium entitlement
- Completing criteria flips `searchCriteriaComplete`
**Estimate:** M

### M1-10 · Onboarding router / gate UI
**Type:** Frontend  
**AC:**
- After login, redirect to next incomplete step: quiz → profile → criteria → “preparing matches” placeholder
- Logged-in nav hides or disables Suggestions until `readyForSuggestions` (or show locked with CTA)
**Estimate:** M

### M1-11 · Quiz retake in settings
**Type:** Full-stack  
**AC:**
- Settings → retake with warning: scores/matches will recalculate
- Resets quiz progress; clears `quizComplete` until submit again
**Estimate:** S

### M1-12 · Content handoff: user quiz import
**Type:** Chore / Content  
**AC:**
- Document JSON/CSV template matching `QuizDefinition`
- Import path or admin script loads user-supplied nl (required), fr/en (required before Wallonia expand; placeholders OK for soft launch)
- New `version` issued; old in-progress users handled (force continue on old version or migrate — **default: finish on started version**)
**Estimate:** M

### M1-13 · Milestone 1 QA
**Type:** QA  
**AC:**
- E2E: register (M0) → quiz → profile+photo → criteria → onboarding flags true
- Locale smoke NL (+ FR/EN strings present)
- Photo pending path; validation failures
- Sign-off checklist attached to release note
**Estimate:** M

---

## Suggested order

```
M1-1 → M1-2 → M1-3 → M1-4
M1-1 → M1-5 → M1-6
M1-7 → M1-8
M1-9 → M1-10
M1-11 parallel after M1-3/4
M1-12 when user content arrives
M1-13 last
```

## Definition of Done (epic)

- [ ] New user can finish onboarding without hitting Suggestions
- [ ] `/me.onboarding.readyForSuggestions` true after quiz+profile+criteria
- [ ] Photos have blur/clear derivatives; moderation pending works
- [ ] Placeholder or real quiz version live in NL
- [ ] Ready for Milestone 2 (scoring + suggestion cards)

## Notes

- Brand: **Oprecht**. Soft launch Flanders-first — polish NL UX first.  
- Do not build Like/Pass or messenger here.
