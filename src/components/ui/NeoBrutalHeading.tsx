import { type ReactNode } from "react";

interface NeoBrutalHeadingProps {
  children: ReactNode;
  emoji?: string;
  rotate?: string;
  className?: string;
}

export function NeoBrutalHeading({
  children,
  emoji,
  rotate = "-1deg",
  className = "",
}: NeoBrutalHeadingProps) {
  return (
    <h2
      className={`split-heading inline-block px-4 py-2.5 text-xl font-bold sm:px-6 sm:py-3 sm:text-2xl md:text-3xl ${className}`}
      style={{
        color: "#fff",
        background: "#3d3248",
        border: "3px solid #1a1220",
        boxShadow: "5px 5px 0px #1a1220",
        fontFamily:
          "var(--font-display, 'Space Grotesk', system-ui, sans-serif)",
        transform: `rotate(${rotate})`,
      }}
    >
      {emoji && <span className="mr-2">{emoji}</span>}
      {children}
    </h2>
  );
}
