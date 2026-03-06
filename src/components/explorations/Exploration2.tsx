"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const projects = [
  {
    title: "Rhythm",
    description: "A music discovery app that learns your taste and surprises you with gems you didn't know existed.",
    tags: ["React", "Node.js", "Spotify API"],
    color: "#ff6e40",
    rotation: -2,
  },
  {
    title: "Pixel Garden",
    description: "Collaborative pixel art canvas where strangers build something beautiful together, one dot at a time.",
    tags: ["WebSocket", "Canvas API", "Go"],
    color: "#2979ff",
    rotation: 1.5,
  },
  {
    title: "Snack Stack",
    description: "Rate and track every snack you've ever tried. Yes, it's exactly as important as it sounds.",
    tags: ["Next.js", "PostgreSQL", "Tailwind"],
    color: "#aa00ff",
    rotation: -1,
  },
];

export default function Exploration2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Hero animations — bouncy and energetic
      const tl = gsap.timeline({ defaults: { ease: "back.out(1.7)" } });

      tl.from(".e2-hero-emoji", {
        scale: 0,
        rotation: -180,
        duration: 0.8,
      })
        .from(
          ".e2-hero-name",
          {
            y: 100,
            opacity: 0,
            scale: 0.8,
            duration: 0.9,
          },
          "-=0.3"
        )
        .from(
          ".e2-hero-tagline",
          {
            y: 60,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.4"
        )
        .from(
          ".e2-hero-blob",
          {
            scale: 0,
            opacity: 0,
            duration: 1.0,
            stagger: 0.15,
            ease: "elastic.out(1, 0.5)",
          },
          "-=0.8"
        );

      // Project cards — pop in with stagger
      gsap.from(".e2-project-card", {
        scrollTrigger: {
          trigger: ".e2-projects-section",
          start: "top 80%",
        },
        y: 80,
        opacity: 0,
        scale: 0.9,
        rotation: (i: number) => (i % 2 === 0 ? -3 : 3),
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.4)",
      });

      gsap.from(".e2-projects-heading", {
        scrollTrigger: {
          trigger: ".e2-projects-section",
          start: "top 85%",
        },
        x: -60,
        opacity: 0,
        duration: 0.7,
        ease: "back.out(1.7)",
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen overflow-hidden"
      style={{
        background: "#1a1a2e",
        fontFamily: "'system-ui', 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        {/* Decorative blobs */}
        <div
          className="e2-hero-blob absolute left-[10%] top-[15%] h-64 w-64 rounded-full opacity-40 blur-3xl"
          style={{ background: "#ff6e40" }}
        />
        <div
          className="e2-hero-blob absolute right-[15%] top-[25%] h-48 w-48 rounded-full opacity-30 blur-3xl"
          style={{ background: "#2979ff" }}
        />
        <div
          className="e2-hero-blob absolute bottom-[20%] left-[25%] h-56 w-56 rounded-full opacity-35 blur-3xl"
          style={{ background: "#aa00ff" }}
        />
        <div
          className="e2-hero-blob absolute bottom-[30%] right-[10%] h-40 w-40 rounded-full opacity-30 blur-3xl"
          style={{ background: "#ffd600" }}
        />

        {/* Content */}
        <div className="relative z-10">
          <div
            className="e2-hero-emoji mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl text-4xl"
            style={{
              background: "linear-gradient(135deg, #ff6e40 0%, #ffd600 100%)",
              transform: "rotate(-6deg)",
              boxShadow: "0 8px 30px rgba(255, 110, 64, 0.3)",
            }}
          >
            <span role="img" aria-label="wave">
              {"\u{1F44B}"}
            </span>
          </div>

          <h1
            className="e2-hero-name text-5xl font-black leading-none tracking-tight sm:text-7xl md:text-9xl"
            style={{ color: "#ffffff" }}
          >
            Hey! I&apos;m{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #ff6e40 0%, #ffd600 50%, #2979ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Khai
            </span>
            <span style={{ color: "#ffd600" }}>.</span>
          </h1>

          <p
            className="e2-hero-tagline mt-8 max-w-lg text-lg font-medium leading-relaxed md:text-xl"
            style={{ color: "rgba(255, 255, 255, 0.6)" }}
          >
            I build fun stuff for the web and occasionally
            <br />
            convince computers to do cool things.
          </p>
        </div>
      </section>

      {/* Projects Section */}
      <section className="e2-projects-section px-6 pb-32 pt-16 md:px-12">
        <div className="mx-auto max-w-5xl">
          <h2
            className="e2-projects-heading mb-16 text-3xl font-black md:text-5xl"
            style={{ color: "#ffffff" }}
          >
            Things I&apos;ve
            <br />
            <span style={{ color: "#ffd600" }}>Built</span>{" "}
            <span style={{ color: "#ff6e40" }}>&</span>{" "}
            <span style={{ color: "#2979ff" }}>Shipped</span>
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <div
                key={project.title}
                className="e2-project-card group relative rounded-2xl p-8 transition-transform duration-300 hover:scale-105"
                style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  border: `2px solid ${project.color}40`,
                  transform: `rotate(${project.rotation}deg)`,
                  boxShadow: `0 4px 24px ${project.color}15`,
                }}
              >
                {/* Number badge */}
                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg text-sm font-black"
                  style={{
                    background: `${project.color}20`,
                    color: project.color,
                  }}
                >
                  0{i + 1}
                </div>

                <h3
                  className="mb-3 text-xl font-bold"
                  style={{ color: "#ffffff" }}
                >
                  {project.title}
                </h3>

                <p
                  className="mb-6 text-sm leading-relaxed"
                  style={{ color: "rgba(255, 255, 255, 0.5)" }}
                >
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        background: `${project.color}15`,
                        color: project.color,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Corner accent */}
                <div
                  className="absolute -right-1 -top-1 h-6 w-6 rounded-full opacity-60"
                  style={{ background: project.color }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
