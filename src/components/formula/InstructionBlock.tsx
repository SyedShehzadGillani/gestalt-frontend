import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  text: string | undefined;
}

/**
 * Collapsible instruction block. Default collapsed → single-line teaser.
 * Click expands to reveal the full guidance.
 */
export function InstructionBlock({ text }: Props) {
  const [open, setOpen] = useState(false);
  if (!text) return null;
  return (
    <div className={open ? "mb-7" : "mb-4"}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 cursor-pointer select-none py-1.5 text-left"
      >
        <span className="text-gold text-[9px] font-extrabold tracking-[3px]">
          {open ? "INSTRUCTIONS" : "▸ INSTRUCTIONS"}
        </span>
        <div className="flex-1 h-px bg-gold/20" aria-hidden />
        <ChevronDown
          className={`w-3.5 h-3.5 text-gold opacity-60 transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      {open && (
        <div className="bg-gold/[0.05] border-l-[3px] border-gold/40 px-6 py-4 mt-2">
          <p className="text-gold text-[15px] leading-[1.9] font-normal">{text}</p>
        </div>
      )}
    </div>
  );
}
