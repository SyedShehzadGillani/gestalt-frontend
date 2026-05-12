import { AUDIENCES, JOURNEY_STAGES } from "@/components/formula/formula-data";
import { FormulaPageHeader } from "@/components/formula/FormulaPageHeader";
import { FormulaCard } from "@/components/formula/FormulaCard";
import { FormulaField } from "@/components/formula/FormulaField";
import { SDIBadges } from "@/components/formula/SDIBadges";
import type { TriggerAi } from "@/components/formula/page-types";

interface Props {
  onAi: TriggerAi;
}

/** 02.10 — Target Audiences. Each audience gets BP/VP + 7-stage Think-Feel-Do. */
export function AudiencesPage({ onAi }: Props) {
  return (
    <div>
      <FormulaPageHeader pageId="02.10" />
      {AUDIENCES.map((a) => (
        <FormulaCard key={a.name} className="mb-3.5">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <span className="text-gold text-[32px] font-black opacity-10">
                {String(a.priority).padStart(2, "0")}
              </span>
              <div>
                <div className="text-foreground text-[18px] font-extrabold tracking-[1px]">{a.name}</div>
                <div className="text-muted-foreground text-[12px] mt-0.5">{a.description}</div>
              </div>
            </div>
            <SDIBadges types={a.sdi} />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <FormulaField label="BRAND PROMISE" placeholder="Emotional commitment — one headline sentence" multiline />
            <FormulaField label="VALUE PROPOSITION" placeholder="Rational justification — why choosing you is smart" multiline />
          </div>

          <div className="border-t border-border pt-4">
            <div className="text-muted-foreground text-[10px] tracking-[2px] font-bold mb-3">
              BEHAVIOR MODEL — 7-STAGE JOURNEY
            </div>
            <div className="grid grid-cols-7 gap-[3px]">
              {JOURNEY_STAGES.map((stage) => (
                <div key={stage.id}>
                  <div className="text-center mb-1 py-1" style={{ background: stage.color }}>
                    <span className="text-white text-[7px] font-extrabold tracking-[0.5px]">
                      {stage.label}
                    </span>
                  </div>
                  <textarea
                    placeholder="Think / Feel / Do"
                    className="w-full bg-background border border-border text-foreground p-1.5 text-[10px] outline-none resize-none overflow-hidden leading-[1.6] focus:border-gold"
                    style={{ minHeight: 60 }}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              onAi({
                context: `AUDIENCE: ${a.name}`,
                text: `${a.name} mapped. S+D+I: ${a.sdi.join("+")}. Watch the Behavior Model — TRIGGER stage is where most strategies fall apart because teams assume awareness exists. Cross-referencing against Campaign Outlets for full coverage.`,
                needsConfirm: true,
                metrics: [
                  { label: "S+D+I", value: a.sdi.join("+"), color: "hsl(var(--gold))" },
                  { label: "PRIORITY", value: `#${a.priority}`, color: "hsl(var(--foreground))" },
                ],
              })
            }
            className="bg-transparent border border-gold text-gold px-5 py-2.5 text-[10px] tracking-[2px] font-bold cursor-pointer mt-4 hover:bg-gold/10"
          >
            CONFIRM {a.name} → AI REVIEW
          </button>
        </FormulaCard>
      ))}
      <button
        type="button"
        className="w-full p-3.5 bg-transparent border border-dashed border-border text-muted-foreground text-[11px] tracking-[2px] cursor-pointer mt-2 hover:text-foreground hover:border-gold/40"
      >
        + ADD AUDIENCE
      </button>
    </div>
  );
}
