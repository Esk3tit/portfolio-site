---
quick_id: 260614-rdt
slug: redact-promptarmor
date: 2026-06-14
status: complete
commit: 90dc3fe
---

# Quick Task 260614-rdt: Summary

## What changed

1. **`src/data/content.ts`** — Added optional `redacted` + `disclaimer` fields to
   `Experience`. Removed the 4 real PromptArmor bullets and replaced them with fake
   lorem placeholders; set `redacted: true` and a `🤐` disclaimer. Real copy no
   longer exists anywhere in source.
2. **`src/components/sections/ExperienceSection.tsx`** — Redacted-mode rendering:
   word-level solid black censor bars (fake text rendered transparent +
   `aria-hidden`), a `🤫` that fades in on hover (`group-hover/redaction`), and a
   visible `🤐` stealth-startup disclaimer line. Header (company/title/dates) stays
   visible. Non-redacted entries render exactly as before.
3. **`HeroSection.tsx` + `ContactSection.tsx`** — Both resume links repointed from
   `/Khai Phan Resume 2-6-2026.pdf` to the redacted `/Resume.pdf`.
4. **`public/`** — Deleted the unredacted `Khai Phan Resume 2-6-2026.pdf` (it was
   directly fetchable). Redacted `Resume.pdf` is served at site root.

## Verification

- `tsc --noEmit` — clean.
- `eslint` (changed files) — clean.
- `next build` — exit 0, static export generated.
- **Leak check (the core requirement):** `grep` for real phrases ("shareable
  alerts", "vendor tagging", "31 organizations", "LLM-powered pipeline", "security
  metadata") across `src/`, `.next/`, and `out/` → **zero matches**. The real work
  details exist only in the redacted resume PDF, not in any shipped HTML/JS — not
  visible via view-source, inspect element, or console.
- Old PDF absent from `public/` and `out/`; new `Resume.pdf` present in `out/`.

## Notes / follow-ups

- The PDF text isn't extractable as plain text (embedded-font encoding), so the
  redacted Resume.pdf doesn't trivially leak its own contents either.
- Visual spot-check in a browser (`npm run dev`) recommended for final aesthetic
  sign-off on the censor-bar look in both light and dark mode.
