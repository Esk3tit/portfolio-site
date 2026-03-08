---
phase: 7
slug: accessibility
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-03-08
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual UAT (no test framework — accessibility is verified visually/interactively) |
| **Config file** | none |
| **Quick run command** | `npm run build` |
| **Full suite command** | Manual UAT checklist + Lighthouse accessibility audit |
| **Estimated runtime** | ~10 seconds (build) + ~5 minutes (manual UAT) |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Manual UAT checklist (Tab navigation, screen reader, reduced-motion toggle)
- **Before `/gsd:verify-work`:** Full Lighthouse accessibility audit must score ≥90
- **Max feedback latency:** 10 seconds (build)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 07-01-01 | 01 | 1 | A11Y-01 | manual | Inspect DOM for `<main>`, `<section aria-label>`, heading hierarchy | N/A | ⬜ pending |
| 07-01-02 | 01 | 1 | A11Y-06 | manual | Press Tab on page load, verify skip-to-content link | N/A | ⬜ pending |
| 07-01-03 | 01 | 1 | A11Y-02 | manual | Tab through all interactive elements, verify logical order | N/A | ⬜ pending |
| 07-01-04 | 01 | 1 | A11Y-03 | manual | Tab through page, verify visible focus rings | N/A | ⬜ pending |
| 07-01-05 | 01 | 1 | A11Y-07 | manual | DOM inspection for aria-expanded, aria-label on interactive elements | N/A | ⬜ pending |
| 07-02-01 | 02 | 1 | A11Y-04 | manual | Enable reduced-motion in OS, reload, verify no motion animations | N/A | ⬜ pending |
| 07-02-02 | 02 | 1 | A11Y-05 | manual | Lighthouse audit or axe devtools contrast check | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No test framework installation needed. `npm run build` catches structural/type errors.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Keyboard tab order visits all interactive elements | A11Y-02 | Requires real browser keyboard interaction | Tab through entire page, verify every link/button/nav-dot receives focus in logical order |
| Skip-to-content link appears on first Tab | A11Y-06 | Visual verification needed | Load page, press Tab, verify skip link appears and jumps to main content |
| Focus rings visible on all focusable elements | A11Y-03 | Visual verification of ring styling | Tab through page in both light/dark themes, verify ring visibility |
| Reduced motion disables all animations | A11Y-04 | Requires OS-level preference toggle | Enable prefers-reduced-motion in OS settings, reload, verify no motion animations fire |
| Contrast ratios meet WCAG AA | A11Y-05 | Requires computed style inspection | Run Lighthouse accessibility audit, check all text meets 4.5:1 (body) / 3:1 (large text) |
| Screen reader announces card states | A11Y-07 | Requires screen reader testing | Use VoiceOver, navigate to project cards, verify aria-expanded announced |
| Semantic landmarks present | A11Y-01 | DOM inspection | Verify `<main>`, `<section aria-label>` on each section, heading hierarchy h1>h2>h3 |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 10s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
