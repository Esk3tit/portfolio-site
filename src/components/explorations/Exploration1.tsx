"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export default function Exploration1() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".hero-title", {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
      gsap.from(".hero-desc", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: "power3.out",
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
        Light + Airy
      </h1>
      <p className="hero-desc mt-6 max-w-lg text-center text-lg text-text/60">
        Generous whitespace, soft pastel tones, elegant minimalism, and clean
        typography that breathes.
      </p>
    </section>
  );
}
