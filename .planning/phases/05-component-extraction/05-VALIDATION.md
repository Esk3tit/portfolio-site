---
phase: 5
slug: component-extraction
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-07
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None installed -- build checks + shell smoke tests |
| **Config file** | none -- Wave 0 not needed (no test framework) |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npm run lint` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npm run lint`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | CLEAN-02a | smoke | `test ! -f src/components/explorations/Exploration6.tsx` | N/A | ⬜ pending |
| 05-01-02 | 01 | 1 | CLEAN-02b | smoke | `ls src/components/sections/{Hero,About,Experience,Skills,Projects,Contact}Section.tsx` | N/A | ⬜ pending |
| 05-01-03 | 01 | 1 | CLEAN-02c | smoke | `grep -c "Section" src/app/page.tsx` | N/A | ⬜ pending |
| 05-01-04 | 01 | 1 | CLEAN-02d | build | `npm run build` | N/A | ⬜ pending |
| 05-01-05 | 01 | 1 | CLEAN-02e | smoke | `grep -r "e6-" src/ --include="*.tsx" --include="*.css"` (expect 0) | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.* Build checks and shell smoke tests require no additional framework installation.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Animations work identically | CLEAN-02f | No browser testing framework installed | Scroll through all 6 sections in dev server, verify scroll-triggered animations, text reveals, and hover interactions match pre-extraction behavior |
| Hot-reload isolation | CLEAN-02g | Requires live dev server interaction | Edit one section component, verify other sections' animations don't break |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
