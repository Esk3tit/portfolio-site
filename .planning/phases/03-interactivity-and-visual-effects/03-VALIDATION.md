---
phase: 3
slug: interactivity-and-visual-effects
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-06
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual browser testing (no automated test framework) |
| **Config file** | none |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npm run dev` (+ manual browser inspection) |
| **Estimated runtime** | ~15 seconds (build) |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build` + full browser test (desktop Chrome + mobile emulation)
- **Before `/gsd:verify-work`:** All 7 requirements verified visually in browser
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-XX | 01 | 1 | ANIM-01 | manual | `npm run build` + visual scroll inspection | N/A | pending |
| 03-01-XX | 01 | 1 | ANIM-04 | manual | `npm run build` + observe heading animations | N/A | pending |
| 03-01-XX | 01 | 1 | ANIM-02 | manual | `npm run build` + desktop cursor + mobile emulation | N/A | pending |
| 03-01-XX | 01 | 1 | ANIM-03 | manual | `npm run build` + hover each element type | N/A | pending |
| 03-02-XX | 02 | 2 | DSGN-03 | manual | `npm run build` + toggle dark mode, reload, check localStorage | N/A | pending |
| 03-02-XX | 02 | 2 | DSGN-04 | manual | `npm run build` + visual grain inspection | N/A | pending |
| 03-02-XX | 02 | 2 | DSGN-05 | manual | `npm run build` + watch gradient ~30s | N/A | pending |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.* No automated test framework exists in this project. All validation is build-check + manual browser inspection, appropriate for a visual/animation-heavy portfolio site.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Scroll-triggered section reveals | ANIM-01 | Visual animation timing/easing | Scroll through page, verify each section fades/slides in |
| Custom cursor with magnetic pull | ANIM-02 | Pointer interaction is visual | Move mouse near buttons/links, verify magnetic pull effect; test touch device shows no cursor |
| Hover micro-interactions | ANIM-03 | Visual hover effects | Hover buttons (lift), cards (tilt), tags (wiggle), links (underline) |
| Split text heading reveals | ANIM-04 | Animation sequencing is visual | Scroll to each heading, verify char/word split animation |
| Dark mode toggle + persistence | DSGN-03 | System pref detection + localStorage | Toggle dark mode, reload page, verify preference persists; change OS theme, verify detection |
| Noise/grain texture | DSGN-04 | Subtle visual effect | Inspect background at 100% zoom, verify grain at 5-8% opacity |
| Gradient color animation | DSGN-05 | Requires watching over time | Observe background for 30s, verify color shift cycle |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: `npm run build` after every commit
- [x] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
