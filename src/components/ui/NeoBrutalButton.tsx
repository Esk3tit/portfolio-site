import { type ReactNode, useCallback, useRef } from "react";

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
  const ref = useRef<HTMLElement>(null);

  const baseClassName = `rounded-xl px-6 py-3.5 min-h-[44px] sm:min-h-0 sm:px-8 text-sm font-bold uppercase tracking-wider ${className}`;

  const baseStyle = {
    background: color,
    color: "#ffffff",
    border: "3px solid #3d3248",
    boxShadow: "4px 4px 0px #3d3248",
    transform: `rotate(${rotate})`,
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  };

  const onEnter = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `rotate(${rotate}) translateY(-3px)`;
    el.style.boxShadow = "6px 6px 0px #3d3248";
  }, [rotate]);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `rotate(${rotate})`;
    el.style.boxShadow = "4px 4px 0px #3d3248";
  }, [rotate]);

  const onDown = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `rotate(${rotate}) translate(2px, 2px)`;
    el.style.boxShadow = "2px 2px 0px #3d3248";
  }, [rotate]);

  const props = {
    ref: ref as React.RefObject<HTMLAnchorElement> & React.RefObject<HTMLButtonElement>,
    className: baseClassName,
    style: baseStyle,
    "data-magnetic": true,
    onMouseEnter: onEnter,
    onMouseLeave: onLeave,
    onMouseDown: onDown,
    onMouseUp: onEnter,
  };

  if (href) {
    return (
      <a {...props} href={href} download={download} target={target} rel={rel}>
        {children}
      </a>
    );
  }

  return (
    <button {...props} onClick={onClick}>
      {children}
    </button>
  );
}
