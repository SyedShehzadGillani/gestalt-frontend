import { useMemo, useState } from "react";
import { SPECTRUM_COLORS, specColorAt } from "@/lib/specColorAt";

const CATEGORIES = [
  { id: "valuation", label: "VALUATION BRIDGE", score: 64.0 as number | null, dailyCost: null as number | null, description: "Gap between current and potential exit valuation" },
  { id: "drain", label: "VALUATION DRAIN™", score: null, dailyCost: 2847, description: "Daily cost of inaction — what standing still costs you" },
  { id: "brand", label: "BRAND ALIGNMENT", score: 71.0, dailyCost: null, description: "B.A.S.E. composite — how aligned your brand is with market value" },
  { id: "human", label: "HUMAN CAPITAL", score: 63.0, dailyCost: null, description: "H.I.V.E. composite — team performance and culture health" },
  { id: "messaging", label: "MESSAGING HEALTH", score: 58.0, dailyCost: null, description: "S.U.M. composite — communication and knowledge sharing" },
  { id: "financial", label: "FINANCIAL HEALTH", score: 72.0, dailyCost: null, description: "EBITDA trends, margins, growth trajectory" },
  { id: "customer", label: "CUSTOMER RISK", score: 45.0, dailyCost: null, description: "Concentration risk, churn, satisfaction signals" },
  { id: "culture", label: "CULTURE INDEX", score: 67.0, dailyCost: null, description: "Combined H.I.V.E. + S.U.M. culture indicators" },
  { id: "readiness", label: "EXIT READINESS", score: 64.0, dailyCost: null, description: "Composite of all systems — your overall GESTALT SCORE" },
];

const MOCK_TRENDS = {
  gestaltScore: [58, 59, 60, 61, 60, 62, 63, 63, 64, 64, 64, 64],
  baseScore: [65, 66, 67, 68, 69, 70, 70, 71, 71, 71, 71, 71],
  hiveScore: [55, 56, 57, 58, 59, 60, 61, 62, 62, 63, 63, 63],
  sumScore: [50, 51, 52, 53, 54, 55, 56, 56, 57, 57, 58, 58],
};

const SUBSYSTEMS = [
  { name: "FRAMEWORK", points: 21, source: "21 binary questions" },
  { name: "FOCUS — PERCEPTION", points: 25, source: "25 binary questions" },
  { name: "FOCUS — CLARITY", points: 25, source: "25 binary questions" },
  { name: "FOCUS — IDENTITY", points: 25, source: "25 binary questions" },
  { name: "FOCUS — CULTURE", points: 25, source: "25 binary questions" },
  { name: "FINANCIALS", points: 13, source: "13 financial inputs" },
  { name: "FORMULA", points: 23, source: "23 strategy steps" },
  { name: "H.I.V.E.", points: 4, source: "4 quadrants × employees" },
  { name: "S.U.M.", points: 7, source: "participation + sharing + projects" },
  { name: "CALENDAR", points: 5, source: "meeting density + follow-through" },
  { name: "VAULT", points: 6, source: "asset completeness + recency" },
  { name: "EXIT EQUATION", points: 45, source: "composite calculations" },
];

function Sparkline({ data, color = "hsl(var(--gold))", width = 120, height = 30 }: { data: number[]; color?: string; width?: number; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`)
    .join(" ");
  return (
    <svg width={width} height={height} className="block">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

function SpectrumBar({ score, height = 24 }: { score: number | null; height?: number }) {
  return (
    <div className="relative mb-2">
      <div className="flex rounded-xl overflow-hidden" style={{ height }}>
        {SPECTRUM_COLORS.map((c, i) => <div key={i} className="flex-1" style={{ background: c }} />)}
      </div>
      {score != null && (
        <div className="absolute -top-1" style={{ left: `${score}%`, transform: "translateX(-50%)" }}>
          <div className="bg-foreground" style={{ width: 2, height: height + 8 }} />
          <div className="text-[9px] font-black text-foreground text-center mt-0.5">{score.toFixed(1)}</div>
        </div>
      )}
    </div>
  );
}

export function AnalyticsContent() {
  const [activeCategory, setActiveCategory] = useState("valuation");
  const activeCat = CATEGORIES.find((c) => c.id === activeCategory);
  const totalDataPoints = useMemo(() => SUBSYSTEMS.reduce((a, s) => a + s.points, 0), []);

  const pillars: { label: string; score: number; color: string; data: number[] }[] = [
    { label: "B.A.S.E.", score: 71.0, color: "hsl(var(--gold))", data: MOCK_TRENDS.baseScore },
    { label: "H.I.V.E.", score: 63.0, color: "#4882ff", data: MOCK_TRENDS.hiveScore },
    { label: "S.U.M.", score: 58.0, color: "#c45c00", data: MOCK_TRENDS.sumScore },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div className="p-4 border border-border rounded-sm">
          <div className="text-[7px] font-bold tracking-[1.5px] text-muted-foreground/60">GESTALT SCORE</div>
          <div className="text-[28px] font-black" style={{ color: specColorAt(64) }}>64.0</div>
          <Sparkline data={MOCK_TRENDS.gestaltScore} />
        </div>
        <div className="p-4 border border-border rounded-sm">
          <div className="text-[7px] font-bold tracking-[1.5px] text-muted-foreground/60">DAILY VALUATION DRAIN™</div>
          <div className="text-[28px] font-black text-destructive">$2,847</div>
          <div className="text-[8px] text-destructive">$1,039,155 / year</div>
        </div>
        <div className="p-4 border border-border rounded-sm">
          <div className="text-[7px] font-bold tracking-[1.5px] text-muted-foreground/60">DATA POINTS ACTIVE</div>
          <div className="text-[28px] font-black text-gold">{totalDataPoints}</div>
          <div className="text-[8px] text-muted-foreground/60">{SUBSYSTEMS.length} subsystems feeding</div>
        </div>
      </div>

      <div className="mb-5">
        <div className="text-[8px] font-bold tracking-[2px] text-muted-foreground/60 mb-1.5">EXIT SPECTRUM™</div>
        <SpectrumBar score={64} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {pillars.map((p) => (
          <div
            key={p.label}
            className="p-3.5 border border-border rounded-sm border-t-2"
            style={{ borderTopColor: p.color }}
          >
            <div className="text-[8px] font-bold tracking-[1.5px]" style={{ color: p.color }}>{p.label}</div>
            <div className="text-[22px] font-black" style={{ color: specColorAt(p.score) }}>{p.score.toFixed(1)}</div>
            <Sparkline data={p.data} color={p.color} />
          </div>
        ))}
      </div>

      <div className="text-[9px] font-bold tracking-[2px] text-muted-foreground mb-2">9 CATEGORY BREAKDOWN</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`text-left p-2.5 border rounded-sm border-l-[3px] transition-colors ${
                isActive ? "border-gold border-l-gold bg-gold/5" : "border-border border-l-transparent bg-card"
              }`}
            >
              <div className={`text-[8px] font-bold tracking-[1.5px] ${isActive ? "text-gold" : "text-muted-foreground"}`}>
                {cat.label}
              </div>
              {cat.score != null ? (
                <div className="text-[20px] font-black mt-0.5" style={{ color: specColorAt(cat.score) }}>
                  {cat.score.toFixed(1)}
                </div>
              ) : cat.dailyCost ? (
                <div className="text-base font-black text-destructive mt-0.5">${cat.dailyCost.toLocaleString()}/day</div>
              ) : null}
              <div className="text-[7px] text-muted-foreground/60 mt-0.5">{cat.description}</div>
            </button>
          );
        })}
      </div>

      {activeCat && (
        <div className="p-5 border border-gold/30 bg-gold/5 rounded-sm mb-5">
          <div className="text-[10px] font-extrabold tracking-[2px] text-gold mb-2">{activeCat.label} — DETAIL VIEW</div>
          <div className="text-[9px] text-muted-foreground leading-[1.7]">
            {activeCat.description}. This panel will show detailed breakdowns, contributing data points, trend analysis, and GESTALT INTELLIGENCE recommendations for improving this category.
          </div>
        </div>
      )}

      <div className="text-[9px] font-bold tracking-[2px] text-muted-foreground mb-2">
        DATA SUBSYSTEMS ({totalDataPoints} POINTS)
      </div>
      {SUBSYSTEMS.map((s) => (
        <div key={s.name} className="flex justify-between py-1.5 border-b border-border text-[9px]">
          <span className="font-semibold text-foreground/80">{s.name}</span>
          <span className="text-muted-foreground/60">{s.points} points · {s.source}</span>
        </div>
      ))}
    </div>
  );
}
