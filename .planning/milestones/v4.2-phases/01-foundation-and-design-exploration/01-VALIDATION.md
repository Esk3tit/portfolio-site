---
phase: 1
slug: foundation-and-design-exploration
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-06
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual browser verification + dev server health checks |
| **Config file** | none — Phase 1 is foundation + design exploration |
| **Quick run command** | `npm run dev` (verify dev server starts) |
| **Full suite command** | `npm run build` (verify static export succeeds) |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run dev` — verify no build errors
- **After every plan wave:** Run `npm run build` — verify static export
- **Before `/gsd:verify-work`:** Full build must succeed + all 5 design routes render
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | INFR-06 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 2 | DSGN-01 | manual | Browser: `/explore/1` through `/explore/5` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `package.json` — Next.js 16, Tailwind v4.2, GSAP 3.14, Lenis dependencies
- [ ] `next.config.ts` — static export configuration
- [ ] `npm run dev` starts without errors
- [ ] `npm run build` completes without errors

*Foundation phase — Wave 0 IS the core deliverable.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 5 design explorations render with distinct visual identities | DSGN-01 | Visual/subjective — requires human judgment | Navigate to `/explore/1` through `/explore/5`, verify each has distinct color, typography, layout |
| GSAP animations run smoothly | INFR-06 | Animation smoothness requires visual check | Verify any demo animations play without jank |
| Lenis smooth scroll works | INFR-06 | Scroll feel requires manual check | Scroll through page, verify smooth interpolation |
| User selects final design direction | DSGN-01 | Human decision | User reviews all 5 and picks a winner |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
