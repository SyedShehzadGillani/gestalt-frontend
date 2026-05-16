import { useState, type ChangeEvent } from "react";
import { Pencil } from "lucide-react";
import { hexToRgb, rgbToCmyk, rgbToHex, isLightHex } from "./color-utils";

type Props = {
  name: string;
  hex: string;
  pms?: string;
  large?: boolean;
};

export function CSwatch({ name, hex: initialHex, pms: initialPms, large }: Props) {
  const [hex, setHex] = useState(initialHex);
  const [pms, setPms] = useState(initialPms ?? "");
  const [isEdit, setIsEdit] = useState(false);

  const rgb = hexToRgb(hex);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
  const tc = isLightHex(hex) ? "#1a1a1a" : "#ffffff";

  const onHex = (e: ChangeEvent<HTMLInputElement>) => setHex(e.target.value);
  const onR = (e: ChangeEvent<HTMLInputElement>) =>
    setHex(rgbToHex(parseInt(e.target.value, 10) || 0, rgb.g, rgb.b));
  const onG = (e: ChangeEvent<HTMLInputElement>) =>
    setHex(rgbToHex(rgb.r, parseInt(e.target.value, 10) || 0, rgb.b));
  const onB = (e: ChangeEvent<HTMLInputElement>) =>
    setHex(rgbToHex(rgb.r, rgb.g, parseInt(e.target.value, 10) || 0));

  return (
    <div className="vb-swatch">
      <div className={`vb-swatch-tile${large ? " is-large" : ""}`} style={{ background: hex }}>
        <div className="vb-swatch-name" style={{ color: tc }}>
          {name}
        </div>
        <div className="vb-swatch-vals" style={{ color: tc }}>
          HEX {hex.toUpperCase()} RGB {rgb.r}, {rgb.g}, {rgb.b} CMYK {cmyk.c}, {cmyk.m}, {cmyk.y}, {cmyk.k}
          {pms ? `\n${pms}` : ""}
        </div>
      </div>
      <button
        type="button"
        className="vb-swatch-edit-btn"
        onClick={() => setIsEdit((v) => !v)}
        aria-label={`Edit ${name}`}
      >
        <Pencil size={large ? 14 : 12} color={tc} />
      </button>

      {isEdit && (
        <div className="vb-swatch-editor">
          <label className="vb-field-label">COLOR PICKER</label>
          <div className="vb-wheel-row">
            <input type="color" value={hex} onChange={onHex} className="vb-wheel" />
            <div className="vb-wheel-info">
              <div className="vb-wheel-hex">{hex.toUpperCase()}</div>
              <div className="vb-wheel-help">Click swatch to open color wheel</div>
            </div>
          </div>

          <label className="vb-field-label">HEX</label>
          <input value={hex} onChange={onHex} className="vb-field-input" placeholder="#000000" />

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
            value={pms}
            onChange={(e) => setPms(e.target.value)}
            className="vb-field-input"
            placeholder="e.g. PMS 7405 C"
          />

          <div className="vb-action-row">
            <button type="button" className="vb-btn-primary" onClick={() => setIsEdit(false)}>
              SAVE
            </button>
            <button
              type="button"
              className="vb-btn-secondary"
              onClick={() => {
                setHex(initialHex);
                setPms(initialPms ?? "");
                setIsEdit(false);
              }}
            >
              CANCEL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
