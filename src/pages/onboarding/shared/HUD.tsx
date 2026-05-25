import { useEffect, useState } from "react";

// Top-left rail: module label, intelligence count, confidence bar, blindspots, reset.

type Props = {
  intelligence: number;
  confidence: number;
  moduleLabel?: string;     // e.g. "FRAMEWORK  7/21"
  blindspotCount?: number;
  onReset?: () => void;
};

export function HUD({ intelligence, confidence, moduleLabel, blindspotCount = 0, onReset }: Props) {
  const intel = useCountUp(intelligence);
  const conf = useCountUp(confidence);
  return (
    <div className="ob-hud">
      {moduleLabel && <div className="ob-hud-module">{moduleLabel}</div>}

      <div className="ob-hud-block">
        <div className="ob-hud-label">INTELLIGENCE ADDED</div>
        <div className="ob-hud-value">{intel.toLocaleString()} <span className="ob-hud-unit">data pts</span></div>
      </div>

      <div className="ob-hud-block">
        <div className="ob-hud-row">
          <span className="ob-hud-label">CONFIDENCE</span>
          <span className="ob-hud-value">{conf}%</span>
        </div>
        <div className="ob-hud-bar"><div className="ob-hud-bar-fill" style={{ width: `${conf}%` }} /></div>
      </div>

      {blindspotCount > 0 && (
        <div className="ob-hud-blindspots">
          {blindspotCount} BLINDSPOT{blindspotCount === 1 ? "" : "S"} EXPOSED
        </div>
      )}

      {onReset && (
        <button className="ob-hud-reset" onClick={onReset}>&lt;&lt;&lt; RESET ALL</button>
      )}
    </div>
  );
}

function useCountUp(target: number): number {
  const [v, setV] = useState(target);
  useEffect(() => {
    let raf = 0;
    const start = v, delta = target - start, dur = 600, t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(start + delta * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  return v;
}
