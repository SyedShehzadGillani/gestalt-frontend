import { useState, type ChangeEvent } from "react";
import { hexToRgb, rgbToCmyk, rgbToHex, isLightHex, type RampStop } from "./color-utils";

type Stop = RampStop & { name?: string; pms?: string };

type Props = {
  label: string;
  ramp: RampStop[];
};

export function TintRampEdit({ label, ramp: initialRamp }: Props) {
  const [stops, setStops] = useState<Stop[]>(initialRamp.map((s) => ({ ...s })));
  const [editIdx, setEditIdx] = useState<number | null>(null);

  const update = (idx: number, patch: Partial<Stop>) =>
    setStops((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));

  const active = editIdx != null ? stops[editIdx] : null;
  const rgb = active ? hexToRgb(active.hex) : { r: 0, g: 0, b: 0 };
  const cmyk = active ? rgbToCmyk(rgb.r, rgb.g, rgb.b) : { c: 0, m: 0, y: 0, k: 0 };

  const onHex = (e: ChangeEvent<HTMLInputElement>) =>
    editIdx != null && update(editIdx, { hex: e.target.value });
  const onR = (e: ChangeEvent<HTMLInputElement>) =>
    editIdx != null && update(editIdx, { hex: rgbToHex(parseInt(e.target.value, 10) || 0, rgb.g, rgb.b) });
  const onG = (e: ChangeEvent<HTMLInputElement>) =>
    editIdx != null && update(editIdx, { hex: rgbToHex(rgb.r, parseInt(e.target.value, 10) || 0, rgb.b) });
  const onB = (e: ChangeEvent<HTMLInputElement>) =>
    editIdx != null && update(editIdx, { hex: rgbToHex(rgb.r, rgb.g, parseInt(e.target.value, 10) || 0) });

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
                className={`vb-ramp-tile${isEd ? " is-active" : ""}`}
                style={{
                  background: s.hex,
                  borderRight: i < stops.length - 1 ? "1px solid var(--vb-border)" : "none",
                }}
                onClick={() => setEditIdx(isEd ? null : i)}
                role="button"
                tabIndex={0}
              >
                <div className="vb-ramp-stop-num" style={{ color: tc }}>
                  {s.name ?? s.stop}
                </div>
                <div className="vb-ramp-stop-hex" style={{ color: tc }}>
                  {s.hex.toUpperCase()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {editIdx != null && active && (
        <>
          <div className="vb-ramp-editor-backdrop" onClick={() => setEditIdx(null)} />
          <div className="vb-ramp-editor-panel" onClick={(e) => e.stopPropagation()}>
            <div className="vb-ramp-editor-header">
              <div className="vb-ramp-editor-preview" style={{ background: active.hex }} />
              <div className="vb-ramp-editor-title">
                <div className="vb-field-label" style={{ marginBottom: 2 }}>EDITING STOP</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--vb-t1)" }}>
                  {active.name ?? active.stop} · {active.hex.toUpperCase()}
                </div>
              </div>
            </div>

            <label className="vb-field-label">NAME</label>
            <input
              value={active.name ?? String(active.stop)}
              onChange={(e) => update(editIdx, { name: e.target.value })}
              className="vb-field-input"
              placeholder={String(active.stop)}
            />

            <label className="vb-field-label">COLOR PICKER</label>
            <div className="vb-wheel-row">
              <input type="color" value={active.hex} onChange={onHex} className="vb-wheel" />
              <div className="vb-wheel-info">
                <div className="vb-wheel-hex">{active.hex.toUpperCase()}</div>
                <div className="vb-wheel-help">Click swatch to open color wheel</div>
              </div>
            </div>

            <label className="vb-field-label">HEX</label>
            <input value={active.hex} onChange={onHex} className="vb-field-input" placeholder="#000000" />

            <label className="vb-field-label">RGB</label>
            <div className="vb-rgb-grid">
              <div>
                <div className="vb-color-channel-label">R</div>
                <input value={rgb.r} onChange={onR} className="vb-field-input" />
              </div>
              <div>
                <div className="vb-color-channel-label">G</div>
                <input value={rgb.g} onChange={onG} className="vb-field-input" />
              </div>
              <div>
                <div className="vb-color-channel-label">B</div>
                <input value={rgb.b} onChange={onB} className="vb-field-input" />
              </div>
            </div>

            <label className="vb-field-label">CMYK</label>
            <div className="vb-cmyk-grid">
              {(["c", "m", "y", "k"] as const).map((k) => (
                <div key={k}>
                  <div className="vb-color-channel-label">{k.toUpperCase()}</div>
                  <div className="vb-field-readonly">{cmyk[k]}</div>
                </div>
              ))}
            </div>

            <label className="vb-field-label">PANTONE (PMS)</label>
            <input
              value={active.pms ?? ""}
              onChange={(e) => update(editIdx, { pms: e.target.value })}
              className="vb-field-input"
              placeholder="e.g. PMS 7405 C"
            />

            <div className="vb-action-row">
              <button type="button" className="vb-btn-primary" style={{ flex: 1 }} onClick={() => setEditIdx(null)}>
                SAVE
              </button>
              <button
                type="button"
                className="vb-btn-secondary"
                onClick={() => {
                  update(editIdx, { hex: initialRamp[editIdx].hex, name: undefined, pms: undefined });
                  setEditIdx(null);
                }}
              >
                RESET
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
