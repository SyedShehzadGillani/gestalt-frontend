import { CompetitorWordBoard } from "@/components/formula/CompetitorWordBoard";
import type { CompetitorMock } from "@/components/formula/formula-data";

interface Props {
  competitors: CompetitorMock[];
  activeId: string;
  onSetActive: (id: string) => void;
  onUpdate: (id: string, patch: Partial<CompetitorMock>) => void;
  onBack: () => void;
  onNext: () => void;
}

/**
 * Step 5 — Competitive Analysis. Three competitors get named, locked, and
 * each gets a CompetitorWordBoard for top-5 ranking + AI narrative. Direct
 * port of source Step 5 (GPS-FORMULA-04-19-v80.jsx step===5 block, lines
 * 4398–4509).
 */
export function CompetitiveStepCompetitors({
  competitors,
  activeId,
  onSetActive,
  onUpdate,
  onBack,
  onNext,
}: Props) {
  const canProceed = competitors.every((c) => c.locked && c.top5.length >= 5);

  return (
    <div className="bg-card border border-border p-6 mb-5">
      <div className="text-foreground text-[20px] font-black tracking-[2px] mb-2">
        STEP 5 — COMPETITIVE ANALYSIS
      </div>
      <p className="text-muted-foreground text-[13px] leading-[1.8] mb-5">
        Name up to 3 competitors. For each one, select the words that describe how the market
        perceives them, rank their top 5, and let GESTALT INTELLIGENCE write the competitive
        narrative.
      </p>

      <div className="grid grid-cols-3 gap-2.5 mb-6">
        {competitors.map((comp, i) => {
          const isActive = activeId === comp.id;
          const borderColor = comp.locked ? comp.color : isActive ? comp.color : undefined;
          return (
            <div
              key={comp.id}
              onClick={() => onSetActive(comp.id)}
              className="p-4 bg-background border cursor-pointer transition-colors"
              style={{ borderColor: borderColor ?? "hsl(var(--border))" }}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-2.5 h-2.5" style={{ background: comp.color }} />
                <span
                  className="text-[8px] font-extrabold tracking-[1px]"
                  style={{ color: comp.color }}
                >
                  COMPETITOR {i + 1}
                </span>
                {comp.locked && (
                  <span
                    className="ml-auto text-[7px] font-extrabold tracking-[1.5px]"
                    style={{ color: comp.color }}
                  >
                    ✓ LOCKED
                  </span>
                )}
              </div>

              {comp.locked ? (
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-[12px] font-extrabold flex-1"
                    style={{ color: comp.color }}
                  >
                    {comp.name}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdate(comp.id, { locked: false });
                    }}
                    className="px-2 py-0.5 bg-transparent border text-[7px] font-extrabold tracking-[1.5px] cursor-pointer"
                    style={{ borderColor: `${comp.color}50`, color: comp.color }}
                  >
                    EDIT
                  </button>
                </div>
              ) : (
                <>
                  <input
                    value={comp.name === `COMPETITOR ${["A", "B", "C"][i]}` ? "" : comp.name}
                    onChange={(e) =>
                      onUpdate(comp.id, { name: e.target.value.toUpperCase() })
                    }
                    onClick={(e) => e.stopPropagation()}
                    placeholder={`ENTER COMPETITOR ${["A", "B", "C"][i]}`}
                    className="w-full bg-card border border-gold/20 text-foreground px-2.5 py-1.5 text-[11px] outline-none mb-2 focus:border-gold"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const trimmed = comp.name.trim();
                      const placeholderName = `COMPETITOR ${["A", "B", "C"][i]}`;
                      if (trimmed && trimmed !== placeholderName) {
                        onUpdate(comp.id, { locked: true });
                      }
                    }}
                    className="w-full py-1.5 text-[8px] font-extrabold tracking-[1.5px] cursor-pointer border transition-colors"
                    style={{
                      background:
                        comp.name.trim() && comp.name !== `COMPETITOR ${["A", "B", "C"][i]}`
                          ? `${comp.color}18`
                          : "transparent",
                      borderColor:
                        comp.name.trim() && comp.name !== `COMPETITOR ${["A", "B", "C"][i]}`
                          ? comp.color
                          : "hsl(var(--border))",
                      color:
                        comp.name.trim() && comp.name !== `COMPETITOR ${["A", "B", "C"][i]}`
                          ? comp.color
                          : "hsl(var(--muted-foreground))",
                    }}
                  >
                    {comp.name.trim() && comp.name !== `COMPETITOR ${["A", "B", "C"][i]}`
                      ? "LOCK IN →"
                      : "ENTER NAME FIRST"}
                  </button>
                </>
              )}

              <div
                className="mt-2 text-[8px]"
                style={{
                  color:
                    comp.top5.length >= 3 ? comp.color : "hsl(var(--muted-foreground))",
                }}
              >
                {comp.top5.length >= 3
                  ? `${comp.top5.length} words ranked`
                  : "Word board incomplete"}
              </div>
            </div>
          );
        })}
      </div>

      {competitors
        .filter((c) => c.id === activeId && c.locked)
        .map((comp) => (
          <div key={comp.id} className="mb-4">
            <CompetitorWordBoard
              competitor={comp}
              onUpdate={(patch) => onUpdate(comp.id, patch)}
            />
          </div>
        ))}

      {competitors
        .filter((c) => c.id === activeId && !c.locked)
        .map((comp) => (
          <div
            key={comp.id}
            className="px-8 py-6 bg-card border-t-2 mb-4 text-center"
            style={{ borderColor: `${comp.color}30`, borderTopColor: comp.color }}
          >
            <div className="text-[12px] font-bold mb-1.5" style={{ color: comp.color }}>
              Lock in a name above to begin the word board for this competitor.
            </div>
            <div className="text-muted-foreground text-[10px]">
              Enter the name, then click LOCK IN →
            </div>
          </div>
        ))}

      <div className="flex gap-2 mt-2">
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
          disabled={!canProceed}
          className={`flex-1 px-5 py-2.5 text-[10px] font-extrabold tracking-[2px] border ${
            canProceed
              ? "bg-gold border-gold text-black cursor-pointer hover:bg-gold/90"
              : "bg-transparent border-border text-muted-foreground cursor-not-allowed opacity-50"
          }`}
        >
          {canProceed
            ? "NEXT — PLACE ON SPECTRUM →"
            : `COMPLETE ALL COMPETITORS (${
                competitors.filter((c) => c.locked && c.top5.length >= 5).length
              }/3)`}
        </button>
      </div>
    </div>
  );
}
