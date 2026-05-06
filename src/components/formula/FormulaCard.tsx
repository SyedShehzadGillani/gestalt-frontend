import { type CSSProperties, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  /** Allows callers to override padding/margin via Tailwind. */
  innerClassName?: string;
  style?: CSSProperties;
}

/**
 * Hoverable card — direct port of the source `Card` helper.
 * Background swaps from `bg-card` to a translucent overlay on hover, and the
 * border switches to a soft gold tone. Click opt-in via `onClick`.
 */
export function FormulaCard({ children, onClick, className = "", innerClassName = "p-6", style }: Props) {
  const interactive = typeof onClick === "function";
  const Tag = interactive ? "button" : "div";
  return (
    <Tag
      type={interactive ? "button" : undefined}
      onClick={onClick}
      style={style}
      className={`block w-full text-left bg-card border border-border hover:bg-foreground/[0.03] hover:border-gold/40 transition-all duration-200 ${
        interactive ? "cursor-pointer" : "cursor-default"
      } ${innerClassName} ${className}`}
    >
      {children}
    </Tag>
  );
}
