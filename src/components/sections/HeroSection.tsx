"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, SplitText } from "@/lib/gsap";
import { heroContent } from "@/data/content";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { NeoBrutalButton } from "@/components/ui/NeoBrutalButton";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

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
          ".hero-section__emoji",
          { scale: 0, rotation: -180 },
          { scale: 1, rotation: 0, duration: 0.7, ease: "back.out(1.7)" }
        )
        .fromTo(
          ".hero-section__glass",
          { scale: 0.92, opacity: 0, y: 40 },
          { scale: 1, opacity: 1, y: 0, duration: 1.2 },
          "-=0.3"
        )
        .fromTo(
          ".hero-section__greeting",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.7"
        );

      // Hero name -- character-by-character reveal for premium feel
      const heroNameEl = containerRef.current?.querySelector(".hero-section__name");
      if (heroNameEl) {
        const heroSplit = new SplitText(".hero-section__name", { type: "chars" });
        splitInstances.push(heroSplit);
        // Re-apply gradient to split chars (SplitText strips it from parent span)
        const gradientChars = heroNameEl.querySelectorAll(".hero-section__name-gradient div");
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
          ".hero-section__tagline",
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.3"
        )
      // Clear CSS transition on buttons so it doesn't fight GSAP's transform animation
      gsap.set(".hero-section__cta", { clearProps: "transition" });

      heroTl.fromTo(
          ".hero-section__cta",
          { scale: 0, rotation: -6, opacity: 0 },
          {
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(2)",
            stagger: 0.1,
            onComplete() {
              // Restore CSS transition for hover effects after entrance animation
              document.querySelectorAll(".hero-section__cta").forEach((el) => {
                (el as HTMLElement).style.transition = "transform 0.2s ease, box-shadow 0.2s ease";
              });
            },
          },
          "-=0.3"
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

  return (
    <section ref={containerRef} id="hero" className="relative z-[2] flex min-h-screen items-center justify-center px-6">
      <div className="relative z-10 w-full max-w-2xl text-center">
        {/* Emoji badge -- playful energy */}
        <GlassPanel
          className="hero-section__emoji mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
          rotate="-4deg"
        >
          <span role="img" aria-label="sparkles">
            {"\u2728"}
          </span>
        </GlassPanel>

        {/* Glass hero card -- Liquid Glass style */}
        <GlassPanel
          className="hero-section__glass px-6 py-10 sm:px-10 sm:py-14 md:px-16 md:py-18"
          shadow="5px 5px 0px #3d3248"
          tilt
        >
          <p
            className="hero-section__greeting text-xs font-semibold tracking-[0.3em] uppercase sm:text-sm"
            style={{ color: "#b8a9c9" }}
          >
            {heroContent.greeting}
          </p>

          <h1
            className="hero-section__name mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl"
            style={{
              color: "var(--text-primary)",
              fontFamily:
                "var(--font-display, 'Space Grotesk', system-ui, sans-serif)",
              transition: "color 0.35s ease",
            }}
          >
            I&apos;m{" "}
            <span className="hero-section__name-gradient">
              {heroContent.name}
            </span>
            <span style={{ color: "var(--accent-pink)" }}>.</span>
          </h1>

          {/* Neobrutalist subtitle banner */}
          <div
            className="hero-section__tagline mx-auto mt-6 inline-block px-4 py-2.5 sm:mt-8 sm:px-6 sm:py-3"
            style={{
              background: "var(--hero-tagline-bg)",
              border: "3px solid var(--glass-border)",
              boxShadow: "4px 4px 0px var(--glass-border)",
              transform: "rotate(-1deg)",
              transition: "background 0.35s ease, border-color 0.35s ease",
            }}
          >
            <p
              className="text-sm font-semibold sm:text-base md:text-lg"
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
              className="hero-section__cta"
            >
              {heroContent.ctaText}
            </NeoBrutalButton>
            <NeoBrutalButton
              href="/resume.pdf"
              download="Khai_Phan_Resume.pdf"
              color="#a78bcd"
              rotate="-1deg"
              className="hero-section__cta"
            >
              Resume {"\u{1F4C4}"}
            </NeoBrutalButton>
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}
