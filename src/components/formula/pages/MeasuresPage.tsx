import { KPI_CATEGORIES } from "@/components/formula/formula-data";
import { FormulaPageHeader } from "@/components/formula/FormulaPageHeader";
import { FormulaCard } from "@/components/formula/FormulaCard";
import { SpectrumBar } from "@/components/formula/SpectrumBar";
import type { TriggerAi } from "@/components/formula/page-types";

interface Props {
  onAi: TriggerAi;
}

const SUMMARY_TEXT = `Your FORMULA is complete. Here is everything GESTALT INTELLIGENCE now knows about your organization:

━━ ALIGNING DIALOGUE ━━
▸ 01.10 Competitive Landscape: Word Exercise documented. Spectrum positions locked.
▸ 01.20 Business Objectives: Goals defined with initiatives and timelines.
▸ 01.30 Barriers & Challenges: Root causes identified and linked to objectives.

━━ BRAND EXPERIENCE ━━
▸ 02.10 Target Audiences: 3 audiences mapped across the 7-stage behavior model.
▸ 02.20 Customer Experience: R.U.D. framework defined. Think / Feel / Do complete.
▸ 02.30 Brand Architecture: Standards documented. Feeds VAULT enforcement.

━━ INTERACTION CAMPAIGNS ━━
▸ 03.10 Campaign Outlets: Channels mapped and S+D+I tagged.
▸ 03.20 Campaign Options: 6 campaigns with 7-stage lifecycle coverage.
▸ 03.30 Success Measures: KPI targets set across all 4 categories.

━━ NEXT STEPS ━━
▸ 04.10 Launch Action Plan: 8 milestones across 4 phases.

━━ WHAT THIS MEANS ━━
Your word stack is now the benchmark for every campaign.
Your brand architecture is now enforceable in VAULT.
Your 7-stage customer journey maps are live.
Your KPI targets feed your GESTALT Score.

I can now generate reports on demand, audit any vendor's work against your strategy, test creative before it goes live, and prioritize actions across every aspect of your business.

The knowledge your team documented here will never be lost. Ask me anything.`;

/** 03.30 — Success Measures. KPI grid + projected spectrum movement. */
export function MeasuresPage({ onAi }: Props) {
  return (
    <div>
      <FormulaPageHeader pageId="03.30" />

      <div className="grid grid-cols-2 gap-2 mb-5">
        {KPI_CATEGORIES.map((kpi) => (
          <FormulaCard key={kpi.category} innerClassName="p-5">
            <span className="text-gold text-[10px] tracking-[3px] font-bold">{kpi.category}</span>
            <div className="w-4 h-px bg-gold mt-1.5 mb-2" />
            {kpi.metrics.map((m) => (
              <div
                key={m}
                className="flex items-center justify-between py-1 border-b border-border last:border-b-0"
              >
                <span className="text-muted-foreground text-[9px]">{m}</span>
                <div className="flex gap-[3px]">
                  <input
                    placeholder="Target"
                    className="w-[70px] bg-background border border-border text-foreground px-2 py-1 text-[11px] outline-none text-right focus:border-gold"
                  />
                  <input
                    placeholder="Current"
                    className="w-[70px] bg-background border border-border text-gold px-2 py-1 text-[11px] outline-none text-right focus:border-gold"
                  />
                </div>
              </div>
            ))}
          </FormulaCard>
        ))}
      </div>

      <FormulaCard>
        <span className="text-gold text-[10px] tracking-[3px] font-bold">PROJECTED SPECTRUM MOVEMENT</span>
        <div className="mt-2.5">
          <SpectrumBar
            label="INNOVATION SPECTRUM"
            current={35}
            target={72}
            scale={["STATUS QUO", "LEADING EDGE", "CUTTING EDGE", "BLEEDING EDGE"]}
          />
          <SpectrumBar
            label="CUSTOMER-CENTRIC SPECTRUM"
            current={30}
            target={78}
            scale={["TERMINATE", "ACCEPTABLE", "LOYAL", ""]}
          />
        </div>
      </FormulaCard>

      <button
        type="button"
        onClick={() =>
          onAi({
            context: "FORMULA COMPLETE — FULL STRATEGY SUMMARY",
            text: SUMMARY_TEXT,
            needsConfirm: true,
            metrics: [
              { label: "SECTIONS", value: "10/10", color: "hsl(var(--success))" },
              { label: "GESTALT SCORE", value: "ACTIVE", color: "hsl(var(--success))" },
              { label: "EXIT IMPACT", value: "2.4× →", color: "hsl(var(--gold))" },
            ],
          })
        }
        className="bg-success text-black w-full px-6 py-3.5 text-[11px] tracking-[3px] font-extrabold cursor-pointer mt-4 hover:bg-success/90"
      >
        ✓ COMPLETE FORMULA — ACTIVATE AI OPERATING SYSTEM
      </button>
    </div>
  );
}
