// Slideshow — DAILY SLIDESHOW tab (v15 spec §4.2).
// Cinematic 1946:780 ratio. Auto-advance interval owned by ClientMessaging.
// Pure render: state (slideIdx) lives in ClientMessaging.

import { Icon } from "@/components/sum/icons";
import { SLIDESHOW } from "@/data/sum-data";

interface Props {
  slideIdx: number;
  onSlideIdx: (i: number) => void;
}

export function Slideshow({ slideIdx, onSlideIdx }: Props) {
  const item = SLIDESHOW[slideIdx];
  return (
    <div style={{ padding: "36px 32px", maxWidth: 1100, margin: "0 auto", width: "100%" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "var(--sum-gold2)" }}>TODAY — MARCH 3, 2026</div>
        <div style={{ fontSize: 28, fontWeight: 900, marginTop: 6 }}>DAILY COMPANY SLIDESHOW</div>
        <div style={{ fontSize: 14, color: "var(--sum-tx3)", marginTop: 8 }}>AI-curated highlights from across the organization</div>
      </div>
      <div style={{ position: "relative", width: "100%", aspectRatio: "1946 / 780", background: "var(--sum-bg2)", border: "1px solid var(--sum-bdr)" }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "6% 8%" }}>
          <div style={{ color: item.color, marginBottom: 14 }}><Icon name={item.icon} size={40} /></div>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2.5, color: item.color }}>{item.title}</div>
          <div style={{ fontSize: 22, lineHeight: 1.45, marginTop: 18, maxWidth: 680, color: "var(--sum-tx)", fontWeight: 500 }}>{item.text}</div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 22 }}>
        {SLIDESHOW.map((_, i) => (
          <button
            key={i}
            onClick={() => onSlideIdx(i)}
            style={{ width: i === slideIdx ? 28 : 8, height: 8, background: i === slideIdx ? "var(--sum-gold)" : "var(--sum-bdr2)", transition: "width .3s" }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 8, fontSize: 12, color: "var(--sum-tx4)" }}>{slideIdx + 1} / {SLIDESHOW.length}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 22 }}>
        <button onClick={() => onSlideIdx((slideIdx - 1 + SLIDESHOW.length) % SLIDESHOW.length)} style={{ padding: "10px 22px", border: "1px solid var(--sum-bdr2)", color: "var(--sum-tx3)", fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>PREVIOUS</button>
        <button onClick={() => onSlideIdx((slideIdx + 1) % SLIDESHOW.length)} style={{ padding: "10px 22px", background: "var(--sum-gold)", color: "#000", fontSize: 12, fontWeight: 800, letterSpacing: 1 }}>NEXT</button>
      </div>
      <div style={{ margin: "36px auto 0", width: "60%", padding: "22px 28px", background: "rgba(226,181,63,0.06)", border: "1px solid rgba(226,181,63,0.18)" }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "var(--sum-gold)", marginBottom: 8 }}>ENGAGEMENT TRACKED</div>
        <div style={{ fontSize: 14, color: "var(--sum-tx3)", lineHeight: 1.7 }}>
          78% of your team viewed today's slideshow. Companies with daily engagement above 70% see 3.5× higher culture alignment scores.
        </div>
      </div>
    </div>
  );
}
