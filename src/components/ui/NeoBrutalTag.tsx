import { type ReactNode } from "react";

interface NeoBrutalTagProps {
  children: ReactNode;
  className?: string;
}

export function NeoBrutalTag({ children, className = "" }: NeoBrutalTagProps) {
  return (
    <span
      className={`px-3 py-1 text-xs font-bold uppercase ${className}`}
      style={{
        background: "var(--tag-bg)",
        border: "2px solid var(--glass-border)",
        boxShadow: "2px 2px 0px var(--glass-border)",
        color: "var(--text-primary)",
        transition: "background 0.35s ease, color 0.35s ease, border-color 0.35s ease",
      }}
    >
      {children}
    </span>
  );
}
