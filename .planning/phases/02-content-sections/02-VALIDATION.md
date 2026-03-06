---
phase: 2
slug: content-sections
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-06
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None (build-time type checking only) |
| **Config file** | tsconfig.json, next.config.ts |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build` + manual browser check
- **Before `/gsd:verify-work`:** Full build must be green + visual review of all 6 sections
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | CONT-01 | smoke | `npm run build` | N/A | pending |
| 02-01-02 | 01 | 1 | CONT-02 | smoke | `npm run build` | N/A | pending |
| 02-01-03 | 01 | 1 | CONT-03 | smoke | `npm run build` | N/A | pending |
| 02-01-04 | 01 | 1 | CONT-04 | smoke | `npm run build` | N/A | pending |
| 02-01-05 | 01 | 1 | CONT-05 | smoke | `npm run build` | N/A | pending |
| 02-01-06 | 01 | 1 | CONT-06 | smoke | `npm run build` | N/A | pending |
| 02-01-07 | 01 | 1 | CONT-07 | manual | `ls public/resume.pdf` | No | pending |
| 02-02-01 | 02 | 2 | DSGN-02 | manual-only | Visual inspection | N/A | pending |
| 02-02-02 | 02 | 2 | DSGN-06 | manual-only | Copy review | N/A | pending |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

- [ ] Resume PDF committed to `public/resume.pdf` (or placeholder)
- [ ] Content data file `src/data/content.ts` with real portfolio content

*Existing infrastructure (npm run build) covers automated verification needs.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Creative layout with personality | DSGN-02 | Visual/aesthetic judgment | Open browser, verify asymmetric grids, overlapping elements, unconventional flow |
| Playful, human copy tone | DSGN-06 | Subjective copy quality | Read all section copy, verify not generic corporate language |
| Resume PDF downloads correctly | CONT-07 | File download behavior | Click resume download link, verify PDF opens/saves |
| Animated hero intro | CONT-01 | Animation timing/feel | Load page, verify GSAP animations play smoothly |

---

## Validation Sign-Off

- [ ] All tasks have automated verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
