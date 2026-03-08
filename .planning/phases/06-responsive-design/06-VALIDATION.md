---
phase: 6
slug: responsive-design
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-08
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual + Playwright MCP (ad-hoc screenshots) |
| **Config file** | none — no formal test framework for visual layout |
| **Quick run command** | DevTools responsive mode at 375px |
| **Full suite command** | Visual walkthrough at 375px, 414px, 768px, 1024px, 1440px |
| **Estimated runtime** | ~60 seconds per viewport |

---

## Sampling Rate

- **After every task commit:** Visual check in browser DevTools at 375px (iPhone SE) and 768px (tablet)
- **After every plan wave:** Full walkthrough at 375px, 414px, 768px, 1024px, 1440px
- **Before `/gsd:verify-work`:** All 4 success criteria verified visually
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 06-01-XX | 01 | 1 | RESP-02, RESP-03 | manual-only | DevTools 375px: hamburger visible, drawer opens, toggle works | N/A | pending |
| 06-02-XX | 02 | 1 | RESP-01 | manual-only | DevTools 375px: no horizontal scroll, grids collapse | N/A | pending |
| 06-03-XX | 02 | 1 | RESP-04 | manual-only | DevTools element inspector: all interactive >= 44px | N/A | pending |

*Status: pending · green · red · flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.* Responsive design testing is inherently visual/manual. Playwright MCP can supplement with viewport screenshots if needed.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| All content readable at 375px, no horizontal scroll | RESP-01 | Visual layout verification | Open DevTools, set viewport 375px, scroll through all sections, confirm no horizontal overflow |
| Mobile nav hamburger visible <768px | RESP-02 | Visual presence check | Set viewport <768px, confirm hamburger button visible top-right |
| Drawer opens with links and dark mode toggle | RESP-02, RESP-03 | Interactive + visual | Tap hamburger, verify drawer with section links and toggle |
| Dark mode toggle functional in drawer | RESP-03 | Interactive behavior | Open drawer, tap toggle, verify theme switches |
| All interactive elements >= 44px touch target | RESP-04 | Element measurement | Use DevTools to inspect computed height/width of buttons, links, cards |
| Grids collapse to single column on mobile | RESP-01 | Layout verification | At 375px, verify skills/projects/contact grids are single column |

---

## Validation Sign-Off

- [x] All tasks have manual verify instructions
- [x] Sampling continuity: visual check after every task commit
- [x] Wave 0 covers all MISSING references (none needed)
- [x] No watch-mode flags
- [x] Feedback latency < 60s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
