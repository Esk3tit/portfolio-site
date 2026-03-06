# Khai Phan Portfolio Site

## What This Is

A personal portfolio website for Khai Phan, a software engineer from Vietnam. The site showcases work experience, projects, and skills with a playful, creative design that features unexpected layouts, cursor effects, micro-interactions, and personality-driven polish — a deliberate departure from the standard top-to-bottom portfolio format. Replaces the existing site at khaiphan.dev.

## Core Value

Visitors immediately get a sense of Khai's personality and technical ability through a portfolio that is as engaging to interact with as the work it showcases.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Hero/intro section with personality and animation
- [ ] About/overview section with background and what Khai does
- [ ] Work experience section showcasing past roles
- [ ] Skills section displaying technical stack
- [ ] Projects showcase with descriptions and links
- [ ] Contact section with email, LinkedIn, and GitHub links (no form)
- [ ] Resume PDF download via git-committed PDF (easy to swap by replacing file in repo)
- [ ] Playful, creative design with micro-interactions, cursor effects, and unexpected layouts
- [ ] Scroll animations and smooth transitions throughout
- [ ] Responsive design (mobile + desktop)
- [ ] Balanced content weight across all sections (no single section dominates)

### Out of Scope

- Contact form with backend — simplified to links only
- CMS or headless CMS for content — content lives in code/repo
- Mobile native app — web only
- Blog section — not requested
- Analytics dashboard — not in v1

## Context

- Existing portfolio at khaiphan.dev has content to migrate: bio, work experience, skills list (Python, C++, JavaScript, TypeScript, Go, React, AWS, Docker, etc.), and 4 projects (L33tC0de Tracker, AIPhone But Better, PyType, RealAssist.AI)
- Current site uses a standard top-to-bottom scroll layout that Khai finds boring
- Design will be created using the frontend-design skill with Opus 4.6 for high visual quality
- Resume is currently served as `Khai_Phan_Resume.pdf` — new site will commit PDF to repo for easy swapping
- GitHub: https://github.com/Esk3tit
- LinkedIn: https://www.linkedin.com/in/khai-phan/
- Domain: khaiphan.dev
- Deployment: flexible — pick what fits the tech stack best

## Constraints

- **Design quality**: Must use frontend-design skill to avoid generic AI aesthetics
- **Resume workflow**: PDF must be swappable by simply committing a new file to the repo
- **Performance**: Animations and effects must not degrade performance on mid-range devices
- **Accessibility**: Creative layout must remain navigable and readable

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| No contact form | Simplifies architecture, no backend needed | — Pending |
| Git-committed resume PDF | Simplest workflow — commit and deploy | — Pending |
| Playful + creative direction | User wants to break from standard portfolio format | — Pending |
| Frontend-design skill for UI | Ensures high design quality, avoids generic look | — Pending |
| HYBRID design direction: Glassmorphism base + Light+Airy palette + Colorful+Playful energy/emojis + Neobrutalism accents | User reviewed all 5 explorations and chose to combine the best elements from 4 of 5 directions. Video Game (#5) dropped as too cheesy. | Selected 2026-03-06 |

---
*Last updated: 2026-03-06 after initialization*
