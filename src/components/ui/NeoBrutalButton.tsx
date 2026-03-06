import { type ReactNode } from "react";

interface NeoBrutalButtonProps {
  children: ReactNode;
  href?: string;
  download?: string;
  onClick?: () => void;
  color?: string;
  rotate?: string;
  className?: string;
  target?: string;
  rel?: string;
}

export function NeoBrutalButton({
  children,
  href,
  download,
  onClick,
  color = "#a78bcd",
  rotate = "-1deg",
  className = "",
  target,
  rel,
}: NeoBrutalButtonProps) {
  const baseClassName = `rounded-xl px-8 py-3.5 text-sm font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#3d3248] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_#3d3248] ${className}`;

  const baseStyle = {
    background: color,
    color: "#ffffff",
    border: "3px solid #3d3248",
    boxShadow: "4px 4px 0px #3d3248",
    transform: `rotate(${rotate})`,
  };

  if (href) {
    return (
      <a
        href={href}
        download={download}
        target={target}
        rel={rel}
        className={baseClassName}
        style={baseStyle}
      >
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={baseClassName} style={baseStyle}>
      {children}
    </button>
  );
}
