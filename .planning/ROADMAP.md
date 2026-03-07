# Roadmap: Khai Phan Portfolio Site

## Milestones

- ✅ **v4.2 Foundation through Interactivity** -- Phases 1-3 (shipped 2026-03-07)
- 🚧 **v4.3 Cleanup and Launch** -- Phases 4-8 (in progress)

## Phases

<details>
<summary>✅ v4.2 Foundation through Interactivity (Phases 1-3) -- SHIPPED 2026-03-07</summary>

- [x] Phase 1: Foundation and Design Exploration (4/4 plans) -- completed 2026-03-06
- [x] Phase 2: Content Sections (3/3 plans) -- completed 2026-03-06
- [x] Phase 3: Interactivity and Visual Effects (3/3 plans) -- completed 2026-03-07

</details>

### 🚧 v4.3 Cleanup and Launch (In Progress)

**Milestone Goal:** Clean up the codebase, extract components from the Exploration6 monolith, make the site responsive and accessible, and deploy production-ready at khaiphan.dev.

**Phase Numbering:**
- Integer phases (4, 5, 6, 7, 8): Planned milestone work
- Decimal phases (e.g., 5.1): Urgent insertions (marked with INSERTED)

- [ ] **Phase 4: Code Cleanup** - Remove dead routes, unused assets, and orphaned code
- [ ] **Phase 5: Component Extraction** - Break Exploration6 monolith into independent section components
- [ ] **Phase 6: Responsive Design** - Mobile and tablet layout with touch-friendly navigation
- [ ] **Phase 7: Accessibility** - Semantic HTML, keyboard nav, reduced-motion, and WCAG AA compliance
- [ ] **Phase 8: Meta and Performance** - OG tags, OG image, and Lighthouse mobile 90+

## Phase Details

### Phase 4: Code Cleanup
**Goal**: Codebase contains only production code -- no dead routes, no prototype artifacts, no default starter assets
**Depends on**: Nothing (first phase of v4.3)
**Requirements**: CLEAN-01, CLEAN-03, CLEAN-04, CLEAN-05
**Success Criteria** (what must be TRUE):
  1. Visiting /explore or /explore/[id] returns a 404 -- no explore routes exist
  2. Favicon in the browser tab shows the old portfolio icon, not the Vercel triangle
  3. No Vercel default SVGs or starter images remain in public/
  4. Build completes with zero unused import warnings from removed files
**Plans**: TBD

Plans:
- [ ] 04-01: TBD

### Phase 5: Component Extraction
**Goal**: Each portfolio section is an independent component owning its own data, animations, and ref scope -- site functions identically to before
**Depends on**: Phase 4
**Requirements**: CLEAN-02
**Success Criteria** (what must be TRUE):
  1. Exploration6.tsx no longer exists -- page.tsx renders 6 separate section components (Hero, About, Experience, Skills, Projects, Contact)
  2. Each section component owns its own useGSAP hook with scoped containerRef -- no animation logic in page.tsx
  3. All scroll-triggered animations, text reveals, and hover interactions work identically to the pre-extraction site
  4. Hot-reloading a single section does not break animations in other sections
**Plans**: TBD

Plans:
- [ ] 05-01: TBD

### Phase 6: Responsive Design
**Goal**: Site is usable and visually polished on phones, tablets, and desktops with touch-friendly interaction
**Depends on**: Phase 5
**Requirements**: RESP-01, RESP-02, RESP-03, RESP-04
**Success Criteria** (what must be TRUE):
  1. On a 375px-wide screen, all content is readable without horizontal scrolling -- grids collapse to single column, hero text scales down
  2. A visible navigation bar appears on mobile screens (below 768px) since FloatingNav is desktop-only
  3. Dark mode toggle is reachable and functional on mobile without scrolling to a hidden element
  4. All buttons, links, and interactive cards have at least 44x44px touch targets on mobile
**Plans**: TBD

Plans:
- [ ] 06-01: TBD

### Phase 7: Accessibility
**Goal**: The site is navigable by keyboard, comprehensible by screen readers, and comfortable for users who prefer reduced motion
**Depends on**: Phase 6
**Requirements**: A11Y-01, A11Y-02, A11Y-03, A11Y-04, A11Y-05, A11Y-06, A11Y-07
**Success Criteria** (what must be TRUE):
  1. Tabbing through the page visits every interactive element in logical order with a visible focus ring -- no element is skipped or trapped
  2. A skip-to-content link appears on first Tab press and jumps past navigation to main content
  3. With prefers-reduced-motion enabled, no elements animate with motion -- all reveals are instant opacity fades, and Lenis smooth scroll is disabled
  4. All body text meets 4.5:1 contrast ratio and large text meets 3:1 in both light and dark themes
  5. Screen reader announces project card expand/collapse state via aria-expanded and nav dots via aria-label
**Plans**: TBD

Plans:
- [ ] 07-01: TBD

### Phase 8: Meta and Performance
**Goal**: The site shares well on social platforms and scores 90+ on Lighthouse mobile -- ready for production deploy
**Depends on**: Phase 7
**Requirements**: META-01, META-02, META-03, PERF-01
**Success Criteria** (what must be TRUE):
  1. Sharing the site URL on Slack, Twitter, or iMessage shows a rich preview with title, description, and the OG image
  2. Twitter card renders correctly with summary_large_image card type
  3. Lighthouse mobile audit scores 90+ across Performance, Accessibility, Best Practices, and SEO
**Plans**: TBD

Plans:
- [ ] 08-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 4 → 5 → 6 → 7 → 8

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation and Design Exploration | v4.2 | 4/4 | Complete | 2026-03-06 |
| 2. Content Sections | v4.2 | 3/3 | Complete | 2026-03-06 |
| 3. Interactivity and Visual Effects | v4.2 | 3/3 | Complete | 2026-03-07 |
| 4. Code Cleanup | v4.3 | 0/? | Not started | - |
| 5. Component Extraction | v4.3 | 0/? | Not started | - |
| 6. Responsive Design | v4.3 | 0/? | Not started | - |
| 7. Accessibility | v4.3 | 0/? | Not started | - |
| 8. Meta and Performance | v4.3 | 0/? | Not started | - |

---
*Roadmap created: 2026-03-07*
*Last updated: 2026-03-07*
