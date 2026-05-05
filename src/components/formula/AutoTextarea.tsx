import { type ChangeEvent, useEffect, useRef } from "react";

interface Props {
  value: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minHeight?: number;
  rows?: number;
}

/**
 * Auto-expanding textarea — grows with content, no internal scroll.
 * Direct port of source `AutoTextarea`. Sets `style.height` imperatively
 * because Tailwind cannot express dynamic height-from-scrollHeight.
 */
export function AutoTextarea({ value, onChange, placeholder, className = "", disabled, minHeight = 80, rows }: Props) {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = `${Math.max(minHeight, ref.current.scrollHeight)}px`;
  });
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
      style={{ minHeight }}
      className={`w-full bg-background border border-border text-foreground px-3 py-2.5 text-[13px] leading-[1.7] outline-none focus:border-gold resize-none overflow-hidden ${className}`}
    />
  );
}
