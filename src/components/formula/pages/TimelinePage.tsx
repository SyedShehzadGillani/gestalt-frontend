import { useState } from "react";
import { LAUNCH_MILESTONES, LAUNCH_PHASES } from "@/components/formula/formula-data";
import { FormulaPageHeader } from "@/components/formula/FormulaPageHeader";
import { FormulaReport } from "@/components/formula/pages/FormulaReport";
import type { TriggerAi } from "@/components/formula/page-types";

interface Props {
  onAi: TriggerAi;
}

/** 04.10 — Launch Action Plan. 8 milestones across 4 phases. */
export function TimelinePage({ onAi }: Props) {
  const [formulaDone, setFormulaDone] = useState(false);

  if (formulaDone) {
    return <FormulaReport onEdit={() => setFormulaDone(false)} />;
  }

  return (
    <div>
      <FormulaPageHeader pageId="04.10" />

      <div className="grid grid-cols-4 gap-0.5 mb-5">
        {LAUNCH_PHASES.map((p) => (
          <div
            key={p.n}
            className={`text-center py-2.5 px-3 border ${p.colorClass.replace("bg-", "bg-").replace(/text-(\S+)/, "text-$1")}`}
          >
            <div className="text-[18px] font-black leading-none">{p.n}</div>
            <div className="text-[7px] font-extrabold tracking-[2px] mt-1">{p.label}</div>
          </div>
        ))}
      </div>

      <div className="border-l-2 border-gold pl-5">
        {LAUNCH_MILESTONES.map((m, i) => {
          const phase = LAUNCH_PHASES.find((p) => p.n === m.phase);
          const dotClass = phase?.colorClass.split(" ").find((c) => c.startsWith("bg-")) || "bg-gold";
          const labelClass = phase?.colorClass.split(" ").find((c) => c.startsWith("text-")) || "text-gold";
          return (
            <div key={i} className="mb-5 relative">
              <div
                className={`absolute -left-[26px] top-1.5 w-2.5 h-2.5 border-2 border-background ${dotClass}`}
              />
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[8px] font-bold tracking-[1.5px] ${labelClass}`}>{m.time}</span>
                <span
                  className={`px-1.5 py-px text-[7px] font-bold tracking-[1px] border ${phase?.colorClass}`}
                >
                  PHASE {m.phase}
                </span>
              </div>
              <div className="text-foreground text-[15px] font-extrabold mb-1.5">{m.label}</div>
              <p className="text-muted-foreground text-[13px] leading-[1.7] mb-2.5">{m.description}</p>
              <div className="flex gap-1.5">
                <input
                  placeholder="Owner..."
                  className="flex-1 bg-background border border-border text-foreground px-2 py-1 text-[10px] outline-none focus:border-gold"
                />
                <input
                  placeholder="Status..."
                  className="w-24 bg-background border border-border text-foreground px-2 py-1 text-[10px] outline-none focus:border-gold"
                />
                <input type="checkbox" className="accent-gold" title="Complete" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 px-4 py-3.5 bg-gold/[0.06] border border-gold">
        <div className="text-gold text-[10px] font-extrabold tracking-[2px] mb-1.5">FORMULA IS COMPLETE</div>
        <div className="text-muted-foreground text-[11px] leading-[1.6]">
          Your Brand Interaction Strategy Guide is now documented, signed off, and executable. GESTALT
          INTELLIGENCE will generate daily priorities, flag when milestones slip, and recalibrate the
          timeline based on your actual performance data.
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setFormulaDone(true);
          onAi({
            context: "FORMULA COMPLETE — LAUNCH PLAN APPROVED",
            text:
              "Launch Action Plan finalized. 8 milestones across 4 phases. GESTALT INTELLIGENCE now monitors every phase against documented objectives.\n\nYour FORMULA is the most valuable document your company has ever produced. It is the brief for every campaign, the benchmark for every employee, and the proof of value for every buyer.\n\nThe knowledge documented here will never be lost. Ask me anything.",
            needsConfirm: true,
            metrics: [
              { label: "PHASES", value: "4", color: "hsl(var(--gold))" },
              { label: "MILESTONES", value: "8", color: "hsl(var(--success))" },
              { label: "FORMULA", value: "COMPLETE", color: "hsl(var(--success))" },
            ],
          });
        }}
        className="w-full bg-success text-black px-6 py-3 text-[11px] tracking-[3px] font-extrabold cursor-pointer mt-3.5 hover:bg-success/90"
      >
        ✓ LAUNCH PLAN APPROVED — FORMULA COMPLETE
      </button>
    </div>
  );
}
