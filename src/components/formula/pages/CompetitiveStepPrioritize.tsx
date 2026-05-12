import { NarrativeDisplay } from "@/components/formula/NarrativeDisplay";

interface Props {
  selected: string[];
  priority: string[];
  onToggle: (word: string) => void;
  onBack: () => void;
  onNext: () => void;
}

/**
 * Step 4 — Prioritize. Top 6 from selected words become the operating system
 * stack. Generates a synthesis sentence using NarrativeDisplay. Direct port
 * of source Step 4 (GPS-FORMULA-04-19-v80.jsx step===4 block, lines
 * 4344–4396).
 */
export function CompetitiveStepPrioritize({
  selected,
  priority,
  onToggle,
  onBack,
  onNext,
}: Props) {
  const canProceed = priority.length >= 3;

  return (
    <div className="bg-card border border-border p-6 mb-5">
      <div className="text-gold text-[16px] font-black tracking-[1px] mb-1.5">
        Rank your top 6 — in order of importance
      </div>
      <p className="text-muted-foreground text-[13px] leading-[1.8] mb-5">
        These 6 become your company's operating system. When any employee faces a decision, they
        run it through this stack. The order matters — word 1 is your highest conviction.
      </p>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <div className="text-muted-foreground text-[9px] tracking-[2px] font-bold mb-2.5">
            YOUR SELECTED WORDS
          </div>
          <div className="flex flex-wrap gap-1">
            {selected.map((w) => {
              const inPriority = priority.includes(w);
              return (
                <button
                  key={w}
                  type="button"
                  onClick={() => onToggle(w)}
                  className={`px-3 py-1.5 text-[9px] font-${
                    inPriority ? "bold" : "normal"
                  } cursor-pointer border ${
                    inPriority
                      ? "bg-gold/[0.06] border-gold/80 text-gold"
                      : "bg-transparent border-gold/20 text-gold/40 hover:border-gold hover:text-gold"
                  }`}
                >
                  {w}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="text-muted-foreground text-[9px] tracking-[2px] font-bold mb-2.5">
            YOUR TOP 6 — <span className="text-gold">{priority.length}/6 selected</span>
          </div>
          {[1, 2, 3, 4, 5, 6].map((n) => {
            const w = priority[n - 1];
            return (
              <div
                key={n}
                className="flex items-center gap-3 py-2.5 border-b border-gold/10"
              >
                <span
                  className={`text-gold text-[18px] font-black min-w-[24px] ${
                    w ? "opacity-60" : "opacity-15"
                  }`}
                >
                  {n}
                </span>
                {w ? (
                  <div className="flex justify-between flex-1">
                    <span className="text-gold text-[12px] font-bold">{w}</span>
                    <button
                      type="button"
                      onClick={() => onToggle(w)}
                      className="bg-transparent border-none text-muted-foreground cursor-pointer hover:text-foreground"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-[11px] italic">
                    Click a word to add…
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {priority.length === 6 && (
        <div className="mt-6 bg-card border border-gold/30 border-t-2 border-t-gold">
          <div className="px-5 py-3 border-b border-gold/15">
            <div className="text-gold/70 text-[9px] font-extrabold tracking-[2.5px]">
              YOUR INNOVATION DEFINITION — GESTALT INTELLIGENCE SYNTHESIS
            </div>
          </div>
          <div className="px-6 py-5">
            <NarrativeDisplay
              text={`When collectively defining [INNOVATION], your team agreed that being [${priority[0]}] is the starting point. Achieving success requires being [${priority[1]}], delivered with [${priority[2]}] and [${priority[3]}] — always balancing [${priority[4]}] with [${priority[5]}].`}
            />
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-5">
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
          NEXT — COMPETITIVE ANALYSIS →
        </button>
      </div>
    </div>
  );
}
