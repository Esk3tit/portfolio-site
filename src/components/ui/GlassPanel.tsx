import { type ReactNode, type CSSProperties, type ElementType } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
  shadow?: string;
  rotate?: string;
  padding?: string;
  style?: CSSProperties;
}

export function GlassPanel({
  children,
  className = "",
  as: Tag = "div",
  shadow = "4px 4px 0px #3d3248",
  rotate,
  padding,
  style,
}: GlassPanelProps) {
  return (
    <Tag
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        background:
          "linear-gradient(160deg, var(--glass-fill) 0%, var(--glass-fill-end) 100%)",
        backdropFilter: "blur(40px) saturate(1.6)",
        WebkitBackdropFilter: "blur(40px) saturate(1.6)",
        border: "3px solid var(--glass-border)",
        boxShadow: shadow,
        transition: "background 0.35s ease, border-color 0.35s ease",
        ...(rotate ? { transform: `rotate(${rotate})` } : {}),
        ...(padding ? { padding } : {}),
        ...style,
      }}
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
