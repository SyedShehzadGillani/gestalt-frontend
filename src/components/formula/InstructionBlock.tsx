import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  text: string | undefined;
}

const HEADER_RE = /^[A-Z][A-Z\s/\-—:.'’&™.]+$/;
const STEP_RE = /^Step \d/;
const BOLD_SPLIT = /(\*\*[^*]+\*\*)/g;

function renderInline(line: string): ReactNode[] {
  return line.split(BOLD_SPLIT).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-gold font-extrabold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function renderRich(raw: string): ReactNode[] {
  const lines = raw.split("\n").filter((l) => l.trim() !== "");
  return lines.map((line, i) => {
    const trimmed = line.trim();

    if (HEADER_RE.test(trimmed) && trimmed.length > 3) {
      return (
        <div
          key={i}
          className="text-gold font-extrabold tracking-[3px]"
          style={{ fontSize: 13, marginTop: i > 0 ? 24 : 0, marginBottom: 8 }}
        >
          {trimmed}
        </div>
      );
    }

    if (STEP_RE.test(trimmed)) {
      const dashIdx = trimmed.indexOf("—");
      const head = dashIdx > 0 ? trimmed.slice(0, dashIdx + 1) : trimmed.split(".")[0] + ".";
      const tail = dashIdx > 0 ? trimmed.slice(dashIdx + 1) : trimmed.split(".").slice(1).join(".");
      return (
        <div key={i} style={{ marginTop: 16, marginBottom: 4 }}>
          <span className="text-gold font-extrabold" style={{ fontSize: 14 }}>
            {head}
          </span>
          <span className="text-muted-foreground" style={{ fontSize: 13, lineHeight: 1.8 }}>
            {renderInline(tail)}
          </span>
        </div>
      );
    }

    return (
      <div
        key={i}
        className="text-gold/80"
        style={{ fontSize: 13, lineHeight: 1.9, marginBottom: 4 }}
      >
        {renderInline(trimmed)}
      </div>
    );
  });
}

/**
 * Collapsible instruction block. Rich-text parser:
 * ALL CAPS line  → gold header
 * "Step N — …"   → gold prefix + body
 * **bold**       → gold strong
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
          {renderRich(text)}
        </div>
      )}
    </div>
  );
}
