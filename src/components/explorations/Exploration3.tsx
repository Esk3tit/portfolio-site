"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export default function Exploration3() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Floating orbs — slow infinite drift
      gsap.to(".e3-orb", {
        y: "random(-30, 30)",
        x: "random(-20, 20)",
        duration: "random(6, 10)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          each: 1.5,
          from: "random",
        },
      });

      // Hero glass panel entrance
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      heroTl
        .from(".e3-hero-glass", {
          scale: 0.92,
          opacity: 0,
          y: 40,
          duration: 1.4,
        })
        .from(
          ".e3-hero-name",
          {
            y: 50,
            opacity: 0,
            duration: 1.2,
          },
          "-=0.9"
        )
        .from(
          ".e3-hero-role",
          {
            y: 30,
            opacity: 0,
            duration: 1.0,
          },
          "-=0.7"
        )
        .from(
          ".e3-hero-divider",
          {
            scaleX: 0,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.5"
        )
        .from(
          ".e3-hero-tagline",
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.4"
        );

      // About section glass panels
      gsap.from(".e3-about-panel", {
        scrollTrigger: {
          trigger: ".e3-about-section",
          start: "top 80%",
        },
        scale: 0.95,
        opacity: 0,
        y: 60,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out",
      });

      gsap.from(".e3-about-heading", {
        scrollTrigger: {
          trigger: ".e3-about-section",
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 1.0,
        ease: "power3.out",
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Gradient orbs — positioned behind glass panels */}
      <div
        className="e3-orb absolute h-[500px] w-[500px] rounded-full opacity-40 blur-[100px]"
        style={{
          background: "radial-gradient(circle, #6366f1 0%, transparent 70%)",
          top: "5%",
          left: "15%",
        }}
      />
      <div
        className="e3-orb absolute h-[400px] w-[400px] rounded-full opacity-30 blur-[80px]"
        style={{
          background: "radial-gradient(circle, #ec4899 0%, transparent 70%)",
          top: "20%",
          right: "10%",
        }}
      />
      <div
        className="e3-orb absolute h-[350px] w-[350px] rounded-full opacity-35 blur-[90px]"
        style={{
          background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
          bottom: "30%",
          left: "5%",
        }}
      />
      <div
        className="e3-orb absolute h-[300px] w-[300px] rounded-full opacity-25 blur-[70px]"
        style={{
          background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)",
          top: "60%",
          right: "20%",
        }}
      />

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center px-6">
        <div
          className="e3-hero-glass relative z-10 w-full max-w-2xl rounded-3xl px-10 py-16 text-center md:px-16 md:py-20"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          <h1
            className="e3-hero-name text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl"
            style={{ color: "rgba(255, 255, 255, 0.95)" }}
          >
            Khai Phan
          </h1>

          <div
            className="e3-hero-divider mx-auto my-6 h-px w-24"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
            }}
          />

          <p
            className="e3-hero-role text-lg font-medium tracking-wide md:text-xl"
            style={{
              background:
                "linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #34d399 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Software Engineer
          </p>

          <p
            className="e3-hero-tagline mt-6 text-base font-light leading-relaxed md:text-lg"
            style={{ color: "rgba(255, 255, 255, 0.5)" }}
          >
            Building digital experiences with precision and purpose.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="e3-about-section relative px-6 pb-32 pt-16 md:px-12">
        <div className="mx-auto max-w-5xl">
          <h2
            className="e3-about-heading mb-16 text-center text-sm font-medium tracking-[0.3em] uppercase"
            style={{ color: "rgba(255, 255, 255, 0.4)" }}
          >
            About
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Panel 1: Background */}
            <div
              className="e3-about-panel relative rounded-2xl px-8 py-10"
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)",
              }}
            >
              <h3
                className="mb-4 text-xs font-medium tracking-[0.25em] uppercase"
                style={{ color: "#a78bfa" }}
              >
                Background
              </h3>
              <p
                className="text-base font-light leading-relaxed"
                style={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                I&apos;m a software engineer drawn to the intersection of engineering and
                design. I build interfaces that feel polished and effortless -- the kind
                of experience where the technology disappears and the interaction just
                flows.
              </p>
              <p
                className="mt-4 text-sm font-light leading-relaxed"
                style={{ color: "rgba(255, 255, 255, 0.45)" }}
              >
                From complex web applications to thoughtful component libraries, I bring
                an eye for detail and a commitment to code quality that stands the test
                of time.
              </p>
            </div>

            {/* Panel 2: Interests */}
            <div
              className="e3-about-panel relative rounded-2xl px-8 py-10"
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)",
              }}
            >
              <h3
                className="mb-4 text-xs font-medium tracking-[0.25em] uppercase"
                style={{ color: "#60a5fa" }}
              >
                Interests
              </h3>
              <p
                className="text-base font-light leading-relaxed"
                style={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                Beyond code, I&apos;m fascinated by motion design, spatial interfaces, and
                the small moments of delight that make digital products feel alive.
                Typography, color theory, and animation timing are some of my favorite
                rabbit holes.
              </p>
              <p
                className="mt-4 text-sm font-light leading-relaxed"
                style={{ color: "rgba(255, 255, 255, 0.45)" }}
              >
                I believe great software is built at the edge of engineering and
                aesthetics -- where performance meets polish.
              </p>
            </div>
          </div>

          {/* Bottom accent line */}
          <div
            className="mx-auto mt-16 h-px w-32"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
            }}
          />
        </div>
      </section>
    </div>
  );
}
