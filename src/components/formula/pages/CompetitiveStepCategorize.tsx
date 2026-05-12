interface Props {
  selected: string[];
  cats: { core: string[]; supporting: string[]; aspirational: string[] };
  onAssign: (word: string, cat: "core" | "supporting" | "aspirational") => void;
  onRemove: (word: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const CATS: Array<{
  key: "core" | "supporting" | "aspirational";
  label: string;
  color: string;
  desc: string;
}> = [
  { key: "core", label: "CORE DNA", color: "hsl(var(--gold))", desc: "Non-negotiable. This IS who you are." },
  { key: "supporting", label: "SUPPORTING", color: "#888888", desc: "Amplifies the core. How you deliver." },
  { key: "aspirational", label: "ASPIRATIONAL", color: "#a855f7", desc: "What you're reaching for. The vision." },
];

/**
 * Step 2 of the Competitive Landscape 7-step flow. The 10 words selected in
 * Phase B get bucketed into CORE DNA / SUPPORTING / ASPIRATIONAL. Direct
 * port of source Step 2 (GPS-FORMULA-04-19-v80.jsx step===2 block, lines
 * around 3700–3830).
 */
export function CompetitiveStepCategorize({
  selected,
  cats,
  onAssign,
  onRemove,
  onBack,
  onNext,
}: Props) {
  const placed = new Set([...cats.core, ...cats.supporting, ...cats.aspirational]);
  const unplaced = selected.filter((w) => !placed.has(w));

  return (
    <div className="bg-card border border-border p-6 mb-5">
      <div className="text-gold text-[10px] tracking-[3px] font-extrabold mb-1.5">
        STEP 2 — CATEGORIZE YOUR WORDS
      </div>
      <div className="text-muted-foreground text-[12px] leading-[1.7] mb-4 italic">
        Sort the 10 words you picked into three buckets — CORE DNA, SUPPORTING, and ASPIRATIONAL.
        A clean map of what is true today versus what you're reaching for is the foundation of an
        honest brand.
      </div>

      {unplaced.length > 0 && (
        <div className="mb-5">
          <div className="text-muted-foreground text-[10px] tracking-[2px] font-bold mb-2">
            UNASSIGNED — {unplaced.length}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {unplaced.map((w) => (
              <div
                key={w}
                className="px-2.5 py-1 bg-background border border-border text-foreground text-[10px] font-semibold tracking-[1px]"
              >
                {w}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {CATS.map((c) => (
          <div
            key={c.key}
            className="p-4 bg-background border-t-2"
            style={{ borderColor: "hsl(var(--border))", borderTopColor: c.color }}
          >
            <div
              className="text-[10px] font-extrabold tracking-[2px] mb-1"
              style={{ color: c.color }}
            >
              {c.label}
            </div>
            <div className="text-muted-foreground text-[9px] mb-3">{c.desc}</div>

            <div className="flex flex-wrap gap-1 min-h-[40px] mb-3">
              {cats[c.key].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => onRemove(w)}
                  className="px-2 py-0.5 text-[9px] font-bold tracking-[1px] cursor-pointer border"
                  style={{ background: `${c.color}18`, borderColor: c.color, color: c.color }}
                >
                  {w} ×
                </button>
              ))}
            </div>

            <div className="text-muted-foreground text-[8px] tracking-[1.5px] font-bold mb-2">
              ASSIGN
            </div>
            <div className="flex flex-wrap gap-1">
              {unplaced.map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => onAssign(w, c.key)}
                  className="px-2 py-0.5 text-[9px] font-semibold tracking-[1px] cursor-pointer border border-border text-muted-foreground hover:text-foreground hover:border-gold"
                >
                  + {w}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-6">
        <button
          type="button"
          onClick={onBack}
          className="bg-transparent border border-border text-muted-foreground px-5 py-2.5 text-[10px] cursor-pointer hover:border-gold hover:text-gold"
        >
          ← BACK
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 bg-gold border-none text-black px-5 py-2.5 text-[10px] font-extrabold tracking-[2px] cursor-pointer hover:bg-gold/90"
        >
          NEXT — PRIORITIZE →
        </button>
      </div>
    </div>
  );
}
