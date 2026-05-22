import { useEffect, useState } from "react";

// Top-right HUD over constellation. Counts up smoothly on prop change.

export function HUD({ intelligence, confidence }: { intelligence: number; confidence: number }) {
  const intel = useCountUp(intelligence);
  const conf = useCountUp(confidence);
  return (
    <div className="ob-hud">
      <div className="ob-hud-row">
        <span className="ob-hud-label">INTELLIGENCE ADDED</span>
        <span className="ob-hud-value">{intel.toLocaleString()} <span className="ob-hud-unit">data pts</span></span>
      </div>
      <div className="ob-hud-row">
        <span className="ob-hud-label">CONFIDENCE</span>
        <span className="ob-hud-value">{conf}%</span>
      </div>
      <div className="ob-hud-bar">
        <div className="ob-hud-bar-fill" style={{ width: `${conf}%` }} />
      </div>
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
