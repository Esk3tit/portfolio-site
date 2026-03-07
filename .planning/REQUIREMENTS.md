# Requirements: Khai Phan Portfolio Site

**Defined:** 2026-03-07
**Core Value:** Visitors immediately get a sense of Khai's personality and technical ability through a portfolio that is as engaging to interact with as the work it showcases.

## v4.3 Requirements

Requirements for the Cleanup and Launch milestone. Each maps to roadmap phases.

### Cleanup

- [x] **CLEAN-01**: Remove explore pages (/explore/[id], explore index) and exploration components 1-5
- [ ] **CLEAN-02**: Extract Exploration6.tsx into separate section components (Hero, About, Experience, Skills, Projects, Contact)
- [x] **CLEAN-03**: Remove Vercel default assets (boilerplate images, SVGs, starter files from public/)
- [x] **CLEAN-04**: Replace favicon with old portfolio favicon
- [x] **CLEAN-05**: Remove dead code (orphaned CSS classes like e6-link-underline, unused imports)

### Responsive

- [ ] **RESP-01**: Site renders correctly on mobile (<640px), tablet (640-1024px), and desktop (>1024px) breakpoints
- [ ] **RESP-02**: Mobile navigation bar visible on small screens (FloatingNav is hidden on mobile)
- [ ] **RESP-03**: Dark mode toggle accessible on mobile (currently hidden with FloatingNav)
- [ ] **RESP-04**: Touch targets meet 44px minimum on mobile

### Accessibility

- [ ] **A11Y-01**: Semantic HTML structure with proper heading hierarchy (h1 > h2 > h3)
- [ ] **A11Y-02**: Keyboard navigation works for all interactive elements (buttons, links, project cards)
- [ ] **A11Y-03**: Focus indicators visible on all focusable elements
- [ ] **A11Y-04**: prefers-reduced-motion replaces animations with instant reveals (opacity 0->1, no motion)
- [ ] **A11Y-05**: Color contrast meets WCAG AA (4.5:1 for text, 3:1 for large text) in both themes
- [ ] **A11Y-06**: Skip-to-content link for keyboard users
- [ ] **A11Y-07**: ARIA labels on interactive elements (project expand buttons, nav dots, theme toggle)

### Meta & Performance

- [ ] **META-01**: Open Graph meta tags (title, description, image, url) for proper link previews
- [ ] **META-02**: Twitter card meta tags
- [ ] **META-03**: OG image (1200x630) created and committed
- [ ] **PERF-01**: Lighthouse mobile score >= 90

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Polish

- **POLSH-01**: Loading/intro animation -- 2-3 second curtain raise on first visit, skip on return
- **POLSH-02**: Interactive project cards with 3D tilt effect and video preview on hover
- **POLSH-03**: Non-linear/experimental layout -- break conventional section flow entirely
- **POLSH-04**: Analytics integration (Plausible or Umami) for visitor tracking

## Out of Scope

| Feature | Reason |
|---------|--------|
| Contact form with backend | Simplified to links only -- no backend/serverless needed |
| Blog/CMS integration | Content lives in code. Blog can be separate platform later |
| 3D WebGL scenes (Three.js) | Massive bundle, kills mobile performance |
| Particle systems / heavy canvas | Battery killer on mobile, frame drops on mid-range devices |
| Sound/audio effects | Universally disliked |
| Chatbot / AI assistant | Gimmicky on a portfolio |
| Page-per-section routing | Single page with smooth scroll is simpler |
| Mobile-specific animations | Same animations adapted via matchMedia, not separate mobile versions |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CLEAN-01 | Phase 4 | Complete |
| CLEAN-02 | Phase 5 | Pending |
| CLEAN-03 | Phase 4 | Complete |
| CLEAN-04 | Phase 4 | Complete |
| CLEAN-05 | Phase 4 | Complete |
| RESP-01 | Phase 6 | Pending |
| RESP-02 | Phase 6 | Pending |
| RESP-03 | Phase 6 | Pending |
| RESP-04 | Phase 6 | Pending |
| A11Y-01 | Phase 7 | Pending |
| A11Y-02 | Phase 7 | Pending |
| A11Y-03 | Phase 7 | Pending |
| A11Y-04 | Phase 7 | Pending |
| A11Y-05 | Phase 7 | Pending |
| A11Y-06 | Phase 7 | Pending |
| A11Y-07 | Phase 7 | Pending |
| META-01 | Phase 8 | Pending |
| META-02 | Phase 8 | Pending |
| META-03 | Phase 8 | Pending |
| PERF-01 | Phase 8 | Pending |

**Coverage:**
- v4.3 requirements: 20 total
- Mapped to phases: 20
- Unmapped: 0

---
*Requirements defined: 2026-03-07*
*Last updated: 2026-03-07 after roadmap creation*
