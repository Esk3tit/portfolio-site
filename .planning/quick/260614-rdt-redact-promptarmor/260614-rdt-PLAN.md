---
quick_id: 260614-rdt
slug: redact-promptarmor
date: 2026-06-14
mode: quick-full
---

# Quick Task 260614-rdt: Redact PromptArmor experience + swap resume

## Goal

Black-ops–redact the PromptArmor work-experience details on the portfolio card and
point the resume download at the new redacted PDF — without leaking any real copy
to the DOM, JS bundle, or static export.

## Decisions (from discussion)

- **Scope:** Keep the card header visible (company `PromptArmor (YC W24)`, title
  `Founding Engineer`, dates — all public). Redact only the 4 detail bullets.
- **Disclaimer + hover:** Show BOTH — a visible `🤐 Stealth startup` disclaimer
  line AND a `🤫` that fades in on hover over the redaction bars.

## Tasks

1. **Strip real copy + add redaction data** (`src/data/content.ts`)
   - Add optional `redacted` + `disclaimer` fields to `Experience`.
   - Replace the 4 real PromptArmor bullets with fake lorem strings (real copy
     removed entirely so it never enters the bundle). Set `redacted: true`.
   - verify: `grep` for real phrases returns nothing in `src/`.
   - done: content compiles, no real PromptArmor copy in source.

2. **Render redaction UI** (`src/components/sections/ExperienceSection.tsx`)
   - When `exp.redacted`, render each bullet as word-level solid black censor
     bars (fake text transparent + `aria-hidden`), `🤫` on `group-hover`, and the
     `🤐` disclaimer line. Non-redacted entries unchanged.
   - verify: `tsc --noEmit` + `eslint` clean.
   - done: redacted card renders bars + disclaimer; other cards normal.

3. **Swap resume + delete old PDF** (`HeroSection.tsx`, `ContactSection.tsx`, `public/`)
   - Repoint both download links to `/Resume.pdf`.
   - `git rm "public/Khai Phan Resume 2-6-2026.pdf"` (unredacted, was publicly fetchable).
   - verify: build output contains `Resume.pdf`, no `2-6-2026` file anywhere.
   - done: links download the redacted PDF; old PDF gone.

## must_haves

- truths:
  - Real PromptArmor descriptions appear nowhere in `src/`, `.next/`, or `out/`.
  - Old unredacted PDF is removed from `public/` and not in the static export.
  - Both resume links resolve to the redacted `/Resume.pdf`.
- artifacts:
  - `public/Resume.pdf` served at site root; old PDF deleted.
- key_links:
  - `src/data/content.ts`, `src/components/sections/ExperienceSection.tsx`,
    `src/components/sections/HeroSection.tsx`, `src/components/sections/ContactSection.tsx`
