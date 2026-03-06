"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { NeoBrutalButton } from "@/components/ui/NeoBrutalButton";
import { NeoBrutalHeading } from "@/components/ui/NeoBrutalHeading";
import { NeoBrutalTag } from "@/components/ui/NeoBrutalTag";
import {
  heroContent,
  aboutPanels,
  experiences,
  skillCategories,
} from "@/data/content";

const projects = [
  {
    emoji: "\u{1F3B5}",
    title: "Rhythm",
    description:
      "A music discovery app that learns your taste and surprises you with gems you didn't know existed.",
    tags: ["React", "Node.js", "Spotify API"],
    headerColor: "#c9a4b2",
  },
  {
    emoji: "\u{1F3A8}",
    title: "Pixel Garden",
    description:
      "Collaborative pixel art canvas where strangers build something beautiful together, one dot at a time.",
    tags: ["WebSocket", "Canvas API", "Go"],
    headerColor: "#a78bcd",
  },
  {
    emoji: "\u{1F36A}",
    title: "Snack Stack",
    description:
      "Rate and track every snack you've ever tried. Yes, it's exactly as important as it sounds.",
    tags: ["Next.js", "PostgreSQL", "Tailwind"],
    headerColor: "#8bb4d4",
  },
];

export default function Exploration6() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Hero entrance — playful energy with glass polish
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      heroTl
        .from(".e6-hero-emoji", {
          scale: 0,
          rotation: -180,
          duration: 0.7,
          ease: "back.out(1.7)",
        })
        .from(
          ".e6-hero-glass",
          { scale: 0.92, opacity: 0, y: 40, duration: 1.2 },
          "-=0.3"
        )
        .from(
          ".e6-hero-greeting",
          { y: 30, opacity: 0, duration: 0.8 },
          "-=0.7"
        )
        .from(
          ".e6-hero-name",
          { y: 50, opacity: 0, duration: 1.0 },
          "-=0.5"
        )
        .from(
          ".e6-hero-tagline",
          { y: 25, opacity: 0, duration: 0.8 },
          "-=0.5"
        )
        .from(
          ".e6-hero-cta",
          {
            scale: 0,
            rotation: -6,
            opacity: 0,
            duration: 0.5,
            ease: "back.out(2)",
            stagger: 0.1,
          },
          "-=0.3"
        );

      // About section
      gsap.from(".e6-about-heading", {
        scrollTrigger: { trigger: ".e6-about-section", start: "top 85%" },
        y: 40,
        opacity: 0,
        duration: 1.0,
        ease: "power3.out",
      });

      gsap.from(".e6-about-panel", {
        scrollTrigger: { trigger: ".e6-about-section", start: "top 80%" },
        scale: 0.95,
        opacity: 0,
        y: 50,
        duration: 1.0,
        stagger: 0.15,
        ease: "power3.out",
      });

      // Experience section
      gsap.from(".e6-experience-card", {
        scrollTrigger: {
          trigger: ".e6-experience-section",
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      });

      // Skills section
      gsap.from(".e6-skill-category", {
        scrollTrigger: { trigger: ".e6-skills-section", start: "top 80%" },
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
      });

      // Projects section
      gsap.from(".e6-projects-heading", {
        scrollTrigger: { trigger: ".e6-projects-section", start: "top 85%" },
        x: -50,
        opacity: 0,
        duration: 0.7,
        ease: "back.out(1.4)",
      });

      gsap.from(".e6-project-card", {
        scrollTrigger: { trigger: ".e6-projects-section", start: "top 78%" },
        y: 60,
        opacity: 0,
        scale: 0.95,
        rotation: (i: number) => (i % 2 === 0 ? -2 : 2),
        duration: 0.8,
        stagger: 0.12,
        ease: "back.out(1.2)",
      });
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
          "linear-gradient(180deg, #e8ddd5 0%, #d8cfc8 30%, #d5cde0 60%, #cdd0e5 100%)",
        fontFamily: "var(--font-body, 'Inter', system-ui, sans-serif)",
      }}
    >

      {/* SVG noise filter for frosted glass grain texture */}
      <svg className="absolute h-0 w-0">
        <filter id="glass-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>

      {/* ─── HERO SECTION ─── */}
      <section className="relative flex min-h-screen items-center justify-center px-6">
        <div className="relative z-10 w-full max-w-2xl text-center">
          {/* Emoji badge — playful energy */}
          <GlassPanel
            className="e6-hero-emoji mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
            rotate="-4deg"
          >
            <span role="img" aria-label="sparkles">
              {"\u2728"}
            </span>
          </GlassPanel>

          {/* Glass hero card — Liquid Glass style */}
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
                color: "#3d3248",
                fontFamily:
                  "var(--font-display, 'Space Grotesk', system-ui, sans-serif)",
              }}
            >
              I&apos;m{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #c9a4b2 0%, #a78bcd 50%, #8bb4d4 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {heroContent.name}
              </span>
              <span style={{ color: "#c9a4b2" }}>.</span>
            </h1>

            {/* Neobrutalist subtitle banner */}
            <div
              className="e6-hero-tagline mx-auto mt-8 inline-block px-6 py-3"
              style={{
                background: "#fff",
                border: "3px solid #3d3248",
                boxShadow: "4px 4px 0px #3d3248",
                transform: "rotate(-1deg)",
              }}
            >
              <p
                className="text-base font-semibold md:text-lg"
                style={{ color: "#3d3248" }}
              >
                {heroContent.tagline}
              </p>
            </div>

            {/* CTAs — scroll down + resume download */}
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
      <section id="about" className="e6-about-section relative px-6 py-28 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="e6-about-heading mb-14 text-center">
            <h2
              className="inline-block px-5 py-2.5 text-sm font-bold tracking-[0.25em] uppercase"
              style={{
                background: "#f5eff8",
                color: "#3d3248",
                border: "3px solid #3d3248",
                boxShadow: "4px 4px 0px #3d3248",
                transform: "rotate(1deg)",
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
                  style={{ color: panel.emoji === "\u{1F680}" ? "#c9a4b2" : "#a78bcd" }}
                >
                  {panel.emoji} {panel.title}
                </h3>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: "#5a4d66" }}
                >
                  {panel.content}
                </p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EXPERIENCE SECTION ─── */}
      <section id="experience" className="e6-experience-section relative px-6 py-28 md:px-12">
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
                      color: "#3d3248",
                      fontFamily:
                        "var(--font-display, 'Space Grotesk', system-ui, sans-serif)",
                    }}
                  >
                    {exp.company}
                  </h3>
                  <p
                    className="mt-1 text-sm font-semibold"
                    style={{ color: "#a78bcd" }}
                  >
                    {exp.title}
                  </p>
                  <p
                    className="mt-0.5 text-xs tracking-wide uppercase"
                    style={{ color: "#8a7d96" }}
                  >
                    {exp.dates}
                  </p>

                  <ul className="mt-4 flex flex-col gap-2">
                    {exp.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-2 text-sm leading-relaxed"
                        style={{ color: "#5a4d66" }}
                      >
                        <span
                          className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: "#c9a4b2" }}
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
      <section id="skills" className="e6-skills-section relative px-6 py-28 md:px-12">
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
                    color: "#3d3248",
                    fontFamily:
                      "var(--font-display, 'Space Grotesk', system-ui, sans-serif)",
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
      <section className="e6-projects-section relative px-6 pb-32 pt-8 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="e6-projects-heading mb-14">
            <NeoBrutalHeading emoji={"\u{1F6E0}\uFE0F"} rotate="-1deg">
              Things I&apos;ve Built
            </NeoBrutalHeading>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <GlassPanel
                key={project.title}
                className="e6-project-card group transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#3d3248]"
              >
                {/* Neobrutalist colored header bar */}
                <div
                  className="flex items-center gap-3 px-6 py-3"
                  style={{
                    background: project.headerColor,
                    borderBottom: "3px solid #3d3248",
                    borderRadius: "1rem 1rem 0 0",
                  }}
                >
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

                <div className="px-6 py-6">
                  <p
                    className="mb-5 text-sm leading-relaxed"
                    style={{ color: "#5a4d66" }}
                  >
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <NeoBrutalTag key={tag}>{tag}</NeoBrutalTag>
                    ))}
                  </div>
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
