---
phase: 4
slug: code-cleanup
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-07
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Shell scripts + Next.js build |
| **Config file** | next.config.ts (existing) |
| **Quick run command** | `npx next build 2>&1 | tail -20` |
| **Full suite command** | `npx next build && echo "BUILD OK"` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx next build 2>&1 | tail -20`
- **After every plan wave:** Run `npx next build && echo "BUILD OK"`
- **Before `/gsd:verify-work`:** Full build must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | CLEAN-01 | integration | `! test -d src/app/explore && echo PASS` | N/A | ⬜ pending |
| 04-01-02 | 01 | 1 | CLEAN-01 | integration | `! test -f src/components/explorations/Exploration1.tsx && echo PASS` | N/A | ⬜ pending |
| 04-01-03 | 01 | 1 | CLEAN-03 | integration | `! test -f public/vercel.svg && echo PASS` | N/A | ⬜ pending |
| 04-01-04 | 01 | 1 | CLEAN-04 | integration | `test -f src/app/favicon.ico && test -f src/app/apple-icon.png && echo PASS` | N/A | ⬜ pending |
| 04-02-01 | 02 | 2 | CLEAN-05 | build | `npx next build 2>&1 \| grep -i "unused" \| wc -l` | N/A | ⬜ pending |
| 04-02-02 | 02 | 2 | CLEAN-05 | manual | Visual check of site at localhost:3000 | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. This phase is deletion-focused — no test framework installation needed. Verification is via file existence checks and `next build`.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Favicon shows correct icon | CLEAN-04 | Browser rendering check | Open site in browser, verify tab icon matches RealFaviconGenerator output |
| Site visually unchanged | CLEAN-05 | Visual regression | Browse all sections, verify animations/cursor/dark mode work |
| /explore returns 404 | CLEAN-01 | Route behavior | Navigate to /explore in browser, confirm 404 page |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
