import { Download, Upload } from "lucide-react";
import { ECard } from "./ECard";
import { MOTION_ASSETS } from "./data/media-data";

export function MotionSection() {
  return (
    <>
      <div className="vb-motion-intro">
        Animated brand assets including logo animations, icon transitions, loading states, and motion graphics. All motion files follow the brand timing and easing standards.
      </div>
      <div className="vb-motion-grid">
        {MOTION_ASSETS.map((m) => (
          <div key={m.name} className="vb-motion-card">
            <div className="vb-motion-poster">
              <div className="vb-motion-pip">
                <div className="vb-motion-pip-dot" />
              </div>
              <div className="vb-motion-duration">{m.duration}</div>
            </div>
            <div className="vb-motion-meta">
              <div className="vb-motion-name">{m.name}</div>
              <div className="vb-motion-sub">
                {m.duration} · {m.subject}
              </div>
              <div className="vb-motion-tag">{m.category.toUpperCase()}</div>
            </div>
          </div>
        ))}
      </div>
      <ECard
        title="TIMING & EASING"
        desc="Define brand standard durations, easing curves, and animation principles. Fast: 0.2-0.3s for micro-interactions. Medium: 0.5-0.8s for reveals. Slow: 1-3s for cinematic moments."
      />
      <ECard
        title="MOTION DO / DON'T"
        desc="Rules for when to animate and when to stay still. Never animate for decoration. Every motion must communicate state, guide attention, or reinforce brand."
      />
      <div style={{ display: "flex", gap: 6 }}>
        <button type="button" className="vb-textbtn">
          <Download size={14} /> Download All
        </button>
        <button type="button" className="vb-textbtn">
          <Upload size={14} /> Upload Motion Asset
        </button>
      </div>
    </>
  );
}
