# Oprecht quiz content (D7)

Fill `quiz.template.json` (or copy to `quiz.nl.json`).

## Rules
- **30–50** items (`itemCount` must match `items.length`).
- Same `id` for each question/answer across locales.
- **Original copy only** — no dating.be / Principe text.
- Weights: typically **-2 … +2** on one or more `traits`.
- Soft launch: **nl** required first; add `fr` / `en` strings in the same file (empty strings blocked at import).

## How to deliver
1. Complete NL prompts + answers for all items.
2. Add FR/EN when ready.
3. Send the JSON back in this chat (or attach the file).
4. Engineering imports as quiz `version` (see M1-12).

## Example item shape
See first five sample items in the template — replace or extend them; keep the structure.
