import { type ChangeEvent } from "react";
import { AutoTextarea } from "@/components/formula/AutoTextarea";

interface Props {
  label?: string;
  value?: string;
  onChange?: (next: string) => void;
  placeholder?: string;
  multiline?: boolean;
  small?: boolean;
}

/** Labeled input or auto-growing textarea — port of source `Field`. */
export function FormulaField({ label, value, onChange, placeholder, multiline, small }: Props) {
  const labelEl = label ? (
    <label className="block text-foreground text-[11px] tracking-[2px] font-bold mb-1.5">
      {label}
    </label>
  ) : null;

  const wrapperClass = small ? "mb-2" : "mb-4";

  if (multiline) {
    return (
      <div className={wrapperClass}>
        {labelEl}
        <AutoTextarea
          value={value || ""}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange?.(e.target.value)}
          placeholder={placeholder}
          minHeight={small ? 52 : 80}
          className={small ? "text-[12px] py-1.5 px-2.5" : ""}
        />
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      {labelEl}
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-background border border-border text-foreground outline-none focus:border-gold leading-[1.7] ${
          small ? "px-2.5 py-1.5 text-[12px]" : "px-3 py-2.5 text-[13px]"
        }`}
      />
    </div>
  );
}
