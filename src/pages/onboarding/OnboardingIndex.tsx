import { useNavigate } from "react-router-dom";
import "./shared/onboarding.css";

const DEMOS = [
  {
    path: "/onboarding/constellation",
    tag: "DEMO A",
    title: "Living Constellation",
    blurb: "Evolution of v11. Gold/red nodes spawn as you answer. Camera pulls back at the end to reveal your full vault as a searchable constellation. Click any node for its source.",
    mechanic: "Canvas-rendered network · zoom-out reveal · search filter",
  },
  {
    path: "/onboarding/carddeck",
    tag: "DEMO B",
    title: "Card Deck → Sphere",
    blurb: "GI runs a scripted conversation. Each answer flies in as a metadata card stacking in the VAULT panel. End: cards orbit into a rotating 360° sphere — Uberfan-style.",
    mechanic: "Chat-driven · physical card stack · 3D sphere finale",
  },
  {
    path: "/onboarding/hubwheel",
    tag: "DEMO C",
    title: "Hub & Spokes",
    blurb: "Direct port of the US Bank radial diagram. 8 module hubs light up sequentially. Spokes are real records. Click any spoke or search a campaign to recenter the wheel.",
    mechanic: "SVG radial layout · click-to-recenter · campaign search",
  },
];

export default function OnboardingIndex() {
  const nav = useNavigate();
  return (
    <div className="onboarding-scope">
      <div className="ob-index">
        <div>
          <div className="ob-label">GESTALT ONBOARDING — CLIENT PREVIEW</div>
          <h1>Three concepts. One question — which one feels like your product?</h1>
          <p className="sub">
            Each demo runs against the canonical Northgate Solutions mock data. Same 18 vault records, same Gestalt score (64.0), same blind-spot story.
            Different mechanic for navigating the knowledge bank.
          </p>
        </div>

        <div className="ob-cards">
          {DEMOS.map((d) => (
            <div key={d.path} className="ob-card">
              <span className="tag">{d.tag}</span>
              <h3>{d.title}</h3>
              <p>{d.blurb}</p>
              <div style={{ fontSize: 10, color: "#555", letterSpacing: 1, marginTop: 8 }}>{d.mechanic.toUpperCase()}</div>
              <button
                onClick={() => nav(d.path)}
                style={{ marginTop: 12, padding: "12px 0", background: "#c9a227", border: "none", color: "#0a0a0a", fontFamily: "inherit", fontSize: 11, fontWeight: 700, letterSpacing: 2, cursor: "pointer" }}
              >
                TRY
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, fontSize: 11, color: "#444", lineHeight: 1.8, maxWidth: 720 }}>
          All three end on the same choice screen: <strong style={{ color: "#aaa" }}>ENTER VAULT</strong> (lands on `/client/1/vault`) or <strong style={{ color: "#aaa" }}>GO TO DASHBOARD</strong> (lands on `/client/1`).
          You can exit any demo with the ✕ in the top-right.
        </div>
      </div>
    </div>
  );
}
