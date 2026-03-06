"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export default function Exploration1() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Hero animations — gentle, unhurried drift upward
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.from(".e1-hero-greeting", {
        y: 60,
        opacity: 0,
        duration: 1.4,
      })
        .from(
          ".e1-hero-name",
          {
            y: 80,
            opacity: 0,
            duration: 1.6,
          },
          "-=1.0"
        )
        .from(
          ".e1-hero-tagline",
          {
            y: 40,
            opacity: 0,
            duration: 1.2,
          },
          "-=1.0"
        )
        .from(
          ".e1-scroll-indicator",
          {
            opacity: 0,
            duration: 1.0,
          },
          "-=0.4"
        );

      // About section animations — staggered fade in
      gsap.from(".e1-about-heading", {
        scrollTrigger: {
          trigger: ".e1-about-section",
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
      });

      gsap.from(".e1-about-text > *", {
        scrollTrigger: {
          trigger: ".e1-about-section",
          start: "top 75%",
        },
        y: 40,
        opacity: 0,
        duration: 1.0,
        stagger: 0.2,
        ease: "power2.out",
      });

      gsap.from(".e1-about-accent", {
        scrollTrigger: {
          trigger: ".e1-about-section",
          start: "top 70%",
        },
        scaleY: 0,
        opacity: 0,
        duration: 1.4,
        ease: "power2.out",
        transformOrigin: "top center",
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen"
      style={{
        background: "linear-gradient(180deg, #fffdf9 0%, #fef6f0 40%, #f8f0fa 100%)",
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      {/* Hero Section */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p
          className="e1-hero-greeting text-sm tracking-[0.35em] uppercase"
          style={{ color: "#b8a9c9", letterSpacing: "0.35em" }}
        >
          Welcome
        </p>

        <h1
          className="e1-hero-name mt-6 text-5xl font-light leading-tight tracking-tight sm:text-6xl md:text-8xl"
          style={{ color: "#3d3248" }}
        >
          Hi, I&apos;m <span style={{ fontStyle: "italic", color: "#c9a4b2" }}>Khai</span>
        </h1>

        <p
          className="e1-hero-tagline mt-8 max-w-md text-lg font-light leading-relaxed md:text-xl"
          style={{ color: "#7a6b8a" }}
        >
          Software engineer who builds things
          <br />
          people enjoy using.
        </p>

        {/* Scroll indicator */}
        <div className="e1-scroll-indicator mt-20 flex flex-col items-center gap-2">
          <div
            className="h-12 w-px"
            style={{
              background: "linear-gradient(180deg, transparent 0%, #c9a4b2 100%)",
            }}
          />
          <p
            className="text-xs tracking-[0.3em] uppercase"
            style={{ color: "#b8a9c9" }}
          >
            Scroll
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="e1-about-section px-6 py-32 md:px-12 lg:px-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-16 md:grid-cols-12">
            {/* Left: heading area */}
            <div className="md:col-span-4 lg:col-span-3">
              <h2
                className="e1-about-heading text-sm tracking-[0.3em] uppercase"
                style={{ color: "#b8a9c9" }}
              >
                About
              </h2>
              <div
                className="e1-about-accent mt-4 h-24 w-px"
                style={{ background: "linear-gradient(180deg, #c9a4b2 0%, transparent 100%)" }}
              />
            </div>

            {/* Right: text content */}
            <div
              className="e1-about-text md:col-span-8 lg:col-span-7 lg:col-start-5"
              style={{ color: "#5a4d66" }}
            >
              <p className="text-lg font-light leading-relaxed md:text-xl">
                I&apos;m a developer who believes the best software feels invisible.
                Clean interfaces, thoughtful interactions, and code that respects the
                people who use it.
              </p>

              <p className="mt-8 text-base font-light leading-relaxed" style={{ color: "#7a6b8a" }}>
                There&apos;s a particular kind of satisfaction in crafting something that
                just works -- where every pixel serves a purpose and every transition
                feels natural. I chase that feeling in every project, whether it&apos;s a
                complex web application or a simple utility tool.
              </p>

              <p className="mt-8 text-base font-light leading-relaxed" style={{ color: "#7a6b8a" }}>
                When I&apos;m not writing code, you&apos;ll find me exploring design systems,
                reading about human-computer interaction, or tweaking animations until
                they feel just right. I believe craft matters, and I bring that belief
                to everything I build.
              </p>

              {/* Decorative divider */}
              <div className="mt-16 flex items-center gap-4">
                <div
                  className="h-px flex-1"
                  style={{ background: "linear-gradient(90deg, #c9a4b2 0%, transparent 100%)" }}
                />
                <div
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: "#c9a4b2" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
