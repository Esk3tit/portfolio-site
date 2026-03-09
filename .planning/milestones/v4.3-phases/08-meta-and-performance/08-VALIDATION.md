---
phase: 8
slug: meta-and-performance
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-08
---

# Phase 8 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — build verification + manual Lighthouse |
| **Config file** | none — build-based validation |
| **Quick run command** | `npx next build` |
| **Full suite command** | `npx next build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx next build`
- **After every plan wave:** Run `npx next build` + verify meta tags in static output HTML
- **Before `/gsd:verify-work`:** Full build must be green + Lighthouse audit on deployed URL
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 08-01-01 | 01 | 1 | META-01 | smoke | `grep -c "og:title" out/index.html` | ❌ W0 | ⬜ pending |
| 08-01-02 | 01 | 1 | META-02 | smoke | `grep -c "twitter:card" out/index.html` | ❌ W0 | ⬜ pending |
| 08-01-03 | 01 | 1 | META-03 | smoke | `test -f public/og-image.png && echo "exists"` | ❌ W0 | ⬜ pending |
| 08-02-01 | 02 | 1 | PERF-01 | manual-only | Lighthouse on deployed URL | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] No test framework needed — build verification and manual Lighthouse audits are sufficient for this phase's 4 requirements
- [ ] Post-build HTML inspection via grep commands covers META-01, META-02, META-03

*Given this is the final phase focused on meta tags and perf, build verification + manual Lighthouse is the appropriate validation strategy rather than installing a test framework.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Lighthouse mobile >= 90 | PERF-01 | Requires browser-based audit on deployed URL | Run Lighthouse on deployed Vercel URL, take median of 3 runs |
| Rich social preview renders | META-01, META-02 | Requires external validators | Test with opengraph.xyz and Twitter Card Validator |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
