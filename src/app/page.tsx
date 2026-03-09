"use client";

import { useRef, useCallback, useEffect } from "react";
import { initGSAP } from "@/lib/gsap";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { FloatingNav } from "@/components/sections/FloatingNav";
import { MobileNav } from "@/components/sections/MobileNav";

export default function HomePage() {
  const gradientTweenRef = useRef<ReturnType<typeof import("gsap").gsap.to> | null>(null);

  const startGradientAnimation = useCallback(async () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    await initGSAP();
    const { gsap } = await import("@/lib/gsap");
    if (!gsap) return;

    if (gradientTweenRef.current) (gradientTweenRef.current as gsap.core.Tween).kill();
    const isDark = document.documentElement.classList.contains("dark");
    const root = document.documentElement;
    const startBase = isDark ? "#1a1520" : "#e8ddd5";
    const endBase = isDark ? "#1e2030" : "#cdd0e5";
    const startTarget = isDark ? "#1e1828" : "#eddcd2";
    const endTarget = isDark ? "#222438" : "#d5cbe8";
    root.style.setProperty("--bg-gradient-start", startBase);
    root.style.setProperty("--bg-gradient-end", endBase);
    gradientTweenRef.current = gsap.to(root, {
      "--bg-gradient-start": startTarget,
      "--bg-gradient-end": endTarget,
      duration: 25,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }, []);

  useEffect(() => {
    startGradientAnimation();
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
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
      if (gradientTweenRef.current) (gradientTweenRef.current as gsap.core.Tween).kill();
    };
  }, [startGradientAnimation]);

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--bg-gradient-start) 0%, color-mix(in srgb, var(--bg-gradient-start) 60%, var(--bg-gradient-end)) 30%, color-mix(in srgb, var(--bg-gradient-end) 70%, var(--bg-gradient-start)) 60%, var(--bg-gradient-end) 100%)",
        fontFamily: "var(--font-body, 'Inter', system-ui, sans-serif)",
        transition: "background 0.35s ease",
      }}
    >
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>

      <FloatingNav />
      <MobileNav />

      {/* SVG noise filter for frosted glass grain texture */}
      <svg className="absolute h-0 w-0">
        <filter id="glass-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
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

      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </div>
  );
}
