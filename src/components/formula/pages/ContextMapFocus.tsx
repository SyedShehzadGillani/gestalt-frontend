import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { NarrativeDisplay } from "@/components/formula/NarrativeDisplay";
import { CTX_DIMS, type CtxKey } from "@/components/formula/formula-data";

interface Props {
  focusDimKey: CtxKey | null;
  setFocusDimKey: (key: CtxKey | null) => void;
  onExit: () => void;
  companyName: string;
  brandNarrative: string;
  identitySynthesis: string | null;
  /** A `<ContextMapCard>` for either one focused dim or all dims. */
  cardSlot: ReactNode;
}

/**
 * Full-screen FOCUS MODE overlay. Shows a single dimension card or all five,
 * with prev/next slide arrows and the brand-narrative reference panel.
 * Direct port of source v80 (lines 4156–4232).
 */
export function ContextMapFocus({
  focusDimKey,
  setFocusDimKey,
  onExit,
  companyName,
  brandNarrative,
  identitySynthesis,
  cardSlot,
}: Props) {
  const [refOpen, setRefOpen] = useState(true);
  const idx = focusDimKey ? CTX_DIMS.findIndex((d) => d.key === focusDimKey) : -1;
  const hasPrev = idx > 0;
  const hasNext = idx >= 0 && idx < CTX_DIMS.length - 1;
  const focusedDim = focusDimKey ? CTX_DIMS.find((d) => d.key === focusDimKey) : null;

  return (
    <div className="fixed inset-0 bg-background z-[1000] overflow-auto">
      {focusDimKey && (
        <button
          type="button"
          onClick={() => hasPrev && setFocusDimKey(CTX_DIMS[idx - 1].key)}
          className={`fixed left-0 top-1/2 -translate-y-1/2 w-16 h-[180px] border-r border-border text-[44px] z-[1001] flex items-center justify-center ${
            hasPrev
              ? "bg-card text-gold cursor-pointer opacity-100"
              : "bg-transparent text-muted-foreground opacity-15 cursor-default"
          }`}
        >
          ‹
        </button>
      )}
      {focusDimKey && (
        <button
          type="button"
          onClick={() => hasNext && setFocusDimKey(CTX_DIMS[idx + 1].key)}
          className={`fixed right-0 top-1/2 -translate-y-1/2 w-16 h-[180px] border-l border-border text-[44px] z-[1001] flex items-center justify-center ${
            hasNext
              ? "bg-card text-gold cursor-pointer opacity-100"
              : "bg-transparent text-muted-foreground opacity-15 cursor-default"
          }`}
        >
          ›
        </button>
      )}

      <div className="max-w-[860px] mx-auto px-6 pt-8 pb-20">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div>
            <div className="text-gold text-[9px] font-extrabold tracking-[3px]">
              CONTEXT MAP — FOCUS MODE
            </div>
            <div
              className="text-[18px] font-black mt-1"
              style={{ color: focusedDim?.color ?? "hsl(var(--foreground))" }}
            >
              {focusedDim ? focusedDim.label : companyName}
            </div>
            {focusDimKey && (
              <div className="flex gap-1.5 mt-2">
                {CTX_DIMS.map((d) => (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => setFocusDimKey(d.key)}
                    className="w-2 h-2 rounded-full p-0 cursor-pointer border"
                    style={{
                      borderColor: d.color,
                      background: d.key === focusDimKey ? d.color : "transparent",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {focusDimKey && (
              <button
                type="button"
                onClick={() => setFocusDimKey(null)}
                className="bg-transparent border border-border text-muted-foreground px-3.5 py-[7px] text-[9px] font-bold tracking-[2px] cursor-pointer"
              >
                ALL DIMENSIONS
              </button>
            )}
            <button
              type="button"
              onClick={onExit}
              className="bg-transparent border border-border text-muted-foreground px-4 py-[7px] text-[9px] font-bold tracking-[2px] cursor-pointer"
            >
              ✕ EXIT FOCUS MODE
            </button>
          </div>
        </div>

        {/* Brand narrative reference */}
        {brandNarrative && (
          <div className="mb-6 border border-gold/25 border-t-2 border-t-gold">
            <button
              type="button"
              onClick={() => setRefOpen((o) => !o)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-card cursor-pointer select-none"
            >
              <span className="text-gold text-[9px] font-extrabold tracking-[2.5px]">
                YOUR BRAND NARRATIVE — REFERENCE WHILE YOU WRITE
              </span>
              <ChevronDown
                className={`w-3 h-3 text-gold/70 transition-transform ${
                  refOpen ? "rotate-0" : "-rotate-90"
                }`}
              />
            </button>
            {refOpen && (
              <div className="px-5 py-4 bg-background border-t border-gold/15">
                <NarrativeDisplay text={brandNarrative} />
              </div>
            )}
          </div>
        )}

        {cardSlot}

        {!focusDimKey && identitySynthesis && (
          <div className="px-6 py-5 bg-card border-2 border-gold">
            <div className="text-gold text-[9px] font-extrabold tracking-[2px] mb-2.5">
              IDENTITY SYNTHESIS
            </div>
            <NarrativeDisplay text={identitySynthesis} />
          </div>
        )}
      </div>
    </div>
  );
}
