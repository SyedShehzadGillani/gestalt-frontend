import { BARRIERS } from "@/components/formula/formula-data";
import { FormulaPageHeader } from "@/components/formula/FormulaPageHeader";
import { FormulaCard } from "@/components/formula/FormulaCard";
import { FormulaField } from "@/components/formula/FormulaField";
import type { TriggerAi } from "@/components/formula/page-types";

interface Props {
  onAi: TriggerAi;
}

/** 01.30 — Barriers & Challenges. */
export function BarriersPage({ onAi }: Props) {
  return (
    <div>
      <FormulaPageHeader pageId="01.30" />
      <p className="text-muted-foreground text-[14px] leading-[1.8] max-w-[660px] mb-8">
        We can't solve problems we can't name. Strategy requires confronting the good, the bad, and
        the ugly. Each barrier maps to your Business Objectives — unresolved barriers mean flat
        spectrum markers and flat exit multiples.
      </p>

      {BARRIERS.map((b, idx) => {
        const sevColor = b.severity === "high" ? "#e3398c" : "#c45c00";
        const sevLabel = b.severity === "high" ? "HIGH RISK" : "MEDIUM RISK";
        return (
          <FormulaCard key={b.category} className="mb-3">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2.5">
                <span
                  className="text-[9px] font-bold tracking-[2px] px-2 py-0.5"
                  style={{ color: sevColor, border: `1px solid ${sevColor}` }}
                >
                  {sevLabel}
                </span>
                <span className="text-foreground text-[14px] font-extrabold tracking-[1px]">
                  {b.category}
                </span>
              </div>
              <span className="text-muted-foreground text-[32px] font-black opacity-[0.06]">
                {String(idx + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <div className="text-muted-foreground text-[10px] tracking-[2px] font-bold mb-2.5">
                  ROOT ISSUES
                </div>
                {b.items.map((item) => (
                  <div key={item} className="flex items-center gap-2 mb-2">
                    <span className="text-[9px]" style={{ color: sevColor }}>◆</span>
                    <input
                      defaultValue={item}
                      className="flex-1 bg-background border border-border text-foreground px-2.5 py-2 text-[13px] outline-none focus:border-gold"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="bg-transparent border-none text-muted-foreground text-[11px] cursor-pointer tracking-[1px] py-1.5 hover:text-foreground"
                >
                  + DIG DEEPER
                </button>
              </div>

              <div>
                <FormulaField label="STRATEGY TO RESOLVE" placeholder="How will you address this?" multiline />
                <FormulaField label="LINKED OBJECTIVE" placeholder="Which objective does this threaten?" small />
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                onAi({
                  context: `BARRIER: ${b.category}`,
                  text: `"${b.category}" — root-level constraint threatening your spectrum position. Creates drag on Innovation and costs you trust with your Primary Customer audience. Companies addressing this barrier see 15-22% improvement in retention within 90 days.`,
                  needsConfirm: true,
                  metrics: [
                    { label: "RISK", value: b.severity.toUpperCase(), color: sevColor },
                    { label: "IMPACT", value: "SPECTRUM", color: "hsl(var(--gold))" },
                  ],
                })
              }
              className="bg-transparent border border-gold text-gold px-5 py-2.5 text-[10px] tracking-[2px] font-bold cursor-pointer mt-3.5 flex items-center gap-1.5 hover:bg-gold/10"
            >
              CONFIRM {b.category}{" "}
              <span className="text-muted-foreground text-[9px] font-normal">→ AI REVIEW</span>
            </button>
          </FormulaCard>
        );
      })}

      <button
        type="button"
        className="w-full p-3.5 bg-transparent border border-dashed border-border text-muted-foreground text-[11px] tracking-[2px] cursor-pointer mt-2 hover:text-foreground hover:border-gold/40"
      >
        + ADD BARRIER
      </button>
    </div>
  );
}
