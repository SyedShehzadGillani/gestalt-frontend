import { REPORT_SECTIONS } from "@/components/formula/formula-data";

interface Props {
  onEdit: () => void;
}

const TOTAL = REPORT_SECTIONS.length;
const RING_R = 120;
const RING_STROKE = 16;
const CX = 160;
const CY = 160;

const SUMMARY_TILES = [
  {
    label: "BRAND VOCABULARY",
    value: "LOCKED",
    sub: "Every campaign, hire, and vendor brief is now measured against your word stack.",
    color: "hsl(var(--gold))",
    border: "border-gold/30",
    bg: "bg-card",
  },
  {
    label: "EXIT IMPACT",
    value: "2.4× →",
    sub: "Documented brand transformation is worth 2–4× on top of your financial multiple.",
    color: "hsl(var(--success))",
    border: "border-success/30",
    bg: "bg-card",
  },
  {
    label: "AI STATUS",
    value: "ACTIVE",
    sub: "GESTALT INTELLIGENCE monitors every section and alerts on drift, deadlines, and opportunities.",
    color: "#58d3ff",
    border: "border-[#58d3ff]/30",
    bg: "bg-card",
  },
] as const;

/** Final FORMULA executive summary — aura ring + checklist + meaning grid. */
export function FormulaReport({ onEdit }: Props) {
  const dateStr = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  const circumference = 2 * Math.PI * RING_R;
  const segLen = circumference / TOTAL;
  const gapLen = 3;
  const arcLen = segLen - gapLen;

  return (
    <div className="mt-6">
      <div className="px-6 py-5 bg-card border border-gold border-b-0 flex justify-between items-center">
        <div>
          <div className="text-gold text-[9px] font-extrabold tracking-[3px]">FORMULA COMPLETE</div>
          <div className="text-foreground text-[22px] font-black tracking-[-0.5px] mt-1">
            Executive Summary
          </div>
          <div className="text-muted-foreground text-[10px] mt-1">
            Generated {dateStr} · GESTALT INTELLIGENCE
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="px-4 py-2 bg-transparent border border-border text-muted-foreground text-[9px] font-bold tracking-[2px] cursor-pointer hover:text-foreground hover:border-gold/40"
          >
            ✎ EDIT
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2 bg-gold border-none text-black text-[9px] font-extrabold tracking-[2px] cursor-pointer hover:bg-gold/90"
          >
            ↓ EXPORT PDF
          </button>
        </div>
      </div>

      <div className="px-8 py-7 bg-card border border-gold border-b-0 border-t-border flex gap-10 items-center">
        <div className="flex-shrink-0">
          <svg width={320} height={320} viewBox="0 0 320 320">
            <circle
              cx={CX}
              cy={CY}
              r={RING_R}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth={RING_STROKE}
            />
            {REPORT_SECTIONS.map((sec, i) => {
              const offset = -circumference * (i / TOTAL) - circumference / 4;
              return (
                <circle
                  key={sec.id}
                  cx={CX}
                  cy={CY}
                  r={RING_R}
                  fill="none"
                  stroke={sec.color}
                  strokeWidth={RING_STROKE}
                  strokeDasharray={`${arcLen} ${circumference - arcLen}`}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                />
              );
            })}
            <text
              x={CX}
              y={CY - 18}
              textAnchor="middle"
              fill="hsl(var(--gold))"
              fontSize="32"
              fontWeight="900"
            >
              10
            </text>
            <text
              x={CX}
              y={CY + 8}
              textAnchor="middle"
              fill="hsl(var(--muted-foreground))"
              fontSize="10"
              letterSpacing="2"
            >
              SECTIONS
            </text>
            <text
              x={CX}
              y={CY + 28}
              textAnchor="middle"
              fill="hsl(var(--success))"
              fontSize="11"
              fontWeight="800"
              letterSpacing="1"
            >
              COMPLETE
            </text>
          </svg>
        </div>

        <div className="flex-1">
          <div className="text-foreground text-[16px] font-extrabold mb-4">
            All 10 sections signed off
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {REPORT_SECTIONS.map((sec) => (
              <div key={sec.id} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 flex-shrink-0" style={{ background: sec.color }} />
                <span className="text-muted-foreground text-[10px]">
                  {sec.id} {sec.label}
                </span>
                <span className="text-success text-[9px] ml-auto">✓</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card border border-gold border-t-border">
        <div className="px-6 py-3.5 border-b border-border">
          <div className="text-gold-dimlight text-[9px] font-extrabold tracking-[2.5px]">
            SECTION CHECKLIST — EXECUTIVE SUMMARY
          </div>
        </div>
        {REPORT_SECTIONS.map((sec) => (
          <div
            key={sec.id}
            className="px-6 py-4 border-b border-border flex gap-4 items-start"
          >
            <div
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center"
              style={{ background: `${sec.color}24`, border: `1px solid ${sec.color}55` }}
            >
              <span className="text-[11px] font-black" style={{ color: sec.color }}>
                ✓
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-[8px] font-bold tracking-[1.5px]"
                  style={{ color: sec.color }}
                >
                  {sec.id} · {sec.group}
                </span>
              </div>
              <div className="text-foreground text-[14px] font-extrabold mb-1">{sec.label}</div>
              <div className="text-muted-foreground text-[12px] leading-[1.7]">{sec.summary}</div>
            </div>
          </div>
        ))}

        <div className="px-6 py-6 bg-gold/[0.04] border-t-2 border-t-gold">
          <div className="text-gold text-[9px] font-extrabold tracking-[2.5px] mb-3">
            WHAT THIS MEANS
          </div>
          <div className="grid grid-cols-3 gap-4">
            {SUMMARY_TILES.map((item) => (
              <div
                key={item.label}
                className={`px-4 py-3.5 ${item.bg} border ${item.border}`}
              >
                <div
                  className="text-[22px] font-black mb-1"
                  style={{ color: item.color }}
                >
                  {item.value}
                </div>
                <div
                  className="text-[8px] font-extrabold tracking-[2px] mb-1.5"
                  style={{ color: item.color }}
                >
                  {item.label}
                </div>
                <div className="text-muted-foreground text-[11px] leading-[1.6]">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 flex justify-end">
          <button
            type="button"
            onClick={handlePrint}
            className="px-7 py-3 bg-gold border-none text-black text-[10px] font-extrabold tracking-[2px] cursor-pointer hover:bg-gold/90"
          >
            ↓ EXPORT PDF →
          </button>
        </div>
      </div>
    </div>
  );
}
