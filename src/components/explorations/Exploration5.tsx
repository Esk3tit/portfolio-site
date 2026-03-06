"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const skills = [
  { category: "FRONTEND", items: [
    { name: "React / Next.js", level: 92 },
    { name: "TypeScript", level: 88 },
    { name: "CSS / Tailwind", level: 85 },
    { name: "Animation (GSAP)", level: 78 },
  ]},
  { category: "BACKEND", items: [
    { name: "Node.js", level: 85 },
    { name: "PostgreSQL", level: 80 },
    { name: "REST / GraphQL", level: 82 },
    { name: "Docker", level: 70 },
  ]},
  { category: "TOOLS", items: [
    { name: "Git / GitHub", level: 90 },
    { name: "CI/CD", level: 75 },
    { name: "Figma", level: 65 },
    { name: "Linux / Shell", level: 72 },
  ]},
];

export default function Exploration5() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Typing effect for hero title
      const titleChars = containerRef.current?.querySelectorAll(".title-char");
      if (titleChars) {
        gsap.from(titleChars, {
          opacity: 0,
          duration: 0.03,
          stagger: 0.08,
          ease: "none",
        });
      }

      // Subtitle typing
      gsap.from(".vg-subtitle", {
        opacity: 0,
        duration: 0.03,
        delay: 0.9,
        ease: "none",
      });

      // HUD elements boot up sequentially
      gsap.from(".hud-element", {
        opacity: 0,
        duration: 0.1,
        stagger: 0.2,
        delay: 0.3,
        ease: "none",
      });

      // Status indicator flicker
      gsap.from(".vg-status", {
        opacity: 0,
        duration: 0.05,
        repeat: 3,
        yoyo: true,
        delay: 1.2,
        ease: "none",
      });

      // CTA slide in
      gsap.from(".vg-cta", {
        x: -40,
        opacity: 0,
        duration: 0.4,
        delay: 1.4,
        ease: "power2.out",
      });

      // Skills section
      gsap.from(".skill-category", {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".vg-skills",
          start: "top 80%",
        },
      });

      // Skill bars fill animation
      gsap.from(".skill-bar-fill", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.8,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".vg-skills",
          start: "top 75%",
        },
      });

      // Skill level numbers count up
      const levelEls = containerRef.current?.querySelectorAll(".skill-level");
      levelEls?.forEach((el) => {
        const target = parseInt(el.getAttribute("data-level") || "0");
        gsap.from(el, {
          textContent: 0,
          duration: 1,
          ease: "power2.out",
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: ".vg-skills",
            start: "top 75%",
          },
          onUpdate: function () {
            const val = Math.round(
              gsap.getProperty(el, "textContent") as number
            );
            el.textContent = String(val);
          },
        });
        // Reset to target so snap works correctly
        el.textContent = String(target);
      });
    },
    { scope: containerRef }
  );

  const titleText = "KHAI_PHAN";

  return (
    <div
      ref={containerRef}
      className="relative bg-[#0a0a0a] font-sans text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      {/* HUD CORNER ELEMENTS */}
      {/* Top-left bracket */}
      <div className="hud-element pointer-events-none fixed left-4 top-4 z-50">
        <div
          className="h-12 w-12"
          style={{
            borderLeft: "2px solid rgba(0,229,255,0.4)",
            borderTop: "2px solid rgba(0,229,255,0.4)",
          }}
        />
      </div>

      {/* Top-right coordinates */}
      <div className="hud-element pointer-events-none fixed right-4 top-4 z-50 text-right font-mono text-[10px] tracking-widest text-cyan-400/40">
        <div>LAT 37.7749</div>
        <div>LNG -122.4194</div>
      </div>

      {/* Bottom-left system status */}
      <div className="hud-element pointer-events-none fixed bottom-4 left-4 z-50 font-mono text-[10px] tracking-widest text-cyan-400/40">
        <div>SYS.STATUS: NOMINAL</div>
        <div>UPTIME: 99.97%</div>
      </div>

      {/* Bottom-right nav */}
      <div className="hud-element pointer-events-none fixed bottom-4 right-4 z-50">
        <div
          className="h-12 w-12"
          style={{
            borderRight: "2px solid rgba(0,229,255,0.4)",
            borderBottom: "2px solid rgba(0,229,255,0.4)",
          }}
        />
      </div>

      {/* HERO SECTION */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6">
        {/* Scanline overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,229,255,0.5) 2px, rgba(0,229,255,0.5) 4px)",
          }}
        />

        <div className="relative z-10 text-center">
          {/* Status indicator */}
          <div className="vg-status mb-8 flex items-center justify-center gap-2 font-mono text-sm tracking-widest">
            <span
              className="inline-block h-2 w-2 rounded-full bg-green-400"
              style={{
                boxShadow: "0 0 8px #39ff14, 0 0 20px #39ff14",
                animation: "pulse-glow 2s ease-in-out infinite",
              }}
            />
            <span className="text-green-400/80">STATUS: ONLINE</span>
          </div>

          {/* Title with typing effect */}
          <h1 className="mb-4 font-mono text-6xl font-bold tracking-tight md:text-8xl">
            {titleText.split("").map((char, i) => (
              <span
                key={i}
                className="title-char inline-block"
                style={{
                  textShadow: "0 0 10px #00e5ff, 0 0 40px rgba(0,229,255,0.3)",
                  color: char === "_" ? "#00e5ff" : "white",
                }}
              >
                {char}
              </span>
            ))}
            <span
              className="ml-1 inline-block h-[0.9em] w-[3px] align-middle bg-cyan-400"
              style={{
                animation: "blink-cursor 1s step-end infinite",
                boxShadow: "0 0 8px #00e5ff",
              }}
            />
          </h1>

          {/* Subtitle */}
          <p
            className="vg-subtitle font-mono text-lg tracking-wider text-cyan-400/70 md:text-xl"
            style={{
              textShadow: "0 0 10px rgba(0,229,255,0.2)",
            }}
          >
            {"// Software Engineer"}
          </p>

          {/* CTA */}
          <div className="vg-cta mt-12">
            <div
              className="inline-block border border-cyan-500/30 px-8 py-3 font-mono text-sm uppercase tracking-widest text-cyan-400 transition-all hover:border-cyan-400 hover:bg-cyan-400/10"
              style={{
                boxShadow: "0 0 15px rgba(0,229,255,0.1)",
              }}
            >
              {">"} INITIALIZE PORTFOLIO
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section className="vg-skills border-t border-cyan-500/10 px-6 py-20 md:px-12">
        <div className="mx-auto max-w-5xl">
          <h2
            className="mb-4 font-mono text-3xl font-bold uppercase tracking-wider md:text-4xl"
            style={{
              textShadow: "0 0 10px #00e5ff, 0 0 30px rgba(0,229,255,0.2)",
            }}
          >
            SKILL_STATS
          </h2>
          <div className="mb-12 font-mono text-xs tracking-widest text-cyan-400/40">
            {"// CURRENT PROFICIENCY LEVELS"}
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            {skills.map((category) => (
              <div
                key={category.category}
                className="skill-category border border-cyan-500/20 p-6"
                style={{
                  boxShadow: "0 0 20px rgba(0,229,255,0.05)",
                }}
              >
                <h3 className="mb-6 border-b border-cyan-500/20 pb-3 font-mono text-sm font-bold tracking-[0.3em] text-cyan-400">
                  {`[ ${category.category} ]`}
                </h3>

                <div className="space-y-5">
                  {category.items.map((skill) => (
                    <div key={skill.name}>
                      <div className="mb-1.5 flex items-baseline justify-between font-mono text-xs">
                        <span className="tracking-wider text-white/70">
                          {skill.name}
                        </span>
                        <span
                          className="skill-level text-cyan-400/60"
                          data-level={skill.level}
                        >
                          {skill.level}
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden bg-white/5">
                        <div
                          className="skill-bar-fill h-full"
                          style={{
                            width: `${skill.level}%`,
                            background:
                              skill.level >= 85
                                ? "linear-gradient(90deg, #00e5ff, #39ff14)"
                                : skill.level >= 75
                                  ? "linear-gradient(90deg, #00e5ff, #00e5ff)"
                                  : "linear-gradient(90deg, #ffab00, #00e5ff)",
                            boxShadow:
                              skill.level >= 85
                                ? "0 0 8px rgba(57,255,20,0.4)"
                                : "0 0 8px rgba(0,229,255,0.3)",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #39ff14, 0 0 20px #39ff14; }
          50% { opacity: 0.6; box-shadow: 0 0 4px #39ff14, 0 0 10px #39ff14; }
        }
      `}</style>
    </div>
  );
}
