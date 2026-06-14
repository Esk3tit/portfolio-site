---
phase: quick-260614-rdt-redact-promptarmor
reviewed: 2026-06-14T00:00:00Z
depth: deep
files_reviewed: 4
files_reviewed_list:
  - src/data/content.ts
  - src/components/sections/ExperienceSection.tsx
  - src/components/sections/HeroSection.tsx
  - src/components/sections/ContactSection.tsx
findings:
  critical: 0
  warning: 3
  info: 4
  total: 7
status: issues_found
---

# Quick Task: Code Review Report — Black-Ops PromptArmor Redaction

**Reviewed:** 2026-06-14
**Depth:** deep
**Files Reviewed:** 4
**Status:** issues_found

## Summary

The change redacts the PromptArmor work-experience bullets behind solid black censor
bars and swaps both resume download links from the deleted unredacted PDF to
`/Resume.pdf`.

**Core security goal — VERIFIED MET (no Critical findings).** I scanned the actual
static export (`out/index.html`) and the production JS chunk
(`out/_next/static/chunks/94202534e5390ee3.js`) rather than trusting the source. The
PromptArmor card *is* server-rendered into the prerendered HTML (it appears alongside
the legit Tesla/Cue Health cards), so redaction must survive SSR — and it does. The
only PromptArmor-related strings that ship are intentionally public:

- `PromptArmor (YC W24)` (company, displayed)
- `Founding Engineer` (title, displayed)
- the visible disclaimer mentioning `proprietary market strategy`
- the `sr-only` notice `Redacted -- proprietary details withheld`
- the fake `Lorem ipsum …` placeholder words (each rendered as a separate
  `text-transparent bg-black` censor bar)

No real/sensitive work descriptions appear anywhere in the DOM, JS bundle, or static
export. The deleted old PDF (`Khai Phan Resume 2-6-2026.pdf`) is gone from the working
tree and has no lingering references in `src/`. Both download sites (HeroSection,
ContactSection) correctly point to `/Resume.pdf` with `download="Khai_Phan_Resume.pdf"`.

**Confirmed harmless (per your informational note):** the fake lorem words are present
in the DOM and once in the JS chunk. They carry zero real information, so their presence
is harmless. Not flagged as a defect.

The remaining findings are accessibility and robustness issues in the redaction
rendering — none compromise the secrecy goal.

## Warnings

### WR-01: Redaction depends on visual CSS only — fake lorem leaks to clipboard / text extraction / no-CSS

**File:** `src/components/sections/ExperienceSection.tsx:170-178`
**Issue:** Each lorem word is rendered as real text node colored `text-transparent` on a
`bg-black` chip. The secrecy of the *real* content is fine (the text node is lorem, not
real copy), but the redaction effect itself is purely visual. If CSS fails to load, or a
user selects/copies the bars, or a reader-mode/text extractor strips styling, the
underlying lorem ("Lorem ipsum dolor sit amet…") becomes visible. This is acceptable for
*this* content because it is fake — but it means the censor-bar pattern provides **no
defense in depth**: if a future maintainer ever puts real text in `bullets` (despite the
comment), the redaction would silently expose it. The `redacted` flag's safety rests
entirely on the discipline of keeping `bullets` fake, not on any rendering guarantee.
**Fix:** Decouple the bar width from real text content so the rendered string can never
be the sensitive value. E.g. render fixed-width placeholder bars driven by a length/count
field instead of mapping over real word strings:
```tsx
// content.ts: replace bullets with redaction shape, not text
redactionBars?: number[][]; // e.g. [[4,7,5,3], ...] word-widths per line

// ExperienceSection.tsx
{exp.redactionBars?.map((line, li) => (
  <li key={li} ...>
    <span className="sr-only">Redacted — proprietary details withheld</span>
    {line.map((w, wi) => (
      <span key={wi} aria-hidden className="... bg-black"
            style={{ width: `${w}ch` }} />  // empty bar, no text node
    ))}
  </li>
))}
```
At minimum, add `user-select: none` is already present, but the text node itself should
not be the sensitive string for the pattern to be trustworthy.

### WR-02: Screen-reader experience repeats the same redaction notice 4× and exposes no structure

**File:** `src/components/sections/ExperienceSection.tsx:147-163`
**Issue:** The `<ul aria-label="Redacted experience details">` contains 4 `<li>`, each
emitting an identical `sr-only` "Redacted -- proprietary details withheld". A screen
reader announces the list label, then reads "Redacted — proprietary details withheld"
four times in a row with no differentiation — verbose and confusing. The censor-bar
`<span>`s are correctly `aria-hidden`, and the watermark emoji is correctly
`aria-hidden`, so nothing *leaks*; the issue is pure AT UX/noise.
**Fix:** Announce the redaction once for the group instead of per bullet. Either drop the
per-`<li>` `sr-only` and let the `aria-label` carry the meaning, or collapse to a single
announced sentence and hide the bar list from AT entirely:
```tsx
<ul aria-hidden="true" className="mt-4 flex flex-col gap-2">{/* bars only */}</ul>
<p className="sr-only">
  Experience details for this role are redacted — proprietary information withheld.
  See the resume PDF.
</p>
```

### WR-03: Non-redacted bullet list uses bullet text as React key — collision/reorder risk

**File:** `src/components/sections/ExperienceSection.tsx:195-197`
**Issue:** The non-redacted branch keys list items on the bullet string (`key={bullet}`).
If two bullets are ever identical (easy to do accidentally across roles, or with short
education entries), React throws a duplicate-key warning and may mis-reconcile DOM nodes.
The redacted branch already uses the index (`key={bi}`), so the two branches are
inconsistent. Content keys are also fragile if copy is edited.
**Fix:** Use a stable index-based key for both branches (the list is static and never
reordered, so index is safe and consistent):
```tsx
{exp.bullets.map((bullet, bi) => (
  <li key={bi} ...>
```

## Info

### IN-01: Emoji badge is clipped by parent `overflow-hidden` (pre-existing, affects redacted card too)

**File:** `src/components/sections/ExperienceSection.tsx:101-106` (with `GlassPanel.tsx:75`)
**Issue:** The emoji badge is `absolute -top-3 -left-3` (~12px outside the card), but
every `GlassPanel` is `relative overflow-hidden` (GlassPanel.tsx:75). The portion of the
badge that overflows the card edge is clipped. This is pre-existing (all four cards share
it) and not introduced by this change, but the redaction work added a `group/redaction`
wrapper and watermark to the same panel, so it is worth noting the badge does not visually
"pop out" as the `-top-3 -left-3` offset suggests it intends to.
**Fix:** If the pop-out look is desired, the badge must live outside the `overflow-hidden`
panel (e.g. as a sibling positioned relative to an outer non-clipping wrapper). Otherwise
adjust the offset so the badge stays within bounds.

### IN-02: Redaction relies on an opt-in `redacted` flag with no guard against real copy

**File:** `src/data/content.ts:101-106`
**Issue:** Safety is enforced only by a code comment ("Do not replace with real bullet
copy"). There is no test or type-level constraint preventing a future edit from putting
real PromptArmor descriptions into `bullets` while `redacted: true`, which (per WR-01)
would render them as transparent-but-extractable text.
**Fix:** Add a lightweight test asserting that no `experiences[].bullets` entry for a
`redacted` role contains known-sensitive tokens, or adopt the WR-01 shape change so real
text cannot occupy `bullets`.

### IN-03: `cursor-help` on redaction `<li>` implies a tooltip that does not exist

**File:** `src/components/sections/ExperienceSection.tsx:154`
**Issue:** Each redacted `<li>` has `cursor-help` (the question-mark cursor), signaling
that hovering reveals an explanation. There is no `title` attribute or tooltip — only the
watermark emoji animates in. Users get a help cursor with no help payload.
**Fix:** Either add a `title`/tooltip with the disclaimer text, or drop `cursor-help` in
favor of `cursor-default`.

### IN-04: Download links repeat `href`/`download`/`color`/`rotate` across two sites without a shared constant

**File:** `src/components/sections/HeroSection.tsx:209-217` and
`src/components/sections/ContactSection.tsx:131-138`
**Issue:** The resume button config (`/Resume.pdf`, `Khai_Phan_Resume.pdf`, color
`#a78bcd`, rotate `-1deg`) is duplicated. If the path changes again (as it just did), both
sites must be updated in lockstep; missing one would serve a dead link or an outdated file.
**Fix:** Hoist the resume path/filename to a shared constant (e.g. in `content.ts`) and
reference it from both buttons so a future repoint is single-source.

---

_Reviewed: 2026-06-14_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: deep_
