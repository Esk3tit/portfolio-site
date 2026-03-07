"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { gsap, ScrollTrigger, useGSAP, SplitText } from "@/lib/gsap";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { NeoBrutalButton } from "@/components/ui/NeoBrutalButton";
import { NeoBrutalHeading } from "@/components/ui/NeoBrutalHeading";
import { NeoBrutalTag } from "@/components/ui/NeoBrutalTag";
import {
  heroContent,
  aboutPanels,
  experiences,
  skillCategories,
  projects,
  contactLinks,
} from "@/data/content";
import { FloatingNav } from "@/components/sections/FloatingNav";

export default function Exploration6() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const gradientTweenRef = useRef<gsap.core.Tween | null>(null);

  const toggleProject = useCallback(
    (index: number) => {
      const detailEl = document.querySelector(`.e6-project-detail-${index}`);
      if (!detailEl) return;

      if (expandedProject === index) {
        // Collapse
        gsap.to(detailEl, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
          onComplete: () => setExpandedProject(null),
        });
      } else {
        // Collapse previous if any
        if (expandedProject !== null) {
          const prevEl = document.querySelector(
            `.e6-project-detail-${expandedProject}`
          );
          if (prevEl) {
            gsap.to(prevEl, {
              height: 0,
              opacity: 0,
              duration: 0.3,
              ease: "power2.inOut",
            });
          }
        }
        // Expand new
        setExpandedProject(index);
        gsap.fromTo(
          detailEl,
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.5, ease: "power2.out" }
        );
      }
    },
    [expandedProject]
  );

  // Gradient animation -- slowly shifts background colors
  const startGradientAnimation = useCallback(() => {
    // Kill existing tween
    if (gradientTweenRef.current) {
      gradientTweenRef.current.kill();
    }

    const isDark = document.documentElement.classList.contains("dark");
    const root = document.documentElement;

    // Set current values as starting point
    const startTarget = isDark ? "#1e1828" : "#eddcd2";
    const endTarget = isDark ? "#222438" : "#d5cbe8";

    gradientTweenRef.current = gsap.to(root, {
      "--bg-gradient-start": startTarget,
      "--bg-gradient-end": endTarget,
      duration: 25,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }, []);

  // Listen for theme changes to restart gradient with correct targets
  useEffect(() => {
    startGradientAnimation();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          // Theme changed -- restart gradient animation with new color targets
          // Small delay to let CSS custom properties update first
          requestAnimationFrame(() => startGradientAnimation());
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
      if (gradientTweenRef.current) {
        gradientTweenRef.current.kill();
      }
    };
  }, [startGradientAnimation]);

  useGSAP(
    () => {
      // Track SplitText instances for cleanup
      const splitInstances: InstanceType<typeof SplitText>[] = [];

      // Hero entrance -- use fromTo() so start states are set explicitly
      // and the timeline reliably plays on first visit after hydration.
      const heroTl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.15,
      });

      heroTl
        .fromTo(
          ".e6-hero-emoji",
          { scale: 0, rotation: -180 },
          { scale: 1, rotation: 0, duration: 0.7, ease: "back.out(1.7)" }
        )
        .fromTo(
          ".e6-hero-glass",
          { scale: 0.92, opacity: 0, y: 40 },
          { scale: 1, opacity: 1, y: 0, duration: 1.2 },
          "-=0.3"
        )
        .fromTo(
          ".e6-hero-greeting",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.7"
        );

      // Hero name -- character-by-character reveal for premium feel
      const heroNameEl = containerRef.current?.querySelector(".e6-hero-name");
      if (heroNameEl) {
        const heroSplit = new SplitText(".e6-hero-name", { type: "chars" });
        splitInstances.push(heroSplit);
        // Re-apply gradient to split chars (SplitText strips it from parent span)
        const gradientChars = heroNameEl.querySelectorAll(".e6-hero-name-gradient div");
        gradientChars.forEach((char: Element) => {
          const el = char as HTMLElement;
          el.style.background = "linear-gradient(135deg, var(--accent-pink) 0%, var(--accent-purple) 50%, var(--accent-blue) 100%)";
          el.style.webkitBackgroundClip = "text";
          el.style.webkitTextFillColor = "transparent";
          el.style.backgroundClip = "text";
        });
        // Set initial state so unsplit text is invisible (no hydration flash)
        gsap.set(heroSplit.chars, { y: 30, opacity: 0 });
        heroTl.to(
          heroSplit.chars,
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.03, ease: "power3.out" },
          "-=0.5"
        );
      }

      heroTl
        .fromTo(
          ".e6-hero-tagline",
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.3"
        )
        .fromTo(
          ".e6-hero-cta",
          { scale: 0, rotation: -6, opacity: 0 },
          {
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(2)",
            stagger: 0.1,
          },
          "-=0.3"
        );

      // Section heading text reveals -- word-by-word slide-up with stagger
      const headings = containerRef.current?.querySelectorAll(".e6-split-heading");
      headings?.forEach((heading) => {
        const split = new SplitText(heading, { type: "words" });
        splitInstances.push(split);
        gsap.fromTo(
          split.words,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: heading, start: "top 85%" },
          }
        );
      });

      // Scroll-triggered sections -- use fromTo() so GSAP never sets opacity:0
      // before the trigger fires. Consistent "power3.out" easing, "top 85%" triggers.

      // About section
      gsap.fromTo(".e6-about-heading",
        { y: 40, opacity: 0 },
        { scrollTrigger: { trigger: ".e6-about-section", start: "top 85%" }, y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );

      gsap.fromTo(".e6-about-panel",
        { scale: 0.95, opacity: 0, y: 50 },
        { scrollTrigger: { trigger: ".e6-about-section", start: "top 85%" }, scale: 1, opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" }
      );

      // Experience section
      gsap.fromTo(".e6-experience-card",
        { y: 50, opacity: 0, scale: 0.95 },
        { scrollTrigger: { trigger: ".e6-experience-section", start: "top 85%" }, y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.12, ease: "power3.out" }
      );

      // Skills section
      gsap.fromTo(".e6-skill-category",
        { y: 40, opacity: 0 },
        { scrollTrigger: { trigger: ".e6-skills-section", start: "top 85%" }, y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out" }
      );

      // Projects section
      gsap.fromTo(".e6-projects-heading",
        { x: -50, opacity: 0 },
        { scrollTrigger: { trigger: ".e6-projects-section", start: "top 85%" }, x: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
      );

      gsap.fromTo(".e6-project-card",
        { y: 60, opacity: 0, scale: 0.95 },
        { scrollTrigger: { trigger: ".e6-projects-section", start: "top 85%" }, y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.12, ease: "power3.out" }
      );

      // Contact section
      gsap.fromTo(".e6-contact-card",
        { y: 40, opacity: 0 },
        { scrollTrigger: { trigger: ".e6-contact-section", start: "top 85%" }, y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out" }
      );

      // Recalculate trigger positions after hydration paint
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          ScrollTrigger.refresh(true);
        });
      });

      // Cleanup: revert SplitText instances on unmount
      return () => {
        splitInstances.forEach((s) => s.revert());
      };
    },
    { scope: containerRef }
  );

  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--bg-gradient-start) 0%, color-mix(in srgb, var(--bg-gradient-start) 60%, var(--bg-gradient-end)) 30%, color-mix(in srgb, var(--bg-gradient-end) 70%, var(--bg-gradient-start)) 60%, var(--bg-gradient-end) 100%)",
        fontFamily: "var(--font-body, 'Inter', system-ui, sans-serif)",
        transition: "background 0.35s ease",
      }}
    >

      {/* Floating section navigation */}
      <FloatingNav />

      {/* SVG noise filter for frosted glass grain texture */}
      <svg className="absolute h-0 w-0">
        <filter id="glass-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>

      {/* Page-level noise texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          filter: "url(#glass-noise)",
          opacity: 0.06,
        }}
      />

      {/* ─── HERO SECTION ─── */}
      <section id="hero" className="relative z-[2] flex min-h-screen items-center justify-center px-6">
        <div className="relative z-10 w-full max-w-2xl text-center">
          {/* Emoji badge -- playful energy */}
          <GlassPanel
            className="e6-hero-emoji mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
            rotate="-4deg"
          >
            <span role="img" aria-label="sparkles">
              {"\u2728"}
            </span>
          </GlassPanel>

          {/* Glass hero card -- Liquid Glass style */}
          <GlassPanel
            className="e6-hero-glass px-10 py-14 md:px-16 md:py-18"
            shadow="5px 5px 0px #3d3248"
          >
            <p
              className="e6-hero-greeting text-sm font-semibold tracking-[0.3em] uppercase"
              style={{ color: "#b8a9c9" }}
            >
              {heroContent.greeting}
            </p>

            <h1
              className="e6-hero-name mt-5 text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl"
              style={{
                color: "var(--text-primary)",
                fontFamily:
                  "var(--font-display, 'Space Grotesk', system-ui, sans-serif)",
                transition: "color 0.35s ease",
              }}
            >
              I&apos;m{" "}
              <span className="e6-hero-name-gradient">
                {heroContent.name}
              </span>
              <span style={{ color: "var(--accent-pink)" }}>.</span>
            </h1>

            {/* Neobrutalist subtitle banner */}
            <div
              className="e6-hero-tagline mx-auto mt-8 inline-block px-6 py-3"
              style={{
                background: "var(--hero-tagline-bg)",
                border: "3px solid var(--glass-border)",
                boxShadow: "4px 4px 0px var(--glass-border)",
                transform: "rotate(-1deg)",
                transition: "background 0.35s ease, border-color 0.35s ease",
              }}
            >
              <p
                className="text-base font-semibold md:text-lg"
                style={{ color: "var(--text-primary)", transition: "color 0.35s ease" }}
              >
                {heroContent.tagline}
              </p>
            </div>

            {/* CTAs -- scroll down + resume download */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <NeoBrutalButton
                onClick={scrollToAbout}
                color="#c9a4b2"
                rotate="1deg"
                className="e6-hero-cta"
              >
                {heroContent.ctaText}
              </NeoBrutalButton>
              <NeoBrutalButton
                href="/resume.pdf"
                download="Khai_Phan_Resume.pdf"
                color="#a78bcd"
                rotate="-1deg"
                className="e6-hero-cta"
              >
                Resume {"\u{1F4C4}"}
              </NeoBrutalButton>
            </div>
          </GlassPanel>
        </div>
      </section>

      {/* ─── ABOUT SECTION ─── */}
      <section id="about" className="e6-about-section relative z-[2] px-6 py-28 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="e6-about-heading mb-14 text-center">
            <h2
              className="inline-block px-5 py-2.5 text-sm font-bold tracking-[0.25em] uppercase"
              style={{
                background: "var(--heading-bg)",
                color: "var(--text-primary)",
                border: "3px solid var(--glass-border)",
                boxShadow: "4px 4px 0px var(--glass-border)",
                transform: "rotate(1deg)",
                transition: "background 0.35s ease, color 0.35s ease, border-color 0.35s ease",
              }}
            >
              {"\u{1F9D1}\u200D\u{1F4BB}"} About Me
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {aboutPanels.map((panel) => (
              <GlassPanel
                key={panel.title}
                className="e6-about-panel px-8 py-10"
              >
                <h3
                  className="mb-4 text-xs font-bold tracking-[0.25em] uppercase"
                  style={{ color: panel.emoji === "\u{1F680}" ? "var(--accent-pink)" : "var(--accent-purple)" }}
                >
                  {panel.emoji} {panel.title}
                </h3>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: "var(--text-body)", transition: "color 0.35s ease" }}
                >
                  {panel.content}
                </p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EXPERIENCE SECTION ─── */}
      <section id="experience" className="e6-experience-section relative z-[2] px-6 py-28 md:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 text-center">
            <NeoBrutalHeading emoji={"\u{1F4BC}"} rotate="1deg">
              Experience
            </NeoBrutalHeading>
          </div>

          <div className="flex flex-col gap-8">
            {experiences.map((exp, i) => (
              <GlassPanel
                key={exp.company}
                className={`e6-experience-card px-8 py-8`}
                rotate={i % 2 === 0 ? "0.5deg" : "-0.5deg"}
                tilt
              >
                {/* Emoji badge */}
                <GlassPanel
                  className="absolute -top-3 -left-3 flex h-12 w-12 items-center justify-center rounded-xl text-xl"
                  rotate={`${i % 2 === 0 ? -3 : 3}deg`}
                >
                  {exp.emoji}
                </GlassPanel>

                <div className="ml-6">
                  <h3
                    className="text-xl font-bold"
                    style={{
                      color: "var(--text-primary)",
                      fontFamily:
                        "var(--font-display, 'Space Grotesk', system-ui, sans-serif)",
                      transition: "color 0.35s ease",
                    }}
                  >
                    {exp.company}
                  </h3>
                  <p
                    className="mt-1 text-sm font-semibold"
                    style={{ color: "var(--accent-purple)" }}
                  >
                    {exp.title}
                  </p>
                  <p
                    className="mt-0.5 text-xs tracking-wide uppercase"
                    style={{ color: "var(--text-secondary)", transition: "color 0.35s ease" }}
                  >
                    {exp.dates}
                  </p>

                  <ul className="mt-4 flex flex-col gap-2">
                    {exp.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-2 text-sm leading-relaxed"
                        style={{ color: "var(--text-body)", transition: "color 0.35s ease" }}
                      >
                        <span
                          className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: "var(--accent-pink)" }}
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SKILLS SECTION ─── */}
      <section id="skills" className="e6-skills-section relative z-[2] px-6 py-28 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <NeoBrutalHeading emoji={"\u{1F9E0}"} rotate="-1deg">
              Skills
            </NeoBrutalHeading>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {skillCategories.map((category) => (
              <GlassPanel
                key={category.name}
                className="e6-skill-category px-8 py-8"
              >
                <h3
                  className="mb-4 text-sm font-bold tracking-[0.2em] uppercase"
                  style={{
                    color: "var(--text-primary)",
                    fontFamily:
                      "var(--font-display, 'Space Grotesk', system-ui, sans-serif)",
                    transition: "color 0.35s ease",
                  }}
                >
                  {category.emoji} {category.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <NeoBrutalTag key={skill}>{skill}</NeoBrutalTag>
                  ))}
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROJECTS SECTION ─── */}
      <section id="projects" className="e6-projects-section relative z-[2] px-6 py-28 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="e6-projects-heading mb-14">
            <NeoBrutalHeading emoji={"\u{1F6E0}\uFE0F"} rotate="-1deg">
              Things I&apos;ve Built
            </NeoBrutalHeading>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {projects.map((project, index) => (
              <GlassPanel
                key={project.title}
                className="e6-project-card group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#3d3248]"
                style={{ overflow: "visible" }}
                tilt
              >
                {/* Clickable card face */}
                <div onClick={() => toggleProject(index)}>
                  {/* Neobrutalist colored header bar */}
                  <div
                    className="flex items-center justify-between gap-3 overflow-hidden px-6 py-3"
                    style={{
                      background: project.headerColor,
                      borderBottom: "3px solid var(--glass-border)",
                      borderRadius: "1rem 1rem 0 0",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{project.emoji}</span>
                      <h3
                        className="text-sm font-bold uppercase tracking-wider text-white"
                        style={{
                          fontFamily:
                            "var(--font-display, 'Space Grotesk', system-ui, sans-serif)",
                        }}
                      >
                        {project.title}
                      </h3>
                    </div>
                    <span
                      className="text-xs font-semibold uppercase tracking-wide text-white/80 transition-colors group-hover:text-white"
                    >
                      {expandedProject === index ? "Close" : "View Details"}
                    </span>
                  </div>

                  <div className="px-6 py-6">
                    <p
                      className="mb-5 text-sm leading-relaxed"
                      style={{ color: "var(--text-body)", transition: "color 0.35s ease" }}
                    >
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <NeoBrutalTag key={tag}>{tag}</NeoBrutalTag>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Expandable case study detail */}
                <div
                  className={`e6-project-detail-${index}`}
                  style={{ height: 0, opacity: 0, overflow: "hidden" }}
                >
                  <div
                    className="border-t-2 px-6 pb-6 pt-5"
                    style={{ borderColor: "rgba(61, 50, 72, 0.2)" }}
                  >
                    <div className="mb-4">
                      <p
                        className="mb-1 text-xs font-bold uppercase tracking-wider"
                        style={{ color: project.headerColor }}
                      >
                        The Problem
                      </p>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--text-body)", transition: "color 0.35s ease" }}
                      >
                        {project.problem}
                      </p>
                    </div>

                    <div className="mb-4">
                      <p
                        className="mb-1 text-xs font-bold uppercase tracking-wider"
                        style={{ color: project.headerColor }}
                      >
                        My Approach
                      </p>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--text-body)", transition: "color 0.35s ease" }}
                      >
                        {project.approach}
                      </p>
                    </div>

                    <div className="mb-5">
                      <p
                        className="mb-2 text-xs font-bold uppercase tracking-wider"
                        style={{ color: project.headerColor }}
                      >
                        Key Highlights
                      </p>
                      <ul className="flex flex-col gap-1.5">
                        {project.highlights.map((highlight) => (
                          <li
                            key={highlight}
                            className="flex items-start gap-2 text-sm leading-relaxed"
                            style={{ color: "var(--text-body)", transition: "color 0.35s ease" }}
                          >
                            <span
                              className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                              style={{ background: project.headerColor }}
                            />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {project.github && (
                        <NeoBrutalButton
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          color={project.headerColor}
                          rotate="0deg"
                          className="text-xs"
                        >
                          GitHub {"\u{1F431}"}
                        </NeoBrutalButton>
                      )}
                      {project.liveUrl && (
                        <NeoBrutalButton
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          color="#8bb4d4"
                          rotate="0deg"
                          className="text-xs"
                        >
                          Live Demo {"\u{1F680}"}
                        </NeoBrutalButton>
                      )}
                    </div>
                  </div>
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT SECTION ─── */}
      <section id="contact" className="e6-contact-section relative z-[2] px-6 py-28 md:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 text-center">
            <NeoBrutalHeading emoji={"\u{1F4AC}"} rotate="1deg">
              Get In Touch
            </NeoBrutalHeading>
          </div>

          <GlassPanel className="px-8 py-10 md:px-12">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
              {contactLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target={link.name !== "Email" ? "_blank" : undefined}
                  rel={link.name !== "Email" ? "noopener noreferrer" : undefined}
                  className="e6-contact-card group w-full sm:w-auto"
                  data-magnetic
                >
                  <GlassPanel
                    className="flex flex-col items-center gap-2 px-8 py-6 text-center transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[6px_6px_0px_#3d3248]"
                  >
                    <span className="text-3xl">{link.emoji}</span>
                    <p
                      className="text-sm font-bold uppercase tracking-wider"
                      style={{
                        color: "var(--text-primary)",
                        fontFamily:
                          "var(--font-display, 'Space Grotesk', system-ui, sans-serif)",
                        transition: "color 0.35s ease",
                      }}
                    >
                      {link.name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-secondary)", transition: "color 0.35s ease" }}
                    >
                      {link.label}
                    </p>
                  </GlassPanel>
                </a>
              ))}
            </div>

            {/* Resume download -- second touchpoint */}
            <div className="mt-8 flex justify-center">
              <NeoBrutalButton
                href="/resume.pdf"
                download="Khai_Phan_Resume.pdf"
                color="#a78bcd"
                rotate="-1deg"
              >
                Download Resume {"\u{1F4C4}"}
              </NeoBrutalButton>
            </div>

            {/* Warm closing copy */}
            <p
              className="mt-8 text-center text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)", transition: "color 0.35s ease" }}
            >
              Whether it&apos;s a project idea, a job opportunity, or you just want to talk
              about animation easing curves -- I&apos;m always down to chat. Don&apos;t be a stranger.
            </p>
          </GlassPanel>
        </div>
      </section>
    </div>
  );
}
