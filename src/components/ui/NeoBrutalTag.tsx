"use client";

import { useRef, useCallback, type ReactNode } from "react";
import { initGSAP } from "@/lib/gsap";

interface NeoBrutalTagProps {
  children: ReactNode;
  className?: string;
}

export function NeoBrutalTag({ children, className = "" }: NeoBrutalTagProps) {
  const tagRef = useRef<HTMLSpanElement>(null);

  const onMouseEnter = useCallback(async () => {
    // Only animate on devices with hover capability
    if (!window.matchMedia("(hover: hover)").matches) return;
    if (!tagRef.current) return;

    await initGSAP();
    const { gsap } = await import("@/lib/gsap");
    if (!gsap) return;

    const el = tagRef.current;
    // Wiggle side-to-side then settle with a scale pop
    gsap.timeline()
      .to(el, { rotation: -3, duration: 0.06, ease: "power1.inOut" })
      .to(el, { rotation: 3, duration: 0.06, ease: "power1.inOut" })
      .to(el, { rotation: -2, duration: 0.06, ease: "power1.inOut" })
      .to(el, { rotation: gsap.utils.random(-1, 1), scale: 1.1, duration: 0.15, ease: "elastic.out(1, 0.5)" });
  }, []);

  const onMouseLeave = useCallback(async () => {
    if (!tagRef.current) return;

    await initGSAP();
    const { gsap } = await import("@/lib/gsap");
    if (!gsap) return;

    gsap.to(tagRef.current, {
      rotation: 0,
      scale: 1,
      duration: 0.3,
      ease: "elastic.out(1, 0.4)",
    });
  }, []);

  return (
    <span
      ref={tagRef}
      className={`inline-block px-2.5 py-1 text-xs font-bold uppercase sm:px-3 ${className}`}
      style={{
        background: "var(--tag-bg)",
        border: "2px solid var(--glass-border)",
        boxShadow: "2px 2px 0px var(--glass-border)",
        color: "var(--text-primary)",
        transition: "background 0.35s ease, color 0.35s ease, border-color 0.35s ease",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </span>
  );
}
