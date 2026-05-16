import { useState } from "react";
import type { RampStop } from "./color-utils";
import { isLightHex } from "./color-utils";

type Props = {
  label: string;
  ramp: RampStop[];
};

export function TintRampEdit({ label, ramp: initialRamp }: Props) {
  const [stops, setStops] = useState<RampStop[]>(initialRamp);
  const [editIdx, setEditIdx] = useState<number | null>(null);

  const updateStop = (idx: number, hex: string) =>
    setStops((prev) => prev.map((s, i) => (i === idx ? { stop: s.stop, hex } : s)));

  return (
    <div className="vb-ramp-wrap">
      <div className="vb-ramp-label">{label}</div>
      <div className="vb-ramp">
        {stops.map((s, i) => {
          const tc = isLightHex(s.hex) ? "#1a1a1a" : "#ffffff";
          const isEd = editIdx === i;
          return (
            <div key={s.stop} className="vb-ramp-stop">
              <div
                className="vb-ramp-tile"
                style={{
                  background: s.hex,
                  borderRight: i < stops.length - 1 ? "1px solid var(--vb-border)" : "none",
                }}
                onClick={() => setEditIdx(isEd ? null : i)}
                role="button"
                tabIndex={0}
              >
                <div className="vb-ramp-stop-num" style={{ color: tc }}>
                  {s.stop}
                </div>
                <div className="vb-ramp-stop-hex" style={{ color: tc }}>
                  {s.hex.toUpperCase()}
                </div>
              </div>
              {isEd && (
                <div className="vb-ramp-editor">
                  <div className="vb-ramp-editor-row">
                    <input
                      type="color"
                      value={s.hex}
                      onChange={(e) => updateStop(i, e.target.value)}
                      className="vb-ramp-mini-wheel"
                    />
                    <input
                      value={s.hex}
                      onChange={(e) => updateStop(i, e.target.value)}
                      className="vb-ramp-hex-input"
                    />
                  </div>
                  <div className="vb-action-row">
                    <button
                      type="button"
                      className="vb-btn-primary"
                      style={{ flex: 1 }}
                      onClick={() => setEditIdx(null)}
                    >
                      SAVE
                    </button>
                    <button
                      type="button"
                      className="vb-btn-secondary"
                      onClick={() => {
                        updateStop(i, initialRamp[i].hex);
                        setEditIdx(null);
                      }}
                    >
                      RESET
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
