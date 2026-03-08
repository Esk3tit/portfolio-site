"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { aboutPanels } from "@/data/content";
import { GlassPanel } from "@/components/ui/GlassPanel";

export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // About heading animation
      gsap.fromTo(".about-section__heading",
        { y: 40, opacity: 0 },
        { scrollTrigger: { trigger: containerRef.current, start: "top 85%" }, y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );

      // About panels animation
      gsap.fromTo(".about-section__panel",
        { scale: 0.95, opacity: 0, y: 50 },
        { scrollTrigger: { trigger: containerRef.current, start: "top 85%" }, scale: 1, opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" }
      );

      // Recalculate trigger positions after hydration paint
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          ScrollTrigger.refresh(true);
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} id="about" className="about-section relative z-[2] px-6 py-28 md:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="about-section__heading mb-14 text-center">
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
              className="about-section__panel px-8 py-10"
              tilt
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
  );
}
