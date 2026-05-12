// Metrics — METRICS tab (v15 spec §4.6).
// Pure render: range + YoY toggle live in ClientMessaging.
// 8 KPIs from SUM_KPIS, plus company-level intelligence rollups + silo alert.

import type { CSSProperties, ReactNode } from "react";
import { SUM_KPIS } from "@/data/sum-data";
import { calcDelta, makeSeries } from "@/lib/sum-utils";

export type MetricsRange = "30" | "60" | "90" | "120" | "q1" | "q2" | "q3" | "q4";

interface Props {
  range: MetricsRange;
  onRange: (r: MetricsRange) => void;
  yoy: boolean;
  onYoy: (v: boolean) => void;
}

const COMPANY = [
  { label: "Messaging Alignment", value: 71, desc: "Brand promise consistency across channels" },
  { label: "Communication Health", value: 74, desc: "Teams talking effectively" },
  { label: "Idea Flow Score", value: 68, desc: "Frontline ideas reaching decision-makers" },
  { label: "Cross-Functional Collaboration", value: 62, desc: "Department connectivity" },
  { label: "Decision Quality", value: 77, desc: "Data-informed and timely decisions" },
  { label: "Information Flow Velocity", value: 69, desc: "Speed of org-wide information travel" },
];

const RANGES_DAY: { id: MetricsRange; label: string }[] = (["30", "60", "90", "120"] as const).map((id) => ({ id, label: `${id} DAYS` }));
const RANGES_QTR: { id: MetricsRange; label: string }[] = (["q1", "q2", "q3", "q4"] as const).map((id) => ({ id, label: id.toUpperCase() }));

// KPI value table (mirrors v15 mockup demo numbers).
const KPI_VALUES: Record<string, { value: number; delta: number; color: string }> = {
  "sum-score":       { value: 67,  delta: 5,    color: "var(--sum-gold)" },
  "participation":   { value: 78,  delta: 14,   color: "var(--sum-green)" },
  "idea-flow":       { value: 5.2, delta: 0.7,  color: "var(--sum-blue)" },
  "helping-signal":  { value: 12,  delta: 3,    color: "var(--sum-green)" },
  "response-latency":{ value: 4.1, delta: -0.6, color: "var(--sum-gold)" },
  "journal-depth":   { value: 7.4, delta: 0.8,  color: "var(--sum-blue)" },
  "core-contrib":    { value: 3.6, delta: 1.2,  color: "var(--sum-green)" },
  "silo-index":      { value: 32,  delta: -4,   color: "var(--sum-red)" },
};

function Spark({ color, seed }: { color: string; seed: number }) {
  const series = makeSeries(seed, 40, 28, 24);
  const N = series.length;
  return (
    <svg viewBox="0 0 320 64" preserveAspectRatio="none" style={{ width: "100%", height: 64 }}>
      {series.map((h, i) => (
        <rect key={i} x={i * (320 / N) + 1} y={64 - h} width={(320 / N) - 2} height={h} fill={color} opacity={0.92} />
      ))}
    </svg>
  );
}

export function Metrics({ range, onRange, yoy, onYoy }: Props) {
  return (
    <div style={{ padding: "28px 32px", maxWidth: 1040, margin: "0 auto", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "var(--sum-gold2)" }}>ADMIN VIEW — COMPANY-LEVEL METRICS</div>
          <div style={{ fontSize: 28, fontWeight: 900, marginTop: 4 }}>S.U.M. DASHBOARD</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "var(--sum-tx4)" }}>LAST {/^q/.test(range) ? range.toUpperCase() : `${range} DAYS`}</span>
          {yoy && <span style={{ padding: "2px 10px", background: "rgba(59,130,246,0.20)", color: "var(--sum-blue)", fontSize: 10, fontWeight: 800, borderRadius: 9, letterSpacing: 0.5 }}>YoY ON</span>}
          <span style={{ padding: "2px 8px", background: "rgba(226,181,63,0.20)", color: "var(--sum-gold)", fontSize: 10, fontWeight: 800, borderRadius: 9, letterSpacing: 0.5 }}>DEMO</span>
        </div>
      </div>

      {/* 8 KPIs grid — 4 cols x 2 rows */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 14 }}>
        {SUM_KPIS.map((k, i) => {
          const v = KPI_VALUES[k.id] ?? { value: 0, delta: 0, color: "var(--sum-tx3)" };
          const goodSign = (k.goodHigh && v.delta > 0) || (!k.goodHigh && v.delta < 0);
          const arrow = v.delta > 0 ? "▲" : v.delta < 0 ? "▼" : "•";
          const deltaColor = goodSign ? "var(--sum-green)" : "var(--sum-red)";
          const series = makeSeries(i + 1);
          const trend = calcDelta(series);
          return (
            <div key={k.id} style={{ padding: "18px 20px", background: "var(--sum-bg2)", border: "1px solid var(--sum-bdr)", display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "var(--sum-tx4)", marginBottom: 12 }}>{k.label}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: v.color, lineHeight: 1 }}>{v.value}</span>
                <span style={{ fontSize: 12, color: "var(--sum-tx4)" }}>{k.suffix}</span>
              </div>
              <div style={{ marginTop: 8, fontSize: 10, color: deltaColor, fontWeight: 800, letterSpacing: 0.3 }}>
                {arrow} {Math.abs(v.delta)} <span style={{ color: "var(--sum-tx5)", fontWeight: 600 }}>vs prior</span>
              </div>
              <div style={{ marginTop: 12, flex: 1 }}><Spark color={v.color} seed={i + 1} /></div>
              {yoy && (
                <div style={{ marginTop: 6, fontSize: 9, color: "var(--sum-blue)", fontWeight: 700, letterSpacing: 0.5 }}>
                  YoY: {trend.sign}{Math.abs(trend.pct)}%
                </div>
              )}
            </div>
          );
        })}
      </div>

      <RangeRow ranges={RANGES_DAY} active={range} onSelect={onRange} extra={
        <button onClick={() => onYoy(!yoy)} className="smooth"
          style={{ padding: "0 22px", background: yoy ? "rgba(59,130,246,0.15)" : "var(--sum-bg2)", color: yoy ? "var(--sum-blue)" : "var(--sum-tx3)", border: `1px solid ${yoy ? "rgba(59,130,246,0.4)" : "var(--sum-bdr)"}`, fontSize: 12, fontWeight: 800, letterSpacing: 1.5, display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span style={{ width: 10, height: 10, background: yoy ? "var(--sum-blue)" : "transparent", border: `1.5px solid ${yoy ? "var(--sum-blue)" : "var(--sum-tx4)"}`, borderRadius: "50%" }} />
          <span>YoY OVERLAY</span>
        </button>
      } />
      <RangeRow ranges={RANGES_QTR} active={range} onSelect={onRange} extra={
        <div style={{ padding: "8px 16px", fontSize: 11, color: "var(--sum-tx5)", fontWeight: 600, display: "flex", alignItems: "center", flexShrink: 0, maxWidth: 240, lineHeight: 1.4 }}>
          {yoy ? "Showing current period overlaid with same period one year ago — both at 50% opacity." : "Click YoY OVERLAY to compare any range to the same period one year ago."}
        </div>
      } style={{ marginBottom: 28 }} />

      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "var(--sum-gold)", marginBottom: 14 }}>COMPANY-LEVEL INTELLIGENCE</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {COMPANY.map((m) => (
          <div key={m.label} style={{ padding: "22px 28px", background: "var(--sum-bg2)", border: "1px solid var(--sum-bdr)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{m.label}</span>
              <span style={{ fontSize: 18, fontWeight: 900, color: m.value >= 70 ? "var(--sum-green)" : "var(--sum-gold)" }}>{m.value}</span>
            </div>
            <div style={{ fontSize: 11, color: "var(--sum-tx4)", marginTop: 6 }}>{m.desc}</div>
            <div style={{ height: 3, background: "var(--sum-bdr)", marginTop: 14 }}>
              <div style={{ height: "100%", width: `${m.value}%`, background: m.value >= 70 ? "var(--sum-green)" : "var(--sum-gold)" }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 18, padding: "22px 28px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: "var(--sum-red)" }}>SILO ALERT</div>
        <div style={{ fontSize: 14, color: "var(--sum-tx2)", lineHeight: 1.7, marginTop: 8 }}>
          The Pricing team hasn't communicated with Marketing in 18 days. Cross-functional score dropped 8 points. Pricing decisions are being made without market context.
        </div>
        <div style={{ fontSize: 11, color: "var(--sum-gold)", marginTop: 10, fontWeight: 700 }}>— GESTALT INTELLIGENCE</div>
      </div>
    </div>
  );
}

function RangeRow({ ranges, active, onSelect, extra, style }: { ranges: { id: MetricsRange; label: string }[]; active: MetricsRange; onSelect: (id: MetricsRange) => void; extra?: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "stretch", ...style }}>
      <div style={{ display: "flex", border: "1px solid var(--sum-bdr)", background: "var(--sum-bg2)", flex: 1 }}>
        {ranges.map((r, i) => {
          const sel = active === r.id;
          return (
            <button key={r.id} onClick={() => onSelect(r.id)} className="smooth"
              style={{ flex: 1, padding: "12px 16px", background: sel ? "rgba(226,181,63,0.10)" : "transparent", color: sel ? "var(--sum-gold)" : "var(--sum-tx3)", borderRight: i < ranges.length - 1 ? "1px solid var(--sum-bdr)" : "none", borderTop: sel ? "2px solid var(--sum-gold)" : "2px solid transparent", fontSize: 12, fontWeight: sel ? 800 : 700, letterSpacing: 1.5 }}>
              {r.label}
            </button>
          );
        })}
      </div>
      {extra}
    </div>
  );
}
