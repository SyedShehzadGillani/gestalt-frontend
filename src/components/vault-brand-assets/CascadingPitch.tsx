import { useState } from "react";
import { ECard } from "./ECard";
import { PITCH_TIERS } from "./data/messaging-blocks";

export function CascadingPitch() {
  const [showExamples, setShowExamples] = useState(false);

  return (
    <div className="vb-pitch-wrap">
      <div className="vb-pitch-head">
        <span className="vb-pitch-eyebrow">ELEVATOR PITCH — CASCADING FRAMEWORK</span>
        <button
          type="button"
          className={`vb-pitch-examples-toggle${showExamples ? " is-on" : ""}`}
          onClick={() => setShowExamples((v) => !v)}
        >
          {showExamples ? "HIDE" : "VIEW EXAMPLES"}
        </button>
      </div>
      <div className="vb-pitch-intro">
        Each tier builds on the last. The 3-second hooks. The 7-second contextualizes. The 15-second makes them share you.
      </div>

      {PITCH_TIERS.map((tier) => (
        <div key={tier.key}>
          <div className="vb-pitch-tier-head">
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span className="vb-pitch-label">{tier.label}</span>
              <span className="vb-pitch-slash">/</span>
              <span className="vb-pitch-seconds">{tier.seconds} SEC PITCH</span>
            </div>
          </div>
          {showExamples && (
            <div className="vb-pitch-example">
              <div className="vb-pitch-example-eyebrow">EXAMPLE</div>
              <div className="vb-pitch-example-text">{tier.example}</div>
            </div>
          )}
          <ECard
            title={`${tier.label} (${tier.seconds}-SEC PITCH)`}
            desc={`Write your ${tier.seconds}-second pitch. ${tier.label === "HOOK" ? "Max 8 words." : tier.label === "CONTEXT" ? "Max 25 words." : "Max 50 words."}`}
            sizeVariant={tier.seconds === "3" ? "large-3" : tier.seconds === "7" ? "large-7" : "default"}
          />
        </div>
      ))}
    </div>
  );
}
