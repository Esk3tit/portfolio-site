"use client";

import { useRef, useCallback, type ReactNode, type CSSProperties } from "react";
import { initGSAP } from "@/lib/gsap";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
  shadow?: string;
  rotate?: string;
  padding?: string;
  style?: CSSProperties;
  tilt?: boolean;
}

export function GlassPanel({
  children,
  className = "",
  as: Tag = "div",
  shadow = "4px 4px 0px #3d3248",
  rotate,
  padding,
  style,
  tilt = false,
}: GlassPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback(
    async (e: React.MouseEvent<HTMLElement>) => {
      if (!tilt || !panelRef.current) return;
      // Only on devices with hover capability
      if (!window.matchMedia("(hover: hover)").matches) return;

      await initGSAP();
      const { gsap } = await import("@/lib/gsap");
      if (!gsap) return;

      const rect = panelRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const relX = (e.clientX - centerX) / (rect.width / 2); // -1 to 1
      const relY = (e.clientY - centerY) / (rect.height / 2); // -1 to 1

      gsap.to(panelRef.current, {
        rotateY: relX * 8,
        rotateX: -relY * 8,
        duration: 0.4,
        ease: "power2.out",
        transformPerspective: 800,
        overwrite: "auto",
      });
    },
    [tilt]
  );

  const onMouseLeave = useCallback(async () => {
    if (!tilt || !panelRef.current) return;

    await initGSAP();
    const { gsap } = await import("@/lib/gsap");
    if (!gsap) return;

    gsap.to(panelRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });
  }, [tilt]);

  return (
    <Tag
      ref={panelRef as React.Ref<HTMLDivElement>}
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        background:
          "linear-gradient(160deg, var(--glass-fill) 0%, var(--glass-fill-end) 100%)",
        backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
        WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturate))",
        border: "3px solid var(--glass-border)",
        boxShadow: shadow,
        transition: "background 0.35s ease, border-color 0.35s ease",
        ...(rotate ? { transform: `rotate(${rotate})` } : {}),
        ...(padding ? { padding } : {}),
        ...style,
      }}
      onMouseMove={tilt ? onMouseMove : undefined}
      onMouseLeave={tilt ? onMouseLeave : undefined}
      {...(tilt ? { "data-magnetic": true } : {})}
    >
      {/* Specular rim -- bright continuous edge like real glass refraction */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          border: "1.5px solid transparent",
          background:
            "linear-gradient(180deg, var(--glass-specular-top) 0%, rgba(255,255,255,0.15) 40%, rgba(255,255,255,0.05) 60%, rgba(255,255,255,0.25) 100%) border-box",
          WebkitMask:
            "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          transition: "background 0.35s ease",
        }}
      />
      {/* Frosted noise grain overlay -- references page-level #glass-noise SVG filter */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.03]"
        style={{ filter: "url(#glass-noise)", background: "transparent" }}
      />
      {children}
    </Tag>
  );
}
