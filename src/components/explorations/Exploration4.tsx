"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export default function Exploration4() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".hero-title", {
        y: 80,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });
      gsap.from(".hero-desc", {
        y: 40,
        opacity: 0,
        duration: 0.5,
        delay: 0.2,
        ease: "power2.out",
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="flex min-h-screen flex-col items-center justify-center px-6"
    >
      <h1 className="hero-title font-display text-5xl font-bold tracking-tight md:text-7xl">
        Neobrutalism
      </h1>
      <p className="hero-desc mt-6 max-w-lg text-center text-lg text-text/60">
        Thick borders, raw geometric shapes, bold colors, and an intentionally
        anti-polish aesthetic.
      </p>
    </section>
  );
}
