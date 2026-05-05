import { POLL } from "@/data/sum-mock";

export function Polls() {
  return (
    <div style={{ padding: "28px 32px", maxWidth: 660, margin: "0 auto", width: "100%" }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 28, fontWeight: 900 }}>PULSE SURVEYS</div>
        <div style={{ fontSize: 14, color: "var(--sum-tx3)", marginTop: 4 }}>Short polls when a project needs more data before prioritizing or executing.</div>
      </div>
      <div style={{ padding: "22px 28px", background: "var(--sum-bg2)", border: "1px solid var(--sum-bdr)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: "var(--sum-gold)" }}>ACTIVE POLL</span>
          <span style={{ fontSize: 12, color: "var(--sum-red)", fontWeight: 600 }}>{POLL.deadline}</span>
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, marginBottom: 18 }}>{POLL.title}</div>
        {POLL.options.map((o, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, gap: 12 }}>
              <span style={{ fontSize: 13, color: "var(--sum-tx2)", lineHeight: 1.4 }}>{o.text}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: o.color, flexShrink: 0 }}>{o.pct}%</span>
            </div>
            <div style={{ height: 4, background: "var(--sum-bdr)" }}>
              <div style={{ height: "100%", width: `${o.pct}%`, background: o.color }} />
            </div>
          </div>
        ))}
        <div style={{ fontSize: 12, color: "var(--sum-tx4)", marginTop: 18 }}>
          {POLL.responses}/{POLL.total} responses ({Math.round((POLL.responses / POLL.total) * 100)}%)
        </div>
      </div>
      <div style={{ marginTop: 14, padding: "18px 22px", background: "rgba(226,181,63,0.06)", border: "1px solid rgba(226,181,63,0.2)" }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: "var(--sum-gold)", marginBottom: 6 }}>POLL INTELLIGENCE</div>
        <div style={{ fontSize: 13, color: "var(--sum-tx2)", lineHeight: 1.7 }}>{POLL.intelligence}</div>
        <div style={{ fontSize: 11, color: "var(--sum-gold)", marginTop: 10, fontWeight: 700 }}>— GESTALT INTELLIGENCE</div>
      </div>
    </div>
  );
}
