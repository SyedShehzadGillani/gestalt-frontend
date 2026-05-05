import { useState } from "react";

const TOP = [
  { label: "S.U.M. SCORE", value: 67, sub: "/100", color: "var(--sum-gold)", delta: "+5", deltaColor: "var(--sum-green)" },
  { label: "PARTICIPATION", value: 78, sub: "%", color: "var(--sum-green)", delta: "+14", deltaColor: "var(--sum-green)" },
  { label: "IDEA FLOW", value: 5.2, sub: "/week", color: "var(--sum-blue)", delta: "+0.7", deltaColor: "var(--sum-green)" },
];

const COMPANY = [
  { label: "Messaging Alignment", value: 71, desc: "Brand promise consistency across channels" },
  { label: "Communication Health", value: 74, desc: "Teams talking effectively" },
  { label: "Idea Flow Score", value: 68, desc: "Frontline ideas reaching decision-makers" },
  { label: "Cross-Functional Collaboration", value: 62, desc: "Department connectivity" },
  { label: "Decision Quality", value: 77, desc: "Data-informed and timely decisions" },
  { label: "Information Flow Velocity", value: 69, desc: "Speed of org-wide information travel" },
];

const RANGES_DAY = ["30", "60", "90", "120"].map((id) => ({ id, label: `${id} DAYS` }));
const RANGES_QTR = ["q1", "q2", "q3", "q4"].map((id) => ({ id, label: id.toUpperCase() }));

function FakeBars({ color }: { color: string }) {
  const N = 40;
  const heights = Array.from({ length: N }, (_, i) => {
    const base = 28 + Math.sin(i * 0.4) * 6 + Math.sin(i * 0.13) * 8;
    const trend = (i / N) * 18;
    const noise = ((i * 9301 + 49297) % 233) / 233 * 12 - 6;
    return Math.max(10, Math.min(58, base + trend + noise));
  });
  return (
    <svg viewBox="0 0 320 64" preserveAspectRatio="none" style={{ width: "100%", height: 64 }}>
      {heights.map((h, i) => (
        <rect key={i} x={i * (320 / N) + 1} y={64 - h} width={(320 / N) - 2} height={h} fill={color} opacity={0.92} />
      ))}
    </svg>
  );
}

export function Metrics() {
  const [range, setRange] = useState("30");
  const [yoy, setYoy] = useState(false);

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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
        {TOP.map((m) => (
          <div key={m.label} style={{ padding: "22px 28px", background: "var(--sum-bg2)", border: "1px solid var(--sum-bdr)", display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: "var(--sum-tx4)", marginBottom: 14 }}>{m.label}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: m.color, lineHeight: 1 }}>{m.value}</span>
              <span style={{ fontSize: 14, color: "var(--sum-tx4)" }}>{m.sub}</span>
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: m.deltaColor, fontWeight: 800, letterSpacing: 0.3 }}>▲ {m.delta} <span style={{ color: "var(--sum-tx5)", fontWeight: 600 }}>vs prior 15d</span></div>
            <div style={{ marginTop: 18, flex: 1 }}><FakeBars color={m.color} /></div>
          </div>
        ))}
      </div>
      <RangeRow ranges={RANGES_DAY} active={range} onSelect={setRange} extra={
        <button onClick={() => setYoy((v) => !v)} className="smooth"
          style={{ padding: "0 22px", background: yoy ? "rgba(59,130,246,0.15)" : "var(--sum-bg2)", color: yoy ? "var(--sum-blue)" : "var(--sum-tx3)", border: `1px solid ${yoy ? "rgba(59,130,246,0.4)" : "var(--sum-bdr)"}`, fontSize: 12, fontWeight: 800, letterSpacing: 1.5, display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span style={{ width: 10, height: 10, background: yoy ? "var(--sum-blue)" : "transparent", border: `1.5px solid ${yoy ? "var(--sum-blue)" : "var(--sum-tx4)"}`, borderRadius: "50%" }} />
          <span>YoY OVERLAY</span>
        </button>
      } />
      <RangeRow ranges={RANGES_QTR} active={range} onSelect={setRange} extra={
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

function RangeRow({ ranges, active, onSelect, extra, style }: { ranges: { id: string; label: string }[]; active: string; onSelect: (id: string) => void; extra?: React.ReactNode; style?: React.CSSProperties }) {
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
