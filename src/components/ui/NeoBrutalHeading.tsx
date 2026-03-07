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
      className={`e6-split-heading inline-block px-6 py-3 text-2xl font-bold md:text-3xl ${className}`}
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
