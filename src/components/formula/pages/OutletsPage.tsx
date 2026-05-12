import { CHANNEL_GROUPS } from "@/components/formula/formula-data";
import { FormulaPageHeader } from "@/components/formula/FormulaPageHeader";
import { FormulaCard } from "@/components/formula/FormulaCard";
import { FormulaField } from "@/components/formula/FormulaField";
import type { TriggerAi } from "@/components/formula/page-types";

interface Props {
  onAi: TriggerAi;
}

const SDI_OPTIONS = [
  { tag: "S", color: "#58d3ff" },
  { tag: "D", color: "#e3398c" },
  { tag: "I", color: "#9aca3e" },
] as const;

const LIFECYCLE = [
  { label: "PROSPECT", color: "#5d1414" },
  { label: "LEAD", color: "#c45c00" },
  { label: "CUSTOMER", color: "#e2b53f" },
  { label: "ADVOCATE", color: "#9aca3e" },
] as const;

/** 03.10 — Campaign Outlets. Channel inventory + lifecycle interaction grid. */
export function OutletsPage({ onAi }: Props) {
  return (
    <div>
      <FormulaPageHeader pageId="03.10" />

      <div className="grid grid-cols-2 gap-2 mb-5">
        {CHANNEL_GROUPS.map((ch) => (
          <FormulaCard key={ch.name} innerClassName="p-5">
            <span className="text-foreground text-[9px] tracking-[3px] font-bold">{ch.name}</span>
            <div className="w-4 h-px bg-gold mt-1.5 mb-2" />
            {ch.items.map((item) => (
              <div
                key={item}
                className="flex items-center gap-1.5 py-0.5 border-b border-border last:border-b-0"
              >
                <input type="checkbox" className="accent-gold" />
                <span className="text-muted-foreground text-[12px] flex-1">{item}</span>
                {SDI_OPTIONS.map((s) => (
                  <button
                    key={s.tag}
                    type="button"
                    className="w-[18px] h-[18px] text-[8px] font-bold bg-transparent border border-border cursor-pointer hover:border-gold"
                    style={{ color: s.color }}
                  >
                    {s.tag}
                  </button>
                ))}
              </div>
            ))}
          </FormulaCard>
        ))}
      </div>

      <div className="text-foreground text-[12px] font-extrabold tracking-[2px] mb-2">
        LIFECYCLE INTERACTIONS
      </div>
      <div className="grid grid-cols-4 gap-0.5 mb-0.5">
        {LIFECYCLE.map((s) => (
          <div key={s.label} className="text-center py-1.5 px-2" style={{ background: s.color }}>
            <span className="text-white text-[7px] font-extrabold tracking-[2px]">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-0.5">
        {LIFECYCLE.map((s) => (
          <FormulaCard key={`grid-${s.label}`} innerClassName="p-2">
            <FormulaField label="ACTIVITIES" placeholder="..." multiline small />
            <FormulaField label="TOUCHPOINTS" placeholder="..." multiline small />
          </FormulaCard>
        ))}
      </div>

      <button
        type="button"
        onClick={() =>
          onAi({
            context: "CAMPAIGN OUTLETS",
            text: "Channels and lifecycle mapped. Cross-referencing S+D+I coverage. Ensure every lifecycle stage has S, D, and I coverage. Gaps = competitor entry points.",
            needsConfirm: true,
            metrics: [{ label: "S+D+I GAP", value: "CHECK →", color: "#c45c00" }],
          })
        }
        className="bg-transparent border border-gold text-gold px-5 py-2.5 text-[10px] tracking-[2px] font-bold cursor-pointer mt-3.5 hover:bg-gold/10"
      >
        CONFIRM OUTLETS → AI REVIEW
      </button>
    </div>
  );
}
