import { FormulaPageHeader } from "@/components/formula/FormulaPageHeader";
import { FormulaCard } from "@/components/formula/FormulaCard";
import { FormulaField } from "@/components/formula/FormulaField";
import { SDIFlywheel } from "@/components/formula/SDIFlywheel";
import type { TriggerAi } from "@/components/formula/page-types";

interface Props {
  onAi: TriggerAi;
}

const RUD_PILLARS = [
  { label: "RELEVANT", color: "#58d3ff", question: "How does your brand create value? Is it timely, contextual, connected to their needs?" },
  { label: "USEFUL", color: "#9aca3e", question: "How does your brand create understanding? Does it help them accomplish something?" },
  { label: "DESIRABLE", color: "#e3398c", question: "How does your brand create loyalty? Does it make them want more?" },
] as const;

const TFD_AUDIENCES = ["PRIMARY CUSTOMER", "INVESTOR / PARTNER", "EMPLOYEE / TEAM"] as const;
const TFD_COLUMNS = [
  { label: "THINK", color: "#58d3ff" },
  { label: "FEEL", color: "#e3398c" },
  { label: "DO", color: "#9aca3e" },
] as const;

/** 02.20 — Customer Experience. R.U.D. + Think/Feel/Do + Cult Loop flywheel. */
export function ExperiencePage({ onAi }: Props) {
  return (
    <div>
      <FormulaPageHeader pageId="02.20" />

      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          { label: "CREATIVE STRATEGY" },
          { label: "BRAND VISION" },
          { label: "EXECUTION DIRECTIVE" },
        ].map((item) => (
          <FormulaCard key={item.label} innerClassName="p-5">
            <span className="text-gold text-[10px] tracking-[3px] font-bold">{item.label}</span>
            <div className="w-4 h-px bg-gold my-1.5" />
            <FormulaField placeholder="Define yours..." multiline />
          </FormulaCard>
        ))}
      </div>

      <div className="mb-6">
        <div className="text-foreground text-[20px] font-black tracking-[2px] mb-1.5">R.U.D. FRAMEWORK</div>
        <div className="text-muted-foreground text-[8px] tracking-[1px] mb-3.5">
          RELEVANT + USEFUL + DESIRABLE = YOUR MOAT
        </div>
        <div className="grid grid-cols-3 gap-2">
          {RUD_PILLARS.map((p) => (
            <FormulaCard key={p.label} innerClassName="p-5">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-1.5 h-1.5" style={{ background: p.color }} />
                <span className="text-[10px] tracking-[2px] font-bold" style={{ color: p.color }}>
                  {p.label}
                </span>
              </div>
              <div className="text-muted-foreground text-[8px] mb-1.5">{p.question}</div>
              <FormulaField placeholder="Your answer..." multiline />
            </FormulaCard>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            onAi({
              context: "R.U.D. FRAMEWORK",
              text: "R.U.D. defines your moat. Where Relevant, Useful, and Desirable overlap = irreplaceable brand experience. This feeds H.I.V.E. employee criteria and becomes the benchmark for TEST creative analysis. When all three overlap completely, you're in 8-10× exit territory.",
              needsConfirm: true,
              metrics: [{ label: "FEEDS", value: "H.I.V.E. + TEST", color: "#58d3ff" }],
            })
          }
          className="bg-transparent border border-gold text-gold px-5 py-2.5 text-[10px] tracking-[2px] font-bold cursor-pointer mt-3.5 hover:bg-gold/10"
        >
          CONFIRM R.U.D. → AI REVIEW
        </button>
      </div>

      <div className="mb-6">
        <div className="text-foreground text-[20px] font-black tracking-[2px] mb-3.5">
          CRITICAL SUCCESS FACTORS + THINK, FEEL, DO
        </div>
        {TFD_AUDIENCES.map((aud) => (
          <FormulaCard key={aud} className="mb-2" innerClassName="p-3.5">
            <span className="text-gold text-[9px] tracking-[2px] font-bold">{aud}</span>
            <div className="grid grid-cols-4 gap-2 mt-2">
              <div>
                <div className="text-muted-foreground text-[7px] tracking-[1px] mb-1">SUCCESS FACTORS</div>
                <textarea
                  placeholder="What must happen..."
                  className="w-full bg-background border border-border text-foreground p-1.5 text-[9px] outline-none resize-none overflow-hidden focus:border-gold"
                  style={{ minHeight: 52 }}
                />
              </div>
              {TFD_COLUMNS.map((col) => (
                <div key={col.label}>
                  <div
                    className="text-[9px] tracking-[1.5px] font-bold mb-1"
                    style={{ color: col.color }}
                  >
                    {col.label}
                  </div>
                  <textarea
                    className="w-full bg-background border border-border text-foreground p-1.5 text-[9px] outline-none resize-none overflow-hidden focus:border-gold"
                    style={{ minHeight: 52 }}
                  />
                </div>
              ))}
            </div>
          </FormulaCard>
        ))}
      </div>

      <div className="mb-5 p-4 bg-card border border-border">
        <SDIFlywheel />
      </div>
    </div>
  );
}
