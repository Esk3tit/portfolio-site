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
        background: "rgba(255, 255, 255, 0.5)",
        border: "2px solid #3d3248",
        boxShadow: "2px 2px 0px #3d3248",
        color: "#3d3248",
      }}
    >
      {children}
    </span>
  );
}
